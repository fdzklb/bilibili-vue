import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  vite: () => ({
    plugins: [
      tailwindcss(),
      // vue(),
      AutoImport({
        resolvers: [VantResolver()],
      }),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
  }),
  manifest: {
    permissions: ["scripting", "contextMenus"],
    host_permissions: ['https://www.bilibili.com/video/*'],
    action: {},
    web_accessible_resources: [
    ],
  },
});
