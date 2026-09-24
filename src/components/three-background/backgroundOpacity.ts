const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/**
 * Background opacity for the current scroll position.
 * Fades out over the 1.5 viewports before `fadeOutEnd` (i.e. starting half a viewport
 * before the target scrolls into view, fully out once its top reaches the viewport top),
 * then fades back in over the last half viewport of scroll.
 */
export const backgroundOpacity = ({
  scrollTop,
  scrollHeight,
  viewportHeight,
  fadeOutEnd,
}: {
  scrollTop: number,
  scrollHeight: number,
  viewportHeight: number,
  fadeOutEnd: number,
}) => {
  const fadeOut = clamp01((fadeOutEnd - scrollTop) / (viewportHeight * 1.5))
  const remaining = scrollHeight - viewportHeight - scrollTop
  const fadeIn = clamp01(1 - remaining / (viewportHeight * 0.5))
  return Math.max(fadeOut, fadeIn)
}
