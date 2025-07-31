// Automatic backup system
import { dbManager, BackupRecord } from './indexedDB'

interface BackupConfig {
  autoBackupEnabled: boolean
  backupInterval: number // minutes
  maxAutoBackups: number
  maxManualBackups: number
}

const DEFAULT_CONFIG: BackupConfig = {
  autoBackupEnabled: true,
  backupInterval: 30, // 30 minutes
  maxAutoBackups: 10,
  maxManualBackups: 20,
}

class BackupSystem {
  private intervalId: NodeJS.Timeout | null = null
  private config: BackupConfig = DEFAULT_CONFIG

  async init(): Promise<void> {
    try {
      // Ensure IndexedDB is initialized first
      await dbManager.init()

      // Load config from IndexedDB
      const savedConfig = await dbManager.getSetting('backupConfig')
      if (savedConfig) {
        this.config = { ...DEFAULT_CONFIG, ...savedConfig }
      }

      // Start automatic backups if enabled
      if (this.config.autoBackupEnabled) {
        this.startAutoBackup()
      }
    } catch (error) {
      console.error('Failed to initialize backup system:', error)
      // Use default config if initialization fails
      this.config = DEFAULT_CONFIG
    }
  }

  async updateConfig(newConfig: Partial<BackupConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig }

    try {
      await dbManager.init()
      await dbManager.setSetting('backupConfig', this.config)
    } catch (error) {
      console.error('Failed to save backup config:', error)
    }

    // Restart auto backup with new interval
    if (this.config.autoBackupEnabled) {
      this.stopAutoBackup()
      this.startAutoBackup()
    } else {
      this.stopAutoBackup()
    }
  }

  getConfig(): BackupConfig {
    return { ...this.config }
  }

  startAutoBackup(): void {
    if (this.intervalId) return

    const intervalMs = this.config.backupInterval * 60 * 1000
    this.intervalId = setInterval(() => {
      this.createAutoBackup().catch(console.error)
    }, intervalMs)

    console.log(
      `Auto backup started with ${this.config.backupInterval} minute interval`
    )
  }

  stopAutoBackup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('Auto backup stopped')
    }
  }

  async createAutoBackup(): Promise<string> {
    try {
      // Ensure IndexedDB is initialized
      await dbManager.init()

      // Get current campaign data
      const campaigns = await dbManager.getAllCampaigns()
      if (campaigns.length === 0) {
        console.log('No campaign data to backup')
        return ''
      }

      // Use the most recently updated campaign
      const currentCampaign = campaigns.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      )[0]

      if (!currentCampaign) {
        throw new Error('No campaign found to backup')
      }

      const backupData = {
        campaignId: currentCampaign.id,
        campaignName: currentCampaign.name,
        data: currentCampaign.data,
        version: currentCampaign.version,
      }

      const backupId = `auto-backup-${Date.now()}`
      const dataString = JSON.stringify(backupData)

      const backup: BackupRecord = {
        id: backupId,
        name: `Auto Backup - ${new Date().toLocaleString()}`,
        data: backupData,
        createdAt: new Date(),
        type: 'auto',
        size: new Blob([dataString]).size,
      }

      await dbManager.saveBackup(backup)
      await dbManager.cleanupOldBackups(this.config.maxAutoBackups)

      console.log(`Auto backup created: ${backup.name}`)
      return backupId
    } catch (error) {
      console.error('Failed to create auto backup:', error)
      throw error
    }
  }

  async createManualBackup(name?: string): Promise<string> {
    try {
      // Ensure IndexedDB is initialized
      await dbManager.init()

      // Get current campaign data
      const campaigns = await dbManager.getAllCampaigns()
      if (campaigns.length === 0) {
        throw new Error('No campaign data to backup')
      }

      // Use the most recently updated campaign
      const currentCampaign = campaigns.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      )[0]

      if (!currentCampaign) {
        throw new Error('No campaign found to backup')
      }

      const backupData = {
        campaignId: currentCampaign.id,
        campaignName: currentCampaign.name,
        data: currentCampaign.data,
        version: currentCampaign.version,
      }

      const backupId = `manual-backup-${Date.now()}`
      const dataString = JSON.stringify(backupData)
      const backupName =
        name || `Manual Backup - ${new Date().toLocaleString()}`

      const backup: BackupRecord = {
        id: backupId,
        name: backupName,
        data: backupData,
        createdAt: new Date(),
        type: 'manual',
        size: new Blob([dataString]).size,
      }

      await dbManager.saveBackup(backup)

      // Cleanup old manual backups if needed
      const allBackups = await dbManager.getAllBackups()
      const manualBackups = allBackups.filter(b => b.type === 'manual')

      if (manualBackups.length > this.config.maxManualBackups) {
        const toDelete = manualBackups
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .slice(0, manualBackups.length - this.config.maxManualBackups)

        for (const backup of toDelete) {
          await dbManager.deleteBackup(backup.id)
        }
      }

      return backupId
    } catch (error) {
      console.error('Failed to create manual backup:', error)
      throw error
    }
  }

  async restoreBackup(backupId: string): Promise<void> {
    try {
      // Ensure IndexedDB is initialized
      await dbManager.init()

      const backup = await dbManager.getBackup(backupId)
      if (!backup) {
        throw new Error('Backup not found')
      }

      const { campaignId, campaignName, data, version } = backup.data

      // Create or update campaign with backup data
      const restoredCampaign = {
        id: campaignId || `restored-${Date.now()}`,
        name: campaignName || 'Restored Campaign',
        data,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: version || '1.0.0',
      }

      await dbManager.saveCampaign(restoredCampaign)

      console.log(`Successfully restored backup: ${backup.name}`)
    } catch (error) {
      console.error('Failed to restore backup:', error)
      throw error
    }
  }

  async getAllBackups(): Promise<BackupRecord[]> {
    return dbManager.getAllBackups()
  }

  async deleteBackup(backupId: string): Promise<void> {
    return dbManager.deleteBackup(backupId)
  }

  async getBackupStats(): Promise<{
    totalBackups: number
    autoBackups: number
    manualBackups: number
    totalSize: number
    oldestBackup: Date | undefined
    newestBackup: Date | undefined
  }> {
    const backups = await this.getAllBackups()

    const autoBackups = backups.filter(b => b.type === 'auto').length
    const manualBackups = backups.filter(b => b.type === 'manual').length
    const totalSize = backups.reduce((sum, b) => sum + b.size, 0)

    const dates = backups
      .map(b => b.createdAt)
      .sort((a, b) => a.getTime() - b.getTime())

    return {
      totalBackups: backups.length,
      autoBackups,
      manualBackups,
      totalSize,
      oldestBackup: dates.length > 0 ? dates[0] : undefined,
      newestBackup: dates.length > 0 ? dates[dates.length - 1] : undefined,
    }
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }
}

export const backupSystem = new BackupSystem()

// Note: Backup system will be initialized when the store loads
