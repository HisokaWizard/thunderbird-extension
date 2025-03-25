declare const browser: any;

declare namespace browser.messages {
  function getFull(messageId: string): Promise<Message>;
  function listMessages(folder: any): Promise<Message[]>;
}

declare namespace browser.compose {
  function setBody(messageId: string, body: string): Promise<void>;
}

interface Message {
  id: string;
  subject: string;
  body: string;
}
