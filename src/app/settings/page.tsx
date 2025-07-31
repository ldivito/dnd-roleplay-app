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
} from 'lucide-react'
import {
  exportCampaignData,
  importCampaignData,
  downloadCampaignBackup,
} from '@/lib/dataManagement'
import BackupManager from '@/components/BackupManager'

export default function SettingsPage() {
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [storageInfo, setStorageInfo] = useState({ size: '0 KB', items: 0 })

  useEffect(() => {
    getStorageInfo().then(setStorageInfo)
  }, [])

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
