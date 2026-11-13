# Chatbot setup and knowledge base

The portfolio chatbot uses the OpenAI API through `api/chat.js`.
Follow the [OpenAI setup guide](README-chatbot-setup-openai.md) for deployment,
environment variables, and local testing.

The active knowledge base is [`api/knowledge_v2.3.js`](knowledge_v2.3.js),
loaded by `api/chat.js`. It is curated manually from the latest resume,
`Knowledge/Resume 2026-11-11.pdf`, and the project documents. PDFs are not
automatically ingested; update the active knowledge file and redeploy the
backend when those details change.
