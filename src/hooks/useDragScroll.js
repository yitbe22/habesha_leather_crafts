import { useEffect } from 'react'

/**
 * Lets a mouse drag a horizontal `.rail` like a finger would. Touch and pen
 * keep native scrolling. While dragging, `data-dragging` switches off link
 * clicks so letting go after a drag doesn't open a tile.
 */
export function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let startX = 0
    let startScroll = 0
    let down = false

    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      down = true
      startX = e.clientX
      startScroll = el.scrollLeft
    }
    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 5) el.dataset.dragging = ''
      if ('dragging' in el.dataset) el.scrollLeft = startScroll - dx
    }
    const onUp = () => {
      down = false
      // clear after the click event that follows pointerup has been swallowed
      requestAnimationFrame(() => delete el.dataset.dragging)
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [ref])
}
