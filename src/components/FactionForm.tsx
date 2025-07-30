'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Trash2,
  Save,
  X,
  Search,
  Users,
  Target,
  Crown,
  MapPin,
} from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  Faction,
  FactionGoal,
  FactionResource,
  FactionRelationship,
  FactionConnection,
  FactionRank,
  FACTION_TYPES,
  FACTION_SIZES,
  FACTION_INFLUENCES,
  FACTION_ALIGNMENTS,
  FACTION_STATUSES,
  RELATIONSHIP_TYPES,
  RESOURCE_TYPES,
  GOAL_PRIORITIES,
  GOAL_STATUSES,
  CONNECTION_RELATIONSHIP_TYPES,
} from '@/types/faction'

interface FactionFormProps {
  faction?: Faction
  onSubmit: (factionData: Partial<Faction>) => void
  onCancel: () => void
}

export function FactionForm({ faction, onSubmit, onCancel }: FactionFormProps) {
  // Form state
  const [formData, setFormData] = useState<Partial<Faction>>({
    name: '',
    shortName: '',
    description: '',
    type: 'guild',
    size: 'small',
    influence: 'local',
    status: 'active',
    territory: [],
    ranks: [],
    totalMembers: 0,
    goals: [],
    motivations: [],
    methods: [],
    secrets: [],
    resources: [],
    relationships: [],
    connections: [],
    isKnownToPlayers: true,
    rumors: [],
    tags: [],
    plotHooks: [],
    ...faction,
  })

  const [newTag, setNewTag] = useState('')
  const [newMotivation, setNewMotivation] = useState('')
  const [newMethod, setNewMethod] = useState('')
  const [newSecret, setNewSecret] = useState('')
  const [newRumor, setNewRumor] = useState('')
  const [newPlotHook, setNewPlotHook] = useState('')
  const [selectedTab, setSelectedTab] = useState('basic')

  // Dialog states
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false)
  const [isRelationshipDialogOpen, setIsRelationshipDialogOpen] =
    useState(false)
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false)
  const [isRankDialogOpen, setIsRankDialogOpen] = useState(false)

  // Edit states
  const [editingGoal, setEditingGoal] = useState<FactionGoal | null>(null)
  const [editingResource, setEditingResource] =
    useState<FactionResource | null>(null)
  const [editingRelationship, setEditingRelationship] =
    useState<FactionRelationship | null>(null)
  const [editingConnection, setEditingConnection] =
    useState<FactionConnection | null>(null)
  const [editingRank, setEditingRank] = useState<FactionRank | null>(null)

  // Form states for dialogs
  const [goalForm, setGoalForm] = useState<Partial<FactionGoal>>({})
  const [resourceForm, setResourceForm] = useState<Partial<FactionResource>>({})
  const [relationshipForm, setRelationshipForm] = useState<
    Partial<FactionRelationship>
  >({})
  const [connectionForm, setConnectionForm] = useState<
    Partial<FactionConnection>
  >({})
  const [rankForm, setRankForm] = useState<Partial<FactionRank>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateFormData = (updates: Partial<Faction>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  // Array field helpers
  const addToArray = (field: keyof Faction, value: string) => {
    if (value.trim()) {
      updateFormData({
        [field]: [...((formData[field] as string[]) || []), value.trim()],
      })
    }
  }

  const removeFromArray = (field: keyof Faction, index: number) => {
    const array = formData[field] as string[]
    updateFormData({
      [field]: array.filter((_, i) => i !== index),
    })
  }

  // Goal management
  const openGoalDialog = (goal?: FactionGoal) => {
    if (goal) {
      setEditingGoal(goal)
      setGoalForm(goal)
    } else {
      setEditingGoal(null)
      setGoalForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'planning',
        progress: 0,
      })
    }
    setIsGoalDialogOpen(true)
  }

  const saveGoal = () => {
    if (!goalForm.title || !goalForm.description) return

    const newGoal: FactionGoal = {
      id: editingGoal?.id || crypto.randomUUID(),
      title: goalForm.title!,
      description: goalForm.description!,
      priority: goalForm.priority || 'medium',
      status: goalForm.status || 'planning',
      progress: goalForm.progress || 0,
      ...(goalForm.deadline && { deadline: goalForm.deadline }),
    }

    const updatedGoals = editingGoal
      ? formData.goals?.map(g => (g.id === editingGoal.id ? newGoal : g)) || []
      : [...(formData.goals || []), newGoal]

    updateFormData({ goals: updatedGoals })
    setIsGoalDialogOpen(false)
    setEditingGoal(null)
    setGoalForm({})
  }

  const deleteGoal = (goalId: string) => {
    updateFormData({
      goals: formData.goals?.filter(g => g.id !== goalId) || [],
    })
  }

  // Resource management
  const openResourceDialog = (resource?: FactionResource) => {
    if (resource) {
      setEditingResource(resource)
      setResourceForm(resource)
    } else {
      setEditingResource(null)
      setResourceForm({
        type: 'wealth',
        name: '',
        description: '',
      })
    }
    setIsResourceDialogOpen(true)
  }

  const saveResource = () => {
    if (!resourceForm.name || !resourceForm.description) return

    const newResource: FactionResource = {
      id: editingResource?.id || crypto.randomUUID(),
      type: resourceForm.type || 'wealth',
      name: resourceForm.name!,
      description: resourceForm.description!,
      ...(resourceForm.amount && { amount: resourceForm.amount }),
      ...(resourceForm.quality && { quality: resourceForm.quality }),
    }

    const updatedResources = editingResource
      ? formData.resources?.map(r =>
          r.id === editingResource.id ? newResource : r
        ) || []
      : [...(formData.resources || []), newResource]

    updateFormData({ resources: updatedResources })
    setIsResourceDialogOpen(false)
    setEditingResource(null)
    setResourceForm({})
  }

  const deleteResource = (resourceId: string) => {
    updateFormData({
      resources: formData.resources?.filter(r => r.id !== resourceId) || [],
    })
  }

  // Relationship management
  const openRelationshipDialog = (relationship?: FactionRelationship) => {
    if (relationship) {
      setEditingRelationship(relationship)
      setRelationshipForm(relationship)
    } else {
      setEditingRelationship(null)
      setRelationshipForm({
        factionName: '',
        relationshipType: 'neutral',
        isPublic: true,
        lastUpdated: new Date(),
      })
    }
    setIsRelationshipDialogOpen(true)
  }

  const saveRelationship = () => {
    if (!relationshipForm.factionName || !relationshipForm.factionId) return

    const newRelationship: FactionRelationship = {
      id: editingRelationship?.id || crypto.randomUUID(),
      factionId: relationshipForm.factionId!,
      factionName: relationshipForm.factionName!,
      relationshipType: relationshipForm.relationshipType || 'neutral',
      isPublic: relationshipForm.isPublic ?? true,
      lastUpdated: relationshipForm.lastUpdated || new Date(),
      ...(relationshipForm.description && {
        description: relationshipForm.description,
      }),
      ...(relationshipForm.history && { history: relationshipForm.history }),
    }

    const updatedRelationships = editingRelationship
      ? formData.relationships?.map(r =>
          r.id === editingRelationship.id ? newRelationship : r
        ) || []
      : [...(formData.relationships || []), newRelationship]

    updateFormData({ relationships: updatedRelationships })
    setIsRelationshipDialogOpen(false)
    setEditingRelationship(null)
    setRelationshipForm({})
  }

  const deleteRelationship = (relationshipId: string) => {
    updateFormData({
      relationships:
        formData.relationships?.filter(r => r.id !== relationshipId) || [],
    })
  }

  // Connection management
  const openConnectionDialog = (connection?: FactionConnection) => {
    if (connection) {
      setEditingConnection(connection)
      setConnectionForm(connection)
    } else {
      setEditingConnection(null)
      setConnectionForm({
        type: 'npc',
        entityName: '',
        relationshipType: 'member',
        importance: 'significant',
      })
    }
    setIsConnectionDialogOpen(true)
  }

  const saveConnection = () => {
    if (!connectionForm.entityName || !connectionForm.entityId) return

    const newConnection: FactionConnection = {
      id: editingConnection?.id || crypto.randomUUID(),
      type: connectionForm.type || 'npc',
      entityId: connectionForm.entityId!,
      entityName: connectionForm.entityName!,
      relationshipType: connectionForm.relationshipType || 'member',
      importance: connectionForm.importance || 'significant',
      ...(connectionForm.description && {
        description: connectionForm.description,
      }),
    }

    const updatedConnections = editingConnection
      ? formData.connections?.map(c =>
          c.id === editingConnection.id ? newConnection : c
        ) || []
      : [...(formData.connections || []), newConnection]

    updateFormData({ connections: updatedConnections })
    setIsConnectionDialogOpen(false)
    setEditingConnection(null)
    setConnectionForm({})
  }

  const deleteConnection = (connectionId: string) => {
    updateFormData({
      connections:
        formData.connections?.filter(c => c.id !== connectionId) || [],
    })
  }

  // Rank management
  const openRankDialog = (rank?: FactionRank) => {
    if (rank) {
      setEditingRank(rank)
      setRankForm(rank)
    } else {
      setEditingRank(null)
      setRankForm({
        name: '',
        level: 1,
        description: '',
        permissions: [],
      })
    }
    setIsRankDialogOpen(true)
  }

  const saveRank = () => {
    if (!rankForm.name || !rankForm.description) return

    const newRank: FactionRank = {
      id: editingRank?.id || crypto.randomUUID(),
      name: rankForm.name!,
      level: rankForm.level || 1,
      description: rankForm.description!,
      permissions: rankForm.permissions || [],
      ...(rankForm.requirements && { requirements: rankForm.requirements }),
    }

    const updatedRanks = editingRank
      ? formData.ranks?.map(r => (r.id === editingRank.id ? newRank : r)) || []
      : [...(formData.ranks || []), newRank]

    updateFormData({ ranks: updatedRanks.sort((a, b) => a.level - b.level) })
    setIsRankDialogOpen(false)
    setEditingRank(null)
    setRankForm({})
  }

  const deleteRank = (rankId: string) => {
    updateFormData({
      ranks: formData.ranks?.filter(r => r.id !== rankId) || [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="organization">Organización</TabsTrigger>
          <TabsTrigger value="goals">
            Objetivos ({formData.goals?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="resources">
            Recursos ({formData.resources?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="relations">
            Relaciones ({formData.relationships?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="connections">
            Conexiones ({formData.connections?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={e => updateFormData({ name: e.target.value })}
                placeholder="Nombre de la facción"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortName">Nombre Corto</Label>
              <Input
                id="shortName"
                value={formData.shortName || ''}
                onChange={e => updateFormData({ shortName: e.target.value })}
                placeholder="Acrónimo o nombre corto"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={e => updateFormData({ description: e.target.value })}
              placeholder="Descripción detallada de la facción"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.type || 'guild'}
                onValueChange={value => updateFormData({ type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FACTION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tamaño</Label>
              <Select
                value={formData.size || 'small'}
                onValueChange={value => updateFormData({ size: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FACTION_SIZES.map(size => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label} ({size.memberRange})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Influencia</Label>
              <Select
                value={formData.influence || 'local'}
                onValueChange={value =>
                  updateFormData({ influence: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FACTION_INFLUENCES.map(influence => (
                    <SelectItem key={influence.value} value={influence.value}>
                      {influence.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={formData.status || 'active'}
                onValueChange={value =>
                  updateFormData({ status: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FACTION_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Alineamiento</Label>
              <Select
                value={formData.alignment || ''}
                onValueChange={value =>
                  updateFormData({ alignment: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar alineamiento" />
                </SelectTrigger>
                <SelectContent>
                  {FACTION_ALIGNMENTS.map(alignment => (
                    <SelectItem key={alignment.value} value={alignment.value}>
                      {alignment.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMembers">Número Total de Miembros</Label>
              <Input
                id="totalMembers"
                type="number"
                value={formData.totalMembers || ''}
                onChange={e =>
                  updateFormData({
                    totalMembers: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Etiquetas</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-600"
                      onClick={() => removeFromArray('tags', index)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="Nueva etiqueta"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addToArray('tags', newTag)
                      setNewTag('')
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addToArray('tags', newTag)
                    setNewTag('')
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isKnownToPlayers"
                checked={formData.isKnownToPlayers ?? true}
                onCheckedChange={checked =>
                  updateFormData({ isKnownToPlayers: checked as boolean })
                }
              />
              <Label htmlFor="isKnownToPlayers">
                Conocida por los jugadores
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publicReputation">Reputación Pública</Label>
              <Textarea
                id="publicReputation"
                value={formData.publicReputation || ''}
                onChange={e =>
                  updateFormData({ publicReputation: e.target.value })
                }
                placeholder="Cómo es vista públicamente la facción"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dmNotes">Notas del DM</Label>
              <Textarea
                id="dmNotes"
                value={formData.dmNotes || ''}
                onChange={e => updateFormData({ dmNotes: e.target.value })}
                placeholder="Notas privadas del Dungeon Master"
                rows={3}
              />
            </div>
          </div>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leader">Líder</Label>
              <Input
                id="leader"
                value={formData.leader || ''}
                onChange={e => updateFormData({ leader: e.target.value })}
                placeholder="Nombre del líder"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondInCommand">Segundo al Mando</Label>
              <Input
                id="secondInCommand"
                value={formData.secondInCommand || ''}
                onChange={e =>
                  updateFormData({ secondInCommand: e.target.value })
                }
                placeholder="Nombre del segundo al mando"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headquarters">Cuartel General</Label>
              <Input
                id="headquarters"
                value={formData.headquarters || ''}
                onChange={e => updateFormData({ headquarters: e.target.value })}
                placeholder="Ubicación del cuartel general"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedBy">Fundado Por</Label>
              <Input
                id="foundedBy"
                value={formData.foundedBy || ''}
                onChange={e => updateFormData({ foundedBy: e.target.value })}
                placeholder="Quién fundó la facción"
              />
            </div>
          </div>

          {/* Ranks Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Rangos y Jerarquía
              </h3>
              <Button type="button" onClick={() => openRankDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Rango
              </Button>
            </div>

            <div className="space-y-2">
              {formData.ranks?.map(rank => (
                <Card key={rank.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Nivel {rank.level}</Badge>
                          <h4 className="font-medium">{rank.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {rank.description}
                        </p>
                        {rank.permissions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {rank.permissions.map((permission, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openRankDialog(rank)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRank(rank.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!formData.ranks || formData.ranks.length === 0) && (
                <div className="text-center text-gray-500 py-8">
                  No hay rangos configurados.
                </div>
              )}
            </div>
          </div>

          {/* Motivations, Methods, Secrets, etc. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Motivations */}
            <div className="space-y-4">
              <Label>Motivaciones</Label>
              <div className="space-y-2">
                {formData.motivations?.map((motivation, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{motivation}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromArray('motivations', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newMotivation}
                    onChange={e => setNewMotivation(e.target.value)}
                    placeholder="Nueva motivación"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addToArray('motivations', newMotivation)
                        setNewMotivation('')
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addToArray('motivations', newMotivation)
                      setNewMotivation('')
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Methods */}
            <div className="space-y-4">
              <Label>Métodos de Operación</Label>
              <div className="space-y-2">
                {formData.methods?.map((method, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{method}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromArray('methods', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newMethod}
                    onChange={e => setNewMethod(e.target.value)}
                    placeholder="Nuevo método"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addToArray('methods', newMethod)
                        setNewMethod('')
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addToArray('methods', newMethod)
                      setNewMethod('')
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Secrets */}
            <div className="space-y-4">
              <Label>Secretos</Label>
              <div className="space-y-2">
                {formData.secrets?.map((secret, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{secret}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromArray('secrets', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newSecret}
                    onChange={e => setNewSecret(e.target.value)}
                    placeholder="Nuevo secreto"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addToArray('secrets', newSecret)
                        setNewSecret('')
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addToArray('secrets', newSecret)
                      setNewSecret('')
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Rumors */}
            <div className="space-y-4">
              <Label>Rumores</Label>
              <div className="space-y-2">
                {formData.rumors?.map((rumor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{rumor}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromArray('rumors', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newRumor}
                    onChange={e => setNewRumor(e.target.value)}
                    placeholder="Nuevo rumor"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addToArray('rumors', newRumor)
                        setNewRumor('')
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addToArray('rumors', newRumor)
                      setNewRumor('')
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Plot Hooks */}
          <div className="space-y-4">
            <Label>Ganchos de Trama</Label>
            <div className="space-y-2">
              {formData.plotHooks?.map((hook, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm">{hook}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromArray('plotHooks', index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newPlotHook}
                  onChange={e => setNewPlotHook(e.target.value)}
                  placeholder="Nuevo gancho de trama"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addToArray('plotHooks', newPlotHook)
                      setNewPlotHook('')
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addToArray('plotHooks', newPlotHook)
                    setNewPlotHook('')
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Target className="w-5 h-5" />
              Objetivos de la Facción
            </h3>
            <Button type="button" onClick={() => openGoalDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Objetivo
            </Button>
          </div>

          <div className="space-y-2">
            {formData.goals?.map(goal => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {
                            GOAL_PRIORITIES.find(p => p.value === goal.priority)
                              ?.label
                          }
                        </Badge>
                        <Badge variant="secondary">
                          {
                            GOAL_STATUSES.find(s => s.value === goal.status)
                              ?.label
                          }
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{goal.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {goal.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progreso</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      {goal.deadline && (
                        <p className="text-xs text-gray-500 mt-2">
                          Fecha límite: {goal.deadline.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openGoalDialog(goal)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!formData.goals || formData.goals.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                No hay objetivos configurados.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recursos y Assets</h3>
            <Button type="button" onClick={() => openResourceDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Recurso
            </Button>
          </div>

          {/* Power Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="wealth">Riqueza (1-10)</Label>
              <Input
                id="wealth"
                type="number"
                value={formData.wealth || ''}
                onChange={e =>
                  updateFormData({ wealth: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
                min="0"
                max="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="militaryStrength">Fuerza Militar (1-10)</Label>
              <Input
                id="militaryStrength"
                type="number"
                value={formData.militaryStrength || ''}
                onChange={e =>
                  updateFormData({
                    militaryStrength: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                min="0"
                max="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="politicalPower">Poder Político (1-10)</Label>
              <Input
                id="politicalPower"
                type="number"
                value={formData.politicalPower || ''}
                onChange={e =>
                  updateFormData({
                    politicalPower: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                min="0"
                max="10"
              />
            </div>
          </div>

          <div className="space-y-2">
            {formData.resources?.map(resource => (
              <Card key={resource.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {
                            RESOURCE_TYPES.find(r => r.value === resource.type)
                              ?.label
                          }
                        </Badge>
                        {resource.quality && (
                          <Badge variant="secondary">{resource.quality}</Badge>
                        )}
                      </div>
                      <h4 className="font-medium mb-1">{resource.name}</h4>
                      <p className="text-sm text-gray-600">
                        {resource.description}
                      </p>
                      {resource.amount && (
                        <p className="text-sm text-gray-500 mt-1">
                          Cantidad: {resource.amount}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openResourceDialog(resource)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteResource(resource.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!formData.resources || formData.resources.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                No hay recursos configurados.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Relations Tab */}
        <TabsContent value="relations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Relaciones con otras Facciones
            </h3>
            <Button type="button" onClick={() => openRelationshipDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Relación
            </Button>
          </div>

          <div className="space-y-2">
            {formData.relationships?.map(relationship => (
              <Card key={relationship.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {
                            RELATIONSHIP_TYPES.find(
                              r => r.value === relationship.relationshipType
                            )?.label
                          }
                        </Badge>
                        {!relationship.isPublic && (
                          <Badge variant="secondary">Secreto</Badge>
                        )}
                      </div>
                      <h4 className="font-medium mb-1">
                        {relationship.factionName}
                      </h4>
                      {relationship.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {relationship.description}
                        </p>
                      )}
                      {relationship.history && (
                        <p className="text-sm text-gray-500">
                          Historia: {relationship.history}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Actualizado:{' '}
                        {relationship.lastUpdated.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openRelationshipDialog(relationship)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRelationship(relationship.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!formData.relationships ||
              formData.relationships.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                No hay relaciones configuradas.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Conexiones con otros Sistemas
            </h3>
            <Button type="button" onClick={() => openConnectionDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Conexión
            </Button>
          </div>

          <div className="space-y-2">
            {formData.connections?.map(connection => (
              <Card key={connection.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {connection.type.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary">
                          {
                            CONNECTION_RELATIONSHIP_TYPES.find(
                              c => c.value === connection.relationshipType
                            )?.label
                          }
                        </Badge>
                        <Badge variant="outline">{connection.importance}</Badge>
                      </div>
                      <h4 className="font-medium mb-1">
                        {connection.entityName}
                      </h4>
                      {connection.description && (
                        <p className="text-sm text-gray-600">
                          {connection.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openConnectionDialog(connection)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteConnection(connection.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!formData.connections || formData.connections.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                No hay conexiones configuradas.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          {faction ? 'Actualizar' : 'Crear'} Facción
        </Button>
      </div>

      {/* Goal Dialog */}
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Editar Objetivo' : 'Nuevo Objetivo'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                value={goalForm.title || ''}
                onChange={e =>
                  setGoalForm(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder="Título del objetivo"
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción *</Label>
              <Textarea
                value={goalForm.description || ''}
                onChange={e =>
                  setGoalForm(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descripción del objetivo"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select
                  value={goalForm.priority || 'medium'}
                  onValueChange={value =>
                    setGoalForm(prev => ({ ...prev, priority: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_PRIORITIES.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={goalForm.status || 'planning'}
                  onValueChange={value =>
                    setGoalForm(prev => ({ ...prev, status: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_STATUSES.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Progreso (%)</Label>
                <Input
                  type="number"
                  value={goalForm.progress || 0}
                  onChange={e =>
                    setGoalForm(prev => ({
                      ...prev,
                      progress: parseInt(e.target.value) || 0,
                    }))
                  }
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha Límite</Label>
                <Input
                  type="date"
                  value={
                    goalForm.deadline
                      ? goalForm.deadline.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={e =>
                    setGoalForm(
                      prev =>
                        ({
                          ...prev,
                          deadline: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        }) as Partial<FactionGoal>
                    )
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGoalDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={saveGoal}>
                {editingGoal ? 'Actualizar' : 'Agregar'} Objetivo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog
        open={isResourceDialogOpen}
        onOpenChange={setIsResourceDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingResource ? 'Editar Recurso' : 'Nuevo Recurso'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select
                  value={resourceForm.type || 'wealth'}
                  onValueChange={value =>
                    setResourceForm(prev => ({ ...prev, type: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  value={resourceForm.name || ''}
                  onChange={e =>
                    setResourceForm(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nombre del recurso"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción *</Label>
              <Textarea
                value={resourceForm.description || ''}
                onChange={e =>
                  setResourceForm(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descripción del recurso"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  value={resourceForm.amount || ''}
                  onChange={e =>
                    setResourceForm(
                      prev =>
                        ({
                          ...prev,
                          amount: parseInt(e.target.value) || undefined,
                        }) as Partial<FactionResource>
                    )
                  }
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Calidad</Label>
                <Select
                  value={resourceForm.quality || ''}
                  onValueChange={value =>
                    setResourceForm(prev => ({
                      ...prev,
                      quality: value as any,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar calidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Pobre</SelectItem>
                    <SelectItem value="average">Promedio</SelectItem>
                    <SelectItem value="good">Bueno</SelectItem>
                    <SelectItem value="excellent">Excelente</SelectItem>
                    <SelectItem value="legendary">Legendario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResourceDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={saveResource}>
                {editingResource ? 'Actualizar' : 'Agregar'} Recurso
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Relationship Dialog */}
      <Dialog
        open={isRelationshipDialogOpen}
        onOpenChange={setIsRelationshipDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRelationship ? 'Editar Relación' : 'Nueva Relación'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre de la Facción *</Label>
                <Input
                  value={relationshipForm.factionName || ''}
                  onChange={e =>
                    setRelationshipForm(prev => ({
                      ...prev,
                      factionName: e.target.value,
                    }))
                  }
                  placeholder="Nombre de la facción"
                />
              </div>

              <div className="space-y-2">
                <Label>ID de la Facción *</Label>
                <Input
                  value={relationshipForm.factionId || ''}
                  onChange={e =>
                    setRelationshipForm(prev => ({
                      ...prev,
                      factionId: e.target.value,
                    }))
                  }
                  placeholder="ID único de la facción"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Relación *</Label>
              <Select
                value={relationshipForm.relationshipType || 'neutral'}
                onValueChange={value =>
                  setRelationshipForm(prev => ({
                    ...prev,
                    relationshipType: value as any,
                  }))
                }
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={relationshipForm.description || ''}
                onChange={e =>
                  setRelationshipForm(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descripción de la relación"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Historia</Label>
              <Textarea
                value={relationshipForm.history || ''}
                onChange={e =>
                  setRelationshipForm(prev => ({
                    ...prev,
                    history: e.target.value,
                  }))
                }
                placeholder="Historia de la relación"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={relationshipForm.isPublic ?? true}
                onCheckedChange={checked =>
                  setRelationshipForm(prev => ({
                    ...prev,
                    isPublic: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="isPublic">Relación pública</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRelationshipDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={saveRelationship}>
                {editingRelationship ? 'Actualizar' : 'Agregar'} Relación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connection Dialog */}
      <Dialog
        open={isConnectionDialogOpen}
        onOpenChange={setIsConnectionDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingConnection ? 'Editar Conexión' : 'Nueva Conexión'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Entidad *</Label>
                <Select
                  value={connectionForm.type || 'npc'}
                  onValueChange={value =>
                    setConnectionForm(prev => ({ ...prev, type: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="npc">NPC</SelectItem>
                    <SelectItem value="location">Ubicación</SelectItem>
                    <SelectItem value="lore">Historia/Lore</SelectItem>
                    <SelectItem value="item">Objeto</SelectItem>
                    <SelectItem value="character">Personaje</SelectItem>
                    <SelectItem value="quest">Misión</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Relación *</Label>
                <Select
                  value={connectionForm.relationshipType || 'member'}
                  onValueChange={value =>
                    setConnectionForm(prev => ({
                      ...prev,
                      relationshipType: value as any,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONNECTION_RELATIONSHIP_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre de la Entidad *</Label>
                <Input
                  value={connectionForm.entityName || ''}
                  onChange={e =>
                    setConnectionForm(prev => ({
                      ...prev,
                      entityName: e.target.value,
                    }))
                  }
                  placeholder="Nombre"
                />
              </div>

              <div className="space-y-2">
                <Label>ID de la Entidad *</Label>
                <Input
                  value={connectionForm.entityId || ''}
                  onChange={e =>
                    setConnectionForm(prev => ({
                      ...prev,
                      entityId: e.target.value,
                    }))
                  }
                  placeholder="ID único"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Importancia</Label>
              <Select
                value={connectionForm.importance || 'significant'}
                onValueChange={value =>
                  setConnectionForm(prev => ({
                    ...prev,
                    importance: value as any,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Menor</SelectItem>
                  <SelectItem value="significant">Significativa</SelectItem>
                  <SelectItem value="major">Mayor</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={connectionForm.description || ''}
                onChange={e =>
                  setConnectionForm(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descripción de la conexión"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConnectionDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={saveConnection}>
                {editingConnection ? 'Actualizar' : 'Agregar'} Conexión
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rank Dialog */}
      <Dialog open={isRankDialogOpen} onOpenChange={setIsRankDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRank ? 'Editar Rango' : 'Nuevo Rango'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  value={rankForm.name || ''}
                  onChange={e =>
                    setRankForm(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nombre del rango"
                />
              </div>

              <div className="space-y-2">
                <Label>Nivel *</Label>
                <Input
                  type="number"
                  value={rankForm.level || 1}
                  onChange={e =>
                    setRankForm(prev => ({
                      ...prev,
                      level: parseInt(e.target.value) || 1,
                    }))
                  }
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción *</Label>
              <Textarea
                value={rankForm.description || ''}
                onChange={e =>
                  setRankForm(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descripción del rango"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Requisitos</Label>
              <Textarea
                value={rankForm.requirements || ''}
                onChange={e =>
                  setRankForm(prev => ({
                    ...prev,
                    requirements: e.target.value,
                  }))
                }
                placeholder="Requisitos para obtener este rango"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Permisos</Label>
              <Input
                value={(rankForm.permissions || []).join(', ')}
                onChange={e =>
                  setRankForm(prev => ({
                    ...prev,
                    permissions: e.target.value
                      .split(',')
                      .map(p => p.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Permisos separados por comas"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRankDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={saveRank}>
                {editingRank ? 'Actualizar' : 'Agregar'} Rango
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  )
}
