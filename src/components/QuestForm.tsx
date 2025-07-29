'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Save, X, Search } from 'lucide-react'
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
import {
  Quest,
  QuestAction,
  QuestReward,
  QuestConnection,
  QUEST_TYPES,
  QUEST_PRIORITIES,
  QUEST_STATUSES,
  ACTION_TYPES,
  REWARD_TYPES,
  CONNECTION_TYPES,
  getActionTypeInfo,
} from '@/types/quest'

interface QuestFormProps {
  quest?: Quest
  onSubmit: (questData: Partial<Quest>) => void
  onCancel: () => void
}

export function QuestForm({ quest, onSubmit, onCancel }: QuestFormProps) {
  // Form state
  const [formData, setFormData] = useState<Partial<Quest>>({
    title: '',
    description: '',
    summary: '',
    type: 'side',
    priority: 'medium',
    status: 'not_started',
    actions: [],
    rewards: [],
    connections: [],
    tags: [],
    relatedQuestIds: [],
    isKnownToPlayers: true,
    playerNotes: '',
    dmNotes: '',
    ...quest,
  })

  const [newTag, setNewTag] = useState('')
  const [selectedTab, setSelectedTab] = useState('basic')

  // Action form states
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [editingAction, setEditingAction] = useState<QuestAction | null>(null)
  const [actionForm, setActionForm] = useState<Partial<QuestAction>>({})

  // Reward form states
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<QuestReward | null>(null)
  const [rewardForm, setRewardForm] = useState<Partial<QuestReward>>({})

  // Connection form states
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false)
  const [editingConnection, setEditingConnection] =
    useState<QuestConnection | null>(null)
  const [connectionForm, setConnectionForm] = useState<
    Partial<QuestConnection>
  >({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateFormData = (updates: Partial<Quest>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      updateFormData({
        tags: [...(formData.tags || []), newTag.trim()],
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || [],
    })
  }

  // Action management
  const openActionDialog = (action?: QuestAction) => {
    if (action) {
      setEditingAction(action)
      setActionForm(action)
    } else {
      setEditingAction(null)
      setActionForm({
        title: '',
        description: '',
        type: 'custom',
        isRequired: true,
        isCompleted: false,
        prerequisites: [],
        order: formData.actions?.length || 0,
      })
    }
    setIsActionDialogOpen(true)
  }

  const saveAction = () => {
    if (!actionForm.title || !actionForm.description) return

    const newAction: QuestAction = {
      id: editingAction?.id || crypto.randomUUID(),
      title: actionForm.title!,
      description: actionForm.description!,
      type: actionForm.type || 'custom',
      isRequired: actionForm.isRequired ?? true,
      isCompleted: actionForm.isCompleted ?? false,
      prerequisites: actionForm.prerequisites || [],
      order: actionForm.order ?? 0,
      ...(actionForm.npcId && { npcId: actionForm.npcId }),
      ...(actionForm.npcName && { npcName: actionForm.npcName }),
      ...(actionForm.locationId && { locationId: actionForm.locationId }),
      ...(actionForm.locationName && { locationName: actionForm.locationName }),
      ...(actionForm.itemId && { itemId: actionForm.itemId }),
      ...(actionForm.itemName && { itemName: actionForm.itemName }),
      ...(actionForm.loreId && { loreId: actionForm.loreId }),
      ...(actionForm.loreTitle && { loreTitle: actionForm.loreTitle }),
      ...(actionForm.skillRequirement && {
        skillRequirement: actionForm.skillRequirement,
      }),
      ...(actionForm.estimatedDuration && {
        estimatedDuration: actionForm.estimatedDuration,
      }),
      ...(actionForm.notes && { notes: actionForm.notes }),
      ...(actionForm.customData && { customData: actionForm.customData }),
    }

    const updatedActions = editingAction
      ? formData.actions?.map(a =>
          a.id === editingAction.id ? newAction : a
        ) || []
      : [...(formData.actions || []), newAction]

    updateFormData({ actions: updatedActions })
    setIsActionDialogOpen(false)
    setEditingAction(null)
    setActionForm({})
  }

  const deleteAction = (actionId: string) => {
    updateFormData({
      actions: formData.actions?.filter(a => a.id !== actionId) || [],
    })
  }

  // Reward management
  const openRewardDialog = (reward?: QuestReward) => {
    if (reward) {
      setEditingReward(reward)
      setRewardForm(reward)
    } else {
      setEditingReward(null)
      setRewardForm({
        type: 'experience',
        description: '',
      })
    }
    setIsRewardDialogOpen(true)
  }

  const saveReward = () => {
    if (!rewardForm.description) return

    const newReward: QuestReward = {
      id: editingReward?.id || crypto.randomUUID(),
      type: rewardForm.type || 'experience',
      description: rewardForm.description!,
      ...(rewardForm.amount && { amount: rewardForm.amount }),
      ...(rewardForm.itemId && { itemId: rewardForm.itemId }),
      ...(rewardForm.itemName && { itemName: rewardForm.itemName }),
      ...(rewardForm.customValue && { customValue: rewardForm.customValue }),
    }

    const updatedRewards = editingReward
      ? formData.rewards?.map(r =>
          r.id === editingReward.id ? newReward : r
        ) || []
      : [...(formData.rewards || []), newReward]

    updateFormData({ rewards: updatedRewards })
    setIsRewardDialogOpen(false)
    setEditingReward(null)
    setRewardForm({})
  }

  const deleteReward = (rewardId: string) => {
    updateFormData({
      rewards: formData.rewards?.filter(r => r.id !== rewardId) || [],
    })
  }

  // Connection management
  const openConnectionDialog = (connection?: QuestConnection) => {
    if (connection) {
      setEditingConnection(connection)
      setConnectionForm(connection)
    } else {
      setEditingConnection(null)
      setConnectionForm({
        type: 'npc',
        relationshipType: 'involved',
      })
    }
    setIsConnectionDialogOpen(true)
  }

  const saveConnection = () => {
    if (!connectionForm.entityName || !connectionForm.entityId) return

    const newConnection: QuestConnection = {
      id: editingConnection?.id || crypto.randomUUID(),
      type: connectionForm.type || 'npc',
      entityId: connectionForm.entityId!,
      entityName: connectionForm.entityName!,
      relationshipType: connectionForm.relationshipType || 'involved',
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="actions">
            Acciones ({formData.actions?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="rewards">
            Recompensas ({formData.rewards?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="connections">
            Conexiones ({formData.connections?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={e => updateFormData({ title: e.target.value })}
                placeholder="Nombre de la misión"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Resumen</Label>
              <Input
                id="summary"
                value={formData.summary || ''}
                onChange={e => updateFormData({ summary: e.target.value })}
                placeholder="Resumen breve en una línea"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={e => updateFormData({ description: e.target.value })}
              placeholder="Descripción detallada de la misión"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.type || 'side'}
                onValueChange={value => updateFormData({ type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUEST_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select
                value={formData.priority || 'medium'}
                onValueChange={value =>
                  updateFormData({ priority: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUEST_PRIORITIES.map(priority => (
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
                value={formData.status || 'not_started'}
                onValueChange={value =>
                  updateFormData({ status: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUEST_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Etiquetas</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-600"
                      onClick={() => removeTag(tag)}
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
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag}>
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
                Visible para los jugadores
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="playerNotes">Notas para Jugadores</Label>
              <Textarea
                id="playerNotes"
                value={formData.playerNotes || ''}
                onChange={e => updateFormData({ playerNotes: e.target.value })}
                placeholder="Información visible para los jugadores"
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

        <TabsContent value="actions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Acciones de la Misión</h3>
            <Button type="button" onClick={() => openActionDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Acción
            </Button>
          </div>

          <div className="space-y-2">
            {formData.actions?.map((action, index) => (
              <Card key={action.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {getActionTypeInfo(action.type)?.label || action.type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          #{action.order + 1}
                        </span>
                        {action.isRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Requerida
                          </Badge>
                        )}
                        {action.isCompleted && (
                          <Badge
                            variant="default"
                            className="text-xs bg-green-600"
                          >
                            Completada
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </p>

                      {action.npcName && (
                        <p className="text-xs text-blue-600 mt-1">
                          NPC: {action.npcName}
                        </p>
                      )}
                      {action.locationName && (
                        <p className="text-xs text-green-600 mt-1">
                          Ubicación: {action.locationName}
                        </p>
                      )}
                      {action.itemName && (
                        <p className="text-xs text-purple-600 mt-1">
                          Objeto: {action.itemName}
                        </p>
                      )}
                      {action.loreTitle && (
                        <p className="text-xs text-yellow-600 mt-1">
                          Historia: {action.loreTitle}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openActionDialog(action)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAction(action.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center text-gray-500 py-8">
                No hay acciones configuradas. Agrega la primera acción para
                comenzar.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recompensas</h3>
            <Button type="button" onClick={() => openRewardDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Recompensa
            </Button>
          </div>

          <div className="space-y-2">
            {formData.rewards?.map(reward => (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {REWARD_TYPES.find(r => r.value === reward.type)
                            ?.label || reward.type}
                        </Badge>
                      </div>
                      <p className="font-medium">{reward.description}</p>
                      {reward.amount && (
                        <p className="text-sm text-gray-600">
                          Cantidad: {reward.amount}
                        </p>
                      )}
                      {reward.itemName && (
                        <p className="text-sm text-purple-600">
                          Objeto: {reward.itemName}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openRewardDialog(reward)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteReward(reward.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center text-gray-500 py-8">
                No hay recompensas configuradas.
              </div>
            )}
          </div>
        </TabsContent>

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
                            CONNECTION_TYPES.find(
                              c => c.value === connection.relationshipType
                            )?.label
                          }
                        </Badge>
                      </div>
                      <p className="font-medium">{connection.entityName}</p>
                      {connection.description && (
                        <p className="text-sm text-gray-600 mt-1">
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
            )) || (
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
          {quest ? 'Actualizar' : 'Crear'} Misión
        </Button>
      </div>

      {/* Action Dialog - Simplified for brevity, would include full form fields */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAction ? 'Editar Acción' : 'Nueva Acción'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={actionForm.title || ''}
                  onChange={e =>
                    setActionForm(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Título de la acción"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={actionForm.type || 'custom'}
                  onValueChange={value =>
                    setActionForm(prev => ({ ...prev, type: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción *</Label>
              <Textarea
                value={actionForm.description || ''}
                onChange={e =>
                  setActionForm(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe qué debe hacer el jugador"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRequired"
                checked={actionForm.isRequired ?? true}
                onCheckedChange={checked =>
                  setActionForm(prev => ({
                    ...prev,
                    isRequired: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="isRequired">Acción requerida</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsActionDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={saveAction}>
                {editingAction ? 'Actualizar' : 'Agregar'} Acción
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Similar dialogs would be implemented for Rewards and Connections */}
    </form>
  )
}
