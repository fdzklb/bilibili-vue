<script lang="ts" setup>
import ListenCard from '@/components/ListenCard/index.vue';
import { setListeners, clearListeners } from "@/hooks/usePreventKeyboardPropagation";
import { PauseCircle } from "lucide-vue-next";

const isOpen = ref(false); // 控制卡片是否已经开启 鼠标右键页面点击插件图标时会触发
const isShow = ref(true); // 控制卡片的显示隐藏 隐藏时在页面右侧显示一个暂停按钮 点击后显示卡片

// 使用 watch 监听 isOpen 的变化，确保每次值改变时都能执行阻止键盘事件的函数，避免和b站快捷键冲突
  watchPostEffect(() => {
    if (isOpen) {
      setListeners()
    } else {
      clearListeners()
    }
  })

  // 组件卸载时清除监听
  onUnmounted(() => {
    clearListeners()
  })
const messageListener = (message: { action: string }) => {
  if (message.action === "openListenCard") {
    // 触发精听模式的开启
    isOpen.value = true;
  }
};

onMounted(() => {
  browser.runtime.onMessage.addListener(messageListener);
});

onUnmounted(() => {
  browser.runtime.onMessage.removeListener(messageListener);
});

const handleUpdateIsShow = (value: boolean) => {
  isShow.value = value
}

</script>

<template>
  <div v-if="isOpen">
    <ListenCard :isShow="isShow" @updateIsShow="handleUpdateIsShow" />
    <!-- 隐藏展示的悬浮球  -->
    <div
      v-if="!isShow"
      class="fixed right-0 top-1/3 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
      @click="isShow = true"
    >
      <div
        class="bg-primary/80 text-white p-2 rounded-l-md shadow-lg cursor-pointer"
      >
        <PauseCircle className="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
