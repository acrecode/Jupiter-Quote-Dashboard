import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  paused: boolean
  slippageBps: number
  cadenceMs: number
  shortcutOpen: boolean
  setPaused: (paused: boolean) => void
  togglePaused: () => void
  setSlippageBps: (slippageBps: number) => void
  setShortcutOpen: (shortcutOpen: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      paused: false,
      slippageBps: 50,
      cadenceMs: 1000,
      shortcutOpen: false,
      setPaused: (paused) => set({ paused }),
      togglePaused: () => set((state) => ({ paused: !state.paused })),
      setSlippageBps: (slippageBps) => set({ slippageBps: Math.max(1, Math.min(500, slippageBps || 1)) }),
      setShortcutOpen: (shortcutOpen) => set({ shortcutOpen }),
    }),
    { name: 'jupiter-dashboard-settings' },
  ),
)
