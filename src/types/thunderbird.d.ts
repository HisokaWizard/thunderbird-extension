interface ThunderbirdMessage {
  id: string;
  subject: string;
  body: string;
}

interface Browser {
  runtime: {
    sendMessage: (message: any) => Promise<any>;
    onMessage: {
      addListener: (callback: (request: any) => void) => void;
    };
  };
  messages: {
    listMessages: (options: { folder: any }) => Promise<ThunderbirdMessage[]>;
    getFull: (messageId: string) => Promise<ThunderbirdMessage>;
    inboxFolder: any;
  };
  compose: {
    setBody: (messageId: string, content: string) => Promise<void>;
  };
}

declare const browser: Browser;
