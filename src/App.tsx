import React, { useEffect, useState } from "react";

const App = () => {
  const [emailContent, setEmailContent] = useState("");
  const [currentMessageId, setCurrentMessageId] = useState("");

  // Получение ID текущего письма
  useEffect(() => {
    if (!browser) return;
    console.log("browser");
    browser?.messages
      ?.listMessages({ folder: browser?.messages?.inboxFolder })
      ?.then((messages) => {
        setCurrentMessageId(messages[0]?.id || "");
      });
  }, []);

  // Получить содержимое письма
  const fetchEmailContent = async () => {
    if (!browser) return;
    const content = await browser?.runtime?.sendMessage({
      action: "GET_EMAIL_CONTENT",
      messageId: currentMessageId,
    });
    setEmailContent(content.body);
  };

  // Обновить содержимое письма
  const updateEmailContent = async (newContent: string) => {
    if (!browser) return;
    await browser?.runtime?.sendMessage({
      action: "UPDATE_EMAIL_CONTENT",
      messageId: currentMessageId,
      content: newContent,
    });
  };

  return (
    <div>
      <button onClick={fetchEmailContent}>Загрузить письмо</button>
      <textarea
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
      />
      <button onClick={() => updateEmailContent(emailContent)}>
        Сохранить изменения
      </button>
    </div>
  );
};

export default App;
