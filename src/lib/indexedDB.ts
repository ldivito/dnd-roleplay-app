// IndexedDB utilities for persistent storage
export interface CampaignDB {
  id: string
  name: string
  data: any
  createdAt: Date
  updatedAt: Date
  version: string
}

export interface BackupRecord {
  id: string
  name: string
  data: any
  createdAt: Date
  type: 'manual' | 'auto'
  size: number
}

const DB_NAME = 'RolAppDB'
const DB_VERSION = 1
const STORES = {
  CAMPAIGNS: 'campaigns',
  BACKUPS: 'backups',
  SETTINGS: 'settings',
} as const

class IndexedDBManager {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result

        // Campaigns store
        if (!db.objectStoreNames.contains(STORES.CAMPAIGNS)) {
          const campaignStore = db.createObjectStore(STORES.CAMPAIGNS, {
            keyPath: 'id',
          })
          campaignStore.createIndex('name', 'name', { unique: false })
          campaignStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }

        // Backups store
        if (!db.objectStoreNames.contains(STORES.BACKUPS)) {
          const backupStore = db.createObjectStore(STORES.BACKUPS, {
            keyPath: 'id',
          })
          backupStore.createIndex('createdAt', 'createdAt', { unique: false })
          backupStore.createIndex('type', 'type', { unique: false })
        }

        // Settings store
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' })
        }
      }
    })
  }

  async saveCampaign(campaign: CampaignDB): Promise<void> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.CAMPAIGNS], 'readwrite')
      const store = transaction.objectStore(STORES.CAMPAIGNS)

      const request = store.put({
        ...campaign,
        updatedAt: new Date(),
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getCampaign(id: string): Promise<CampaignDB | null> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.CAMPAIGNS], 'readonly')
      const store = transaction.objectStore(STORES.CAMPAIGNS)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async getAllCampaigns(): Promise<CampaignDB[]> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.CAMPAIGNS], 'readonly')
      const store = transaction.objectStore(STORES.CAMPAIGNS)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async saveBackup(backup: BackupRecord): Promise<void> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.BACKUPS], 'readwrite')
      const store = transaction.objectStore(STORES.BACKUPS)
      const request = store.put(backup)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getAllBackups(): Promise<BackupRecord[]> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.BACKUPS], 'readonly')
      const store = transaction.objectStore(STORES.BACKUPS)
      const index = store.index('createdAt')
      const request = index.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const backups = request.result || []
        // Sort by creation date (newest first)
        backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        resolve(backups)
      }
    })
  }

  async getBackup(id: string): Promise<BackupRecord | null> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.BACKUPS], 'readonly')
      const store = transaction.objectStore(STORES.BACKUPS)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async deleteBackup(id: string): Promise<void> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.BACKUPS], 'readwrite')
      const store = transaction.objectStore(STORES.BACKUPS)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async cleanupOldBackups(maxBackups: number = 10): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    const backups = await this.getAllBackups()
    const autoBackups = backups.filter(b => b.type === 'auto')

    if (autoBackups.length > maxBackups) {
      const toDelete = autoBackups.slice(maxBackups)
      for (const backup of toDelete) {
        await this.deleteBackup(backup.id)
      }
    }
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SETTINGS], 'readonly')
      const store = transaction.objectStore(STORES.SETTINGS)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result?.value || null)
    })
  }

  async setSetting(key: string, value: any): Promise<void> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SETTINGS], 'readwrite')
      const store = transaction.objectStore(STORES.SETTINGS)
      const request = store.put({ key, value })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async migrateFromLocalStorage(): Promise<void> {
    try {
      const existingData = localStorage.getItem('dnd-session-storage')
      if (!existingData) return

      const parsed = JSON.parse(existingData)
      if (!parsed.state) return

      // Create a campaign from localStorage data
      const campaign: CampaignDB = {
        id: 'migrated-campaign',
        name: 'Migrated Campaign',
        data: parsed.state,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0',
      }

      await this.saveCampaign(campaign)

      // Create initial backup
      const backup: BackupRecord = {
        id: `backup-${Date.now()}`,
        name: 'Migration Backup',
        data: parsed.state,
        createdAt: new Date(),
        type: 'manual',
        size: new Blob([existingData]).size,
      }

      await this.saveBackup(backup)

      // Clear localStorage after successful migration
      localStorage.removeItem('dnd-session-storage')

      console.log('Successfully migrated data from localStorage to IndexedDB')
    } catch (error) {
      console.error('Failed to migrate from localStorage:', error)
      throw error
    }
  }
}

export const dbManager = new IndexedDBManager()

// Export the getAllCampaigns function directly for easier importing
export async function getAllCampaigns(): Promise<CampaignDB[]> {
  return dbManager.getAllCampaigns()
}

// Note: Database will be initialized when needed
