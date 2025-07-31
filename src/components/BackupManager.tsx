'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Clock,
  Download,
  Trash2,
  RotateCcw,
  Plus,
  Settings,
  Database,
  History,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import {
  getAllBackups,
  createManualBackup,
  restoreFromBackup,
  deleteBackup,
  getBackupStats,
  getBackupSystem,
} from '@/lib/indexedDBPersist'
import { BackupRecord } from '@/lib/indexedDB'

export default function BackupManager() {
  const [backups, setBackups] = useState<BackupRecord[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [backupName, setBackupName] = useState('')
  const [config, setConfig] = useState({
    autoBackupEnabled: true,
    backupInterval: 30,
    maxAutoBackups: 10,
    maxManualBackups: 20,
  })

  useEffect(() => {
    loadBackups()
    loadConfig()
  }, [])

  const loadBackups = async () => {
    try {
      const [backupList, backupStats] = await Promise.all([
        getAllBackups(),
        getBackupStats(),
      ])
      setBackups(backupList)
      setStats(backupStats)
    } catch (error) {
      console.error('Failed to load backups:', error)
      setMessage({
        type: 'error',
        text: 'Error al cargar las copias de seguridad',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadConfig = async () => {
    try {
      const backupSystem = getBackupSystem()
      const currentConfig = backupSystem.getConfig()
      setConfig(currentConfig)
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      setMessage({
        type: 'error',
        text: 'Por favor ingresa un nombre para la copia de seguridad',
      })
      return
    }

    setCreating(true)
    try {
      await createManualBackup(backupName)
      setMessage({
        type: 'success',
        text: 'Copia de seguridad creada correctamente',
      })
      setBackupName('')
      await loadBackups()
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al crear la copia de seguridad',
      })
    } finally {
      setCreating(false)
    }
  }

  const handleRestore = async (backupId: string) => {
    try {
      await restoreFromBackup(backupId)
      setMessage({
        type: 'success',
        text: 'Copia de seguridad restaurada. La página se recargará.',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al restaurar la copia de seguridad',
      })
    }
  }

  const handleDelete = async (backupId: string) => {
    try {
      await deleteBackup(backupId)
      setMessage({ type: 'success', text: 'Copia de seguridad eliminada' })
      await loadBackups()
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al eliminar la copia de seguridad',
      })
    }
  }

  const handleConfigChange = async (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)

    try {
      const backupSystem = getBackupSystem()
      await backupSystem.updateConfig(newConfig)
      setMessage({ type: 'success', text: 'Configuración actualizada' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al actualizar la configuración',
      })
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-ES')
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando copias de seguridad...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
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

      {/* Backup Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Estadísticas de Copias de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalBackups}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.autoBackups}
                </div>
                <div className="text-sm text-muted-foreground">Automáticas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.manualBackups}
                </div>
                <div className="text-sm text-muted-foreground">Manuales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatSize(stats.totalSize)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tamaño Total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Copias de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Copias de seguridad automáticas</Label>
              <div className="text-sm text-muted-foreground">
                Crear copias automáticamente en intervalos regulares
              </div>
            </div>
            <Switch
              checked={config.autoBackupEnabled}
              onCheckedChange={checked =>
                handleConfigChange('autoBackupEnabled', checked)
              }
            />
          </div>

          {config.autoBackupEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="backup-interval">Intervalo (minutos)</Label>
                <Input
                  id="backup-interval"
                  type="number"
                  min="5"
                  max="1440"
                  value={config.backupInterval}
                  onChange={e =>
                    handleConfigChange(
                      'backupInterval',
                      parseInt(e.target.value)
                    )
                  }
                  className="w-32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-auto-backups">
                  Máximo de copias automáticas
                </Label>
                <Input
                  id="max-auto-backups"
                  type="number"
                  min="1"
                  max="50"
                  value={config.maxAutoBackups}
                  onChange={e =>
                    handleConfigChange(
                      'maxAutoBackups',
                      parseInt(e.target.value)
                    )
                  }
                  className="w-32"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="max-manual-backups">
              Máximo de copias manuales
            </Label>
            <Input
              id="max-manual-backups"
              type="number"
              min="1"
              max="100"
              value={config.maxManualBackups}
              onChange={e =>
                handleConfigChange('maxManualBackups', parseInt(e.target.value))
              }
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Create Manual Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Crear Copia de Seguridad Manual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backup-name">Nombre de la copia de seguridad</Label>
            <Input
              id="backup-name"
              value={backupName}
              onChange={e => setBackupName(e.target.value)}
              placeholder="Ej: Antes del gran evento"
              disabled={creating}
            />
          </div>
          <Button
            onClick={handleCreateBackup}
            disabled={creating || !backupName.trim()}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {creating ? 'Creando...' : 'Crear Copia de Seguridad'}
          </Button>
        </CardContent>
      </Card>

      {/* Backup List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Copias de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No hay copias de seguridad disponibles
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map(backup => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{backup.name}</span>
                      <Badge
                        variant={
                          backup.type === 'auto' ? 'secondary' : 'default'
                        }
                      >
                        {backup.type === 'auto' ? 'Automática' : 'Manual'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(backup.createdAt)}
                      </span>
                      <span>{formatSize(backup.size)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restaurar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Restaurar copia de seguridad?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esto reemplazará todos los datos actuales con los
                            datos de la copia de seguridad &quot;{backup.name}
                            &quot;. Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRestore(backup.id)}
                          >
                            Restaurar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Eliminar copia de seguridad?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Se eliminará permanentemente la copia de seguridad
                            &quot;{backup.name}&quot;. Esta acción no se puede
                            deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(backup.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
