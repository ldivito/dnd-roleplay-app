'use client'

import React, { useState, useMemo } from 'react'
import {
  Plus,
  Filter,
  Search,
  Users,
  Crown,
  Building,
  Shield,
  X,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
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
import {
  Faction,
  FactionType,
  FactionStatus,
  FactionInfluence,
  FactionSize,
  FACTION_TYPES,
  FACTION_STATUSES,
  FACTION_INFLUENCES,
  FACTION_SIZES,
  getActiveFactions,
  getFactionsByStatus,
  getFactionsByType,
  getFactionsByInfluence,
  sortFactionsByPower,
  calculateFactionPower,
  RESOURCE_TYPES,
  RELATIONSHIP_TYPES,
} from '@/types/faction'
import { FactionForm } from '@/components/FactionForm'
import { FactionCard } from '@/components/FactionCard'
import AppLayout from '@/components/AppLayout'
import { useSessionStore } from '@/stores/sessionStore'

export default function FactionsPage() {
  const { factions, addFaction, updateFaction, removeFaction } =
    useSessionStore()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<FactionType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<FactionStatus | 'all'>('all')
  const [influenceFilter, setInfluenceFilter] = useState<
    FactionInfluence | 'all'
  >('all')
  const [sizeFilter, setSizeFilter] = useState<FactionSize | 'all'>('all')

  // Filtered and sorted factions
  const filteredFactions = useMemo(() => {
    let filtered = factions.filter(faction => {
      const matchesSearch =
        faction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faction.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faction.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )

      const matchesType = typeFilter === 'all' || faction.type === typeFilter
      const matchesStatus =
        statusFilter === 'all' || faction.status === statusFilter
      const matchesInfluence =
        influenceFilter === 'all' || faction.influence === influenceFilter
      const matchesSize = sizeFilter === 'all' || faction.size === sizeFilter

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesInfluence &&
        matchesSize
      )
    })

    return sortFactionsByPower(filtered)
  }, [
    factions,
    searchTerm,
    typeFilter,
    statusFilter,
    influenceFilter,
    sizeFilter,
  ])

  // Stats
  const activeFactions = getActiveFactions(factions)
  const inactiveFactions = getFactionsByStatus(factions, 'inactive')
  const disbandedFactions = getFactionsByStatus(factions, 'disbanded')
  const hiddenFactions = getFactionsByStatus(factions, 'hidden')

  const handleCreateFaction = (factionData: Partial<Faction>) => {
    const newFaction: Faction = {
      id: crypto.randomUUID(),
      name: factionData.name || '',
      shortName: factionData.shortName,
      description: factionData.description || '',
      type: factionData.type || 'guild',
      size: factionData.size || 'small',
      influence: factionData.influence || 'local',
      status: factionData.status || 'active',
      territory: factionData.territory || [],
      ranks: factionData.ranks || [],
      totalMembers: factionData.totalMembers,
      goals: factionData.goals || [],
      motivations: factionData.motivations || [],
      methods: factionData.methods || [],
      secrets: factionData.secrets || [],
      resources: factionData.resources || [],
      relationships: factionData.relationships || [],
      connections: factionData.connections || [],
      isKnownToPlayers: factionData.isKnownToPlayers ?? true,
      rumors: factionData.rumors || [],
      tags: factionData.tags || [],
      plotHooks: factionData.plotHooks || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...factionData,
    } as Faction

    addFaction(newFaction)
    setIsCreateDialogOpen(false)
  }

  const handleUpdateFaction = (updatedFaction: Faction) => {
    updateFaction(updatedFaction.id, updatedFaction)
    setSelectedFaction(null)
  }

  const handleDeleteFaction = (factionId: string) => {
    removeFaction(factionId)
  }

  const handleEditFaction = (faction: Faction) => {
    setSelectedFaction(faction)
  }

  const handleViewDetails = (faction: Faction) => {
    setSelectedFaction(faction)
    setIsDetailsDialogOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setTypeFilter('all')
    setStatusFilter('all')
    setInfluenceFilter('all')
    setSizeFilter('all')
  }

  const getTotalPower = () => {
    return factions.reduce(
      (sum, faction) => sum + calculateFactionPower(faction),
      0
    )
  }

  const getMostPowerfulFaction = () => {
    if (factions.length === 0) return null
    return factions.reduce((most, faction) =>
      calculateFactionPower(faction) > calculateFactionPower(most)
        ? faction
        : most
    )
  }

  const mostPowerful = getMostPowerfulFaction()

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Grupos y Facciones
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona las organizaciones, gremios y facciones de tu campaña
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Facción
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Facción</DialogTitle>
              </DialogHeader>
              <FactionForm
                onSubmit={handleCreateFaction}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeFactions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactivas</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {inactiveFactions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Disueltas</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {disbandedFactions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Ocultas</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {hiddenFactions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {factions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Power Stats */}
        {mostPowerful && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Facción Más Poderosa
                  </p>
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span className="font-bold text-lg">
                      {mostPowerful.name}
                    </span>
                    <Badge variant="outline">
                      Poder: {Math.round(calculateFactionPower(mostPowerful))}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">
                    Poder Total del Reino
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(getTotalPower())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar facciones..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={typeFilter}
                  onValueChange={value =>
                    setTypeFilter(value as FactionType | 'all')
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Tipos</SelectItem>
                    {FACTION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter}
                  onValueChange={value =>
                    setStatusFilter(value as FactionStatus | 'all')
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Estados</SelectItem>
                    {FACTION_STATUSES.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={influenceFilter}
                  onValueChange={value =>
                    setInfluenceFilter(value as FactionInfluence | 'all')
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Influencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Influencias</SelectItem>
                    {FACTION_INFLUENCES.map(influence => (
                      <SelectItem key={influence.value} value={influence.value}>
                        {influence.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={sizeFilter}
                  onValueChange={value =>
                    setSizeFilter(value as FactionSize | 'all')
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Tamaños</SelectItem>
                    {FACTION_SIZES.map(size => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchTerm ||
                  typeFilter !== 'all' ||
                  statusFilter !== 'all' ||
                  influenceFilter !== 'all' ||
                  sizeFilter !== 'all') && (
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faction List */}
        <div className="space-y-4">
          {filteredFactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Users className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {factions.length === 0
                    ? 'No hay facciones creadas'
                    : 'No se encontraron facciones'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {factions.length === 0
                    ? 'Comienza creando tu primera facción para la campaña.'
                    : 'Prueba ajustando los filtros de búsqueda.'}
                </p>
                {factions.length === 0 && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primera Facción
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFactions.map(faction => (
                <FactionCard
                  key={faction.id}
                  faction={faction}
                  onEdit={handleEditFaction}
                  onDelete={handleDeleteFaction}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>

        {/* Edit Faction Dialog */}
        {selectedFaction && !isDetailsDialogOpen && (
          <Dialog open={true} onOpenChange={() => setSelectedFaction(null)}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Editar Facción: {selectedFaction.name}
                </DialogTitle>
              </DialogHeader>
              <FactionForm
                faction={selectedFaction}
                onSubmit={factionData => {
                  const updated = {
                    ...selectedFaction,
                    ...factionData,
                    updatedAt: new Date(),
                  }
                  handleUpdateFaction(updated)
                  setSelectedFaction(null)
                }}
                onCancel={() => setSelectedFaction(null)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Faction Details Dialog */}
        {selectedFaction && isDetailsDialogOpen && (
          <Dialog
            open={true}
            onOpenChange={() => {
              setIsDetailsDialogOpen(false)
              setSelectedFaction(null)
            }}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {selectedFaction.name}
                  {selectedFaction.shortName && (
                    <Badge variant="outline">{selectedFaction.shortName}</Badge>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Información Básica</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Tipo:</span>{' '}
                        {
                          FACTION_TYPES.find(
                            t => t.value === selectedFaction.type
                          )?.label
                        }
                      </div>
                      <div>
                        <span className="font-medium">Tamaño:</span>{' '}
                        {
                          FACTION_SIZES.find(
                            s => s.value === selectedFaction.size
                          )?.label
                        }
                      </div>
                      <div>
                        <span className="font-medium">Influencia:</span>{' '}
                        {
                          FACTION_INFLUENCES.find(
                            i => i.value === selectedFaction.influence
                          )?.label
                        }
                      </div>
                      <div>
                        <span className="font-medium">Estado:</span>{' '}
                        {
                          FACTION_STATUSES.find(
                            s => s.value === selectedFaction.status
                          )?.label
                        }
                      </div>
                      {selectedFaction.totalMembers && (
                        <div>
                          <span className="font-medium">Miembros:</span>{' '}
                          {selectedFaction.totalMembers}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Liderazgo</h3>
                    <div className="space-y-2 text-sm">
                      {selectedFaction.leader && (
                        <div>
                          <span className="font-medium">Líder:</span>{' '}
                          {selectedFaction.leader}
                        </div>
                      )}
                      {selectedFaction.secondInCommand && (
                        <div>
                          <span className="font-medium">Segundo:</span>{' '}
                          {selectedFaction.secondInCommand}
                        </div>
                      )}
                      {selectedFaction.headquarters && (
                        <div>
                          <span className="font-medium">Base:</span>{' '}
                          {selectedFaction.headquarters}
                        </div>
                      )}
                      {selectedFaction.foundedBy && (
                        <div>
                          <span className="font-medium">Fundador:</span>{' '}
                          {selectedFaction.foundedBy}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-medium mb-2">Descripción</h3>
                  <p className="text-sm text-gray-600">
                    {selectedFaction.description}
                  </p>
                </div>

                {/* Goals */}
                {selectedFaction.goals && selectedFaction.goals.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Objetivos</h3>
                    <div className="space-y-2">
                      {selectedFaction.goals.map(goal => (
                        <div key={goal.id} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{goal.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{goal.priority}</Badge>
                              <Badge variant="secondary">{goal.status}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {goal.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs">
                              Progreso: {goal.progress}%
                            </span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${goal.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {selectedFaction.resources &&
                  selectedFaction.resources.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Recursos</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedFaction.resources.map(resource => (
                          <div key={resource.id} className="border rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm">
                                {resource.name}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {
                                  RESOURCE_TYPES.find(
                                    r => r.value === resource.type
                                  )?.label
                                }
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              {resource.description}
                            </p>
                            {resource.amount && (
                              <p className="text-xs mt-1">
                                Cantidad: {resource.amount}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Relationships */}
                {selectedFaction.relationships &&
                  selectedFaction.relationships.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Relaciones</h3>
                      <div className="space-y-2">
                        {selectedFaction.relationships.map(rel => (
                          <div
                            key={rel.id}
                            className="flex items-center justify-between border rounded p-2"
                          >
                            <div>
                              <span className="font-medium">
                                {rel.factionName}
                              </span>
                              {rel.description && (
                                <p className="text-sm text-gray-600">
                                  {rel.description}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline">
                              {
                                RELATIONSHIP_TYPES.find(
                                  r => r.value === rel.relationshipType
                                )?.label
                              }
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedFaction.motivations &&
                    selectedFaction.motivations.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Motivaciones</h3>
                        <ul className="text-sm space-y-1">
                          {selectedFaction.motivations.map(
                            (motivation, index) => (
                              <li key={index} className="text-gray-600">
                                • {motivation}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {selectedFaction.methods &&
                    selectedFaction.methods.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Métodos</h3>
                        <ul className="text-sm space-y-1">
                          {selectedFaction.methods.map((method, index) => (
                            <li key={index} className="text-gray-600">
                              • {method}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                {/* Secrets and Rumors */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedFaction.secrets &&
                    selectedFaction.secrets.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2 text-red-600">
                          Secretos (Solo DM)
                        </h3>
                        <ul className="text-sm space-y-1">
                          {selectedFaction.secrets.map((secret, index) => (
                            <li key={index} className="text-red-600">
                              • {secret}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {selectedFaction.rumors &&
                    selectedFaction.rumors.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Rumores</h3>
                        <ul className="text-sm space-y-1">
                          {selectedFaction.rumors.map((rumor, index) => (
                            <li key={index} className="text-gray-600">
                              • {rumor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                {/* Plot Hooks */}
                {selectedFaction.plotHooks &&
                  selectedFaction.plotHooks.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Ganchos de Trama</h3>
                      <ul className="text-sm space-y-1">
                        {selectedFaction.plotHooks.map((hook, index) => (
                          <li key={index} className="text-gray-600">
                            • {hook}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailsDialogOpen(false)
                      handleEditFaction(selectedFaction)
                    }}
                  >
                    Editar Facción
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailsDialogOpen(false)
                      setSelectedFaction(null)
                    }}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  )
}
