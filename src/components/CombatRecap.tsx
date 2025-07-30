import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Trophy,
  Clock,
  Users,
  Sword,
  Heart,
  Zap,
  Star,
  Download,
  Edit,
  Save,
  Share,
  BarChart3,
} from 'lucide-react'
import type { CombatRecap as CombatRecapType } from '@/types/combat'
import { useCombatStore } from '@/stores/combatStore'

interface CombatRecapProps {
  combatId: string
  recap?: CombatRecapType
}

export default function CombatRecap({
  combatId,
  recap: initialRecap,
}: CombatRecapProps) {
  const { generateRecap, combats } = useCombatStore()
  const [recap, setRecap] = useState<CombatRecapType | null>(
    initialRecap || null
  )
  const [isEditing, setIsEditing] = useState(false)
  const [editedRecap, setEditedRecap] = useState<CombatRecapType | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const combat = combats.find(c => c.id === combatId)

  const handleGenerateRecap = () => {
    const generatedRecap = generateRecap(combatId)
    if (generatedRecap) {
      setRecap(generatedRecap)
    }
  }

  const handleStartEdit = () => {
    if (recap) {
      setEditedRecap({ ...recap })
      setIsEditing(true)
    }
  }

  const handleSaveEdit = () => {
    if (editedRecap) {
      setRecap(editedRecap)
      setIsEditing(false)
      setEditedRecap(null)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedRecap(null)
  }

  const handleExportRecap = () => {
    if (!recap) return

    const recapText = `
RESUMEN DE COMBATE: ${recap.combatName}
=============================================

Duración: ${formatDuration(recap.startTime, recap.endTime)}
Rondas Totales: ${recap.totalRounds}

PARTICIPANTES:
${recap.participants
  .map(
    p =>
      `• ${p.name} (${p.type.toUpperCase()}) - ${p.survived ? 'SOBREVIVIÓ' : 'DERROTADO'}
    Daño Infligido: ${p.damageDealt} | Daño Recibido: ${p.damageTaken}
    Curación Realizada: ${p.healingDone} | Hechizos Usados: ${p.spellsUsed}`
  )
  .join('\n')}

EVENTOS IMPORTANTES:
${recap.majorEvents.map(e => `• Ronda ${e.round}: ${e.event}`).join('\n')}

${
  recap.loot && recap.loot.length > 0
    ? `
BOTÍN:
${recap.loot.map(item => `• ${item}`).join('\n')}
`
    : ''
}

${recap.experience ? `EXPERIENCIA OTORGADA: ${recap.experience}` : ''}

${
  recap.notes
    ? `
NOTAS ADICIONALES:
${recap.notes}
`
    : ''
}
    `.trim()

    const blob = new Blob([recapText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `combat-recap-${recap.combatName.replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDuration = (start: Date, end: Date) => {
    const durationMs = end.getTime() - start.getTime()
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const getParticipantTypeColor = (type: string) => {
    switch (type) {
      case 'player':
        return 'bg-blue-100 text-blue-800'
      case 'npc':
        return 'bg-green-100 text-green-800'
      case 'monster':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!recap && !combat) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Combate no encontrado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recap) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Resumen de Combate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div>
              <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Generar Resumen</h3>
              <p className="text-muted-foreground">
                Crea un resumen detallado del combate &quot;{combat?.name}&quot;
              </p>
            </div>
            <Button onClick={handleGenerateRecap}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generar Resumen
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentRecap = isEditing ? editedRecap! : recap

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {currentRecap.combatName}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(currentRecap.startTime, currentRecap.endTime)}
                </div>
                <div className="flex items-center gap-1">
                  <Sword className="h-4 w-4" />
                  {currentRecap.totalRounds} rondas
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {currentRecap.participants.length} participantes
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={handleStartEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" onClick={handleExportRecap}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Dialog
                    open={showShareDialog}
                    onOpenChange={setShowShareDialog}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Share className="h-4 w-4 mr-2" />
                        Compartir
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Compartir Resumen</DialogTitle>
                        <DialogDescription>
                          Funcionalidad de compartir disponible próximamente
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {currentRecap.participants.map(participant => (
                  <div
                    key={participant.id}
                    className={`p-4 rounded-lg border ${
                      participant.survived
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{participant.name}</h4>
                        <Badge
                          className={getParticipantTypeColor(participant.type)}
                        >
                          {participant.type.toUpperCase()}
                        </Badge>
                        <Badge
                          variant={
                            participant.survived ? 'default' : 'destructive'
                          }
                        >
                          {participant.survived ? 'Sobrevivió' : 'Derrotado'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Daño Infligido</p>
                        <p className="font-medium text-red-600">
                          {participant.damageDealt}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Daño Recibido</p>
                        <p className="font-medium text-red-600">
                          {participant.damageTaken}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Curación</p>
                        <p className="font-medium text-green-600">
                          {participant.healingDone}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hechizos</p>
                        <p className="font-medium text-blue-600">
                          {participant.spellsUsed}
                        </p>
                      </div>
                    </div>

                    {participant.conditions.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-1">
                          Condiciones Finales:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {participant.conditions.map((condition, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Major Events & Details */}
        <div className="space-y-4">
          {/* Major Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Eventos Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {currentRecap.majorEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 rounded"
                    >
                      <Badge variant="outline" className="text-xs mt-0.5">
                        R{event.round}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm">{event.event}</p>
                        <Badge
                          className={`${getEventImportanceColor(event.importance)} text-xs mt-1`}
                          variant="secondary"
                        >
                          {event.importance === 'high'
                            ? 'Alta'
                            : event.importance === 'medium'
                              ? 'Media'
                              : 'Baja'}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {currentRecap.majorEvents.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay eventos importantes registrados
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Loot & Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recompensas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="experience">Experiencia</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      value={editedRecap?.experience || 0}
                      onChange={e =>
                        setEditedRecap(prev =>
                          prev
                            ? {
                                ...prev,
                                experience: Number(e.target.value),
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="loot">Botín (uno por línea)</Label>
                    <Textarea
                      id="loot"
                      rows={4}
                      value={editedRecap?.loot?.join('\n') || ''}
                      onChange={e =>
                        setEditedRecap(prev =>
                          prev
                            ? {
                                ...prev,
                                loot: e.target.value
                                  .split('\n')
                                  .filter(item => item.trim()),
                              }
                            : null
                        )
                      }
                      placeholder="Espada Larga +1&#10;Poción de Curación&#10;100 monedas de oro"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {currentRecap.experience && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Experiencia Otorgada
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {currentRecap.experience} XP
                      </p>
                    </div>
                  )}

                  {currentRecap.loot && currentRecap.loot.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Botín Obtenido
                      </p>
                      <ul className="space-y-1">
                        {currentRecap.loot.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!currentRecap.experience &&
                    (!currentRecap.loot || currentRecap.loot.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No se registraron recompensas
                      </p>
                    )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              rows={6}
              value={editedRecap?.notes || ''}
              onChange={e =>
                setEditedRecap(prev =>
                  prev
                    ? {
                        ...prev,
                        notes: e.target.value,
                      }
                    : null
                )
              }
              placeholder="Añade notas adicionales sobre el combate..."
            />
          ) : (
            <div className="min-h-[120px]">
              {currentRecap.notes ? (
                <p className="text-sm whitespace-pre-wrap">
                  {currentRecap.notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay notas adicionales
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
