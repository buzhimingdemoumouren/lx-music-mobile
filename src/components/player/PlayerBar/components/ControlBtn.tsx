import { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '@/components/common/Icon'
import { useIsPlay } from '@/store/player/hook'
import { useTheme } from '@/store/theme/hook'
import { playNext, playPrev, togglePlay } from '@/core/player/player'
import { createStyle } from '@/utils/tools'
import { useHorizontalMode } from '@/utils/hooks'
import { TvFocusable } from '@/components/common/TvFocusable'

const BTN_SIZE = 24
const handlePlayPrev = () => {
  void playPrev()
}
const handlePlayNext = () => {
  void playNext()
}

const PlayPrevBtn = () => {
  const theme = useTheme()

  return (
    <TvFocusable id="player-prev" onPress={handlePlayPrev} style={styles.cotrolBtn}>
      <Icon name='prevMusic' color={theme['c-button-font']} size={BTN_SIZE} />
    </TvFocusable>
  )
}

const PlayNextBtn = () => {
  const theme = useTheme()

  return (
    <TvFocusable id="player-next" onPress={handlePlayNext} style={styles.cotrolBtn}>
      <Icon name='nextMusic' color={theme['c-button-font']} size={BTN_SIZE} />
    </TvFocusable>
  )
}

const TogglePlayBtn = () => {
  const isPlay = useIsPlay()
  const theme = useTheme()

  return (
    <TvFocusable id="player-toggle" onPress={togglePlay} style={styles.cotrolBtn}>
      <Icon name={isPlay ? 'pause' : 'play'} color={theme['c-button-font']} size={BTN_SIZE} />
    </TvFocusable>
  )
}

export default () => {
  const isHorizontalMode = useHorizontalMode()
  return (
    <>
      {/* <TouchableOpacity activeOpacity={0.5} onPress={toggleNextPlayMode}>
        <Text style={{ ...styles.cotrolBtn }}>
          <Icon name={playModeIcon} style={{ color: theme.secondary10 }} size={18} />
        </Text>
      </TouchableOpacity>
    */}
      {/* {btnPrev} */}
      { isHorizontalMode ? <PlayPrevBtn /> : null }
      <TogglePlayBtn />
      <PlayNextBtn />
    </>
  )
}


const styles = createStyle({
  cotrolBtn: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',

    // backgroundColor: '#ccc',
    shadowOpacity: 1,
    textShadowRadius: 1,
  },
})
