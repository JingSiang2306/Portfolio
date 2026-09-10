# Bloub animation engine

Source: https://github.com/jeremy-prt/bloub

Pinned revision: `b4bb3c1b5f93c7b87a2e8d620f667c4093d97749`.
Copyright (c) 2026 Jeremy Perret. Distributed under the MIT license in `LICENSE`.

`bloub.js` bundles the unmodified `src/bot/engine.ts` and its dependencies from
that revision. The portfolio's DOM adapter is `../../avatar.js`; it renders the
idle, wink and thinking states. The avatar blinks at rest, winks on hover/focus,
and morphs into pulsing dots while a chat request is pending. Reduced motion
uses a still pose, and animation pauses in hidden tabs or behind the mobile chat.

The bundle is committed and served locally. No clone, npm install, Vue runtime,
CDN, or build step is needed to run the portfolio.

To regenerate, download the pinned source revision and run from that checkout:

```sh
npx --yes esbuild@0.25.9 src/bot/engine.ts --bundle --format=iife --global-name=Bloub --target=es2020 --minify --legal-comments=inline --outfile=bloub.js
```

Copy the output here and keep the license and source attribution with it.
Bloub's repository notes that its code license does not cover the x.ai design
it recreates and that the project is not affiliated with x.ai.
