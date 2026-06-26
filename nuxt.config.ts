// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  telemetry: false,

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n"],

  i18n: {
    locales: [
      { code: "en", name: "English", iso: "en-US" },
      { code: "zh", name: "中文", iso: "zh-CN" },
      { code: "de", name: "Deutsch", iso: "de-DE" },
      { code: "es", name: "Español", iso: "es-ES" },
      { code: "ja", name: "日本語", iso: "ja-JP" },
    ],
    defaultLocale: "en",
    strategy: "prefix_except_default",
    vueI18n: "./i18n.config.ts",
  },

  plugins: ["~/plugins/request"],
  runtimeConfig: {
    "/**": {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      },
    },
    public: {
      baseURL: 'http://localhost:8081'
    }
  },
  app: {
    head: {
      charset: "utf-8",
      title: "gptpix.ai",
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no",
        },
        { name: "description", content: "gptpix.ai AI image and video generation studio" },
      ],
    },
  },

  tailwindcss: {},

  css: ["~/assets/style/base.scss"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/style/variable.scss" as *;',
        },
      },
    },
  },
});
