import { useEffect } from 'react'
import { addTvKeyListener, type TvKeyEvent, TV_KEY_CODES } from '@/utils/nativeModules/tvRemote'
import { tvFocusManager } from '@/utils/tvFocusManager'
import commonState from '@/store/common/state'
import { setNavActiveId } from '@/core/common'
import { navigations } from '@/navigation'

const NAV_ORDER = ['nav_search', 'nav_songlist', 'nav_top', 'nav_love', 'nav_setting'] as const

export const useTvRemoteGlobal = () => {
  useEffect(() => {
    const handler = (event: TvKeyEvent) => {
      if (event.action !== 'down') return

      const { keyCode } = event

      switch (keyCode) {
        case TV_KEY_CODES.DPAD_UP:
        case TV_KEY_CODES.DPAD_DOWN:
        case TV_KEY_CODES.DPAD_LEFT:
        case TV_KEY_CODES.DPAD_RIGHT: {
          const direction = {
            [TV_KEY_CODES.DPAD_UP]: 'up' as const,
            [TV_KEY_CODES.DPAD_DOWN]: 'down' as const,
            [TV_KEY_CODES.DPAD_LEFT]: 'left' as const,
            [TV_KEY_CODES.DPAD_RIGHT]: 'right' as const,
          }[keyCode]
          tvFocusManager.focusNearest(direction)
          break
        }
        case TV_KEY_CODES.DPAD_CENTER:
        case TV_KEY_CODES.ENTER: {
          // If no focus, set focus to first element
          if (!tvFocusManager.getCurrentFocus()) {
            const firstId = tvFocusManager.getFirstFocusableId()
            if (firstId) {
              tvFocusManager.setFocus(firstId)
            }
          }
          break
        }
        case TV_KEY_CODES.MEDIA_PLAY_PAUSE:
        case TV_KEY_CODES.MEDIA_PLAY:
        case TV_KEY_CODES.MEDIA_PAUSE: {
          global.app_event.play()
          break
        }
        case TV_KEY_CODES.MEDIA_NEXT: {
          global.app_event.emit('next')
          break
        }
        case TV_KEY_CODES.MEDIA_PREVIOUS: {
          global.app_event.emit('prev')
          break
        }
      }
    }

    const removeListener = addTvKeyListener(handler)
    return removeListener
  }, [])
}
