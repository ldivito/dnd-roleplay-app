import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sword, Users, MapPin, Plus, Trash2, Eye, Settings } from 'lucide-react'
import type { Character } from '@/types/character'
import type { NPC } from '@/types/npc'
import type { CombatMap, GridPosition } from '@/types/combat'
import { useCombatStore } from '@/stores/combatStore'

interface CombatSetupProps {
  characters: Character[]
  npcs: NPC[]
  maps: CombatMap[]
  onStartCombat: () => void
}

export default function CombatSetup({
  characters,
  npcs,
  maps,
  onStartCombat,
}: CombatSetupProps) {
  const {
    currentCombat,
    createCombat,
    addEntityToCombat,
    removeEntityFromCombat,
    setMap,
    createMap,
  } = useCombatStore()

  const [combatName, setCombatName] = useState('')
  const [combatDescription, setCombatDescription] = useState('')
  const [selectedMap, setSelectedMap] = useState<CombatMap | null>(null)
  const [showNewMapDialog, setShowNewMapDialog] = useState(false)
  const [newMapName, setNewMapName] = useState('')
  const [newMapWidth, setNewMapWidth] = useState(20)
  const [newMapHeight, setNewMapHeight] = useState(20)

  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(
    new Set()
  )
  const [selectedNPCs, setSelectedNPCs] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!currentCombat) {
      const newCombat = createCombat('Nuevo Combate')
      setCombatName(newCombat.name)
    }
  }, [currentCombat, createCombat])

  const handleCreateCombat = () => {
    if (!combatName.trim()) return

    createCombat(combatName, combatDescription)
  }

  const handleAddCharacter = (character: Character) => {
    if (!currentCombat) return

    const position: GridPosition = {
      x: Math.floor(Math.random() * (selectedMap?.gridSize.width || 10)),
      y: Math.floor(Math.random() * (selectedMap?.gridSize.height || 10)),
    }

    addEntityToCombat(character, position)
    setSelectedCharacters(prev => new Set(prev).add(character.id))
  }

  const handleAddNPC = (npc: NPC) => {
    if (!currentCombat) return

    const position: GridPosition = {
      x: Math.floor(Math.random() * (selectedMap?.gridSize.width || 10)),
      y: Math.floor(Math.random() * (selectedMap?.gridSize.height || 10)),
    }

    addEntityToCombat(npc, position)
    setSelectedNPCs(prev => new Set(prev).add(npc.id))
  }

  const handleRemoveEntity = (entityId: string) => {
    if (!currentCombat) return

    const entity = currentCombat.entities.find(e => e.id === entityId)
    if (entity) {
      removeEntityFromCombat(entityId)

      if (entity.characterId) {
        setSelectedCharacters(prev => {
          const next = new Set(prev)
          next.delete(entity.characterId!)
          return next
        })
      }

      if (entity.npcId) {
        setSelectedNPCs(prev => {
          const next = new Set(prev)
          next.delete(entity.npcId!)
          return next
        })
      }
    }
  }

  const handleSelectMap = (map: CombatMap) => {
    setSelectedMap(map)
    if (currentCombat) {
      setMap(map)
    }
  }

  const handleCreateMap = () => {
    if (!newMapName.trim()) return

    const map = createMap(newMapName, newMapWidth, newMapHeight)
    handleSelectMap(map)
    setShowNewMapDialog(false)
    setNewMapName('')
    setNewMapWidth(20)
    setNewMapHeight(20)
  }

  const canStartCombat =
    currentCombat &&
    currentCombat.entities.length >= 2 &&
    selectedMap &&
    combatName.trim()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Configuración de Combate
          </h2>
          <p className="text-muted-foreground">
            Configura un nuevo encuentro de combate
          </p>
        </div>
        <Button
          onClick={onStartCombat}
          disabled={!canStartCombat}
          className="bg-red-600 hover:bg-red-700"
        >
          <Sword className="h-4 w-4 mr-2" />
          Iniciar Combate
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Combat Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Detalles del Combate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="combat-name">Nombre del Combate</Label>
              <Input
                id="combat-name"
                value={combatName}
                onChange={e => setCombatName(e.target.value)}
                placeholder="Ej: Emboscada en el Bosque"
              />
            </div>

            <div>
              <Label htmlFor="combat-description">Descripción</Label>
              <Textarea
                id="combat-description"
                value={combatDescription}
                onChange={e => setCombatDescription(e.target.value)}
                placeholder="Describe el encuentro..."
                rows={3}
              />
            </div>

            <div>
              <Label>Entidades en Combate</Label>
              <div className="mt-2 space-y-2">
                {currentCombat?.entities.map(entity => (
                  <div
                    key={entity.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          entity.type === 'player'
                            ? 'default'
                            : entity.type === 'npc'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {entity.type === 'player'
                          ? 'PC'
                          : entity.type === 'npc'
                            ? 'NPC'
                            : 'MON'}
                      </Badge>
                      <span className="text-sm font-medium">{entity.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEntity(entity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {(!currentCombat?.entities ||
                  currentCombat.entities.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No hay entidades seleccionadas
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entity Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Seleccionar Participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="characters" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="characters">Personajes</TabsTrigger>
                <TabsTrigger value="npcs">NPCs/Monstruos</TabsTrigger>
              </TabsList>

              <TabsContent value="characters" className="space-y-2">
                <ScrollArea className="h-[400px]">
                  {characters.map(character => (
                    <div
                      key={character.id}
                      className="p-3 border rounded-lg mb-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{character.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {character.class} Nivel {character.level}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            AC: {character.armorClass} | HP:{' '}
                            {character.hitPoints.current}/
                            {character.hitPoints.maximum}
                          </p>
                        </div>
                        <Button
                          variant={
                            selectedCharacters.has(character.id)
                              ? 'secondary'
                              : 'outline'
                          }
                          size="sm"
                          onClick={() => {
                            if (selectedCharacters.has(character.id)) {
                              const entity = currentCombat?.entities.find(
                                e => e.characterId === character.id
                              )
                              if (entity) handleRemoveEntity(entity.id)
                            } else {
                              handleAddCharacter(character)
                            }
                          }}
                        >
                          {selectedCharacters.has(character.id)
                            ? 'Quitar'
                            : 'Añadir'}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {characters.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay personajes disponibles
                    </p>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="npcs" className="space-y-2">
                <ScrollArea className="h-[400px]">
                  {npcs.map(npc => (
                    <div key={npc.id} className="p-3 border rounded-lg mb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{npc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {npc.race} {npc.class}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                npc.npcType === 'enemy'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {npc.npcType}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              AC: {npc.armorClass} | HP: {npc.hitPoints.current}
                              /{npc.hitPoints.maximum}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant={
                            selectedNPCs.has(npc.id) ? 'secondary' : 'outline'
                          }
                          size="sm"
                          onClick={() => {
                            if (selectedNPCs.has(npc.id)) {
                              const entity = currentCombat?.entities.find(
                                e => e.npcId === npc.id
                              )
                              if (entity) handleRemoveEntity(entity.id)
                            } else {
                              handleAddNPC(npc)
                            }
                          }}
                        >
                          {selectedNPCs.has(npc.id) ? 'Quitar' : 'Añadir'}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {npcs.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay NPCs disponibles
                    </p>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Map Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Seleccionar Mapa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Mapa de Combate</Label>
              <Dialog
                open={showNewMapDialog}
                onOpenChange={setShowNewMapDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Mapa</DialogTitle>
                    <DialogDescription>
                      Crea un nuevo mapa para el combate
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="map-name">Nombre del Mapa</Label>
                      <Input
                        id="map-name"
                        value={newMapName}
                        onChange={e => setNewMapName(e.target.value)}
                        placeholder="Ej: Claro del Bosque"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="map-width">Ancho (celdas)</Label>
                        <Input
                          id="map-width"
                          type="number"
                          min="5"
                          max="50"
                          value={newMapWidth}
                          onChange={e => setNewMapWidth(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="map-height">Alto (celdas)</Label>
                        <Input
                          id="map-height"
                          type="number"
                          min="5"
                          max="50"
                          value={newMapHeight}
                          onChange={e =>
                            setNewMapHeight(Number(e.target.value))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateMap}>
                      Crear Mapa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[350px]">
              <div className="space-y-2">
                {maps.map(map => (
                  <div
                    key={map.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMap?.id === map.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleSelectMap(map)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{map.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {map.gridSize.width}x{map.gridSize.height} celdas
                        </p>
                        {map.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {map.description}
                          </p>
                        )}
                      </div>
                      {selectedMap?.id === map.id && (
                        <Eye className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                ))}

                {maps.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay mapas disponibles
                  </p>
                )}
              </div>
            </ScrollArea>

            {selectedMap && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Mapa Seleccionado</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>Nombre:</strong> {selectedMap.name}
                    </p>
                    <p>
                      <strong>Tamaño:</strong> {selectedMap.gridSize.width}x
                      {selectedMap.gridSize.height}
                    </p>
                    <p>
                      <strong>Obstáculos:</strong>{' '}
                      {selectedMap.obstacles.length}
                    </p>
                    <p>
                      <strong>Terreno Difícil:</strong>{' '}
                      {selectedMap.difficultTerrain.length}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {!canStartCombat && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Requisitos para iniciar combate
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    {!combatName.trim() && (
                      <li>Proporciona un nombre para el combate</li>
                    )}
                    {(!currentCombat?.entities ||
                      currentCombat.entities.length < 2) && (
                      <li>Selecciona al menos 2 entidades para el combate</li>
                    )}
                    {!selectedMap && (
                      <li>Selecciona un mapa para el combate</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
