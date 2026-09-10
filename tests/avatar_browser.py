"""Browser regression checks: pip install playwright; python tests/avatar_browser.py.

Uses installed Chrome, local files and mocked chat responses; no live AI requests.
"""
import asyncio
import json
import mimetypes
from pathlib import Path
import tempfile
from urllib.parse import unquote, urlparse

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def main():
    output = Path(tempfile.mkdtemp(prefix='portfolio-avatar-check-'))
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 960})
        errors = []
        requests = asyncio.Queue()

        async def files(route):
            name = unquote(urlparse(route.request.url).path).lstrip('/') or 'index.html'
            path = (ROOT / name).resolve()
            if path.is_relative_to(ROOT) and path.is_file():
                await route.fulfill(body=path.read_bytes(), content_type=mimetypes.guess_type(path)[0] or 'application/octet-stream')
            else:
                await route.fulfill(status=404, body='Not found')

        async def api(route):
            response = asyncio.get_running_loop().create_future()
            await requests.put(response)
            await route.fulfill(**await response)

        await context.route('http://portfolio.test/**', files)
        await context.route('https://**', lambda route: route.abort())
        await context.route('**/api/chat', api)
        page = await context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        await page.goto('http://portfolio.test/')

        async def state(expected):
            await page.wait_for_function('(state) => document.querySelector("#chatAvatar").dataset.state === state', arg=expected)

        async def pose():
            return await page.locator('#chatAvatar svg').inner_html()

        async def expression():
            return await page.locator('#chatAvatar').get_attribute('data-expression')

        async def eyes():
            # Eye paths encode their shape; transforms also change during ordinary
            # wandering/blinking, so a transform change alone proves very little.
            return await page.locator('#chat-bloub-eyes g path').evaluate_all(
                '(nodes) => nodes.map(node => node.getAttribute("d"))')

        async def next_expression(previous):
            await page.wait_for_function(
                '(old) => document.querySelector("#chatAvatar").dataset.expression !== old',
                arg=previous, timeout=8000)
            current = await expression()
            assert current in ['neutral', 'curious', 'happy', 'sleepy'], current
            return current

        async def no_circle():
            appearance = await page.locator('#chatLauncher').evaluate('''(node) => {
                const style = getComputedStyle(node);
                return {
                    background: style.backgroundColor,
                    image: style.backgroundImage,
                    shadow: style.boxShadow,
                    borders: ['Top', 'Right', 'Bottom', 'Left'].map(side => style[`border${side}Width`])
                };
            }''')
            assert appearance == {
                'background': 'rgba(0, 0, 0, 0)', 'image': 'none',
                'shadow': 'none', 'borders': ['0px'] * 4
            }, appearance

        async def body_color(expected):
            # Check the rendered SVG fill, including currentColor inheritance.
            await page.wait_for_function('''(color) => getComputedStyle(
                document.querySelector('#chatAvatar svg > g[mask="url(#chat-bloub-eyes)"] > rect')
            ).fill === color''', arg=expected)

        async def open_chat():
            await page.locator('#chatLauncher').click()
            await page.mouse.move(5, 5)
            assert await expression() == 'neutral'

        async def hover_during(expected):
            await page.locator('#chatLauncher').hover()
            await state(expected)
            assert await expression() != 'curious', f'Hover replaced {expected}'
            await no_circle()
            await page.mouse.move(5, 5)
            await state(expected)

        async def frozen():
            first = await pose()
            await page.wait_for_timeout(600)
            assert first == await pose(), 'Expected a frozen pose'

        async def send(text):
            await page.locator('#chatInput').fill(text)
            await page.locator('#chatSend').click()
            return await asyncio.wait_for(requests.get(), 5)

        def reply(request, text='Verified response.'):
            request.set_result({'json': {'reply': text, 'format': 'paragraphs', 'items': [text]}})

        async def screenshot(name):
            await page.screenshot(path=str(output / f'{name}.png'))

        await state('idle')
        assert await expression() == 'neutral'
        neutral_eyes = await eyes()
        assert len(neutral_eyes) == 2
        await body_color('rgb(255, 255, 255)')
        await no_circle()
        await screenshot('dark-neutral')
        await page.wait_for_timeout(4000)
        assert await expression() == 'neutral', 'Initial expression changed before five seconds'
        idle_expression = await next_expression('neutral')
        await page.wait_for_timeout(700)
        assert await eyes() != neutral_eyes, 'Idle label changed without changing the rendered eyes'
        await screenshot('idle-expression')
        await page.wait_for_timeout(3000)
        assert await expression() == idle_expression, 'Expression changed before five seconds'
        idle_expression = await next_expression(idle_expression)

        # Use the site's actual controls; direct dataset changes miss toggle bugs.
        await page.locator('#themeToggle').click()
        await body_color('rgb(0, 0, 0)')
        await no_circle()
        await screenshot('light-idle')
        await page.locator('#themeToggle').click()
        await body_color('rgb(255, 255, 255)')
        await no_circle()

        if idle_expression == 'curious':
            idle_expression = await next_expression(idle_expression)
        await page.wait_for_timeout(700)
        idle_eyes = await eyes()
        await page.locator('#chatLauncher').hover()
        await page.wait_for_function('document.querySelector("#chatAvatar").dataset.expression === "curious"')
        await page.wait_for_timeout(700)
        assert await eyes() != idle_eyes, 'Hover did not visibly change the expression'
        await no_circle()
        await screenshot('dark-hover-curious')
        await page.wait_for_timeout(5100)
        assert await expression() == 'curious', 'Idle timer replaced the hover expression'
        await page.mouse.move(5, 5)
        assert await expression() == idle_expression, 'Pointer leave did not restore the idle expression'
        await page.wait_for_timeout(700)
        assert await eyes() == idle_eyes, 'Pointer leave did not restore the rendered eyes'
        await page.wait_for_timeout(3300)
        assert await expression() == idle_expression, 'Pointer leave did not restart the five-second delay'
        await next_expression(idle_expression)

        # Tab onto the launcher so this exercises :focus-visible, not pointer focus.
        await page.locator('#chatLauncher').focus()
        await page.keyboard.press('Shift+Tab')
        await page.keyboard.press('Tab')
        assert await page.locator('#chatLauncher').evaluate('(node) => node.matches(":focus-visible")')
        await page.wait_for_function('document.querySelector("#chatAvatar").dataset.expression === "curious"')
        await page.wait_for_timeout(700)
        await screenshot('keyboard-curious')
        await page.mouse.click(5, 400)

        await open_chat()
        await frozen()
        request = await send('First query')
        await state('burst')
        await hover_during('burst')
        await page.wait_for_timeout(300)
        await screenshot('burst')
        await state('comet')
        await hover_during('comet')
        await page.wait_for_timeout(800)
        assert await page.locator('#chatAvatar linearGradient').count() > 0
        await screenshot('comet')
        await page.wait_for_timeout(2600)
        assert await page.locator('#chatAvatar linearGradient').count() > 0, 'Comet trails expired instead of looping'
        reply(request)
        await state('orbit')
        await hover_during('orbit')
        await page.wait_for_timeout(1000)
        assert await page.locator('#chatAvatar linearGradient').count() > 0
        await screenshot('orbit')
        await page.wait_for_timeout(3700)
        assert await page.locator('#chatAvatar linearGradient').count() > 0, 'Orbit stopped after the first clip'
        await page.locator('#themeToggle').click()
        await body_color('rgb(0, 0, 0)')
        await screenshot('light-orbit')

        request = await send('Next query')
        await state('comet')
        request.set_result({'status': 503, 'json': {'error': 'Please retry.', 'retryable': True}})
        await page.locator('#chatRetry').wait_for(state='visible')
        await state('alert')
        await hover_during('alert')
        await page.wait_for_timeout(900)
        await screenshot('alert')
        await page.locator('#chatRetry').click()
        request = await asyncio.wait_for(requests.get(), 5)
        await state('alert')
        await page.wait_for_timeout(3500)
        await state('alert')
        assert await page.locator('#chatAvatar svg > g > path').count() > 0, 'Alert dot is missing'
        reply(request)
        await state('orbit')

        await page.locator('#chatClose').click()
        assert await expression() == 'neutral', 'Pointer-restored focus incorrectly activated Curious'
        assert not await page.locator('#chatLauncher').evaluate('(node) => node.matches(":focus-visible")')
        await frozen()
        await next_expression('neutral')
        await page.locator('#chatLauncher').hover()
        await page.wait_for_function('document.querySelector("#chatAvatar").dataset.expression === "curious"')
        await open_chat()
        await page.locator('#chatReset').click()
        assert await expression() == 'neutral'
        await frozen()
        await next_expression('neutral')
        request = await send('Reset during burst')
        await state('burst')
        await page.locator('#chatReset').click()
        assert await expression() == 'neutral'
        reply(request, 'This old response must be ignored.')
        await page.wait_for_timeout(1500)
        await frozen()
        assert 'This old response' not in await page.locator('#chatMessages').inner_text()

        request = await send('Stop during burst')
        await state('burst')
        await page.locator('#chatStop').click()
        await state('alert')
        reply(request)
        await page.wait_for_timeout(1200)
        await state('alert')
        await page.locator('#chatReset').click()
        request = await send('A fast reply')
        reply(request)
        await state('orbit')
        await page.wait_for_timeout(1200)
        await state('orbit')

        # A response arriving after close must not reactivate the avatar.
        request = await send('Close while pending')
        await page.locator('#chatClose').click()
        assert await expression() == 'neutral'
        reply(request)
        await page.wait_for_timeout(400)
        await frozen()
        await open_chat()

        # Still poses retain state feedback, including a mid-flight preference change.
        request = await send('Reduced motion')
        await state('comet')
        await page.emulate_media(reduced_motion='reduce')
        await page.wait_for_timeout(150)
        await frozen()
        reply(request)
        await state('orbit')
        await frozen()
        await page.locator('#chatClose').click()
        await frozen()

        await page.set_viewport_size({'width': 390, 'height': 844})
        await page.locator('#chatLauncher').click()
        assert await page.locator('#chatLauncher').is_hidden()
        assert await page.locator('#chatInput').is_visible()
        await page.locator('#chatClose').click()
        assert await page.locator('#chatLauncher').is_visible()
        await screenshot('mobile-neutral')
        assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert not errors, errors
        await browser.close()
        print(json.dumps({'result': 'PASS', 'screenshots': str(output), 'checks': 'real theme toggle and SVG fills, no outer circle at rest/hover, visible random idle changes and five-second timing, hover/focus Curious and animation priority, idle resumes after close/reset, Burst/Comet/Orbit loops, retry/Alert, close/reset/stop, late and fast replies, reduced motion, mobile, no page errors'}))


asyncio.run(main())
