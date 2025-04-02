// import "webext-dynamic-content-scripts";
// import addPermissionToggle from "webext-permission-toggle";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "bilibiliListenCard",
      title: "去精听",
      contexts: ["page"],
      documentUrlPatterns: ["https://www.bilibili.com/video/*"]
    })
  })
  
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "bilibiliListenCard" && tab?.id) {
      // 向当前标签页发送开启精听的消息
      console.log("发送消息给当前标签页");
      browser.tabs.sendMessage(tab.id, {
        action: "openListenCard"
      })
    }
  })
  
});