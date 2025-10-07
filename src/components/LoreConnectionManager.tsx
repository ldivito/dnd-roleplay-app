'use client'

import React, { useState } from 'react'
import { Plus, X, Search, Link } from 'lucide-react'
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
import { useSessionStore } from '@/stores/sessionStore'
import type { LoreConnection, ConnectionType } from '@/types/lore'
import { RELATIONSHIP_TYPES, getRelationshipTypeInfo } from '@/types/lore'

interface LoreConnectionManagerProps {
  connections: LoreConnection[]
  onChange: (connections: LoreConnection[]) => void
}

interface EntitySelectorProps {
  type: ConnectionType
  onSelect: (entityId: string, entityName: string) => void
}

const EntitySelector: React.FC<EntitySelectorProps> = ({ type, onSelect }) => {
  const { characters, items, songs, locations, lore } = useSessionStore()
  const [searchTerm, setSearchTerm] = useState('')

  const getEntities = () => {
    switch (type) {
      case 'character':
        return characters.map(c => ({ id: c.id, name: c.name }))
      case 'item':
        return items.map(i => ({ id: i.id, name: i.name }))
      case 'spell':
        return songs.map(s => ({ id: s.id, name: s.name }))
      case 'location':
        return locations.map(l => ({ id: l.id, name: l.name }))
      case 'lore':
        return lore.map(l => ({ id: l.id, name: l.title }))
      default:
        return []
    }
  }

  const entities = getEntities().filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-2">
      <Input
        placeholder={`Buscar ${type}...`}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="text-sm"
      />
      <div className="max-h-40 overflow-y-auto space-y-1">
        {entities.length === 0 ? (
          <p className="text-sm text-muted-foreground p-2">
            No se encontraron entidades
          </p>
        ) : (
          entities.map(entity => (
            <Button
              key={entity.id}
              variant="ghost"
              className="w-full justify-start text-sm h-auto p-2"
              onClick={() => onSelect(entity.id, entity.name)}
            >
              {entity.name}
            </Button>
          ))
        )}
      </div>
    </div>
  )
}

const ConnectionItem: React.FC<{
  connection: LoreConnection
  onUpdate: (connection: LoreConnection) => void
  onRemove: () => void
}> = ({ connection, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false)
  const relationshipInfo = getRelationshipTypeInfo(connection.relationshipType)

  const handleUpdate = (field: keyof LoreConnection, value: any) => {
    onUpdate({ ...connection, [field]: value })
  }

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Editando Conexión</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Guardar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRemove}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Tipo de Relación</Label>
              <Select
                value={connection.relationshipType}
                onValueChange={value => handleUpdate('relationshipType', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_TYPES.map(rel => (
                    <SelectItem key={rel.value} value={rel.value}>
                      {rel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Entidad</Label>
              <Input
                value={connection.entityName}
                onChange={e => handleUpdate('entityName', e.target.value)}
                className="h-8 text-sm"
                disabled
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Descripción (opcional)</Label>
            <Textarea
              value={connection.description || ''}
              onChange={e => handleUpdate('description', e.target.value)}
              placeholder="Describe la relación..."
              rows={2}
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {connection.type}
          </Badge>
          <span className="font-medium text-sm">{connection.entityName}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {relationshipInfo?.label || connection.relationshipType}
          </Badge>
          {connection.description && (
            <span className="text-xs text-muted-foreground">
              {connection.description}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={e => {
          e.stopPropagation()
          onRemove()
        }}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

export const LoreConnectionManager: React.FC<LoreConnectionManagerProps> = ({
  connections,
  onChange,
}) => {
  const [isAddingConnection, setIsAddingConnection] = useState(false)
  const [newConnectionType, setNewConnectionType] =
    useState<ConnectionType>('character')
  const [newRelationshipType, setNewRelationshipType] = useState('mentions')
  const [newDescription, setNewDescription] = useState('')

  const handleAddConnection = (entityId: string, entityName: string) => {
    const newConnection: LoreConnection = {
      id: crypto.randomUUID(),
      type: newConnectionType,
      entityId,
      entityName,
      relationshipType: newRelationshipType as any,
      ...(newDescription && { description: newDescription }),
    }

    onChange([...connections, newConnection])
    setIsAddingConnection(false)
    setNewDescription('')
  }

  const handleUpdateConnection = (
    index: number,
    updatedConnection: LoreConnection
  ) => {
    const newConnections = [...connections]
    newConnections[index] = updatedConnection
    onChange(newConnections)
  }

  const handleRemoveConnection = (index: number) => {
    onChange(connections.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Conexiones</Label>
          <p className="text-xs text-muted-foreground">
            Vincula este lore con personajes, objetos, hechizos, ubicaciones u
            otro lore
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingConnection(true)}
          disabled={isAddingConnection}
        >
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
      </div>

      {connections.length > 0 && (
        <div className="space-y-2">
          {connections.map((connection, index) => (
            <ConnectionItem
              key={connection.id}
              connection={connection}
              onUpdate={conn => handleUpdateConnection(index, conn)}
              onRemove={() => handleRemoveConnection(index)}
            />
          ))}
        </div>
      )}

      {isAddingConnection && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Link className="h-4 w-4" />
              Nueva Conexión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Tipo de Entidad</Label>
                <Select
                  value={newConnectionType}
                  onValueChange={value =>
                    setNewConnectionType(value as ConnectionType)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="character">Personaje</SelectItem>
                    <SelectItem value="item">Objeto</SelectItem>
                    <SelectItem value="spell">Hechizo</SelectItem>
                    <SelectItem value="location">Ubicación</SelectItem>
                    <SelectItem value="lore">Lore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Tipo de Relación</Label>
                <Select
                  value={newRelationshipType}
                  onValueChange={setNewRelationshipType}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_TYPES.map(rel => (
                      <SelectItem key={rel.value} value={rel.value}>
                        {rel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Descripción (opcional)</Label>
              <Input
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Describe la relación..."
                className="h-8 text-sm"
              />
            </div>

            <Separator />

            <div>
              <Label className="text-xs">Seleccionar Entidad</Label>
              <EntitySelector
                type={newConnectionType}
                onSelect={handleAddConnection}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingConnection(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {connections.length === 0 && !isAddingConnection && (
        <div className="text-center py-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <Link className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No hay conexiones agregadas
          </p>
        </div>
      )}
    </div>
  )
}

export default LoreConnectionManager
