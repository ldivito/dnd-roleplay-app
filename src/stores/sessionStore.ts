import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, Campaign } from '@/types/session'
import type { Character } from '@/types/character'
import type { DiceRoll, Initiative } from '@/types/dice'
import type { Spell } from '@/types/spell'
import type { Item } from '@/types/item'

interface SessionState {
  currentSession: Session | null
  currentCampaign: Campaign | null
  characters: Character[]
  initiatives: Initiative[]
  diceHistory: DiceRoll[]
  spells: Spell[]
  items: Item[]

  // Actions
  createSession: (
    session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
  updateSession: (sessionId: string, updates: Partial<Session>) => void
  startSession: () => void
  pauseSession: () => void
  endSession: () => void

  addCharacter: (character: Character) => void
  updateCharacter: (characterId: string, updates: Partial<Character>) => void
  removeCharacter: (characterId: string) => void

  addSpell: (spell: Spell) => void
  updateSpell: (spellId: string, updates: Partial<Spell>) => void
  removeSpell: (spellId: string) => void

  addItem: (item: Item) => void
  updateItem: (itemId: string, updates: Partial<Item>) => void
  removeItem: (itemId: string) => void

  setInitiatives: (initiatives: Initiative[]) => void
  addDiceRoll: (roll: DiceRoll) => void
  clearDiceHistory: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      currentCampaign: null,
      characters: [],
      initiatives: [],
      diceHistory: [],
      spells: [],
      items: [],

      createSession: sessionData => {
        const session: Session = {
          ...sessionData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set({ currentSession: session })
      },

      updateSession: (sessionId, updates) => {
        const { currentSession } = get()
        if (currentSession && currentSession.id === sessionId) {
          set({
            currentSession: {
              ...currentSession,
              ...updates,
              updatedAt: new Date(),
            },
          })
        }
      },

      startSession: () => {
        const { currentSession } = get()
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              status: 'active',
              startTime: new Date(),
              updatedAt: new Date(),
            },
          })
        }
      },

      pauseSession: () => {
        const { currentSession } = get()
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              status: 'paused',
              updatedAt: new Date(),
            },
          })
        }
      },

      endSession: () => {
        const { currentSession } = get()
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              status: 'completed',
              endTime: new Date(),
              updatedAt: new Date(),
            },
          })
        }
      },

      addCharacter: character => {
        set(state => ({
          characters: [...state.characters, character],
        }))
      },

      updateCharacter: (characterId, updates) => {
        set(state => ({
          characters: state.characters.map(char =>
            char.id === characterId
              ? { ...char, ...updates, updatedAt: new Date() }
              : char
          ),
        }))
      },

      removeCharacter: characterId => {
        set(state => ({
          characters: state.characters.filter(char => char.id !== characterId),
        }))
      },

      addSpell: spell => {
        set(state => ({
          spells: [...state.spells, spell],
        }))
      },

      updateSpell: (spellId, updates) => {
        set(state => ({
          spells: state.spells.map(spell =>
            spell.id === spellId
              ? { ...spell, ...updates, updatedAt: new Date() }
              : spell
          ),
        }))
      },

      removeSpell: spellId => {
        set(state => ({
          spells: state.spells.filter(spell => spell.id !== spellId),
        }))
      },

      addItem: item => {
        set(state => ({
          items: [...state.items, item],
        }))
      },

      updateItem: (itemId, updates) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId
              ? { ...item, ...updates, updatedAt: new Date() }
              : item
          ),
        }))
      },

      removeItem: itemId => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId),
        }))
      },

      setInitiatives: initiatives => {
        set({ initiatives })
      },

      addDiceRoll: roll => {
        set(state => ({
          diceHistory: [roll, ...state.diceHistory.slice(0, 49)], // Keep last 50 rolls
        }))
      },

      clearDiceHistory: () => {
        set({ diceHistory: [] })
      },
    }),
    {
      name: 'dnd-session-storage',
      partialize: state => ({
        currentSession: state.currentSession,
        currentCampaign: state.currentCampaign,
        characters: state.characters,
        spells: state.spells,
        items: state.items,
        diceHistory: state.diceHistory,
      }),
    }
  )
)
