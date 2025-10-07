'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Moon,
  Sun,
  Users,
  History,
  Dice6,
  Heart,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'
import CharacterRestCard from './CharacterRestCard'
import HitDiceRoller from './HitDiceRoller'
import RestHistoryTimeline from './RestHistoryTimeline'
import type { Character } from '@/types/character'

export default function RestManagement() {
  const { characters, takeShortRest, takeLongRest, getRestHistory } =
    useSessionStore()

  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [hitDiceCharacter, setHitDiceCharacter] = useState<Character | null>(
    null
  )
  const [isLongRestDialogOpen, setIsLongRestDialogOpen] = useState(false)

  const restHistory = getRestHistory()
  const selectedCharacters = characters.filter(c =>
    selectedCharacterIds.includes(c.id)
  )

  const handleSelectAll = () => {
    if (selectedCharacterIds.length === characters.length) {
      setSelectedCharacterIds([])
    } else {
      setSelectedCharacterIds(characters.map(c => c.id))
    }
  }

  const handleToggleCharacter = (characterId: string) => {
    setSelectedCharacterIds(prev =>
      prev.includes(characterId)
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    )
  }

  const handleShortRest = () => {
    if (selectedCharacterIds.length === 0) return

    takeShortRest(
      selectedCharacterIds,
      location || undefined,
      notes || undefined
    )

    // Reset form
    setLocation('')
    setNotes('')
    setActiveTab('history')
  }

  const handleLongRest = () => {
    if (selectedCharacterIds.length === 0) return

    takeLongRest(
      selectedCharacterIds,
      location || undefined,
      notes || undefined
    )

    // Reset form
    setLocation('')
    setNotes('')
    setIsLongRestDialogOpen(false)
    setActiveTab('history')
  }

  if (characters.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No hay personajes en la campaña</p>
          <p className="text-sm mt-1">
            Crea personajes primero para usar el sistema de descansos
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="short" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Desc. Corto</span>
          </TabsTrigger>
          <TabsTrigger value="long" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Desc. Largo</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historial</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Estado del Grupo
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedCharacterIds.length === characters.length
                    ? 'Deseleccionar Todos'
                    : 'Seleccionar Todos'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {characters.map(character => (
                  <CharacterRestCard
                    key={character.id}
                    character={character}
                    selected={selectedCharacterIds.includes(character.id)}
                    onSelectedChange={selected => {
                      if (selected) {
                        setSelectedCharacterIds(prev => [...prev, character.id])
                      } else {
                        setSelectedCharacterIds(prev =>
                          prev.filter(id => id !== character.id)
                        )
                      }
                    }}
                  />
                ))}
              </div>

              {selectedCharacterIds.length > 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-3">
                      Personajes seleccionados: {selectedCharacterIds.length}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => setActiveTab('short')}
                        className="flex items-center gap-2"
                      >
                        <Sun className="h-4 w-4" />
                        Tomar Descanso Corto
                      </Button>
                      <Button
                        onClick={() => setActiveTab('long')}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        <Moon className="h-4 w-4" />
                        Tomar Descanso Largo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Short Rest Tab */}
        <TabsContent value="short" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Descanso Corto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Durante un descanso corto (mínimo 1 hora), los personajes
                  pueden:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-center gap-2">
                    <Dice6 className="h-3 w-3" />
                    Gastar Dados de Golpe para recuperar HP
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Recuperar recursos de clase (Ki, Acción Adicional, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-3 w-3" />
                    Brujos recuperan espacios de conjuro
                  </li>
                </ul>
              </div>

              {selectedCharacterIds.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Selecciona personajes en la pestaña Resumen</p>
                </div>
              ) : (
                <>
                  {/* Location and Notes */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="short-location">
                        Ubicación (opcional)
                      </Label>
                      <Input
                        id="short-location"
                        placeholder="Ej: Campamento en el bosque"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="short-notes">Notas (opcional)</Label>
                      <Textarea
                        id="short-notes"
                        placeholder="Ej: El grupo se detiene para comer y revisar el mapa"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Hit Dice Rolling */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Dice6 className="h-4 w-4" />
                      Gastar Dados de Golpe
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedCharacters.map(character => {
                        const needsHealing =
                          character.hitPoints.current <
                          character.hitPoints.maximum
                        const hasHitDice =
                          (character.hitDicePool?.available ??
                            character.level) > 0

                        return (
                          <Button
                            key={character.id}
                            variant="outline"
                            onClick={() => setHitDiceCharacter(character)}
                            disabled={!needsHealing && !hasHitDice}
                            className="justify-start h-auto py-3"
                          >
                            <div className="text-left w-full">
                              <p className="font-medium">{character.name}</p>
                              <p className="text-xs text-muted-foreground">
                                HP: {character.hitPoints.current}/
                                {character.hitPoints.maximum} • Dados:{' '}
                                {character.hitDicePool?.available ??
                                  character.level}
                              </p>
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Complete Short Rest Button */}
                  <Button
                    onClick={handleShortRest}
                    size="lg"
                    className="w-full"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Completar Descanso Corto
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Hit Dice Roller Dialog */}
          {hitDiceCharacter && (
            <Dialog
              open={hitDiceCharacter !== null}
              onOpenChange={open => !open && setHitDiceCharacter(null)}
            >
              <DialogContent className="max-w-md">
                <HitDiceRoller
                  character={hitDiceCharacter}
                  onClose={() => setHitDiceCharacter(null)}
                />
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* Long Rest Tab */}
        <TabsContent value="long" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Descanso Largo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-900 dark:text-purple-100">
                  Durante un descanso largo (mínimo 8 horas), los personajes:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-purple-800 dark:text-purple-200">
                  <li className="flex items-center gap-2">
                    <Heart className="h-3 w-3" />
                    Recuperan todos sus Puntos de Golpe
                  </li>
                  <li className="flex items-center gap-2">
                    <Dice6 className="h-3 w-3" />
                    Recuperan la mitad de sus Dados de Golpe (mínimo 1)
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Recuperan todos los espacios de conjuro
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Recuperan todos los recursos de clase
                  </li>
                </ul>
              </div>

              {selectedCharacterIds.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Selecciona personajes en la pestaña Resumen</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="long-location">
                        Ubicación (opcional)
                      </Label>
                      <Input
                        id="long-location"
                        placeholder="Ej: Posada del Dragón Verde"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="long-notes">Notas (opcional)</Label>
                      <Textarea
                        id="long-notes"
                        placeholder="Ej: El grupo pasa la noche en la posada antes de partir hacia las montañas"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Selected Characters Preview */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Personajes que descansarán:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacters.map(char => (
                        <Badge key={char.id} variant="secondary">
                          {char.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Dialog
                    open={isLongRestDialogOpen}
                    onOpenChange={setIsLongRestDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full">
                        <Moon className="h-4 w-4 mr-2" />
                        Tomar Descanso Largo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Descanso Largo</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres realizar un descanso
                          largo para {selectedCharacterIds.length}{' '}
                          {selectedCharacterIds.length === 1
                            ? 'personaje'
                            : 'personajes'}
                          ?
                          <br />
                          <br />
                          Esto restaurará completamente sus HP, espacios de
                          conjuro, y recursos de clase.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsLongRestDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleLongRest}>
                          Confirmar Descanso Largo
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <RestHistoryTimeline restEvents={restHistory} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
