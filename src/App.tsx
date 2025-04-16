import React, { CSSProperties, useEffect, useState } from 'react';

// Объявляем глобальный объект browser для TypeScript
declare const browser: any;

const generalContainer: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

function printDeepObject(obj: object) {
  console.dir(obj, {
    depth: null,
    colors: true,
    showHidden: true,
  });
}

const App = () => {
  const [editedContent, setEditedContent] = useState<string>('');

  const onOpenPanel = () => {
    browser.runtime.sendMessage({
      type: 'OPEN_SIDEBAR',
      data: { status: 'success' },
    });
  };

  const getMessageComposeTab = async (): Promise<any> => {
    const tabs: any[] = await browser.tabs.query();
    const messageComposeTab = tabs.find((it) => it.type === 'messageCompose');
    return messageComposeTab;
  };

  const fetchEmailContent = async () => {
    try {
      const messageComposeTab = await getMessageComposeTab();
      const emptyMessage = 'Тестовое содержимое письма не обнаружено';

      if (messageComposeTab) {
        const currentCompose = await browser.compose.getComposeDetails(messageComposeTab.id);

        setEditedContent(currentCompose.plainTextBody ?? emptyMessage);
      } else {
        const currentEmail = await browser.messageDisplay.getDisplayedMessage();
        const emailId = currentEmail.id;
        if (!emailId) return;

        const fullMessage = await browser.messages.getFull(emailId);
        const content: string = fullMessage?.parts?.[0]?.body ?? emptyMessage;

        setEditedContent(content);
      }
    } catch (error) {
      console.error('Ошибка получения содержимого письма: ', error);
    }
  };

  const sendUpdatedContent = async () => {
    try {
      const messageComposeTab = await getMessageComposeTab();

      if (!messageComposeTab) return;

      await browser.compose.setComposeDetails(messageComposeTab.id, {
        body: editedContent,
      });
    } catch (error) {
      console.error('Ошибка отправки обновлённого содержимого: ', error);
    }
  };

  return (
    <div style={generalContainer}>
      <h1>DID Почтовый плагин</h1>
      <button onClick={fetchEmailContent}>Извлечь содержимое письма</button>
      <div style={{ marginTop: '20px' }}>
        <textarea
          rows={10}
          cols={50}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          placeholder='Редактируйте содержимое письма...'
        />
      </div>
      <button onClick={sendUpdatedContent} style={{ marginTop: '20px' }}>
        Обновить письмо
      </button>
      <button onClick={onOpenPanel} style={{ marginTop: '20px' }}>
        Открыть тестовую панель
      </button>
    </div>
  );
};

export default App;
