import {
  supabase,
  isSupabaseConfigured,
  BACKUP_BUCKET,
  getCurrentUser,
} from './supabase'
import { dbManager } from './indexedDB'

export interface CloudBackupMetadata {
  name: string
  fileName: string
  size: number
  createdAt: Date
  lastModified: Date
}

export interface CloudBackupResult {
  success: boolean
  fileName?: string
  error?: string
}

export interface CloudBackupListResult {
  success: boolean
  backups?: CloudBackupMetadata[]
  error?: string
}

/**
 * Uploads current campaign data to Supabase Storage as a JSON backup
 */
export async function uploadBackupToCloud(
  customName?: string
): Promise<CloudBackupResult> {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error:
          'Supabase no está configurado. Por favor, configura las credenciales en .env.local',
      }
    }

    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para subir copias a la nube',
      }
    }

    // Get current campaign data from IndexedDB
    const CURRENT_CAMPAIGN_ID = 'current-campaign'
    const campaign = await dbManager.getCampaign(CURRENT_CAMPAIGN_ID)

    if (!campaign || !campaign.data) {
      return {
        success: false,
        error: 'No hay datos de campaña para respaldar',
      }
    }

    // Create filename with user ID, timestamp and optional custom name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const namePart = customName ? `-${sanitizeFilename(customName)}` : ''
    const fileName = `${user.id}/backup-${timestamp}${namePart}.json`

    // Convert campaign data to JSON
    const jsonData = JSON.stringify(campaign.data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BACKUP_BUCKET)
      .upload(fileName, blob, {
        contentType: 'application/json',
        upsert: false,
      })

    if (error) {
      console.error('Error uploading to Supabase:', error)
      return {
        success: false,
        error: `Error al subir: ${error.message}`,
      }
    }

    return {
      success: true,
      fileName: data.path,
    }
  } catch (error) {
    console.error('Unexpected error uploading backup:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Lists all cloud backups from Supabase Storage for the current user
 */
export async function listCloudBackups(): Promise<CloudBackupListResult> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: 'Supabase no está configurado',
      }
    }

    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para ver copias en la nube',
      }
    }

    // List files in user's folder
    const { data, error } = await supabase.storage
      .from(BACKUP_BUCKET)
      .list(user.id, {
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('Error listing backups:', error)
      return {
        success: false,
        error: `Error al listar copias: ${error.message}`,
      }
    }

    // Filter only JSON files and map to metadata
    const backups: CloudBackupMetadata[] = (data || [])
      .filter(file => file.name.endsWith('.json'))
      .map(file => ({
        name: extractBackupName(file.name),
        fileName: `${user.id}/${file.name}`, // Include user ID in path
        size: file.metadata?.size || 0,
        createdAt: new Date(file.created_at),
        lastModified: new Date(file.updated_at),
      }))

    return {
      success: true,
      backups,
    }
  } catch (error) {
    console.error('Unexpected error listing backups:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Downloads a backup file from Supabase Storage
 */
export async function downloadBackupFromCloud(
  fileName: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: 'Supabase no está configurado',
      }
    }

    const { data, error } = await supabase.storage
      .from(BACKUP_BUCKET)
      .download(fileName)

    if (error) {
      console.error('Error downloading backup:', error)
      return {
        success: false,
        error: `Error al descargar: ${error.message}`,
      }
    }

    // Convert blob to JSON
    const text = await data.text()
    const jsonData = JSON.parse(text)

    return {
      success: true,
      data: jsonData,
    }
  } catch (error) {
    console.error('Unexpected error downloading backup:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Deletes a backup file from Supabase Storage
 */
export async function deleteCloudBackup(
  fileName: string
): Promise<CloudBackupResult> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: 'Supabase no está configurado',
      }
    }

    const { error } = await supabase.storage
      .from(BACKUP_BUCKET)
      .remove([fileName])

    if (error) {
      console.error('Error deleting backup:', error)
      return {
        success: false,
        error: `Error al eliminar: ${error.message}`,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Unexpected error deleting backup:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Restores campaign data from a cloud backup
 */
export async function restoreFromCloudBackup(
  fileName: string
): Promise<CloudBackupResult> {
  try {
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: 'Cannot restore during SSR',
      }
    }

    // Download the backup data
    const downloadResult = await downloadBackupFromCloud(fileName)
    if (!downloadResult.success || !downloadResult.data) {
      return {
        success: false,
        error: downloadResult.error || 'Error al descargar la copia',
      }
    }

    // Save to IndexedDB as current campaign
    const CURRENT_CAMPAIGN_ID = 'current-campaign'
    await dbManager.saveCampaign({
      id: CURRENT_CAMPAIGN_ID,
      name: 'Restored Campaign',
      data: downloadResult.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0',
    })

    return {
      success: true,
      fileName,
    }
  } catch (error) {
    console.error('Unexpected error restoring backup:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Downloads backup as a JSON file to user's computer
 */
export async function downloadBackupFile(fileName: string): Promise<void> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase no está configurado')
    }

    const { data, error } = await supabase.storage
      .from(BACKUP_BUCKET)
      .download(fileName)

    if (error) {
      throw new Error(`Error al descargar: ${error.message}`)
    }

    // Create download link
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}

/**
 * Formats file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Extracts a human-readable name from backup filename
 */
function extractBackupName(fileName: string): string {
  // Remove .json extension
  const withoutExt = fileName.replace('.json', '')

  // Remove 'backup-' prefix if present
  const withoutPrefix = withoutExt.replace(/^backup-/, '')

  // Split by timestamp pattern and get custom name if exists
  const parts = withoutPrefix.split('-')

  // If there's a custom name part (after timestamp), return it
  // Otherwise return the full filename
  if (parts.length > 6) {
    // Timestamp has 6 parts (YYYY-MM-DDTHH-MM-SS)
    return parts.slice(6).join('-')
  }

  return withoutPrefix
}

/**
 * Sanitizes filename to remove special characters
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/--+/g, '-')
    .toLowerCase()
    .slice(0, 50) // Limit length
}
