const runEventListeners = () => {
  if (!browser) return;

  // Перехват событий письма
  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection()?.toString();
    browser?.runtime?.sendMessage({
      action: 'SELECTION_CHANGED',
      content: selection,
    });
  });

  // Вставка текста в активное письмо
  browser?.runtime?.onMessage?.addListener((request) => {
    if (request.action === 'INSERT_TEXT') {
      const editor = document.activeElement;
      if (editor?.tagName === 'DIV' && editor.contentEditable === 'true') {
        editor.innerHTML += request.text;
      }
    }
  });
};

runEventListeners();
