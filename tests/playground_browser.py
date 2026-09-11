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
        await page.locator('#themeToggle').click()
        assert await page.evaluate('document.documentElement.dataset.theme') == 'light'
        await page.set_viewport_size({'width':390,'height':844})
        await page.emulate_media(reduced_motion='reduce')
        await page.screenshot(path=str(output / 'mobile-light.png'), full_page=True)
        boxes=await page.locator('.comparison figure').evaluate_all('(els)=>els.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y}))')
        assert boxes[0]['x']==boxes[1]['x'] and boxes[1]['y']>boxes[0]['y']
        assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth')
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
        link=portfolio.get_by_role('link',name='Playground ↗',exact=True)
        assert await link.get_attribute('href')=='playground01/'
        assert await link.get_attribute('target')=='_blank'
        assert await link.get_attribute('rel')=='noopener noreferrer'
        async with portfolio.expect_popup() as popup_event:
            await link.click()
        popup=await popup_event.value
        await popup.wait_for_load_state('domcontentloaded')
        assert popup.url==origin+'/playground01/'
        await popup.close()
        await portfolio.close()
        assert hashlib.sha256(model.read_bytes()).hexdigest() == digest
        print(json.dumps({'result': 'PASS', 'screenshots': str(output), 'requests': network}), flush=True)
        await browser.close()
    server.shutdown()


asyncio.run(main())
