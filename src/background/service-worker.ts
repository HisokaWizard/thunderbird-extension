// Получение содержимого письма
async function handleGetEmail(messageId: string) {
  try {
    const message = await browser?.messages?.getFull(messageId);
    return {
      subject: message.subject,
      body: message.body,
    };
  } catch (error) {
    console.error('Error getting email:', error);
  }
}

// Обновление содержимого письма
async function handleUpdateEmail(messageId: string, content: string) {
  try {
    await browser?.compose?.setBody(messageId, content);
    console.log('Email content updated successfully');
  } catch (error) {
    console.error('Error updating email:', error);
  }
}

const runReactEventListeners = () => {
  if (!browser) return;
  // Обработчик сообщений от React-приложения
  browser?.runtime?.onMessage?.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'GET_EMAIL_CONTENT':
        handleGetEmail(request.messageId);
        break;
      case 'UPDATE_EMAIL_CONTENT':
        handleUpdateEmail(request.messageId, request.content);
        break;
    }
    return true;
  });
};

runReactEventListeners();
