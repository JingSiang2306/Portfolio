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

Before the first interaction, idle expressions change randomly every five seconds
among neutral, curious, happy and sleepy, without consecutive repeats. Opening,
closing or resetting the chat shows a frozen neutral pose. The first query in a
new conversation starts Burst for one second, then loops Comet until the response.
Later queries start Comet directly. A successful reply loops Orbit while open.
If a reply arrives before the second is up, Orbit starts immediately.
Whenever Retry appears, Alert loops through the retry request until success.
Closing always displays frozen Neutral; pending/retry activity resumes on reopen.
New chat cancels previous animation timers. Reduced motion uses still poses;
rendering pauses in hidden tabs or behind the full-screen mobile chat panel.

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
