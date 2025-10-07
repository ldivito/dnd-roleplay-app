'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  Download,
  Upload,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Bug,
  Cloud,
  CloudUpload,
  Trash2,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import {
  exportCampaignData,
  importCampaignData,
  downloadCampaignBackup,
} from '@/lib/dataManagement'
import BackupManager from '@/components/BackupManager'
import {
  uploadBackupToCloud,
  listCloudBackups,
  restoreFromCloudBackup,
  deleteCloudBackup,
  downloadBackupFile,
  formatFileSize,
  type CloudBackupMetadata,
} from '@/lib/cloudBackup'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function SettingsPage() {
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [storageInfo, setStorageInfo] = useState({ size: '0 KB', items: 0 })

  // Cloud backup state
  const [cloudBackups, setCloudBackups] = useState<CloudBackupMetadata[]>([])
  const [cloudLoading, setCloudLoading] = useState(false)
  const [uploadingToCloud, setUploadingToCloud] = useState(false)
  const [customBackupName, setCustomBackupName] = useState('')
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)

  useEffect(() => {
    getStorageInfo().then(setStorageInfo)

    // Check if Supabase is configured
    setSupabaseConfigured(isSupabaseConfigured())

    // Load cloud backups if configured
    if (isSupabaseConfigured()) {
      loadCloudBackups()
    }
  }, [])

  const loadCloudBackups = async () => {
    setCloudLoading(true)
    try {
      const result = await listCloudBackups()
      if (result.success && result.backups) {
        setCloudBackups(result.backups)
      } else if (result.error) {
        setMessage({ type: 'error', text: result.error })
      }
    } catch (error) {
      console.error('Error loading cloud backups:', error)
    } finally {
      setCloudLoading(false)
    }
  }

  const handleUploadToCloud = async () => {
    setUploadingToCloud(true)
    setMessage(null)
    try {
      const result = await uploadBackupToCloud(customBackupName || undefined)
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Copia de seguridad subida a la nube correctamente',
        })
        setCustomBackupName('')
        await loadCloudBackups()
      } else {
        setMessage({ type: 'error', text: result.error || 'Error desconocido' })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al subir la copia de seguridad',
      })
    } finally {
      setUploadingToCloud(false)
    }
  }

  const handleRestoreFromCloud = async (fileName: string) => {
    if (
      !confirm(
        '¿Estás seguro de que quieres restaurar desde esta copia? Esto reemplazará todos los datos actuales y recargará la página.'
      )
    ) {
      return
    }

    setCloudLoading(true)
    setMessage(null)
    try {
      const result = await restoreFromCloudBackup(fileName)
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Restaurando desde la nube... Recargando página...',
        })
        // Reload page after a short delay to show message
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: result.error || 'Error desconocido' })
        setCloudLoading(false)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al restaurar desde la nube',
      })
      setCloudLoading(false)
    }
  }

  const handleDeleteCloudBackup = async (fileName: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta copia?')) {
      return
    }

    setCloudLoading(true)
    setMessage(null)
    try {
      const result = await deleteCloudBackup(fileName)
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Copia de seguridad eliminada correctamente',
        })
        await loadCloudBackups()
      } else {
        setMessage({ type: 'error', text: result.error || 'Error desconocido' })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al eliminar la copia de seguridad',
      })
    } finally {
      setCloudLoading(false)
    }
  }

  const handleDownloadCloudBackup = async (fileName: string) => {
    setMessage(null)
    try {
      await downloadBackupFile(fileName)
      setMessage({
        type: 'success',
        text: 'Copia de seguridad descargada correctamente',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al descargar la copia de seguridad',
      })
    }
  }

  const handleExport = async () => {
    try {
      await downloadCampaignBackup()
      setMessage({
        type: 'success',
        text: 'Copia de seguridad descargada correctamente',
      })
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al exportar los datos' })
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    const reader = new FileReader()

    reader.onload = async e => {
      try {
        const content = e.target?.result as string
        await importCampaignData(content)
        setMessage({ type: 'success', text: 'Datos importados correctamente' })
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Error al importar los datos. Verifica el formato del archivo.',
        })
        setImporting(false)
      }
    }

    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Error al leer el archivo' })
      setImporting(false)
    }

    reader.readAsText(file)
  }

  const getStorageInfo = async () => {
    try {
      // Get storage info from IndexedDB
      const { getAllCampaigns } = await import('@/lib/indexedDB')
      const campaigns = await getAllCampaigns()

      if (campaigns.length === 0) return { size: '0 KB', items: 0 }

      const currentCampaign = campaigns.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      )[0]

      if (!currentCampaign) return { size: '0 KB', items: 0 }

      const data = JSON.stringify(currentCampaign.data)
      const size = (new Blob([data]).size / 1024).toFixed(1)

      let items = 0
      if (currentCampaign.data) {
        items += currentCampaign.data.characters?.length || 0
        items += currentCampaign.data.spells?.length || 0
        items += currentCampaign.data.npcs?.length || 0
        items += currentCampaign.data.quests?.length || 0
        items += currentCampaign.data.factions?.length || 0
        items += currentCampaign.data.locations?.length || 0
        items += currentCampaign.data.lore?.length || 0
        items += currentCampaign.data.items?.length || 0
      }

      return { size: `${size} KB`, items }
    } catch {
      return { size: '0 KB', items: 0 }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Configuración, preferencias y gestión de datos de la aplicación.
        </p>
      </div>

      {message && (
        <Card
          className={`border-2 ${message.type === 'success' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30'}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <span
                className={
                  message.type === 'success'
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }
              >
                {message.text}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Gestión de Datos de Campaña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Storage Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Estado del Almacenamiento
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Tamaño total:</span>
                <Badge variant="outline" className="ml-2">
                  {storageInfo.size}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Elementos guardados:
                </span>
                <Badge variant="outline" className="ml-2">
                  {storageInfo.items}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Los datos se almacenan en IndexedDB con copias de seguridad
              automáticas.
            </p>
          </div>

          <Separator />

          {/* Export Data */}
          <div className="space-y-3">
            <h4 className="font-medium">Exportar Datos</h4>
            <p className="text-sm text-muted-foreground">
              Descarga una copia de seguridad completa de todos tus datos de
              campaña.
            </p>
            <Button onClick={handleExport} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Descargar Copia de Seguridad
            </Button>
          </div>

          <Separator />

          {/* Import Data */}
          <div className="space-y-3">
            <h4 className="font-medium">Importar Datos</h4>
            <p className="text-sm text-muted-foreground">
              Restaura tus datos desde una copia de seguridad. Esto reemplazará
              todos los datos actuales.
            </p>
            <div className="space-y-2">
              <Label htmlFor="import-file">
                Seleccionar archivo de copia de seguridad
              </Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
              />
            </div>
            {importing && (
              <p className="text-sm text-muted-foreground">
                Importando datos... La página se recargará automáticamente.
              </p>
            )}
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Importante:
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  - Los datos se almacenan localmente en IndexedDB
                  <br />
                  - Se crean copias de seguridad automáticas cada 30 minutos
                  <br />- Los datos no se sincronizan entre dispositivos o
                  navegadores
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Management */}
      <BackupManager />

      {/* Cloud Backup */}
      {supabaseConfigured ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Copias de Seguridad en la Nube
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload to Cloud */}
            <div className="space-y-3">
              <h4 className="font-medium">Subir a la Nube</h4>
              <p className="text-sm text-muted-foreground">
                Sube una copia de seguridad de tu campaña actual a Supabase
                Storage.
              </p>
              <div className="space-y-2">
                <Label htmlFor="backup-name">
                  Nombre personalizado (opcional)
                </Label>
                <Input
                  id="backup-name"
                  type="text"
                  placeholder="ej: antes-batalla-final"
                  value={customBackupName}
                  onChange={e => setCustomBackupName(e.target.value)}
                  disabled={uploadingToCloud}
                />
              </div>
              <Button
                onClick={handleUploadToCloud}
                disabled={uploadingToCloud}
                className="w-full sm:w-auto"
              >
                {uploadingToCloud ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-4 w-4 mr-2" />
                    Subir a la Nube
                  </>
                )}
              </Button>
            </div>

            <Separator />

            {/* Cloud Backups List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Copias en la Nube</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadCloudBackups}
                  disabled={cloudLoading}
                >
                  {cloudLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {cloudLoading && cloudBackups.length === 0 ? (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Cargando copias de seguridad...
                </div>
              ) : cloudBackups.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay copias de seguridad en la nube</p>
                  <p className="text-sm">
                    Sube tu primera copia usando el botón de arriba
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cloudBackups.map(backup => (
                    <div
                      key={backup.fileName}
                      className="p-4 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium truncate">
                            {backup.name || backup.fileName}
                          </h5>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{formatFileSize(backup.size)}</span>
                            <span>•</span>
                            <span>
                              {backup.createdAt.toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRestoreFromCloud(backup.fileName)
                            }
                            disabled={cloudLoading}
                            title="Restaurar desde esta copia"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDownloadCloudBackup(backup.fileName)
                            }
                            title="Descargar archivo JSON"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteCloudBackup(backup.fileName)
                            }
                            disabled={cloudLoading}
                            title="Eliminar esta copia"
                          >
                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    Copias en la Nube Activas
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Tus copias están almacenadas de forma segura en Supabase
                    Storage. Puedes acceder a ellas desde cualquier dispositivo
                    con las credenciales configuradas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-muted-foreground" />
              Copias de Seguridad en la Nube
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-8 text-center border-2 border-dashed rounded-lg">
              <Cloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h4 className="font-medium mb-2">Supabase no configurado</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Para usar copias de seguridad en la nube, configura Supabase en
                tu archivo .env.local:
              </p>
              <div className="text-left bg-muted p-4 rounded-lg font-mono text-xs space-y-1">
                <div>NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon</div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Reinicia el servidor de desarrollo después de configurar.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Debug */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-600 dark:text-red-400" />
            Depuración de Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Herramientas avanzadas para inspeccionar el estado de la base de
            datos, analizar el almacenamiento y depurar problemas de datos.
          </p>
          <Button
            onClick={() => (window.location.href = '/settings/database')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Database className="h-4 w-4 mr-2" />
            Abrir Depurador de Base de Datos
          </Button>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Más opciones de configuración estarán disponibles pronto...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
