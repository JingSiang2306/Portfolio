
(() => {
  const chatLauncher = document.getElementById('chatLauncher');
  const chatPanel = document.getElementById('portfolioChat');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatStop = document.getElementById('chatStop');
  const chatStatus = document.getElementById('chatStatus');
  const chatWaiting = document.getElementById('chatWaiting');
  const chatRetry = document.getElementById('chatRetry');
  const chatJump = document.getElementById('chatJump');
  const suggestions = document.getElementById('chatSuggestions');
  const MAX_MESSAGE = 1200;
  const MAX_HISTORY_ITEM = 2400;
  const REQUEST_TIMEOUT = 30000;
  let conversationHistory = [];
  let pending = null;
  let retryRequest = null;
  let retryTimer = null;
  let returnFocus = null;

  function scrollToLatest() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatJump.hidden = true;
  }
  function isNearBottom() {
    return chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < 80;
  }
  function status(text, error = false) {
    chatStatus.textContent = text;
    chatStatus.dataset.error = String(error);
  }
  function updateControls() {
    const length = chatInput.value.length;
    document.getElementById('chatCount').textContent = `${length} / ${MAX_MESSAGE}`;
    chatSend.disabled = !!pending || !chatInput.value.trim() || length > MAX_MESSAGE;
    chatSend.hidden = !!pending;
    chatStop.hidden = !pending;
    chatWaiting.hidden = !pending;
    suggestions.querySelectorAll('button').forEach(button => { button.disabled = !!pending; });
  }
  // Inline emphasis is parsed into text nodes; model output never becomes HTML.
  function appendInline(parent, text) {
    const tokens = String(text).split(/(\*\*[^*\n]+\*\*|`[^`\n]+`)/g);
    for (const token of tokens) {
      if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
        const strong = document.createElement('strong');
        strong.textContent = token.slice(2, -2);
        parent.appendChild(strong);
      } else if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
        const code = document.createElement('code');
        code.textContent = token.slice(1, -1);
        parent.appendChild(code);
      } else parent.appendChild(document.createTextNode(token));
    }
  }
  function renderLegacy(content, text) {
    // Compatibility with an older backend: recognize only actual line-based lists.
    let list = null;
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) { continue; }
      const bullet = line.match(/^\s*[-*•]\s+(.+)$/);
      const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);
      if (bullet || numbered) {
        const tag = numbered ? 'OL' : 'UL';
        if (!list || list.tagName !== tag) {
          list = document.createElement(tag.toLowerCase());
          content.appendChild(list);
        }
        const li = document.createElement('li');
        appendInline(li, (numbered || bullet)[1]);
        list.appendChild(li);
      } else {
        list = null;
        const p = document.createElement('p');
        appendInline(p, line.replace(/^#{1,6}\s+/, ''));
        content.appendChild(p);
      }
    }
  }
  function addChatMessage(answer, role, forceScroll = false) {
    const follow = forceScroll || isNearBottom();
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${role === 'user' ? 'user' : 'bot'}`;
    bubble.setAttribute('role', 'group');
    bubble.setAttribute('aria-label', role === 'user' ? 'You' : 'Portfolio assistant');
    const content = document.createElement('div');
    content.className = 'chat-content';
    if (role === 'user') {
      const p = document.createElement('p');
      p.textContent = answer;
      content.appendChild(p);
    } else if (answer && Array.isArray(answer.items) && ['paragraphs','bullets','numbered'].includes(answer.format)) {
      const parent = answer.format === 'paragraphs' ? content : document.createElement(answer.format === 'numbered' ? 'ol' : 'ul');
      for (const item of answer.items) {
        const element = document.createElement(answer.format === 'paragraphs' ? 'p' : 'li');
        const clean = answer.format === 'paragraphs' ? item : item.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '');
        appendInline(element, clean);
        parent.appendChild(element);
      }
      if (parent !== content) content.appendChild(parent);
    } else renderLegacy(content, typeof answer === 'string' ? answer : answer.reply);
    bubble.appendChild(content);
    chatMessages.appendChild(bubble);
    if (role !== 'user' && !forceScroll && !chatPanel.hidden) {
      portfolioMotion.animate(bubble, [{ opacity:0 }, { opacity:1 }], { duration:180 });
    }
    // Keep the visible conversation bounded, independent of model context.
    while (chatMessages.children.length > 60) chatMessages.firstElementChild.remove();
    if (follow) scrollToLatest();
    else chatJump.hidden = false;
    return bubble;
  }
  function clearRetry() {
    clearTimeout(retryTimer);
    retryRequest = null;
    chatRetry.hidden = true;
    chatRetry.disabled = false;
    chatRetry.textContent = 'Retry question';
  }
  function showRetry(request, delay = 0) {
    retryRequest = request;
    chatRetry.hidden = false;
    chatRetry.disabled = delay > 0;
    chatRetry.textContent = delay > 0 ? `Retry in ${delay}s` : 'Retry question';
    window.portfolioAvatar?.requestFailed(true);
    if (delay > 0) retryTimer = setTimeout(() => {
      chatRetry.disabled = false;
      chatRetry.textContent = 'Retry question';
    }, delay * 1000);
  }
  function usableAnswer(data) {
    if (!data || typeof data.reply !== 'string' || !data.reply.trim() || data.reply.length > 12000) return false;
    if ('items' in data) return ['paragraphs','bullets','numbered'].includes(data.format) && Array.isArray(data.items) && data.items.length > 0 && data.items.length <= 8 && data.items.every(item => typeof item === 'string' && item.trim() && item.length <= 1200);
    return true;
  }
  async function sendToAssistant(question, retry = null) {
    question = question.trim();
    if (pending || !question) return;
    if (question.length > MAX_MESSAGE) { status(`Please use no more than ${MAX_MESSAGE} characters.`, true); return; }
    if (location.protocol === 'file:') { status('The assistant is available on the hosted portfolio. Please use the contact section while viewing this local file.', true); return; }
    if (navigator.onLine === false) { status('You appear to be offline. Reconnect and try again.', true); return; }
    clearRetry();
    const history = (retry?.history || conversationHistory).slice(-6);
    const request = { question, history, controller: new AbortController(), stopped: false, timedOut: false };
    pending = request;
    window.portfolioAvatar?.requestStarted({ retry: !!retry });
    if (!retry) {
      addChatMessage(question, 'user', true);
      chatInput.value = '';
    }
    suggestions.hidden = true;
    status('Preparing an answer…');
    updateControls();
    const slowTimer = setTimeout(() => { if (pending === request) status('Still working… You can stop and try again.'); }, 8000);
    const timeout = setTimeout(() => { request.timedOut = true; request.controller.abort(); }, REQUEST_TIMEOUT);
    try {
      // Bound payload bytes too, so multi-byte text cannot exceed the server limit.
      const payload = { message: question, history: history.map(item => ({ role: item.role, content: item.content.slice(0, MAX_HISTORY_ITEM) })) };
      while (new TextEncoder().encode(JSON.stringify(payload)).length > 22000 && payload.history.length) payload.history.splice(0, 2);
      const response = await fetch('/api/chat', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        signal:request.controller.signal, body:JSON.stringify(payload)
      });
      const data = await response.json().catch(() => null);
      if (pending !== request) return;
      if (request.controller.signal.aborted) throw new Error('ABORTED');
      if (!response.ok) {
        const message = typeof data?.error === 'string' ? data.error : 'The assistant is unavailable. Please retry or use the contact section.';
        status(message, true);
        const delay = Math.min(60, Math.max(0, Math.ceil(Number(response.headers.get('Retry-After')) || 0)));
        if (data?.retryable !== false && response.status !== 404 && response.status !== 405) showRetry({ question, history }, delay);
        else window.portfolioAvatar?.requestFailed(false);
        return;
      }
      if (!usableAnswer(data)) throw new Error('INVALID_REPLY');
      addChatMessage(data, 'bot');
      window.portfolioAvatar?.requestSucceeded();
      conversationHistory = [...history, { role:'user', content:question }, { role:'assistant', content:data.reply.slice(0, MAX_HISTORY_ITEM) }].slice(-6);
      status('');
    } catch (err) {
      if (pending !== request) return;
      status(request.stopped ? 'Stopped. Retry this question or ask something else.' : request.timedOut ? 'The response took too long. Please retry.' : 'The reply could not be received. Please retry or use the contact section.', true);
      showRetry({ question, history });
    } finally {
      clearTimeout(timeout);
      clearTimeout(slowTimer);
      if (pending === request) {
        pending = null;
        updateControls();
        if (!chatPanel.hidden && (document.activeElement === chatStop || document.activeElement === chatSend)) chatInput.focus();
      }
    }
  }
  function updateMobileViewport() {
    chatPanel.classList.toggle('is-compact', !!window.visualViewport && window.visualViewport.height < 500);
    if (chatPanel.hidden || !window.visualViewport || window.innerWidth > 480) {
      chatPanel.style.removeProperty('height'); chatPanel.style.removeProperty('top'); chatPanel.style.removeProperty('bottom'); return;
    }
    chatPanel.style.top = `${window.visualViewport.offsetTop + 8}px`;
    chatPanel.style.height = `${Math.max(180, window.visualViewport.height - 16)}px`;
    chatPanel.style.bottom = 'auto';
  }
  function setChatOpen(open, restore = true) {
    if (open && document.querySelector('.image-lightbox.is-open')) return;
    if (open) returnFocus = document.activeElement;
    chatPanel.hidden = !open;
    chatPanel.inert = !open;
    chatLauncher.setAttribute('aria-expanded', String(open));
    chatLauncher.setAttribute('aria-label', open ? 'Close portfolio assistant' : 'Open portfolio assistant');
    window.portfolioAvatar?.setOpen(open);
    if (open) {
      updateMobileViewport();
      requestAnimationFrame(() => { if (!chatPanel.hidden) { chatInput.focus({preventScroll:true}); scrollToLatest(); } });
    } else if (restore) (returnFocus?.isConnected ? returnFocus : chatLauncher).focus({preventScroll:true});
  }
  function resetChat(initial = false) {
    if (pending) pending.controller.abort();
    pending = null; // Late responses belong to the old conversation and are ignored.
    clearRetry();
    window.portfolioAvatar?.reset(initial);
    conversationHistory = [];
    chatMessages.replaceChildren();
    chatInput.value = '';
    suggestions.hidden = false;
    status('');
    addChatMessage('Hi! Ask me about Jing Siang’s background and projects, or a general question.', 'bot', true);
    updateControls();
  }
  chatLauncher.addEventListener('click', () => setChatOpen(chatPanel.hidden));
  document.getElementById('chatClose').addEventListener('click', () => setChatOpen(false));
  document.getElementById('chatReset').addEventListener('click', () => { resetChat(); chatInput.focus(); });
  document.getElementById('chatContact').addEventListener('click', () => { setChatOpen(false, false); document.querySelector('#contact a').focus({preventScroll:true}); });
  chatStop.addEventListener('click', () => { if (pending) { pending.stopped = true; pending.controller.abort(); } });
  chatRetry.addEventListener('click', () => { if (retryRequest && !pending) sendToAssistant(retryRequest.question, retryRequest); });
  chatJump.addEventListener('click', scrollToLatest);
  chatMessages.addEventListener('scroll', () => { if (isNearBottom()) chatJump.hidden = true; });
  chatInput.addEventListener('input', updateControls);
  chatInput.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); sendToAssistant(chatInput.value); }
  });
  document.getElementById('chatForm').addEventListener('submit', event => { event.preventDefault(); sendToAssistant(chatInput.value); });
  suggestions.querySelectorAll('button').forEach(button => button.addEventListener('click', () => sendToAssistant(button.dataset.question)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !chatPanel.hidden && !document.querySelector('.image-lightbox.is-open')) { event.preventDefault(); setChatOpen(false); }
  });
  document.addEventListener('portfolio:lightbox-open', () => { if (!chatPanel.hidden) setChatOpen(false, false); });
  window.addEventListener('resize', updateMobileViewport);
  window.visualViewport?.addEventListener('resize', updateMobileViewport);
  window.visualViewport?.addEventListener('scroll', updateMobileViewport);
  resetChat(true);
})();
