import { ContentScriptContext } from "#imports";
import App from "./App.vue";
import { createApp } from "vue";
import '../../global.css';


export default defineContentScript({
  matches: ["https://www.bilibili.com/video/*"], // 只在B站视频页面生效
  // allFrames: true, // 所有的iframe都生效
  runAt: "document_end", // 脚本在页面加载完成后执行
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await defineOverlay(ctx);

    // Mount initially
    ui.mount();

    // Re-mount when page changes
    ctx.addEventListener(window, "wxt:locationchange", (event) => {
      ui.mount();
    });
  },
});

function defineOverlay(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "bilibili-overlay",
    position: "modal",
    zIndex: 99999,
    anchor: "body",
    onMount(container, _shadow, shadowHost) {
      const app = createApp(App);
      app.mount(container);
      shadowHost.style.pointerEvents = "none";
      return app;
    },
    onRemove(app) {
      app?.unmount();
    },
  });
}