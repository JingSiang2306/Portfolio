# Bloub animation engine

Source: https://github.com/jeremy-prt/bloub

Pinned revision: `b4bb3c1b5f93c7b87a2e8d620f667c4093d97749`.
Copyright (c) 2026 Jeremy Perret. Distributed under the MIT license in `LICENSE`.

`bloub.js` bundles the unmodified engine and expression presets from that revision,
exported through `entry.js`. The portfolio's DOM adapter is `../../avatar.js`.
It renders body/eyes, rear and front gradient arcs, particles, and shaped dots.
The body inherits white in the dark theme and black in the light theme. Eye holes
and the launcher background are transparent. The old outer-circle CSS remains
commented out in `../../chatbot.css`.

While idle, expressions change randomly every five seconds among neutral,
curious, happy and sleepy, without consecutive repeats. Hovering or focusing the
launcher with the keyboard shows Confused; leaving restores the previous idle
expression and starts a fresh five-second delay. Hover never interrupts request,
reply or retry animations. Opening, closing or resetting the chat returns to
Neutral immediately, then resumes idle expressions after five seconds. Every
regular query starts Burst for one second, then loops Comet until the response.
A successful reply plays Orbit once (3.4 seconds), then holds the Unimpressed
expression (`blase`) while the chat remains open. Hover/focus temporarily shows
Confused and returns to Unimpressed on leaving; random idle cycling stays paused.
If a reply arrives before the second is up, Orbit starts immediately.
Whenever Retry appears, Alert loops through the retry request until success,
then follows the same Orbit-to-Unimpressed sequence. A new query, closing or
resetting the chat cancels any previous Orbit completion timer.
Closing returns to Neutral and resumes idle cycling; pending/retry activity resumes on reopen.
New chat cancels previous animation timers. Reduced motion uses still poses;
rendering pauses in hidden tabs or behind the full-screen mobile chat panel.

To change the hover/focus expression, edit `HOVER_EXPRESSION` near the top of
`../../avatar.js`. Bloub uses French preset IDs: `confus` (confused), `curieux`
(curious), `heureux` (happy), `somnolent` (sleepy), and `neutre` (neutral).
The separate `expressions` array controls the random idle expressions.

The bundle is committed and served locally. No clone, npm install, Vue runtime,
CDN, or build step is needed to run the portfolio.

To regenerate, download the pinned source revision, copy `entry.js` into that
checkout's root, and run from that checkout:

```sh
npx --yes esbuild@0.25.9 entry.js --bundle --format=iife --global-name=Bloub --target=es2020 --minify --legal-comments=inline --outfile=bloub.js
```

Copy the output here and keep the license and source attribution with it.
Bloub's repository notes that its code license does not cover the x.ai design
it recreates and that the project is not affiliated with x.ai.
