import { create } from 'zustand'
import { createIndexedDBPersist, PersistState } from '@/lib/indexedDBPersist'
import type { Session, Campaign } from '@/types/session'
import type { Character } from '@/types/character'
import type { DiceRoll, Initiative } from '@/types/dice'
import type { Song } from '@/types/song'
import type { Item } from '@/types/item'
import type { AnyLocation, LocationType } from '@/types/location'
import type { Lore, Era } from '@/types/lore'
import { DEFAULT_ERAS } from '@/types/lore'
import type {
  NPC,
  BackgroundOption,
  RaceOption,
  NPCTypeOption,
  NPCImportanceOption,
  TaxonomyOption,
} from '@/types/npc'
import {
  DEFAULT_BACKGROUNDS,
  DEFAULT_RACES,
  DEFAULT_NPC_TYPES,
  DEFAULT_NPC_IMPORTANCE,
  DEFAULT_TRAITS,
  DEFAULT_IDEALS,
  DEFAULT_BONDS,
  DEFAULT_FLAWS,
  DEFAULT_MANNERISMS,
} from '@/types/npc'
import type { Quest } from '@/types/quest'
import type { Faction } from '@/types/faction'
import type { LocationMap } from '@/types/map'
import type { Taxonomy, TaxonomyCategory } from '@/types/taxonomy'
import { DEFAULT_TAXONOMIES } from '@/types/taxonomy'
import type { RestEvent } from '@/types/rest'
import type { Spell } from '@/types/spell'
import {
  performShortRest,
  performLongRest,
  rollHitDice,
  getConstitutionModifier,
  initializeHitDicePool,
  calculateSpellSlotsByLevel,
  getDefaultClassResources,
} from '@/lib/restHelpers'

interface SessionState extends PersistState {
  currentSession: Session | null
  currentCampaign: Campaign | null
  characters: Character[]
  initiatives: Initiative[]
  diceHistory: DiceRoll[]
  songs: Song[]
  items: Item[]
  locations: AnyLocation[]
  lore: Lore[]
  eras: Era[]
  npcs: NPC[]
  backgrounds: BackgroundOption[]
  races: RaceOption[]
  npcTypes: NPCTypeOption[]
  npcImportance: NPCImportanceOption[]
  traits: TaxonomyOption[]
  ideals: TaxonomyOption[]
  bonds: TaxonomyOption[]
  flaws: TaxonomyOption[]
  mannerisms: TaxonomyOption[]
  quests: Quest[]
  factions: Faction[]
  maps: LocationMap[]
  taxonomies: Taxonomy[]
  restEvents: RestEvent[]
  spells: Spell[]

  // Actions
  createSession: (
    session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
  updateSession: (sessionId: string, updates: Partial<Session>) => void
  startSession: () => void
  pauseSession: () => void
  endSession: () => void

  createCampaign: (
    campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => void

  addCharacter: (character: Character) => void
  updateCharacter: (characterId: string, updates: Partial<Character>) => void
  removeCharacter: (characterId: string) => void

  addSong: (song: Song) => void
  updateSong: (songId: string, updates: Partial<Song>) => void
  removeSong: (songId: string) => void

  addItem: (item: Item) => void
  updateItem: (itemId: string, updates: Partial<Item>) => void
  removeItem: (itemId: string) => void

  addLocation: (location: AnyLocation) => void
  updateLocation: (locationId: string, updates: Partial<AnyLocation>) => void
  removeLocation: (locationId: string) => void
  getLocationChildren: (parentId: string) => AnyLocation[]
  getLocationsByType: (type: LocationType) => AnyLocation[]
  getLocationHierarchy: () => AnyLocation[]
  getLocationById: (locationId: string) => AnyLocation | undefined

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

  addBackground: (background: BackgroundOption) => void
  updateBackground: (
    backgroundId: string,
    updates: Partial<BackgroundOption>
  ) => void
  removeBackground: (backgroundId: string) => void
  getBackgroundById: (backgroundId: string) => BackgroundOption | undefined

  addRace: (race: RaceOption) => void
  updateRace: (raceId: string, updates: Partial<RaceOption>) => void
  removeRace: (raceId: string) => void
  getRaceById: (raceId: string) => RaceOption | undefined

  addNPCType: (npcType: NPCTypeOption) => void
  updateNPCType: (npcTypeId: string, updates: Partial<NPCTypeOption>) => void
  removeNPCType: (npcTypeId: string) => void
  getNPCTypeById: (npcTypeId: string) => NPCTypeOption | undefined

  addNPCImportance: (importance: NPCImportanceOption) => void
  updateNPCImportance: (
    importanceId: string,
    updates: Partial<NPCImportanceOption>
  ) => void
  removeNPCImportance: (importanceId: string) => void
  getNPCImportanceById: (
    importanceId: string
  ) => NPCImportanceOption | undefined

  addTrait: (trait: TaxonomyOption) => void
  addIdeal: (ideal: TaxonomyOption) => void
  addBond: (bond: TaxonomyOption) => void
  addFlaw: (flaw: TaxonomyOption) => void
  addMannerism: (mannerism: TaxonomyOption) => void

  addQuest: (quest: Quest) => void
  updateQuest: (questId: string, updates: Partial<Quest>) => void
  removeQuest: (questId: string) => void
  getQuestsByStatus: (status: string) => Quest[]
  getQuestsByType: (type: string) => Quest[]
  getActiveQuests: () => Quest[]
  getCompletedQuests: () => Quest[]

  addFaction: (faction: Faction) => void
  updateFaction: (factionId: string, updates: Partial<Faction>) => void
  removeFaction: (factionId: string) => void
  getFactionsByType: (type: string) => Faction[]
  getFactionsByStatus: (status: string) => Faction[]
  getActiveFactions: () => Faction[]
  getFactionsByInfluence: (influence: string) => Faction[]

  addMap: (map: LocationMap) => void
  updateMap: (mapId: string, updates: Partial<LocationMap>) => void
  removeMap: (mapId: string) => void
  getMapsByLocation: (locationId: string) => LocationMap[]
  getMapById: (mapId: string) => LocationMap | undefined

  addSpell: (spell: Spell) => void
  updateSpell: (spellId: string, updates: Partial<Spell>) => void
  removeSpell: (spellId: string) => void

  addTaxonomy: (taxonomy: Taxonomy) => void
  updateTaxonomy: (taxonomyId: string, updates: Partial<Taxonomy>) => void
  removeTaxonomy: (taxonomyId: string) => void
  getTaxonomiesByCategory: (category: TaxonomyCategory) => Taxonomy[]
  getTaxonomyById: (taxonomyId: string) => Taxonomy | undefined
  getTaxonomyByName: (
    category: TaxonomyCategory,
    name: string
  ) => Taxonomy | undefined
  initializeTaxonomies: () => void
  migrateCharactersForRest: () => void

  // Rest Management Actions
  takeShortRest: (
    characterIds: string[],
    location?: string,
    notes?: string
  ) => void
  takeLongRest: (
    characterIds: string[],
    location?: string,
    notes?: string
  ) => void
  spendHitDice: (characterId: string, diceCount: number) => number
  addRestEvent: (event: RestEvent) => void
  getRestHistory: () => RestEvent[]
  getRestEventsByCharacter: (characterId: string) => RestEvent[]

  setInitiatives: (initiatives: Initiative[]) => void
  addDiceRoll: (roll: DiceRoll) => void
  clearDiceHistory: () => void
}

export const useSessionStore = create<SessionState>()(
  createIndexedDBPersist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      currentSession: null,
      currentCampaign: null,
      characters: [],
      initiatives: [],
      diceHistory: [],
      songs: [],
      items: [],
      locations: [],
      lore: [],
      eras: DEFAULT_ERAS,
      npcs: [],
      backgrounds: DEFAULT_BACKGROUNDS,
      races: DEFAULT_RACES,
      npcTypes: DEFAULT_NPC_TYPES,
      npcImportance: DEFAULT_NPC_IMPORTANCE,
      traits: DEFAULT_TRAITS,
      ideals: DEFAULT_IDEALS,
      bonds: DEFAULT_BONDS,
      flaws: DEFAULT_FLAWS,
      mannerisms: DEFAULT_MANNERISMS,
      quests: [],
      factions: [],
      maps: [],
      taxonomies: [],
      restEvents: [],
      spells: [],

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

      createCampaign: campaignData => {
        const campaign: Campaign = {
          ...campaignData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set({ currentCampaign: campaign })
      },

      updateCampaign: (campaignId, updates) => {
        const { currentCampaign } = get()
        if (currentCampaign && currentCampaign.id === campaignId) {
          set({
            currentCampaign: {
              ...currentCampaign,
              ...updates,
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

      addSong: song => {
        set(state => ({
          songs: [...state.songs, song],
        }))
      },

      updateSong: (songId, updates) => {
        set(state => ({
          songs: state.songs.map(song =>
            song.id === songId
              ? { ...song, ...updates, updatedAt: new Date() }
              : song
          ),
        }))
      },

      removeSong: songId => {
        set(state => ({
          songs: state.songs.filter(song => song.id !== songId),
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

      getLocationById: locationId => {
        const { locations } = get()
        return locations.find(location => location.id === locationId)
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

      addBackground: background => {
        set(state => ({
          backgrounds: [...state.backgrounds, background],
        }))
      },

      updateBackground: (backgroundId, updates) => {
        set(state => ({
          backgrounds: state.backgrounds.map(background =>
            background.id === backgroundId
              ? { ...background, ...updates }
              : background
          ),
        }))
      },

      removeBackground: backgroundId => {
        set(state => ({
          backgrounds: state.backgrounds.filter(
            background => background.id !== backgroundId
          ),
        }))
      },

      getBackgroundById: backgroundId => {
        const { backgrounds } = get()
        return backgrounds.find(background => background.id === backgroundId)
      },

      addRace: race => {
        set(state => ({
          races: [...state.races, race],
        }))
      },

      updateRace: (raceId, updates) => {
        set(state => ({
          races: state.races.map(race =>
            race.id === raceId ? { ...race, ...updates } : race
          ),
        }))
      },

      removeRace: raceId => {
        set(state => ({
          races: state.races.filter(race => race.id !== raceId),
        }))
      },

      getRaceById: raceId => {
        const { races } = get()
        return races.find(race => race.id === raceId)
      },

      addNPCType: npcType => {
        set(state => ({
          npcTypes: [...state.npcTypes, npcType],
        }))
      },

      updateNPCType: (npcTypeId, updates) => {
        set(state => ({
          npcTypes: state.npcTypes.map(npcType =>
            npcType.id === npcTypeId ? { ...npcType, ...updates } : npcType
          ),
        }))
      },

      removeNPCType: npcTypeId => {
        set(state => ({
          npcTypes: state.npcTypes.filter(npcType => npcType.id !== npcTypeId),
        }))
      },

      getNPCTypeById: npcTypeId => {
        const { npcTypes } = get()
        return npcTypes.find(npcType => npcType.id === npcTypeId)
      },

      addNPCImportance: importance => {
        set(state => ({
          npcImportance: [...state.npcImportance, importance],
        }))
      },

      updateNPCImportance: (importanceId, updates) => {
        set(state => ({
          npcImportance: state.npcImportance.map(importance =>
            importance.id === importanceId
              ? { ...importance, ...updates }
              : importance
          ),
        }))
      },

      removeNPCImportance: importanceId => {
        set(state => ({
          npcImportance: state.npcImportance.filter(
            importance => importance.id !== importanceId
          ),
        }))
      },

      getNPCImportanceById: importanceId => {
        const { npcImportance } = get()
        return npcImportance.find(importance => importance.id === importanceId)
      },

      addTrait: trait => {
        set(state => ({
          traits: [...state.traits, trait],
        }))
      },

      addIdeal: ideal => {
        set(state => ({
          ideals: [...state.ideals, ideal],
        }))
      },

      addBond: bond => {
        set(state => ({
          bonds: [...state.bonds, bond],
        }))
      },

      addFlaw: flaw => {
        set(state => ({
          flaws: [...state.flaws, flaw],
        }))
      },

      addMannerism: mannerism => {
        set(state => ({
          mannerisms: [...state.mannerisms, mannerism],
        }))
      },

      addQuest: quest => {
        set(state => ({
          quests: [...state.quests, quest],
        }))
      },

      updateQuest: (questId, updates) => {
        set(state => ({
          quests: state.quests.map(quest =>
            quest.id === questId
              ? { ...quest, ...updates, updatedAt: new Date() }
              : quest
          ),
        }))
      },

      removeQuest: questId => {
        set(state => ({
          quests: state.quests.filter(quest => quest.id !== questId),
        }))
      },

      getQuestsByStatus: status => {
        const { quests } = get()
        return quests.filter(quest => quest.status === status)
      },

      getQuestsByType: type => {
        const { quests } = get()
        return quests.filter(quest => quest.type === type)
      },

      getActiveQuests: () => {
        const { quests } = get()
        return quests.filter(quest => quest.status === 'active')
      },

      getCompletedQuests: () => {
        const { quests } = get()
        return quests.filter(quest => quest.status === 'completed')
      },

      addFaction: faction => {
        set(state => ({
          factions: [...state.factions, faction],
        }))
      },

      updateFaction: (factionId, updates) => {
        set(state => ({
          factions: state.factions.map(faction =>
            faction.id === factionId
              ? { ...faction, ...updates, updatedAt: new Date() }
              : faction
          ),
        }))
      },

      removeFaction: factionId => {
        set(state => ({
          factions: state.factions.filter(faction => faction.id !== factionId),
        }))
      },

      getFactionsByType: type => {
        const { factions } = get()
        return factions.filter(faction => faction.type === type)
      },

      getFactionsByStatus: status => {
        const { factions } = get()
        return factions.filter(faction => faction.status === status)
      },

      getActiveFactions: () => {
        const { factions } = get()
        return factions.filter(faction => faction.status === 'active')
      },

      getFactionsByInfluence: influence => {
        const { factions } = get()
        return factions.filter(faction => faction.influence === influence)
      },

      addMap: map => {
        const { maps } = get()
        const newMap = {
          ...map,
          metadata: {
            ...map.metadata,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
          },
        }
        set({ maps: [...maps, newMap] })
      },

      updateMap: (mapId, updates) => {
        const { maps } = get()
        const updatedMaps = maps.map(map =>
          map.id === mapId
            ? {
                ...map,
                ...updates,
                metadata: {
                  ...map.metadata,
                  ...updates.metadata,
                  updatedAt: new Date(),
                  version: (map.metadata.version || 1) + 1,
                },
              }
            : map
        )
        set({ maps: updatedMaps })
      },

      removeMap: mapId => {
        const { maps } = get()
        set({ maps: maps.filter(map => map.id !== mapId) })
      },

      getMapsByLocation: locationId => {
        const { maps } = get()
        return maps.filter(map => map.locationId === locationId)
      },

      getMapById: mapId => {
        const { maps } = get()
        return maps.find(map => map.id === mapId)
      },

      // Spell operations
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

      // Taxonomy operations
      addTaxonomy: taxonomy => {
        set(state => ({
          taxonomies: [...state.taxonomies, taxonomy],
        }))
      },

      updateTaxonomy: (taxonomyId, updates) => {
        set(state => ({
          taxonomies: state.taxonomies.map(taxonomy =>
            taxonomy.id === taxonomyId
              ? { ...taxonomy, ...updates, updatedAt: new Date() }
              : taxonomy
          ),
        }))
      },

      removeTaxonomy: taxonomyId => {
        set(state => ({
          taxonomies: state.taxonomies.filter(
            taxonomy => taxonomy.id !== taxonomyId
          ),
        }))
      },

      getTaxonomiesByCategory: category => {
        const { taxonomies } = get()
        return taxonomies
          .filter(taxonomy => taxonomy.category === category)
          .sort((a, b) => a.sortOrder - b.sortOrder)
      },

      getTaxonomyById: taxonomyId => {
        const { taxonomies } = get()
        return taxonomies.find(taxonomy => taxonomy.id === taxonomyId)
      },

      getTaxonomyByName: (category, name) => {
        const { taxonomies } = get()
        return taxonomies.find(
          taxonomy =>
            taxonomy.category === category &&
            taxonomy.name.toLowerCase() === name.toLowerCase()
        )
      },

      initializeTaxonomies: () => {
        const { taxonomies } = get()

        // Only initialize if taxonomies array is empty
        if (taxonomies.length === 0) {
          const initialTaxonomies: Taxonomy[] = DEFAULT_TAXONOMIES.map(
            taxonomy => ({
              ...taxonomy,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          )
          set({ taxonomies: initialTaxonomies })
          console.log(
            'Initialized',
            initialTaxonomies.length,
            'default taxonomies'
          )
        }
      },

      migrateCharactersForRest: () => {
        const { characters } = get()
        let migrationNeeded = false

        const migratedCharacters = characters.map(character => {
          let updated = false
          const updates: Partial<Character> = {}

          // Initialize hit dice pool if missing
          if (!character.hitDicePool) {
            updates.hitDicePool = initializeHitDicePool(character)
            updated = true
          }

          // Initialize spell slots if missing and character is a spellcaster
          if (!character.spellSlots) {
            const spellSlots = calculateSpellSlotsByLevel(
              character.class,
              character.level
            )
            if (spellSlots) {
              updates.spellSlots = spellSlots
              updated = true
            }
          }

          // Initialize class resources if missing
          if (!character.classResources) {
            const resources = getDefaultClassResources(
              character.class,
              character.level
            )
            if (resources.length > 0) {
              updates.classResources = resources
              updated = true
            }
          }

          if (updated) {
            migrationNeeded = true
            return {
              ...character,
              ...updates,
              updatedAt: new Date(),
            }
          }

          return character
        })

        if (migrationNeeded) {
          set({ characters: migratedCharacters })
          console.log(
            'Migrated characters for rest system -',
            migratedCharacters.length,
            'characters updated'
          )
        }
      },

      // Rest Management Actions
      takeShortRest: (characterIds, location, notes) => {
        const { characters } = get()
        const startTime = new Date()
        const resourcesRestored: RestEvent['resourcesRestored'] = []

        // Process short rest for each character
        const updatedCharacters = characters.map(char => {
          if (characterIds.includes(char.id)) {
            const result = performShortRest(char)
            const restore: RestEvent['resourcesRestored'][number] = {
              characterId: char.id,
              characterName: char.name,
              hpRestored: result.hpRestored,
              hitDiceRestored: 0,
              resourcesRestored: result.resourcesRestored,
            }
            // Only add spellSlotsRestored if character is a Warlock
            if (char.class === 'Brujo') {
              restore.spellSlotsRestored = 1
            }
            resourcesRestored.push(restore)
            return result.character
          }
          return char
        })

        // Create rest event
        const restEvent: RestEvent = {
          id: crypto.randomUUID(),
          type: 'short',
          startTime,
          endTime: new Date(startTime.getTime() + 60 * 60 * 1000), // 1 hour later
          participantIds: characterIds,
          ...(location && { location }),
          ...(notes && { notes }),
          resourcesRestored,
          interrupted: false,
          createdAt: new Date(),
        }

        set(state => ({
          characters: updatedCharacters,
          restEvents: [...state.restEvents, restEvent],
        }))
      },

      takeLongRest: (characterIds, location, notes) => {
        const { characters } = get()
        const startTime = new Date()
        const resourcesRestored: RestEvent['resourcesRestored'] = []

        // Process long rest for each character
        const updatedCharacters = characters.map(char => {
          if (characterIds.includes(char.id)) {
            const result = performLongRest(char)
            const restore: RestEvent['resourcesRestored'][number] = {
              characterId: char.id,
              characterName: char.name,
              hpRestored: result.hpRestored,
              hitDiceRestored: result.hitDiceRestored,
              resourcesRestored: result.resourcesRestored,
            }
            // Only add spellSlotsRestored if character has spell slots
            if (char.spellSlots) {
              restore.spellSlotsRestored = 1
            }
            resourcesRestored.push(restore)
            return result.character
          }
          return char
        })

        // Create rest event
        const restEvent: RestEvent = {
          id: crypto.randomUUID(),
          type: 'long',
          startTime,
          endTime: new Date(startTime.getTime() + 8 * 60 * 60 * 1000), // 8 hours later
          participantIds: characterIds,
          ...(location && { location }),
          ...(notes && { notes }),
          resourcesRestored,
          interrupted: false,
          createdAt: new Date(),
        }

        set(state => ({
          characters: updatedCharacters,
          restEvents: [...state.restEvents, restEvent],
        }))
      },

      spendHitDice: (characterId, diceCount) => {
        const { characters } = get()
        const character = characters.find(c => c.id === characterId)

        if (!character || !character.hitDicePool) {
          return 0
        }

        // Check if character has enough hit dice
        const availableDice = character.hitDicePool.available
        const actualDiceCount = Math.min(diceCount, availableDice)

        if (actualDiceCount <= 0) {
          return 0
        }

        // Roll hit dice and add CON modifier
        const hpRecovered = rollHitDice(
          character.hitDicePool.diceType,
          character.abilityScores.constitution,
          actualDiceCount
        )

        // Update character
        const newHP = Math.min(
          character.hitPoints.current + hpRecovered,
          character.hitPoints.maximum
        )

        set(state => ({
          characters: state.characters.map(char =>
            char.id === characterId
              ? {
                  ...char,
                  hitPoints: {
                    ...char.hitPoints,
                    current: newHP,
                  },
                  hitDicePool: char.hitDicePool
                    ? {
                        ...char.hitDicePool,
                        available: char.hitDicePool.available - actualDiceCount,
                      }
                    : undefined,
                  updatedAt: new Date(),
                }
              : char
          ),
        }))

        return hpRecovered
      },

      addRestEvent: event => {
        set(state => ({
          restEvents: [...state.restEvents, event],
        }))
      },

      getRestHistory: () => {
        const { restEvents } = get()
        return restEvents.sort(
          (a, b) => b.startTime.getTime() - a.startTime.getTime()
        )
      },

      getRestEventsByCharacter: characterId => {
        const { restEvents } = get()
        return restEvents
          .filter(event => event.participantIds.includes(characterId))
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
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
      version: '1.0.0',
      onRehydrateStorage: () => {
        console.log('Session store rehydrated from IndexedDB')
        // Initialize taxonomies if they don't exist
        const store = useSessionStore.getState()
        store.initializeTaxonomies()
        // Migrate existing characters to support rest system
        store.migrateCharactersForRest()
      },
    }
  )
)
