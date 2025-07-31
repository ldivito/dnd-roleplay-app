// Data export/import utilities for campaign data backup
import { dbManager, CampaignDB } from './indexedDB'
import { createManualBackup } from './indexedDBPersist'

export interface CampaignExport {
  exportDate: string
  version: string
  campaignId: string
  campaignName: string
  data: any
}

export async function exportCampaignData(): Promise<string> {
  try {
    await dbManager.init()

    // Get current campaign data
    const campaigns = await dbManager.getAllCampaigns()
    if (campaigns.length === 0) {
      throw new Error('No campaign data found')
    }

    // Use the most recently updated campaign
    const currentCampaign = campaigns.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    )[0]

    if (!currentCampaign) {
      throw new Error('No campaign found to export')
    }

    const exportData: CampaignExport = {
      exportDate: new Date().toISOString(),
      version: currentCampaign.version,
      campaignId: currentCampaign.id,
      campaignName: currentCampaign.name,
      data: currentCampaign.data,
    }

    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error('Failed to export campaign data:', error)
    throw new Error('Failed to export campaign data')
  }
}

export async function importCampaignData(jsonData: string): Promise<void> {
  try {
    const importData: CampaignExport = JSON.parse(jsonData)

    if (!importData.data || !importData.version) {
      throw new Error('Invalid campaign data format')
    }

    await dbManager.init()

    // Create campaign from imported data
    const importedCampaign: CampaignDB = {
      id: importData.campaignId || `imported-${Date.now()}`,
      name: importData.campaignName || 'Imported Campaign',
      data: importData.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: importData.version,
    }

    await dbManager.saveCampaign(importedCampaign)

    // Create a backup of the imported data
    await createManualBackup(
      `Imported - ${importData.campaignName || 'Campaign'}`
    )

    // Reload the page to trigger store rehydration
    window.location.reload()
  } catch (error) {
    console.error('Failed to import campaign data:', error)
    throw new Error('Failed to import campaign data')
  }
}

export async function downloadCampaignBackup(): Promise<void> {
  try {
    const exportData = await exportCampaignData()
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `campaign-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(url)

    // Create a manual backup as well
    await createManualBackup(
      `Export Backup - ${new Date().toLocaleDateString()}`
    )
  } catch (error) {
    console.error('Failed to download backup:', error)
    throw new Error('Failed to download backup')
  }
}
