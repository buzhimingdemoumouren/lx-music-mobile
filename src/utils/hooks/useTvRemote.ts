import { useCallback, useEffect, useRef } from 'react'
import { addTvKeyListener, type TvKeyEvent, TV_KEY_CODES } from '@/utils/nativeModules/tvRemote'

interface UseTvRemoteOptions {
  onUp?: () => void
  onDown?: () => void
  onLeft?: () => void
  onRight?: () => void
  onCenter?: () => void
  onBack?: () => void
  onMenu?: () => void
  onPlayPause?: () => void
  onNext?: () => void
  onPrevious?: () => void
  onVolumeUp?: () => void
  onVolumeDown?: () => void
  enabled?: boolean
}

export const useTvRemote = (options: UseTvRemoteOptions) => {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const handler = useCallback((event: TvKeyEvent) => {
    if (event.action !== 'down') return
    if (optionsRef.current.enabled === false) return

    const { keyCode } = event
    const opts = optionsRef.current

    switch (keyCode) {
      case TV_KEY_CODES.DPAD_UP:
        opts.onUp?.()
        break
      case TV_KEY_CODES.DPAD_DOWN:
        opts.onDown?.()
        break
      case TV_KEY_CODES.DPAD_LEFT:
        opts.onLeft?.()
        break
      case TV_KEY_CODES.DPAD_RIGHT:
        opts.onRight?.()
        break
      case TV_KEY_CODES.DPAD_CENTER:
      case TV_KEY_CODES.ENTER:
        opts.onCenter?.()
        break
      case TV_KEY_CODES.BACK:
        opts.onBack?.()
        break
      case TV_KEY_CODES.MENU:
        opts.onMenu?.()
        break
      case TV_KEY_CODES.MEDIA_PLAY_PAUSE:
      case TV_KEY_CODES.MEDIA_PLAY:
      case TV_KEY_CODES.MEDIA_PAUSE:
        opts.onPlayPause?.()
        break
      case TV_KEY_CODES.MEDIA_NEXT:
        opts.onNext?.()
        break
      case TV_KEY_CODES.MEDIA_PREVIOUS:
        opts.onPrevious?.()
        break
      case TV_KEY_CODES.VOLUME_UP:
        opts.onVolumeUp?.()
        break
      case TV_KEY_CODES.VOLUME_DOWN:
        opts.onVolumeDown?.()
        break
    }
  }, [])

  useEffect(() => {
    const removeListener = addTvKeyListener(handler)
    return removeListener
  }, [handler])
}
