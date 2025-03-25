import React, { useEffect, useState } from 'react';

const App = () => {
  const [emailContent, setEmailContent] = useState('');
  const [currentMessageId, setCurrentMessageId] = useState('');
  const [isExtensionContext, setIsExtensionContext] = useState(false);

  // Проверяем контекст выполнения
  useEffect(() => {
    setIsExtensionContext(typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined');

    if (typeof browser === 'undefined' || !browser.messages) return;

    const init = async () => {
      try {
        const messages = await browser.messages.listMessages({
          folder: browser.messages.inboxFolder,
        });
        setCurrentMessageId(messages[0]?.id || '');
      } catch (error) {
        console.error('Failed to init:', error);
      }
    };

    init();
  }, []);

  const fetchEmailContent = async () => {
    if (!isExtensionContext) return;

    try {
      const content = await browser.runtime.sendMessage({
        action: 'GET_EMAIL_CONTENT',
        messageId: currentMessageId,
      });
      setEmailContent(content.body);
    } catch (error) {
      console.error('Failed to fetch email:', error);
    }
  };

  const updateEmailContent = async (newContent: string) => {
    if (!isExtensionContext) return;

    try {
      await browser.runtime.sendMessage({
        action: 'UPDATE_EMAIL_CONTENT',
        messageId: currentMessageId,
        content: newContent,
      });
      alert('Изменения сохранены!');
    } catch (error) {
      console.error('Failed to update email:', error);
      alert('Ошибка при сохранении!');
    }
  };

  if (!isExtensionContext) {
    return (
      <div className='warning'>
        <h3>Это расширение работает только в Thunderbird</h3>
        <p>Для тестирования в браузере используйте mock-режим</p>
      </div>
    );
  }

  return (
    <div className='email-editor'>
      <button onClick={fetchEmailContent} disabled={!currentMessageId}>
        Загрузить письмо
      </button>
      <textarea
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        placeholder={!currentMessageId ? 'Сначала выберите письмо' : ''}
      />
      <button onClick={() => updateEmailContent(emailContent)} disabled={!emailContent}>
        Сохранить изменения
      </button>
      <button onClick={() => console.log('TEST 12345')}>Тестим рантайм</button>
    </div>
  );
};

export default App;
