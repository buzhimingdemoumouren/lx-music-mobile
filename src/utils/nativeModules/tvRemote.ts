import { NativeEventEmitter, NativeModules } from 'react-native'

const { TvRemoteModule } = NativeModules

export interface TvKeyEvent {
  keyCode: number
  action: 'down' | 'up'
  keyName: string
}

// Android KeyEvent key codes
export const TV_KEY_CODES = {
  DPAD_UP: 19,
  DPAD_DOWN: 20,
  DPAD_LEFT: 21,
  DPAD_RIGHT: 22,
  DPAD_CENTER: 23,
  ENTER: 66,
  BACK: 4,
  MENU: 82,
  VOLUME_UP: 24,
  VOLUME_DOWN: 25,
  MEDIA_PLAY_PAUSE: 85,
  MEDIA_STOP: 86,
  MEDIA_NEXT: 87,
  MEDIA_PREVIOUS: 88,
  MEDIA_REWIND: 89,
  MEDIA_FAST_FORWARD: 90,
  MEDIA_PLAY: 126,
  MEDIA_PAUSE: 127,
} as const

export type TvKeyName = keyof typeof TV_KEY_CODES

let eventEmitter: NativeEventEmitter | null = null
let eventListener: ReturnType<typeof eventEmitter.addListener> | null = null
let handlers: Array<(event: TvKeyEvent) => void> = []

const getEmitter = () => {
  if (!eventEmitter && TvRemoteModule) {
    eventEmitter = new NativeEventEmitter(TvRemoteModule)
  }
  return eventEmitter
}

export const startTvRemoteListener = () => {
  if (eventListener) return

  const emitter = getEmitter()
  if (!emitter) return

  eventListener = emitter.addListener('tv-remote-key', (event: TvKeyEvent) => {
    handlers.forEach(handler => handler(event))
  })
}

export const stopTvRemoteListener = () => {
  if (eventListener) {
    eventListener.remove()
    eventListener = null
  }
}

export const addTvKeyListener = (handler: (event: TvKeyEvent) => void): (() => void) => {
  handlers.push(handler)

  return () => {
    handlers = handlers.filter(h => h !== handler)
  }
}

export const isTvRemoteKey = (keyCode: number): boolean => {
  return Object.values(TV_KEY_CODES).includes(keyCode as typeof TV_KEY_CODES[keyof typeof TV_KEY_CODES])
}

export const getKeyName = (keyCode: number): TvKeyName | `KEY_${number}` => {
  const entry = Object.entries(TV_KEY_CODES).find(([, code]) => code === keyCode)
  return entry ? entry[0] as TvKeyName : `KEY_${keyCode}`
}
