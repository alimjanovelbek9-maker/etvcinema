interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  openTelegramLink: (url: string) => void;
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  };
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}