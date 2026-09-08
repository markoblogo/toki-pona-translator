const STORAGE_KEY = 'sitelenLayerEnabled';
const ALLOW_ALL = false;

async function readEnabled() {
  if (ALLOW_ALL) {
    return true;
  }

  const store = await chrome.storage.local.get(STORAGE_KEY);
  return store[STORAGE_KEY] !== false;
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ [STORAGE_KEY]: true });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'GET_ENABLED') {
    readEnabled().then((enabled) => sendResponse({ enabled }));
    return true;
  }

  if (message?.type === 'SET_ENABLED') {
    chrome.storage.local.set({ [STORAGE_KEY]: Boolean(message.enabled) });
    sendResponse({ ok: true });
  }
});
