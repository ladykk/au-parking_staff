/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RECAPTCHA_SITE_KEY: string;
  readonly VITE_VAPID_KEY: string;
  readonly VITE_LINE_CHANNEL_ACCESS_TOKEN: string;
  readonly VITE_LIFF_URI: string;
  readonly VITE_STAFF_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
