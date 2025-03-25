// Только для development-режима!
if (typeof browser === 'undefined') {
  window.browser = {
    runtime: {
      sendMessage: (data) => {
        console.log('Mock sendMessage:', data);
        return Promise.resolve({ body: 'Тестовое содержимое письма' });
      },
    },
    messages: {
      inboxFolder: {},
      listMessages: () => Promise.resolve([{ id: 'mock-message-id' }]),
      getFull: () => Promise.resolve({ body: 'Mock email content' }),
    },
    compose: {
      setBody: () => Promise.resolve(),
    },
  };
}
