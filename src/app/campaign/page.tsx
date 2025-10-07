'use client'

import { useState, useEffect } from 'react'
import { useSessionStore } from '@/stores/sessionStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Crown,
  Save,
  Calendar,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'

export default function CampaignPage() {
  const {
    currentCampaign,
    createCampaign,
    updateCampaign,
    characters,
    npcs,
    quests,
    factions,
    locations,
  } = useSessionStore()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Load campaign data when component mounts
  useEffect(() => {
    if (currentCampaign) {
      setName(currentCampaign.name)
      setDescription(currentCampaign.description || '')
    }
  }, [currentCampaign])

  const handleSave = () => {
    if (!name.trim()) {
      setMessage({
        type: 'error',
        text: 'El nombre de la campaña es obligatorio',
      })
      return
    }

    if (currentCampaign) {
      // Update existing campaign
      updateCampaign(currentCampaign.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      })
      setMessage({
        type: 'success',
        text: 'Campaña actualizada correctamente',
      })
    } else {
      // Create new campaign
      createCampaign({
        name: name.trim(),
        description: description.trim() || undefined,
        currentSession: 0,
        totalSessions: 0,
      })
      setMessage({
        type: 'success',
        text: 'Campaña creada correctamente',
      })
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000)
  }

  // Calculate campaign statistics
  const stats = {
    characters: characters.length,
    npcs: npcs.length,
    activeQuests: quests.filter(q => q.status === 'active').length,
    totalQuests: quests.length,
    factions: factions.length,
    locations: locations.length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configuración de Campaña
        </h1>
        <p className="text-muted-foreground">
          Configura los detalles principales de tu campaña y visualiza
          estadísticas clave.
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

      {/* Campaign Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Detalles de la Campaña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="campaign-name">
                Nombre de la Campaña <span className="text-red-500">*</span>
              </Label>
              <Input
                id="campaign-name"
                placeholder="Ej: La Leyenda del Dragón Dorado"
                value={name}
                onChange={e => setName(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                El nombre que identifica tu campaña
              </p>
            </div>

            <Separator />

            {/* Campaign Description */}
            <div className="space-y-2">
              <Label htmlFor="campaign-description">Descripción</Label>
              <Textarea
                id="campaign-description"
                placeholder="Describe tu campaña: la trama principal, el mundo, los temas centrales..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Una descripción general de tu campaña (opcional)
              </p>
            </div>

            <Separator />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} size="lg">
                <Save className="h-4 w-4 mr-2" />
                {currentCampaign ? 'Actualizar Campaña' : 'Crear Campaña'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Statistics */}
      {currentCampaign && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Estadísticas de Campaña
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Characters */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Personajes</span>
                </div>
                <p className="text-2xl font-bold">{stats.characters}</p>
              </div>

              {/* NPCs */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">NPCs</span>
                </div>
                <p className="text-2xl font-bold">{stats.npcs}</p>
              </div>

              {/* Active Quests */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Misiones Activas</span>
                </div>
                <p className="text-2xl font-bold">
                  {stats.activeQuests}
                  <span className="text-sm text-muted-foreground">
                    {' '}
                    / {stats.totalQuests}
                  </span>
                </p>
              </div>

              {/* Factions */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Crown className="h-4 w-4" />
                  <span className="text-sm">Facciones</span>
                </div>
                <p className="text-2xl font-bold">{stats.factions}</p>
              </div>

              {/* Locations */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Ubicaciones</span>
                </div>
                <p className="text-2xl font-bold">{stats.locations}</p>
              </div>

              {/* Total Sessions */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Sesiones Totales</span>
                </div>
                <p className="text-2xl font-bold">
                  {currentCampaign.totalSessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Info */}
      {currentCampaign && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Información de la Campaña
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creada:</span>
                <Badge variant="outline">
                  {new Date(currentCampaign.createdAt).toLocaleDateString(
                    'es-ES',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Última actualización:
                </span>
                <Badge variant="outline">
                  {new Date(currentCampaign.updatedAt).toLocaleDateString(
                    'es-ES',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sesión actual:</span>
                <Badge variant="default">
                  Sesión #{currentCampaign.currentSession}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
