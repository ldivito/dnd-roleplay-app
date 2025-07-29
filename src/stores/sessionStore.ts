import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, Campaign } from '@/types/session'
import type { Character } from '@/types/character'
import type { DiceRoll, Initiative } from '@/types/dice'
import type { Spell } from '@/types/spell'
import type { Item } from '@/types/item'
import type { AnyLocation, LocationType } from '@/types/location'
import type { Lore, Era } from '@/types/lore'
import { DEFAULT_ERAS } from '@/types/lore'
import type { NPC } from '@/types/npc'

interface SessionState {
  currentSession: Session | null
  currentCampaign: Campaign | null
  characters: Character[]
  initiatives: Initiative[]
  diceHistory: DiceRoll[]
  spells: Spell[]
  items: Item[]
  locations: AnyLocation[]
  lore: Lore[]
  eras: Era[]
  npcs: NPC[]

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

  addLocation: (location: AnyLocation) => void
  updateLocation: (locationId: string, updates: Partial<AnyLocation>) => void
  removeLocation: (locationId: string) => void
  getLocationChildren: (parentId: string) => AnyLocation[]
  getLocationsByType: (type: LocationType) => AnyLocation[]
  getLocationHierarchy: () => AnyLocation[]

  addLore: (lore: Lore) => void
  updateLore: (loreId: string, updates: Partial<Lore>) => void
  removeLore: (loreId: string) => void
  getLoreByImportance: (importance: 'main' | 'secondary' | 'minor') => Lore[]
  getMainTimelineLore: () => Lore[]
  getLoreByEntity: (entityType: string, entityId: string) => Lore[]

  addEra: (era: Era) => void
  updateEra: (eraId: string, updates: Partial<Era>) => void
  removeEra: (eraId: string) => void

  addNPC: (npc: NPC) => void
  updateNPC: (npcId: string, updates: Partial<NPC>) => void
  removeNPC: (npcId: string) => void
  getNPCsByType: (type: string) => NPC[]
  getNPCsByImportance: (importance: string) => NPC[]
  getNPCsByLocation: (locationId: string) => NPC[]
  getNPCsWithRelationships: () => NPC[]

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
      locations: [],
      lore: [],
      eras: DEFAULT_ERAS,
      npcs: [],

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

      addLocation: location => {
        set(state => ({
          locations: [...state.locations, location],
        }))
      },

      updateLocation: (locationId, updates) => {
        set(state => ({
          locations: state.locations.map(location =>
            location.id === locationId
              ? ({
                  ...location,
                  ...updates,
                  updatedAt: new Date(),
                } as AnyLocation)
              : location
          ),
        }))
      },

      removeLocation: locationId => {
        set(state => {
          // Remove the location and all its children recursively
          const removeLocationAndChildren = (
            locations: AnyLocation[],
            targetId: string
          ): AnyLocation[] => {
            return locations.filter(location => {
              if (location.id === targetId) {
                return false
              }
              // Remove children of the target location
              if (location.parentId === targetId) {
                return false
              }
              return true
            })
          }

          let filteredLocations = state.locations.filter(
            loc => loc.id !== locationId
          )

          // Keep removing children until no more are found
          let previousLength
          do {
            previousLength = filteredLocations.length
            filteredLocations = filteredLocations.filter(
              location =>
                !state.locations.some(
                  loc => loc.id === locationId && location.parentId === loc.id
                ) &&
                filteredLocations.some(
                  loc => loc.id === location.parentId || !location.parentId
                )
            )
          } while (filteredLocations.length !== previousLength)

          return { locations: filteredLocations }
        })
      },

      getLocationChildren: parentId => {
        const { locations } = get()
        return locations.filter(location => location.parentId === parentId)
      },

      getLocationsByType: type => {
        const { locations } = get()
        return locations.filter(location => location.type === type)
      },

      getLocationHierarchy: () => {
        const { locations } = get()
        // Return locations organized in hierarchy (planes first, then their children, etc.)
        const hierarchy: AnyLocation[] = []
        const addLocationWithChildren = (parentId?: string, level = 0) => {
          const children = locations
            .filter(loc => loc.parentId === parentId)
            .sort((a, b) => a.name.localeCompare(b.name))

          children.forEach(child => {
            hierarchy.push(child)
            addLocationWithChildren(child.id, level + 1)
          })
        }

        addLocationWithChildren() // Start with root locations (planes)
        return hierarchy
      },

      addLore: lore => {
        set(state => ({
          lore: [...state.lore, lore],
        }))
      },

      updateLore: (loreId, updates) => {
        set(state => ({
          lore: state.lore.map(lore =>
            lore.id === loreId
              ? { ...lore, ...updates, updatedAt: new Date() }
              : lore
          ),
        }))
      },

      removeLore: loreId => {
        set(state => ({
          lore: state.lore.filter(lore => lore.id !== loreId),
        }))
      },

      getLoreByImportance: importance => {
        const { lore } = get()
        return lore.filter(l => l.importance === importance)
      },

      getMainTimelineLore: () => {
        const { lore } = get()
        return lore
          .filter(l => l.isMainTimeline)
          .sort((a, b) => {
            if (a.year !== undefined && b.year !== undefined) {
              return a.year - b.year
            }
            return a.createdAt.getTime() - b.createdAt.getTime()
          })
      },

      getLoreByEntity: (entityType, entityId) => {
        const { lore } = get()
        return lore.filter(l =>
          l.connections.some(
            conn => conn.type === entityType && conn.entityId === entityId
          )
        )
      },

      addEra: era => {
        set(state => ({
          eras: [...state.eras, era],
        }))
      },

      updateEra: (eraId, updates) => {
        set(state => ({
          eras: state.eras.map(era =>
            era.id === eraId ? { ...era, ...updates } : era
          ),
        }))
      },

      removeEra: eraId => {
        set(state => ({
          eras: state.eras.filter(era => era.id !== eraId),
        }))
      },

      addNPC: npc => {
        set(state => ({
          npcs: [...state.npcs, npc],
        }))
      },

      updateNPC: (npcId, updates) => {
        set(state => ({
          npcs: state.npcs.map(npc =>
            npc.id === npcId
              ? { ...npc, ...updates, updatedAt: new Date() }
              : npc
          ),
        }))
      },

      removeNPC: npcId => {
        set(state => ({
          npcs: state.npcs.filter(npc => npc.id !== npcId),
        }))
      },

      getNPCsByType: type => {
        const { npcs } = get()
        return npcs.filter(npc => npc.npcType === type)
      },

      getNPCsByImportance: importance => {
        const { npcs } = get()
        return npcs.filter(npc => npc.importance === importance)
      },

      getNPCsByLocation: locationId => {
        const { npcs } = get()
        return npcs.filter(
          npc =>
            npc.currentLocation === locationId ||
            npc.locationRelations.some(rel => rel.locationId === locationId)
        )
      },

      getNPCsWithRelationships: () => {
        const { npcs } = get()
        return npcs.filter(npc => npc.relationships.length > 0)
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
        locations: state.locations,
        lore: state.lore,
        eras: state.eras,
        npcs: state.npcs,
        diceHistory: state.diceHistory,
      }),
    }
  )
)
