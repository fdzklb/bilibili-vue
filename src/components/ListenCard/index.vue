<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { exportWordDocx } from "@/lib/utils"
import Content from "./Content.vue"
import Footer from "./Footer.vue"
import Header from "./Header.vue"
import {
  fetchSubtitles,
  formatSubtitleData,
  getAidOrBvid,
  type dataListTypes
} from "@/utils/bilibili_getSubtitle"
type DownloadType = "raw" | "translate" | "raw+translate" | "raw+note" | "translate+note" | "raw+translate+note"

interface ModesTypes {
  listenWriteMode: boolean // 是否开启听写模式
  noteMode: boolean // 是否开启笔记模式
  showRaw: boolean // 是否显示原文
  showTranslate: boolean // 是否显示译文
}

// 获取字幕数据的函数
const getSubtitle = async (location: Location) => {
  const aidOrBvid = await getAidOrBvid(location)
  const subtitles = aidOrBvid ? await fetchSubtitles(aidOrBvid) : {}
  return subtitles
}

const props = defineProps<{
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isShow', value: boolean): void
}>()

const title = ref("")
const data = ref<dataListTypes>([])
const loading = ref(true)
const isRepeat = ref(false)
const currentIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const videoRef = ref<HTMLVideoElement | null>(null)

const modes = ref<ModesTypes>({
  listenWriteMode: true,
  noteMode: false,
  showRaw: true,
  showTranslate: false
})

// 当点击显示原文/译文按钮时
watch([() => modes.value.showRaw, () => modes.value.showTranslate], () => {
  data.value = data.value.map((item) => ({
    ...item,
    showRaw: modes.value.showRaw,
    showTranslate: modes.value.showTranslate
  }))
})

watch(() => data.value.length, () => {
  if (data.value.length === 0) return
  const video = document
    .querySelector(".bpx-player-video-wrap")
    ?.querySelector("video")
  videoRef.value = video
})

// 获取字幕数据
onMounted(async () => {
  loading.value = true
  const subtitleData = await getSubtitle(location)
  const { title: videoTitle } = subtitleData
  const formatData: dataListTypes = formatSubtitleData(subtitleData, 6)
  data.value = formatData
  loading.value = false
  title.value = videoTitle
})

// 监听视频播放状态变化
watch([videoRef, () => data.value.length, isPlaying, isRepeat, currentIndex], () => {
  if (!videoRef.value || data.value.length === 0) return

  duration.value = videoRef.value?.duration || 0

  const handlePlay = () => isPlaying.value = true
  const handlePause = () => isPlaying.value = false
  
  const handleTimeUpdate = () => {
    if (!isPlaying.value || !videoRef.value) return
    const currentVideoTime = videoRef.value.currentTime
    
    if (isRepeat.value) {
      const currentSubtitle = data.value[currentIndex.value]
      if (currentVideoTime > currentSubtitle.to - 0.1) {
        videoRef.value.currentTime = currentSubtitle.from
        currentTime.value = videoRef.value.currentTime
        return
      }
    } else {
      const index = data.value.findIndex(
        (subtitle) =>
          subtitle.from <= currentVideoTime && subtitle.to >= currentVideoTime
      )
      if (index !== -1) {
        currentIndex.value = index
        currentTime.value = currentVideoTime
      }
    }
  }

  videoRef.value.addEventListener("play", handlePlay)
  videoRef.value.addEventListener("pause", handlePause)
  videoRef.value.addEventListener("timeupdate", handleTimeUpdate)

  onUnmounted(() => {
    videoRef.value?.removeEventListener("play", handlePlay)
    videoRef.value?.removeEventListener("pause", handlePause)
    videoRef.value?.removeEventListener("timeupdate", handleTimeUpdate)
  })
})

// 监听视频播放状态变化 
const handleVideoChange = (
  type: "playRate" | "currentTime" | "isPlaying",
  value: number | boolean
) => {
  if (videoRef.value) {
    if (type === "playRate") {
      videoRef.value.playbackRate = value as number
    } else if (type === "currentTime") {
      const newTime = data.value[value as number].from + 0.05
      videoRef.value.currentTime = newTime
      currentIndex.value = value as number
    } else if (type === "isPlaying") {
      if (value) {
        videoRef.value.play()
      } else {
        videoRef.value.pause()
      }
    }
  }
}

// 下载文档
const handleDownload = (type: DownloadType, docType: string) => {
  console.log(type, docType)
  exportWordDocx(
    browser.runtime.getURL(`~assets/template.docx`),
    {
      description: "欢迎使用bilibili插件，有任何问题可以联系我！",
      author: 'fangdada',
      email: 'fangdada160@gmail.com',
      title: title.value,
      data: data.value.map((item) => ({
        content: item.content,
        translateContent: item.translateContent,
        noteContent: item.noteContent
      }))
    },
    `${title.value}.docx`
  )
}
</script>

<template>
  <div
    v-if="isShow"
    class="fixed top-16 right-0 flex flex-col gap-2 w-[80vw] h-[calc(100vh-64px)] bg-[#FFFFF4] rounded-lg shadow-xl"
  >
    <!-- 头部按钮操作区域 -->
    <Header
      v-model:modes="modes"
      :isShow="isShow"
      @update:show-card="(val) => emit('update:isShow', val)"
      @handleDownload="handleDownload"
    />
    <div class="h-[calc(100%-80px-64px-64px)]">
      <!-- 中间句子List和句子内容 -->
      <Content
        :loading="loading"
        v-model:data="data"
        :is-playing="isPlaying"
        :current-index="currentIndex"
        :modes="modes"
        @video-change="handleVideoChange"
      />
    </div>
    <!-- 视频进度条控制区域 -->
    <div class="w-full h-[80px] px-8 py-2 backdrop-blur-sm border-t border-gray-200">
      <!-- <Footer
        :current-index="currentIndex"
        :data-length="data.length"
        :duration="duration"
        :current-time="currentTime"
        :is-playing="isPlaying"
        v-model:is-repeat="isRepeat"
        @video-change="handleVideoChange"
      /> -->
    </div>
  </div>
</template>
