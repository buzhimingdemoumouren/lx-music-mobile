import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type LayoutChangeEvent, type ViewStyle, Pressable, StyleSheet, View } from 'react-native'
import { tvFocusManager } from '@/utils/tvFocusManager'
import { useTvRemote } from '@/utils/hooks/useTvRemote'
import { useTheme } from '@/store/theme/hook'

interface TvFocusableProps {
  id: string
  onPress?: () => void
  style?: ViewStyle
  focusStyle?: ViewStyle
  children: React.ReactNode
  hasFocus?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export const TvFocusable = ({
  id,
  onPress,
  style,
  focusStyle,
  children,
  hasFocus: externalFocus,
  onFocus,
  onBlur,
}: TvFocusableProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<View>(null)
  const theme = useTheme()

  const focused = externalFocus !== undefined ? externalFocus : isFocused

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout
    containerRef.current?.measure((_fx, _fy, w, h, px, py) => {
      tvFocusManager.register(id, {
        id,
        x: px,
        y: py,
        width: w,
        height: h,
      })
    })
  }, [id])

  useEffect(() => {
    return () => {
      tvFocusManager.unregister(id)
    }
  }, [id])

  useEffect(() => {
    const unsubscribe = tvFocusManager.onFocusChange((focusId) => {
      if (focusId === id) {
        setIsFocused(true)
        onFocus?.()
      } else {
        setIsFocused(false)
      }
    })
    return unsubscribe
  }, [id, onFocus])

  useTvRemote({
    onCenter: focused ? onPress : undefined,
    enabled: focused,
  })

  const focusBorderColor = theme['c-primary-light-200-alpha-700'] ?? theme['c-primary'] ?? '#4a90d9'

  const containerStyle = useMemo(() => [
    styles.container,
    style,
    focused && styles.focused,
    focused && { borderColor: focusBorderColor },
    focused && focusStyle,
  ], [style, focused, focusStyle, focusBorderColor])

  return (
    <View
      ref={containerRef}
      style={containerStyle}
      onLayout={handleLayout}
    >
      <Pressable
        onPress={onPress}
        style={styles.pressable}
      >
        {children}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  focused: {
    // Focus ring handled dynamically via theme
  },
  pressable: {
    flex: 1,
  },
})
