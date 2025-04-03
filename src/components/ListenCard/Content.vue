<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Button, Input, Textarea } from "@/components/ui"
import type { dataListTypes, dataTypes } from "@/utils/bilibili_getSubtitle"
import { ArrowLeft, ArrowRight } from "lucide-react"
import VirtualList from 'vue-virtual-list-v3';
import activeImage from "url:~assets/icons/active.gif"
// import InputWord from "./InputWord.vue"

interface ModesTypes {
  listenWriteMode: boolean // 是否开启听写模式
  noteMode: boolean // 是否开启笔记模式
  showRaw: boolean // 是否显示原文
  showTranslate: boolean // 是否显示译文
}

const props = defineProps<{
  loading: boolean
  data: dataListTypes
  isPlaying: boolean
  currentIndex: number
  modes: ModesTypes
}>()

const emit = defineEmits<{
  (e: 'update:data', value: dataListTypes): void
  (e: 'video-change', type: "playRate" | "currentTime" | "isPlaying", value: number | boolean): void
}>()

// 状态
const allowAutoScroll = ref(true)
const focusIndex = ref<number | null>(null)
const timerRef = ref<NodeJS.Timeout | null>(null)

// 计算属性
const currentRowData = computed(() => props.data[props.currentIndex])
const totalLength = computed(() => props.data.length)
const { listenWriteMode, noteMode } = toRefs(props.modes)
const currentRawArr = computed(() => 
  currentRowData.value?.content ? currentRowData.value.content.split(" ") : []
)

// 监听快捷键
onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.shiftKey && e.code === "ArrowLeft") {
      e.preventDefault()
      if (props.currentIndex > 0) {
        emit('video-change', "currentTime", props.currentIndex - 1)
      }
    }
    if (e.shiftKey && e.code === "ArrowRight") {
      e.preventDefault()
      if (props.currentIndex < totalLength.value - 1) {
        emit('video-change', "currentTime", props.currentIndex + 1)
      }
    }
  }
  
  document.addEventListener("keydown", handleKeyDown)
  onUnmounted(() => {
    document.removeEventListener("keydown", handleKeyDown)
  })
})

// 处理数据更新
const handleChange = (index: number, key: string, value: string | boolean) => {
  const updateRow = {
    ...currentRowData.value,
    [key]: value
  }
  const updateData = [...props.data]
  updateData[index] = updateRow
  emit('update:data', updateData)
}

// 处理用户交互
const handleUserInteraction = () => {
  allowAutoScroll.value = false
  
  if (timerRef.value) {
    clearTimeout(timerRef.value)
  }
  
  timerRef.value = setTimeout(() => {
    allowAutoScroll.value = true
  }, 5000)
}
</script>

<template>
  <div class="h-full">
    <!-- 左侧句子List -->
    <div class="absolute left-0 w-[200px] h-[calc(100%-80px-64px-64px)] border-r border-gray-200 bg-inherit py-2">
      <div v-if="loading" class="space-y-4 p-4">
        <div v-for="i in 10" :key="i" class="flex items-center justify-between animate-pulse">
          <div class="h-4 w-24 bg-gray-200 rounded"></div>
          <div class="h-4 w-4 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <VirtualList
        v-else
        :data-key="'index'"
        :data-sources="Array.from({ length: totalLength }, (_, i) => ({ index: i }))"
        :keeps="10"
        :item-size="56"
        :estimate-size="56"
        :start="Math.max(0, currentIndex - 5)"
        @scroll="handleUserInteraction"
        :style="{
          height: `${window.innerHeight - 80 - 64 - 64 - 80}px`,
          width: '200px'
        }"
        
      >
        <template #item="{ source: { index } }">
          <div
            :class="[
              'px-4 py-4 cursor-pointer hover:bg-primary/10',
              { 'bg-primary/30': index === currentIndex }
            ]"
            @click="handleUserInteraction(); emit('video-change', 'currentTime', index)">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">第 {{ index + 1 }} 句</span>
              <img
                v-if="index === currentIndex && isPlaying"
                :src="activeImage"
                alt="active indicator"
                class="w-4 h-4"
              />
              <img
                v-else-if="index === currentIndex"
                class="w-4 h-4"
                src="data:image/png;base64,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"
              />
            </div>
          </div>
        </template>
      </VirtualList>
    </div>
    
    <!-- 右侧句子内容 -->
    <div class="flex justify-between items-center ml-[200px] px-12 h-full">
      <Button
        size="icon"
        class="rounded-full h-12 w-12 min-w-12"
        @click="currentIndex > 0 && emit('video-change', 'currentTime', currentIndex - 1)"
        title="快捷键:Shift+左箭头⬅"
        :disabled="currentIndex === 0">
        <ArrowLeft />
      </Button>
      
      <div class="text-lg px-10 py-4 space-y-4 flex flex-col align-middle flex-grow h-full">
        <div class="text-center mb-4 text-gray-600">
          <span class="text-primary text-xl">{{ currentIndex + 1 }}</span> / {{ totalLength }}
        </div>

        <!-- 内容区域 -->
        <div class="flex flex-col items-center space-y-4">
          <!-- 原文部分 -->
          <div class="">
            <div
              class="pl-4"
              @click.stop="handleChange(currentIndex, 'showRaw', !currentRowData?.showRaw)">
              <div class="min-h-[40px] flex cursor-pointer tems-center rounded-lg">
                <span
                  class="text-base"
                  :style="currentRowData?.showRaw ? {} : {
                    color: 'transparent',
                    textShadow: '#5a5656 0 0 11px'
                  }">
                  {{ currentRowData?.content || "暂无原文(该视频作者未上传原文字幕)" }}
                </span>
              </div>
            </div>
          </div>

          <!-- 译文部分 -->
          <div class="">
            <div
              class="pl-4"
              @click.stop="handleChange(currentIndex, 'showTranslate', !currentRowData?.showTranslate)">
              <div
                :class="[
                  'min-h-[48px] flex items-center cursor-pointer rounded-lg',
                  currentRowData?.showTranslate ? '' : 'backdrop-blur-md bg-white/30'
                ]">
                <span
                  class="text-base"
                  :style="currentRowData?.showTranslate ? {} : {
                    color: 'transparent',
                    textShadow: '#5a5656 0 0 11px'
                  }">
                  {{ currentRowData?.translateContent || "暂无译文(该视频作者未上传译文字幕)" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 听写输入区域 -->
        <div
          v-if="listenWriteMode"
          id="listenWriteContentDom"
          class="flex flex-wrap gap-3 w-full">
          <template v-if="currentRawArr.length">
            <InputWord
              v-for="(item, index) in currentRawArr"
              :key="`${item}-${index}`"
              :set-focus-index="(index) => focusIndex = index"
              :focus-index="focusIndex"
              :word="item"
              :index="index"
              :total-length="currentRawArr.length"
              :input-value-arr="currentRowData?.listenWriteContent?.split(' ') || []"
              @change="(value) => handleChange(currentIndex, 'listenWriteContent', value.join(' '))"
            />
          </template>
          <div v-else class="w-full flex justify-center">
            <Input
              class="w-[80%] min-h-[60px]"
              :value="currentRowData?.listenWriteContent || ''"
              @change="(e) => {
                e.stopPropagation()
                handleChange(currentIndex, 'listenWriteContent', e.target.value)
              }"
              @keydown.stop"
            />
          </div>
        </div>

        <!-- 笔记区域 -->
        <div v-if="noteMode" class="w-full flex flex-col items-center">
          <Textarea
            class="w-[80%] min-h-[80px]"
            placeholder="笔记...(可导出笔记)"
            :value="currentRowData?.noteContent || ''"
            @change="(e) => {
              e.stopPropagation()
              handleChange(currentIndex, 'noteContent', e.target.value)
            }"
            @keydown.stop
          />
        </div>
      </div>

      <Button
        size="icon"
        class="rounded-full h-12 w-12 min-w-12"
        @click="currentIndex < totalLength - 1 && emit('video-change', 'currentTime', currentIndex + 1)"
        title="快捷键:Shift+右箭头➡"
        :disabled="currentIndex === totalLength - 1">
        <ArrowRight />
      </Button>
    </div>
  </div>
</template>
