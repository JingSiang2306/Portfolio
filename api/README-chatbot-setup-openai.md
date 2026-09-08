# Setting up your real AI chatbot

This portfolio's chatbot is powered by a real AI model through the **OpenAI API**, not
hardcoded answers or keyword matching. Every reply is generated live by sending your
visitor's question — plus the relevant portfolio knowledge — to the OpenAI API.

**This requires a small backend piece.** A plain HTML file can't safely call
an AI API on its own, because that would mean putting your secret API key
inside code anyone can view in their browser. The fix is a **serverless
function**: a small piece of server-side code that keeps your API key private
and relays requests between the website and OpenAI. You don't need to manage
a server yourself — hosting platforms such as Vercel can run this function
for you.

## What's in this folder

```text
index.html              ← your site (chat widget calls /api/chat)
api/
  chat.js               ← serverless function that talks to the OpenAI API
  knowledge.js          ← portfolio knowledge used to ground chatbot answers
```

## Deploy in ~5 minutes using Vercel

1. **Get an OpenAI API key**

   Go to:

   https://platform.openai.com/api-keys

   Create a new secret key and copy it somewhere safe.

   > Do not place the API key directly inside `index.html`, JavaScript sent to
   > the browser, or a public GitHub repository.

2. **Create a Vercel account**

   Go to:

   https://vercel.com

   You can deploy through the Vercel web dashboard or use the Vercel CLI.

3. **Deploy the whole portfolio project**

   Keep `index.html` and the `api/` folder at the same top level:

   ```text
   portfolio/
   ├── index.html
   └── api/
       ├── chat.js
       └── knowledge.js
   ```

   Create a new Vercel project from the folder or GitHub repository.

   - Framework preset: **Other**
   - No build step is required for a plain HTML portfolio unless you add one later.

4. **Add the OpenAI API key as an environment variable**

   In Vercel:

   **Project → Settings → Environment Variables**

   Add:

   ```text
   Name: OPENAI_API_KEY
   Value: your OpenAI API key
   ```

   Save the variable and redeploy the project so the serverless function can
   access it.

5. **Make sure `api/chat.js` uses the OpenAI API**

   The backend should read the key from:

   ```text
   process.env.OPENAI_API_KEY
   ```

   and send the user's message and portfolio context to the OpenAI API.
   For new integrations, OpenAI's **Responses API** is the recommended API
   for generating model responses.

   The model itself can be changed inside `api/chat.js` without changing the
   front-end chat widget.

6. **Done**

   Your website will be available at a `*.vercel.app` URL, or through a custom
   domain if you connect one.

   The chat widget in the bottom-right corner will send requests to:

   ```text
   /api/chat
   ```

   The serverless function then:

   ```text
   Visitor question
        ↓
   index.html
        ↓
   /api/chat
        ↓
   Portfolio knowledge + question
        ↓
   OpenAI API
        ↓
   Generated answer
        ↓
   Chat widget
   ```

## Local testing

You can test the project locally with Vercel CLI.

Install Vercel CLI:

```bash
npm install -g vercel
```

Create a `.env` file in the project root:

```text
OPENAI_API_KEY=your_api_key_here
```

Then run:

```bash
vercel dev
```

Open the local URL shown in the terminal and test the chatbot.

> Add `.env` to `.gitignore` so your API key is never committed to GitHub.

Example:

```text
.env
.env.local
```

## Good to know

- **API cost:** OpenAI API usage is billed separately from a ChatGPT
  subscription. Cost depends on the model selected in `api/chat.js` and the
  number of input and output tokens used. Check the current OpenAI API
  pricing page before deployment:

  https://openai.com/api/pricing/

- **Knowledge-base size:** sending the full thesis and portfolio documents
  with every question can use a large number of input tokens. For a
  portfolio with occasional visitors this may be manageable, but it is more
  efficient to keep `api/knowledge.js` concise or retrieve only the
  information relevant to each question.

- **Updating the knowledge base:** when you revise your resume or project
  descriptions, update `api/knowledge.js`. The chat interface does not need
  to change unless the structure of the backend request changes.

- **Security:** never expose `OPENAI_API_KEY` in browser-side code or commit
  it to GitHub. Keep it in Vercel Environment Variables for deployment and
  in a local `.env` file only for development.

- **GitHub Pages:** GitHub Pages only serves static files and cannot run the
  `/api/chat` serverless function by itself. You can keep the repository on
  GitHub while deploying the working chatbot version through Vercel.

## OpenAI references

- API keys: https://platform.openai.com/api-keys
- API documentation: https://developers.openai.com/api/docs/
- Responses API: https://developers.openai.com/api/docs/guides/text
- Pricing: https://openai.com/api/pricing/
