import { watchPostEffect, onUnmounted } from 'vue'

// 防止一些键盘事件冒泡，避免和b站的键盘快捷键冲突
export function usePreventKeyboardPropagation(open: boolean) {
  const preventKeyboardPropagation = (e: KeyboardEvent) => {
    const keysToPrevent = [
      // 'Space',
      // 'ArrowLeft',
      // 'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Shift',
      'KeyF',
      'KeyA',
      'KeyD',
      'KeyW',
      'KeyE',
      'KeyQ',
    ]
  
    if (keysToPrevent.includes(e.code)) {
      e.stopPropagation()
      // e.preventDefault()
    }
  }
  const clear = () => {
    document.removeEventListener('keydown', preventKeyboardPropagation, true)
    document.removeEventListener('keyup', preventKeyboardPropagation, true)
    document.removeEventListener('keypress', preventKeyboardPropagation, true) 
  }
  const set = () => {
    document.addEventListener('keydown', preventKeyboardPropagation, true)
    document.addEventListener('keyup', preventKeyboardPropagation, true)
    document.addEventListener('keypress', preventKeyboardPropagation, true) 
  }

  // 在open为true时，监听键盘事件，在open为false时，移除监听
  watchPostEffect(() => {
    if (open) {
      set()
    } else {
      clear()
      console.log('默认键盘事件监听已移除')
    }
  })

  onUnmounted(() => {
    clear()
  })
} 