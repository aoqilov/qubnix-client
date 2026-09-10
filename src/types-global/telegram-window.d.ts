export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: Record<string, unknown>;
        ready: () => void;
        expand: () => void;
        colorScheme: "light" | "dark";
        themeParams: Record<string, string>;
        // Bot API 8.0+ — eski Telegram klientlarida bo'lmasligi mumkin,
        // shuning uchun optional (chaqirishda ham `?.()` ishlatiladi).
        isFullscreen?: boolean;
        requestFullscreen?: () => void;
        exitFullscreen?: () => void;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        isVerticalSwipesEnabled?: boolean;
        enableVerticalSwipes?: () => void;
        disableVerticalSwipes?: () => void;
        onEvent?: (eventType: string, callback: () => void) => void;
        offEvent?: (eventType: string, callback: () => void) => void;
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
      };
    };
  }
}
