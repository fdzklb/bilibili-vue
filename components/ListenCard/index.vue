<script lang="ts" setup></script>

<template>
  <div className="fixed top-16 right-0 flex flex-col gap-2 w-[80vw] h-[calc(100vh-64px)] bg-[#FFFFF4] rounded-lg shadow-xl">
    
    <!-- {/* 头部按钮操作区域 */} -->
    <h1 className="text-center text-2xl font-bold py-4">这是头部操作区域</h1>

    <div className="h-[calc(100%-80px-64px-64px)]">
      <h1>这是左侧列表区域</h1>
    </div>
    <!-- {/* 视频进度条控制区域 */} -->
    <div
      className="w-full h-[80px] px-8 py-2 backdrop-blur-sm border-t border-gray-200"
    >
      这是底部控制视频进度区域
    </div>
  </div>
</template>

<style scoped></style>
