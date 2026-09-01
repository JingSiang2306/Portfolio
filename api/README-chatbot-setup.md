# Setting up your real AI chatbot

This portfolio's chatbot is now powered by a real AI model (Claude), not
hardcoded answers or keyword matching. Every reply is generated live by
sending your visitor's question — plus the full text of your Knowledge
folder documents — to the Anthropic API.

**This requires a small backend piece.** A plain HTML file can't safely call
an AI API on its own, because that would mean putting your secret API key
inside code anyone can view in their browser. The fix is a "serverless
function": a tiny bit of server code that holds your API key privately and
relays requests. You don't need to manage a server — free hosting platforms
run this for you.

## What's in this folder

```
index.html              ← your site (chat widget calls /api/chat)
api/
  chat.js                ← the serverless function that talks to Claude
  knowledge.js            ← your 4 documents' full text, auto-generated
```

## Deploy in ~5 minutes (using Vercel, free)

1. **Get an API key**
   Go to https://console.anthropic.com → API Keys → Create Key. Copy it.

2. **Create a Vercel account** at https://vercel.com (free tier is fine) and
   install their CLI, or just use the web dashboard's "drag and drop" deploy.

3. **Upload this whole folder** (keep `index.html` and `api/` together at
   the same top level) as a new Vercel project.
   - Framework preset: choose "Other" — no build step is needed.

4. **Add your API key as an environment variable**
   In the Vercel project → Settings → Environment Variables:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (paste the key from step 1)
   Then redeploy so the function can see it.

5. **Done.** Your site is now live at a `*.vercel.app` URL (or your own
   domain if you connect one), and the chat bubble in the bottom-right
   corner will answer questions using real AI grounded in your documents.

Netlify and Cloudflare Pages work the same way (drop `api/chat.js` into
their equivalent functions folder — `netlify/functions/` or
`functions/api/` — with the same environment variable). GitHub Pages does
**not** support this, since it only serves static files with no functions.

## Good to know

- **Cost:** each question sends the full knowledge base (~56,000 tokens) as
  context to the model, so this isn't free per message — check current
  pricing on your Anthropic console. For a portfolio getting occasional
  visits from recruiters, this should be very cheap overall, but if you
  expect heavy traffic, consider trimming `api/knowledge.js` to a shorter
  summary of each document instead of the full text.
- **Updating the knowledge base:** if you revise your resume or project
  write-ups, re-export the text and update `api/knowledge.js` (it's just a
  JavaScript file containing one big text string) — no other code changes
  needed.
- **Testing locally first:** you can test with `vercel dev` (after
  `npm i -g vercel`) before deploying, using a `.env` file with your key.
