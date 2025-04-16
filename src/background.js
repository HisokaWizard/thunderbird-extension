browser.runtime.onMessage.addListener((request, sender) => {
  if (request.type === 'OPEN_SIDEBAR') {
    console.log('Событие получено в фоне: ', request.data);
    console.log('Sender: ', sender);

    browser.windows.create({
      url: 'sidebar.html',
      type: 'panel',
      width: 320,
      height: 240,
    });
  }
});
