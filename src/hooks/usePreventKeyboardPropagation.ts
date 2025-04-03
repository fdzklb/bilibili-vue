// 阻止与b站的快捷键冒泡
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

const clearListeners = () => {
  document.removeEventListener('keydown', preventKeyboardPropagation)
  document.removeEventListener('keyup', preventKeyboardPropagation)
  document.removeEventListener('keypress', preventKeyboardPropagation)
}

// 设置键盘事件监听
const setListeners = () => {
  document.addEventListener('keydown', preventKeyboardPropagation)
  document.addEventListener('keyup', preventKeyboardPropagation)
  document.addEventListener('keypress', preventKeyboardPropagation)
}

export { clearListeners, setListeners }