// Custom persist middleware for Zustand using IndexedDB
import { StateCreator } from 'zustand'
import { dbManager, CampaignDB } from './indexedDB'
import { backupSystem } from './backupSystem'

export interface PersistOptions {
  name: string
  version?: string
  migrate?: (persistedState: any, version: number) => any
  onRehydrateStorage?: () => void
}

export interface PersistState {
  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const CURRENT_CAMPAIGN_ID = 'current-campaign'

export function createIndexedDBPersist<T extends object>(
  stateCreator: StateCreator<T & PersistState>,
  options: PersistOptions
): StateCreator<T & PersistState> {
  return (set: any, get: any, api: any) => {
    const state = stateCreator(
      (partial, replace) => {
        set(partial, replace)
        // Save to IndexedDB whenever state changes
        saveStateToIndexedDB(get(), options).catch(console.error)
      },
      get,
      api
    )

    // Add persist state
    const persistState: PersistState = {
      hasHydrated: false,
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    }

    // Load initial state from IndexedDB
    loadStateFromIndexedDB(set, options).catch(console.error)

    return {
      ...state,
      ...persistState,
    }
  }
}

async function saveStateToIndexedDB<T>(
  state: T,
  options: PersistOptions
): Promise<void> {
  // Skip during SSR
  if (typeof window === 'undefined') {
    return
  }

  try {
    await dbManager.init()

    // Extract only the serializable data, excluding functions and persist state
    const serializableData = extractSerializableData(state as any)

    const campaign: CampaignDB = {
      id: CURRENT_CAMPAIGN_ID,
      name: 'Current Campaign',
      data: serializableData,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: options.version || '1.0.0',
    }

    await dbManager.saveCampaign(campaign)
  } catch (error) {
    console.error('Failed to save state to IndexedDB:', error)
  }
}

function extractSerializableData(state: any): any {
  const serializable: any = {}

  // List of data properties to include (exclude functions and non-serializable state)
  const dataKeys = [
    'currentSession',
    'currentCampaign',
    'characters',
    'initiatives',
    'diceHistory',
    'spells',
    'items',
    'locations',
    'lore',
    'eras',
    'npcs',
    'quests',
    'factions',
    'maps',
  ]

  for (const key of dataKeys) {
    if (key in state && state[key] !== undefined) {
      // Deep clone to ensure we don't have any function references
      serializable[key] = JSON.parse(JSON.stringify(state[key]))
    }
  }

  return serializable
}

async function loadStateFromIndexedDB(
  set: any,
  options: PersistOptions
): Promise<void> {
  try {
    // Skip during SSR
    if (typeof window === 'undefined') {
      set({ hasHydrated: true })
      return
    }

    await dbManager.init()

    // Check for migration from localStorage first
    await dbManager.migrateFromLocalStorage()

    // Load current campaign
    const campaign = await dbManager.getCampaign(CURRENT_CAMPAIGN_ID)

    if (campaign && campaign.data) {
      let stateToRestore = campaign.data

      // Apply migration if version mismatch
      if (options.migrate && campaign.version !== options.version) {
        stateToRestore = options.migrate(
          stateToRestore,
          parseVersion(campaign.version)
        )
      }

      set(stateToRestore)
    }

    // Mark as hydrated
    set({ hasHydrated: true })

    // Initialize backup system
    try {
      await backupSystem.init()
    } catch (error) {
      console.error('Failed to initialize backup system:', error)
    }

    if (options.onRehydrateStorage) {
      options.onRehydrateStorage()
    }

    console.log('State successfully loaded from IndexedDB')
  } catch (error) {
    console.error('Failed to load state from IndexedDB:', error)
    // Mark as hydrated even on error to prevent infinite loading
    set({ hasHydrated: true })
  }
}

function parseVersion(version: string): number {
  if (!version) return 0
  const parts = version.split('.').map(Number)
  return (parts[0] || 0) * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0)
}

// Utility functions for manual backup/restore
export async function createManualBackup(name?: string): Promise<string> {
  return backupSystem.createManualBackup(name)
}

export async function restoreFromBackup(backupId: string): Promise<void> {
  if (typeof window === 'undefined') {
    console.warn('Cannot restore backup during SSR')
    return
  }

  await backupSystem.restoreBackup(backupId)
  // Reload the page to trigger store rehydration
  window.location.reload()
}

export async function getAllBackups() {
  return backupSystem.getAllBackups()
}

export async function deleteBackup(backupId: string): Promise<void> {
  return backupSystem.deleteBackup(backupId)
}

export async function getBackupStats() {
  return backupSystem.getBackupStats()
}

export function getBackupSystem() {
  return backupSystem
}
