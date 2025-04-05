<script lang="ts" setup>
import { ref, watch } from 'vue'
import {
  Download,
  Minimize2,
} from "lucide-vue-next"
import { Button, Tooltip,TooltipContent, TooltipProvider,TooltipTrigger, Switch } from '@/components/ui'

// 类型定义
type DownloadType = "raw" | "translate" | "raw+translate" | "raw+note" | "translate+note" | "raw+translate+note"
type ModesTypes = Record<string, boolean>

// Props定义
const props = defineProps<{
  modes: ModesTypes
}>()

const emit = defineEmits<{
  (e: 'updateIsShow', value: boolean): void
  (e: 'handleDownload', type: DownloadType, docType: string): void
  (e: 'update:modes', value: ModesTypes): void
}>()

// 本地状态
const modesData = ref<ModesTypes>(props.modes)

// 监听本地状态变化并触发更新
watch(modesData, (newVal) => {
  emit('update:modes', newVal)
}, { deep: true })
</script>

<template>
  <div class="backdrop-blur-sm shadow-sm p-4 border-b border-gray-200">
    <div class="flex items-center justify-between gap-4">
      <!-- 中间控制组 -->
      <div class="flex items-center gap-4"></div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-4 pr-6">
          <template v-for="(mode, index) in [
            { value: 'showRaw', title: '原文' },
            { value: 'showTranslate', title: '译文' },
            { value: 'listenWriteMode', title: '听写模式' },
            { value: 'noteMode', title: '笔记模式' }
          ]" :key="mode.value">
            <div
              class="flex items-center gap-2"
              :class="{ 'border-r border-gray-200 pr-6': index === 1 }"
            >
              <label
                :for="mode.value"
                class="text-sm font-medium text-gray-700"
              >
                {{ mode.title }}
              </label>
              <Switch
                :id="mode.value"
                v-model="modesData[mode.value]"
                class="data-[state=checked]:bg-primary"
              />
            </div>
          </template>
        </div>
      </div>
      <!-- 侧控制组 -->
      <div class="flex items-center gap-4">
        <Button
          class="h-6"
          @click="handleDownload('raw+translate+note', 'doc')"
        >
          <template #icon>
            <Download class="h-4 w-4" />
          </template>
          <span>下载(word格式)</span>
        </Button>
        
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  @click="emit('updateIsShow', false)"
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/80 cursor-pointer"
                  title="收起">
                  <Minimize2 className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="end"
                >
                收起
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 如果需要额外样式可以在这里添加 */
</style>
