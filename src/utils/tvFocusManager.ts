import { NativeModules, Platform } from 'react-native'

const { TvRemoteModule } = NativeModules

export interface FocusableNode {
  id: string
  x: number
  y: number
  width: number
  height: number
}

class TvFocusManager {
  private focusableNodes: Map<string, FocusableNode> = new Map()
  private currentFocusId: string | null = null
  private focusChangeListeners: Array<(id: string | null) => void> = []

  register(id: string, node: FocusableNode) {
    this.focusableNodes.set(id, node)
  }

  unregister(id: string) {
    this.focusableNodes.delete(id)
    if (this.currentFocusId === id) {
      this.currentFocusId = null
      this.notifyFocusChange(null)
    }
  }

  updatePosition(id: string, node: FocusableNode) {
    this.focusableNodes.set(id, node)
  }

  setFocus(id: string) {
    if (this.focusableNodes.has(id)) {
      this.currentFocusId = id
      this.notifyFocusChange(id)
    }
  }

  getCurrentFocus(): string | null {
    return this.currentFocusId
  }

  getFirstFocusableId(): string | null {
    const iterator = this.focusableNodes.keys()
    const result = iterator.next()
    return result.done ? null : result.value
  }

  findNearest(currentId: string, direction: 'up' | 'down' | 'left' | 'right'): string | null {
    const current = this.focusableNodes.get(currentId)
    if (!current) return null

    let nearest: string | null = null
    let nearestDist = Infinity

    this.focusableNodes.forEach((node, id) => {
      if (id === currentId) return

      let isValid = false
      let dist = 0

      switch (direction) {
        case 'up':
          isValid = node.y < current.y
          dist = Math.abs(current.y - node.y) + Math.abs(current.x - node.x) * 0.5
          break
        case 'down':
          isValid = node.y > current.y
          dist = Math.abs(node.y - current.y) + Math.abs(current.x - node.x) * 0.5
          break
        case 'left':
          isValid = node.x < current.x
          dist = Math.abs(current.x - node.x) + Math.abs(current.y - node.y) * 0.5
          break
        case 'right':
          isValid = node.x > current.x
          dist = Math.abs(node.x - current.x) + Math.abs(current.y - node.y) * 0.5
          break
      }

      if (isValid && dist < nearestDist) {
        nearestDist = dist
        nearest = id
      }
    })

    return nearest
  }

  focusNearest(direction: 'up' | 'down' | 'left' | 'right') {
    if (!this.currentFocusId) {
      // If nothing focused, focus first available
      const firstId = this.focusableNodes.keys().next().value
      if (firstId) {
        this.setFocus(firstId)
      }
      return
    }

    const nearest = this.findNearest(this.currentFocusId, direction)
    if (nearest) {
      this.setFocus(nearest)
    }
  }

  onFocusChange(listener: (id: string | null) => void): () => void {
    this.focusChangeListeners.push(listener)
    return () => {
      this.focusChangeListeners = this.focusChangeListeners.filter(l => l !== listener)
    }
  }

  private notifyFocusChange(id: string | null) {
    this.focusChangeListeners.forEach(listener => listener(id))
  }

  clear() {
    this.focusableNodes.clear()
    this.currentFocusId = null
    this.notifyFocusChange(null)
  }
}

export const tvFocusManager = new TvFocusManager()

// Auto-register focus manager with global for app_event access
declare global {
  var tvFocusManager: TvFocusManager
}

if (typeof global.tvFocusManager === 'undefined') {
  global.tvFocusManager = tvFocusManager
}
