'use client'

import React, { useState } from 'react'
import { Plus, X, Users, MapPin, Scroll, Heart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useSessionStore } from '@/stores/sessionStore'
import type {
  NPCRelationship,
  NPCLocationRelation,
  NPCLoreConnection,
  RelationshipType,
  LocationRelationType,
} from '@/types/npc'
import {
  RELATIONSHIP_TYPES,
  LOCATION_RELATION_TYPES,
  LORE_CONNECTION_TYPES,
  getRelationshipStrength,
} from '@/types/npc'

interface NPCRelationshipManagerProps {
  relationships: NPCRelationship[]
  locationRelations: NPCLocationRelation[]
  loreConnections: NPCLoreConnection[]
  onRelationshipsChange: (relationships: NPCRelationship[]) => void
  onLocationRelationsChange: (relations: NPCLocationRelation[]) => void
  onLoreConnectionsChange: (connections: NPCLoreConnection[]) => void
  currentNPCId?: string | undefined // To avoid self-relationships
}

// Component for managing NPC-to-NPC relationships
const NPCRelationshipsSection: React.FC<{
  relationships: NPCRelationship[]
  onChange: (relationships: NPCRelationship[]) => void
  currentNPCId?: string | undefined
}> = ({ relationships, onChange, currentNPCId }) => {
  const { npcs } = useSessionStore()
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newRelationship, setNewRelationship] = useState({
    type: 'friend' as RelationshipType,
    strength: 3,
    isSecret: false,
    description: '',
    notes: '',
  })

  const availableNPCs = npcs.filter(
    npc =>
      npc.id !== currentNPCId &&
      npc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !relationships.some(rel => rel.npcId === npc.id)
  )

  const handleAddRelationship = (npcId: string, npcName: string) => {
    const relationship: NPCRelationship = {
      id: crypto.randomUUID(),
      npcId,
      npcName,
      relationshipType: newRelationship.type,
      isSecret: newRelationship.isSecret,
      strength: newRelationship.strength as 1 | 2 | 3 | 4 | 5,
      ...(newRelationship.description && {
        description: newRelationship.description,
      }),
      ...(newRelationship.notes && { notes: newRelationship.notes }),
    }

    onChange([...relationships, relationship])
    setIsAdding(false)
    setSearchTerm('')
    setNewRelationship({
      type: 'friend',
      strength: 3,
      isSecret: false,
      description: '',
      notes: '',
    })
  }

  const handleUpdateRelationship = (
    index: number,
    updates: Partial<NPCRelationship>
  ) => {
    const updated = [...relationships]
    updated[index] = { ...updated[index], ...updates } as NPCRelationship
    onChange(updated)
  }

  const handleRemoveRelationship = (index: number) => {
    onChange(relationships.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Relaciones con NPCs
          </Label>
          <p className="text-xs text-muted-foreground">
            Relaciones personales, familiares y profesionales
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
      </div>

      {relationships.length > 0 && (
        <div className="space-y-2">
          {relationships.map((relationship, index) => {
            const typeInfo = RELATIONSHIP_TYPES.find(
              t => t.value === relationship.relationshipType
            )
            return (
              <Card key={relationship.id} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {relationship.npcName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {typeInfo?.label}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getRelationshipStrength(relationship.strength)}
                      </Badge>
                      {relationship.isSecret && (
                        <Badge variant="destructive" className="text-xs">
                          Secreto
                        </Badge>
                      )}
                    </div>
                    {relationship.description && (
                      <p className="text-sm text-muted-foreground">
                        {relationship.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRelationship(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {isAdding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Nueva Relación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Tipo de Relación</Label>
                <Select
                  value={newRelationship.type}
                  onValueChange={value =>
                    setNewRelationship(prev => ({
                      ...prev,
                      type: value as RelationshipType,
                    }))
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Fuerza (1-5)</Label>
                <Select
                  value={newRelationship.strength.toString()}
                  onValueChange={value =>
                    setNewRelationship(prev => ({
                      ...prev,
                      strength: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(strength => (
                      <SelectItem key={strength} value={strength.toString()}>
                        {strength} - {getRelationshipStrength(strength)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Descripción</Label>
              <Input
                value={newRelationship.description}
                onChange={e =>
                  setNewRelationship(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe la relación..."
                className="h-8 text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSecret"
                checked={newRelationship.isSecret}
                onCheckedChange={checked =>
                  setNewRelationship(prev => ({ ...prev, isSecret: !!checked }))
                }
              />
              <Label htmlFor="isSecret" className="text-xs">
                Relación secreta
              </Label>
            </div>

            <Separator />

            <div>
              <Label className="text-xs">Buscar NPC</Label>
              <Input
                placeholder="Buscar NPCs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-8 text-sm mb-2"
              />
              <div className="max-h-32 overflow-y-auto space-y-1">
                {availableNPCs.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No se encontraron NPCs disponibles
                  </p>
                ) : (
                  availableNPCs.map(npc => (
                    <Button
                      key={npc.id}
                      variant="ghost"
                      className="w-full justify-start text-sm h-auto p-2"
                      onClick={() => handleAddRelationship(npc.id, npc.name)}
                    >
                      {npc.name}
                    </Button>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Component for managing location relationships
const LocationRelationsSection: React.FC<{
  relations: NPCLocationRelation[]
  onChange: (relations: NPCLocationRelation[]) => void
}> = ({ relations, onChange }) => {
  const { locations } = useSessionStore()
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newRelation, setNewRelation] = useState({
    type: 'lives_in' as LocationRelationType,
    importance: 'primary' as 'primary' | 'secondary' | 'minor',
    isSecret: false,
    description: '',
  })

  const availableLocations = locations.filter(
    location =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !relations.some(rel => rel.locationId === location.id)
  )

  const handleAddRelation = (locationId: string, locationName: string) => {
    const relation: NPCLocationRelation = {
      id: crypto.randomUUID(),
      locationId,
      locationName,
      relationType: newRelation.type,
      isSecret: newRelation.isSecret,
      importance: newRelation.importance,
      ...(newRelation.description && { description: newRelation.description }),
    }

    onChange([...relations, relation])
    setIsAdding(false)
    setSearchTerm('')
    setNewRelation({
      type: 'lives_in',
      importance: 'primary',
      isSecret: false,
      description: '',
    })
  }

  const handleRemoveRelation = (index: number) => {
    onChange(relations.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Relaciones con Ubicaciones
          </Label>
          <p className="text-xs text-muted-foreground">
            Lugares donde vive, trabaja, frecuenta, etc.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
      </div>

      {relations.length > 0 && (
        <div className="space-y-2">
          {relations.map((relation, index) => {
            const typeInfo = LOCATION_RELATION_TYPES.find(
              t => t.value === relation.relationType
            )
            return (
              <Card key={relation.id} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{typeInfo?.icon}</span>
                      <span className="font-medium">
                        {relation.locationName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {typeInfo?.label}
                      </Badge>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {relation.importance}
                      </Badge>
                      {relation.isSecret && (
                        <Badge variant="destructive" className="text-xs">
                          Secreto
                        </Badge>
                      )}
                    </div>
                    {relation.description && (
                      <p className="text-sm text-muted-foreground">
                        {relation.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRelation(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {isAdding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Nueva Ubicación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Tipo de Relación</Label>
                <Select
                  value={newRelation.type}
                  onValueChange={value =>
                    setNewRelation(prev => ({
                      ...prev,
                      type: value as LocationRelationType,
                    }))
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_RELATION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Importancia</Label>
                <Select
                  value={newRelation.importance}
                  onValueChange={value =>
                    setNewRelation(prev => ({
                      ...prev,
                      importance: value as any,
                    }))
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Principal</SelectItem>
                    <SelectItem value="secondary">Secundaria</SelectItem>
                    <SelectItem value="minor">Menor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Descripción</Label>
              <Input
                value={newRelation.description}
                onChange={e =>
                  setNewRelation(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe la relación con este lugar..."
                className="h-8 text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="locationSecret"
                checked={newRelation.isSecret}
                onCheckedChange={checked =>
                  setNewRelation(prev => ({ ...prev, isSecret: !!checked }))
                }
              />
              <Label htmlFor="locationSecret" className="text-xs">
                Relación secreta
              </Label>
            </div>

            <Separator />

            <div>
              <Label className="text-xs">Buscar Ubicación</Label>
              <Input
                placeholder="Buscar ubicaciones..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-8 text-sm mb-2"
              />
              <div className="max-h-32 overflow-y-auto space-y-1">
                {availableLocations.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No se encontraron ubicaciones disponibles
                  </p>
                ) : (
                  availableLocations.map(location => (
                    <Button
                      key={location.id}
                      variant="ghost"
                      className="w-full justify-start text-sm h-auto p-2"
                      onClick={() =>
                        handleAddRelation(location.id, location.name)
                      }
                    >
                      {location.name}
                    </Button>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Component for managing lore connections
const LoreConnectionsSection: React.FC<{
  connections: NPCLoreConnection[]
  onChange: (connections: NPCLoreConnection[]) => void
}> = ({ connections, onChange }) => {
  const { lore } = useSessionStore()
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newConnection, setNewConnection] = useState({
    type: 'knows_about' as any,
    isSecret: false,
    description: '',
  })

  const availableLore = lore.filter(
    loreItem =>
      loreItem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !connections.some(conn => conn.loreId === loreItem.id)
  )

  const handleAddConnection = (loreId: string, loreTitle: string) => {
    const connection: NPCLoreConnection = {
      id: crypto.randomUUID(),
      loreId,
      loreTitle,
      connectionType: newConnection.type,
      isSecret: newConnection.isSecret,
      ...(newConnection.description && {
        description: newConnection.description,
      }),
    }

    onChange([...connections, connection])
    setIsAdding(false)
    setSearchTerm('')
    setNewConnection({
      type: 'knows_about',
      isSecret: false,
      description: '',
    })
  }

  const handleRemoveConnection = (index: number) => {
    onChange(connections.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <Scroll className="h-4 w-4" />
            Conexiones con Lore
          </Label>
          <p className="text-xs text-muted-foreground">
            Historia y eventos relacionados con este NPC
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
      </div>

      {connections.length > 0 && (
        <div className="space-y-2">
          {connections.map((connection, index) => {
            const typeInfo = LORE_CONNECTION_TYPES.find(
              t => t.value === connection.connectionType
            )
            return (
              <Card key={connection.id} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{typeInfo?.icon}</span>
                      <span className="font-medium">
                        {connection.loreTitle}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {typeInfo?.label}
                      </Badge>
                      {connection.isSecret && (
                        <Badge variant="destructive" className="text-xs">
                          Secreto
                        </Badge>
                      )}
                    </div>
                    {connection.description && (
                      <p className="text-sm text-muted-foreground">
                        {connection.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveConnection(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {isAdding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Nueva Conexión de Lore</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Tipo de Conexión</Label>
              <Select
                value={newConnection.type}
                onValueChange={value =>
                  setNewConnection(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LORE_CONNECTION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Descripción</Label>
              <Input
                value={newConnection.description}
                onChange={e =>
                  setNewConnection(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe la conexión con este lore..."
                className="h-8 text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="loreSecret"
                checked={newConnection.isSecret}
                onCheckedChange={checked =>
                  setNewConnection(prev => ({ ...prev, isSecret: !!checked }))
                }
              />
              <Label htmlFor="loreSecret" className="text-xs">
                Conexión secreta
              </Label>
            </div>

            <Separator />

            <div>
              <Label className="text-xs">Buscar Lore</Label>
              <Input
                placeholder="Buscar entradas de lore..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-8 text-sm mb-2"
              />
              <div className="max-h-32 overflow-y-auto space-y-1">
                {availableLore.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No se encontraron entradas de lore disponibles
                  </p>
                ) : (
                  availableLore.map(loreItem => (
                    <Button
                      key={loreItem.id}
                      variant="ghost"
                      className="w-full justify-start text-sm h-auto p-2"
                      onClick={() =>
                        handleAddConnection(loreItem.id, loreItem.title)
                      }
                    >
                      {loreItem.title}
                    </Button>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Main component
export const NPCRelationshipManager: React.FC<NPCRelationshipManagerProps> = ({
  relationships,
  locationRelations,
  loreConnections,
  onRelationshipsChange,
  onLocationRelationsChange,
  onLoreConnectionsChange,
  currentNPCId,
}) => {
  const [activeTab, setActiveTab] = useState<'npcs' | 'locations' | 'lore'>(
    'npcs'
  )

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Relaciones y Conexiones</Label>
        <p className="text-sm text-muted-foreground">
          Gestiona las relaciones de este NPC con otros personajes, ubicaciones
          y eventos del mundo.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'npcs'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('npcs')}
        >
          <Users className="h-4 w-4 inline mr-2" />
          NPCs ({relationships.length})
        </button>
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'locations'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('locations')}
        >
          <MapPin className="h-4 w-4 inline mr-2" />
          Ubicaciones ({locationRelations.length})
        </button>
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'lore'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('lore')}
        >
          <Scroll className="h-4 w-4 inline mr-2" />
          Lore ({loreConnections.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'npcs' && (
          <NPCRelationshipsSection
            relationships={relationships}
            onChange={onRelationshipsChange}
            currentNPCId={currentNPCId}
          />
        )}
        {activeTab === 'locations' && (
          <LocationRelationsSection
            relations={locationRelations}
            onChange={onLocationRelationsChange}
          />
        )}
        {activeTab === 'lore' && (
          <LoreConnectionsSection
            connections={loreConnections}
            onChange={onLoreConnectionsChange}
          />
        )}
      </div>
    </div>
  )
}

export default NPCRelationshipManager
