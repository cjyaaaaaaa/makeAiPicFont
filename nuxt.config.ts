// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  telemetry: false,

  modules: ["@nuxtjs/tailwindcss"],

  plugins: ["~/plugins/request"],
  runtimeConfig: {
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
        { name: "description", content: "VAA先锋音讯企业官网" },
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
