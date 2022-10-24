declare global {
  interface Window {
    Buffer: Buffer;
    ENV: {
      GOOGLE_ANALYTICS: string;
      BACKEND_API_URL: string;
      DEX_ROUTER_API_KEY: string;
    };
    gtag?: (event: string, message: string) => void;
  }
}

export {};
