"""Static browser verification. Install playwright and use an installed Chrome.

Run: python tests/playground_browser.py
No Python inference is used: the test server serves files only.
"""
import asyncio
import base64
import functools
import hashlib
import http.server
import json
from pathlib import Path
import tempfile
import threading

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


class StaticFiles(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, BrokenPipeError):
            pass  # Closing a test tab may cancel an in-flight static asset request.


async def main():
    output = Path(tempfile.mkdtemp(prefix='portfolio-playground-check-'))
    model = ROOT / 'playground01/weights/best.onnx'
    digest = hashlib.sha256(model.read_bytes()).hexdigest()
    handler = functools.partial(StaticFiles, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    origin = f'http://127.0.0.1:{server.server_port}'
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 1100})
        page = await context.new_page()
        errors = []
        network = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: print('CONSOLE:', m.type, m.text[:1000], flush=True))
        page.on('request', lambda r: network.append((r.method, r.url)))
        await page.goto(origin + '/playground01/')
        await page.wait_for_function("document.querySelector('#modelIndicator').dataset.state !== 'loading'", timeout=180000)
        print('MODEL:', await page.locator('#modelStatus').inner_text(), await page.locator('#runtimeLabel').inner_text(), flush=True)
        assert await page.locator('#modelIndicator').get_attribute('data-state') == 'ready'
        print('METADATA:', await page.evaluate('JSON.stringify({inputs: session.inputMetadata, outputs: session.outputMetadata})'), flush=True)
        await page.screenshot(path=str(output / 'ready-desktop.png'), full_page=True)
        await page.locator('#imageInput').set_input_files(str(ROOT / 'Image/Y3GP/1_ImageDetection.jpg'))
        await page.wait_for_function('!document.querySelector("#runButton").disabled')
        await page.locator('#runButton').click()
        await page.wait_for_function('!running', timeout=180000)
        assert await page.locator('#resultSummary').is_visible(), await page.locator('#detectionStatus').inner_text()
        print('REAL RESULT:', await page.locator('#resultSummary').inner_text(), flush=True)
        assert 'Elephant' in await page.locator('#detectionList').inner_text()
        await page.wait_for_timeout(250)
        await page.screenshot(path=str(output / 'real-detection.png'), full_page=True)
        # Examples use the upload pipeline; diagnostics expose every non-empty row.
        await page.wait_for_function('examples.length === 4')
        await page.evaluate('''() => {
          window.diagnosticTables=[];
          const table=console.table.bind(console);
          console.table=rows=>{diagnosticTables.push(JSON.parse(JSON.stringify(rows)));table(rows);};
        }''')
        example_results=[]
        for index, expected_classes in enumerate([[2,2],[3,3,3],[2,2],[3]]):
            await page.locator('#exampleSelect').select_option(str(index))
            await page.wait_for_function('!decoding')
            assert await page.locator('#runButton').is_enabled()
            await page.locator('#runButton').click()
            await page.wait_for_function('!running',timeout=120000)
            raw, filtered, annotated = await page.evaluate('diagnosticTables.slice(-3)')
            assert [row['class_id'] for row in raw] == expected_classes
            assert [row['class_id'] for row in filtered] == expected_classes
            assert filtered == annotated
            assert await page.locator('#detectionList li').count() == len(expected_classes)
            assert await page.locator('#resultCanvas').is_visible()
            example_results.append({'file':await page.locator('#fileName').inner_text(),'raw':raw,'annotated':annotated})
            if index==2:
                await page.wait_for_timeout(250)
                await page.screenshot(path=str(output/'mixed-example.png'),full_page=True)
        (output/'example-diagnosis.json').write_text(json.dumps(example_results,indent=2))
        print('EXAMPLES:',json.dumps(example_results),flush=True)
        # Preview remains intact mid-collapse, and controls prevent overlapping work.
        initial_height=await page.locator('#resultsRegion').evaluate('(e)=>e.getBoundingClientRect().height')
        await page.locator('#resetButton').click()
        await page.wait_for_timeout(100)
        assert await page.evaluate('resetting')
        current_height=await page.locator('#resultsRegion').evaluate('(e)=>e.getBoundingClientRect().height')
        assert 0 < current_height < initial_height
        assert await page.locator('#comparison').is_visible()
        assert await page.locator('#runButton').is_disabled()
        await page.wait_for_function('!resetting')
        assert await page.locator('#exampleSelect').input_value()==''
        assert await page.locator('#imageInput').input_value()==''
        assert await page.locator('#comparison').is_hidden()
        await page.locator('#exampleSelect').select_option('0')
        await page.wait_for_function('!decoding')
        await page.locator('#imageInput').set_input_files(str(ROOT/'playground01/test/human1.jpg'))
        await page.wait_for_function('!decoding')
        assert await page.locator('#exampleSelect').input_value()==''
        assert await page.locator('#fileName').inner_text()=='human1.jpg'
        await page.route('**/test/elephant1.jpg',lambda route:route.fulfill(status=404,body='missing'))
        await page.locator('#exampleSelect').select_option('0')
        await page.wait_for_function('!decoding')
        assert 'This example image could not be loaded' in await page.locator('#imageError').inner_text()
        await page.unroute('**/test/elephant1.jpg')
        # An upload or reset must beat an older, slow example download.
        for replacement in ['upload','reset','example']:
            started, release = asyncio.Event(), asyncio.Event()
            async def delayed_example(route):
                started.set()
                await release.wait()
                await route.fulfill(path=str(ROOT/'playground01/test/elephant1.jpg'),content_type='image/jpeg')
            await page.route('**/test/elephant1.jpg',delayed_example)
            await page.locator('#exampleSelect').select_option('0')
            await started.wait()
            if replacement=='upload':
                await page.locator('#imageInput').set_input_files(str(ROOT/'playground01/test/human1.jpg'))
            elif replacement=='reset':
                await page.locator('#resetButton').click()
            else:
                await page.locator('#exampleSelect').select_option('1')
            await page.wait_for_function('!decoding && !resetting')
            release.set()
            await page.wait_for_timeout(150)
            if replacement=='reset': assert await page.locator('#comparison').is_hidden()
            else: assert await page.locator('#fileName').inner_text()=='human1.jpg'
            await page.unroute('**/test/elephant1.jpg')
        for manifest_body, status, expected in [('[]',200,'No example images'),('missing',404,'Examples are unavailable')]:
            empty=await context.new_page()
            await empty.route('**/test/images.json',lambda route:route.fulfill(status=status,body=manifest_body,content_type='application/json'))
            await empty.route('**/weights/best.onnx',lambda route:route.fulfill(status=404,body='skip model in manifest-only test'))
            await empty.goto(origin+'/playground01/')
            await empty.wait_for_function("!document.querySelector('#exampleStatus').textContent.includes('Loading')")
            assert expected in await empty.locator('#exampleStatus').inner_text()
            assert await empty.locator('#exampleSelect').is_disabled()
            assert await empty.locator('#dropzone').is_enabled()
            await empty.close()
        # Validate preprocessing numerically, including channel order and padding.
        math_checks = await page.evaluate('''() => {
          const results = [];
          for (const [width, height] of [[1920,1080],[1080,1920],[1000,1000],[321,199]]) {
            const source = document.createElement('canvas');
            source.width=width; source.height=height;
            const ctx=source.getContext('2d'); ctx.fillStyle='rgb(255,0,128)'; ctx.fillRect(0,0,width,height);
            const t=preprocessImage(source), plane=640*640, center=320*640+320;
            const expected=[width*.1,height*.1,width*.9,height*.9];
            const modelBox=expected.map((v,i)=>v*t.scale+(i%2 ? t.paddingY:t.paddingX));
            const mapped=mapBoxToOriginal(modelBox,t);
            if(mapped.some((v,i)=>Math.abs(v-expected[i])>1e-6)) throw Error('Mapping failed');
            if(t.tensor.type!=='float32'||String(t.tensor.dims)!=='1,3,640,640') throw Error('Input mismatch');
            if(t.tensor.data[center]!==1||t.tensor.data[plane+center]!==0||Math.abs(t.tensor.data[2*plane+center]-128/255)>1e-6) throw Error('RGB mismatch');
            if((t.paddingX||t.paddingY)&&Math.abs(t.tensor.data[0]-114/255)>1e-6) throw Error('Padding mismatch');
            const clamped=mapBoxToOriginal([-100,-100,900,900],t);
            if(String(clamped)!==String([0,0,width,height])) throw Error('Clamping failed');
            results.push({width,height,scale:t.scale,paddingX:t.paddingX,paddingY:t.paddingY});
            t.tensor.dispose();
          }
          const t={width:1920,height:1080,scale:1/3,paddingX:0,paddingY:140};
          const values=new Float32Array(1800);
          values.set([64,176,576,464,.941,2]);
          values.set([64,176,576,464,.817,2],6); // Already-NMS output: no second suppression.
          values.set([64,176,576,464,.2,2],12);
          values.set([64,176,576,464,NaN,2],18);
          const parsed=parseDetections({type:'float32',dims:[1,300,6],data:values},t);
          if(parsed.length!==2||parsed[0].label!=='Elephant') throw Error('Row parsing failed');
          showSummary(parsed,100);
          if(!ui.detectionList.textContent.includes('94.1%')||!ui.detectionList.textContent.includes('81.7%')) throw Error('Confidence format failed');
          let rejected=false;
          try{parseDetections({type:'float32',dims:[1,6,300],data:values},t)}catch{rejected=true}
          if(!rejected) throw Error('Wrong output accepted');
          return results;
        }''')
        print('LETTERBOX:', json.dumps(math_checks), flush=True)
        # Blank portrait/square images exercise the real model and session reuse.
        for width, height in [(360,640),(640,640)]:
            await page.locator('#resetButton').click()
            await page.wait_for_function('!resetting')
            data_url = await page.evaluate('''([w,h]) => {
              const c=document.createElement('canvas');c.width=w;c.height=h;
              const x=c.getContext('2d');x.fillStyle='#728291';x.fillRect(0,0,w,h);
              return c.toDataURL('image/png');
            }''', [width,height])
            await page.locator('#imageInput').set_input_files({'name':'blank.png','mimeType':'image/png','buffer':base64.b64decode(data_url.split(',')[1])})
            await page.wait_for_function('!document.querySelector("#runButton").disabled')
            await page.locator('#runButton').click()
            await page.wait_for_function('!running', timeout=120000)
            assert await page.locator('#resultSummary').is_visible()
            assert await page.locator('#detectionList li').count() == 0
            assert await page.locator('#emptyResult').is_visible()
        for name, mime, data, message in [
            ('bad.gif','image/gif',b'GIF89a','JPG'),
            ('huge.jpg','image/jpeg',bytes(10*1024*1024+1),'10 MB'),
            ('corrupt.png','image/png',b'not an image','could not be read')
        ]:
            await page.locator('#imageInput').set_input_files({'name':name,'mimeType':mime,'buffer':data})
            await page.wait_for_function('!decoding')
            assert message in await page.locator('#imageError').inner_text()
        # Drop a real WebP generated in-browser; there must be no network upload.
        await page.evaluate('''async () => {
          const c=document.createElement('canvas');c.width=200;c.height=300;
          const blob=await new Promise(resolve=>c.toBlob(resolve,'image/webp'));
          const dt=new DataTransfer();dt.items.add(new File([blob],'drop.webp',{type:'image/webp'}));
          ui.dropzone.dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:dt}));
        }''')
        await page.wait_for_function('!decoding')
        assert 'drop.webp' in await page.locator('#fileName').inner_text()
        # Test wrong outputs and inference errors without modifying the real model.
        await page.evaluate('''() => {
          window.savedRun=session.run.bind(session);
          session.run=async()=>({output0:new ort.Tensor('float32',new Float32Array(6),[1,1,6])});
        }''')
        await page.locator('#runButton').click()
        await page.wait_for_function('!running')
        assert 'could not finish' in await page.locator('#detectionStatus').inner_text()
        assert await page.locator('#resultCanvas').is_hidden()
        await page.evaluate('() => { session.run=window.savedRun; }')
        await page.locator('#exampleSelect').select_option('2')
        await page.wait_for_function('!decoding')
        await page.locator('#runButton').click()
        await page.wait_for_function('!running',timeout=120000)
        await page.locator('#themeToggle').click()
        assert await page.evaluate('document.documentElement.dataset.theme') == 'light'
        await page.set_viewport_size({'width':390,'height':844})
        await page.emulate_media(reduced_motion='reduce')
        await page.wait_for_timeout(250)
        await page.screenshot(path=str(output / 'mobile-light.png'), full_page=True)
        boxes=await page.locator('.comparison figure').evaluate_all('(els)=>els.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y}))')
        assert boxes[0]['x']==boxes[1]['x'] and boxes[1]['y']>boxes[0]['y']
        assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        # Reduced motion clears immediately, without a collapse animation.
        await page.locator('#resetButton').click()
        assert not await page.evaluate('resetting')
        assert await page.locator('#comparison').is_hidden()
        assert await page.locator('#resultsRegion').evaluate('(e)=>e.getAnimations().length')==0
        assert not errors, errors
        assert all(method == 'GET' for method, _ in network), network
        assert sum('/weights/best.onnx' in url for _, url in network) == 1

        # Real WASM: test both absence of WebGPU and an explicit creation failure.
        for scenario in ['gpu-absent','gpu-create-fails']:
            fallback=await context.new_page()
            await fallback.add_init_script("Object.defineProperty(navigator,'gpu',{value:undefined,configurable:true})" if scenario=='gpu-absent' else "Object.defineProperty(navigator,'gpu',{value:{},configurable:true})")
            async def intercept_script(route):
                prefix="""window.creationAttempts=[];
                  const originalCreate=ort.InferenceSession.create.bind(ort.InferenceSession);
                  ort.InferenceSession.create=async(bytes,options)=>{
                    window.creationAttempts.push(options.executionProviders[0]);
                    if(options.executionProviders[0]==='webgpu') throw Error('Test GPU creation failure');
                    return originalCreate(bytes,options);
                  };\n"""
                await route.fulfill(body=prefix+(ROOT/'playground01/script.js').read_text(encoding='utf-8'),content_type='application/javascript')
            if scenario=='gpu-create-fails': await fallback.route('**/playground01/script.js',intercept_script)
            await fallback.goto(origin+'/playground01/')
            await fallback.wait_for_function("document.querySelector('#modelIndicator').dataset.state !== 'loading'",timeout=180000)
            assert await fallback.locator('#runtimeLabel').inner_text()=='Runtime: WebAssembly'
            if scenario=='gpu-create-fails': assert await fallback.evaluate('creationAttempts')==['webgpu','wasm']
            await fallback.locator('#imageInput').set_input_files(str(ROOT/'Image/Y3GP/1_ImageDetection.jpg'))
            await fallback.wait_for_function('!document.querySelector("#runButton").disabled')
            await fallback.locator('#runButton').click()
            await fallback.wait_for_function('!running',timeout=120000)
            assert 'Elephant' in await fallback.locator('#detectionList').inner_text()
            print('FALLBACK:',scenario,await fallback.locator('#detectionList').inner_text(),flush=True)
            await fallback.locator('#exampleSelect').select_option('2')
            await fallback.wait_for_function('!decoding')
            await fallback.locator('#runButton').click()
            await fallback.wait_for_function('!running',timeout=120000)
            assert await fallback.locator('#detectionList li').count()==2
            assert 'Human' not in await fallback.locator('#detectionList').inner_text()
            print('MIXED WASM:',await fallback.locator('#detectionList').inner_text(),flush=True)
            if scenario=='gpu-absent':
                await fallback.evaluate("() => { session.run=async()=>{throw Error('Test inference failure')}; }")
                await fallback.locator('#runButton').click()
                await fallback.wait_for_function('!running')
                assert 'could not finish' in await fallback.locator('#detectionStatus').inner_text()
            await fallback.close()

        missing=await context.new_page()
        await missing.route('**/weights/best.onnx',lambda route:route.fulfill(status=404,body='missing'))
        await missing.goto(origin+'/playground01/')
        await missing.locator('#modelError').wait_for(state='visible')
        assert await missing.locator('#runButton').is_disabled()
        await missing.unroute('**/weights/best.onnx')
        await missing.locator('#retryModel').click()
        await missing.wait_for_function("document.querySelector('#modelIndicator').dataset.state === 'ready'",timeout=180000)
        await missing.close()
        portfolio=await context.new_page()
        await portfolio.goto(origin+'/')
        link=portfolio.get_by_role('link',name='Playground →',exact=True)
        assert await link.get_attribute('href')=='playground01/'
        assert await link.get_attribute('target') is None
        assert 'btn-primary' in await link.get_attribute('class')
        await link.hover()
        await portfolio.wait_for_timeout(250)
        assert await portfolio.locator('#playgroundHint').is_visible()
        await portfolio.screenshot(path=str(output/'portfolio-tooltip.png'),full_page=True)
        await portfolio.mouse.move(0,0)
        await portfolio.keyboard.press('Tab')
        await link.focus()
        assert await link.evaluate("e=>e.matches(':focus-visible')")
        assert await portfolio.locator('#playgroundHint').is_visible()
        tab_count=len(context.pages)
        await link.click()
        await portfolio.wait_for_url(origin+'/playground01/')
        assert len(context.pages)==tab_count
        await portfolio.locator('.back-link').click()
        await portfolio.wait_for_url(origin+'/#projects')
        assert len(context.pages)==tab_count
        await portfolio.close()
        assert hashlib.sha256(model.read_bytes()).hexdigest() == digest
        print(json.dumps({'result': 'PASS', 'screenshots': str(output), 'requests': network}), flush=True)
        await browser.close()
    server.shutdown()


asyncio.run(main())
