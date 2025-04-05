import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  srcDir: "src",
  vite: () => ({
    plugins: [
      tailwindcss(),
      // vue(),
    ],
  }),
  manifest: {
    permissions: ["scripting", "contextMenus"],
    host_permissions: ["https://www.bilibili.com/video/*"],
    action: {},
    web_accessible_resources: [
      {
        "resources": [
          "assets/template.docx",
          "assets/icons/active.gif",
        ],
        "matches": [
          "*://*.bilibili.com/*"
        ]
      }
    ],
  },
});
