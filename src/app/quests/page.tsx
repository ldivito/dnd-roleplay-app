'use client'

import React, { useState, useMemo } from 'react'
import {
  Plus,
  Filter,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Quest,
  QuestStatus,
  QuestType,
  QuestPriority,
  QUEST_TYPES,
  QUEST_STATUSES,
  QUEST_PRIORITIES,
  getQuestTypeInfo,
  getQuestStatusInfo,
  getQuestPriorityInfo,
  calculateQuestProgress,
  getActiveQuests,
  getCompletedQuests,
  filterQuestsByStatus,
  sortQuestsByPriority,
} from '@/types/quest'
import { QuestForm } from '@/components/QuestForm'
import { QuestTimeline } from '@/components/QuestTimeline'
import { QuestCard } from '@/components/QuestCard'
import { useSessionStore } from '@/stores/sessionStore'

export default function QuestsPage() {
  const { quests, addQuest, updateQuest, removeQuest } = useSessionStore()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuestStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<QuestType | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<QuestPriority | 'all'>(
    'all'
  )

  // Filtered and sorted quests
  const filteredQuests = useMemo(() => {
    let filtered = quests.filter(quest => {
      const matchesSearch =
        quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )

      const matchesStatus =
        statusFilter === 'all' || quest.status === statusFilter
      const matchesType = typeFilter === 'all' || quest.type === typeFilter
      const matchesPriority =
        priorityFilter === 'all' || quest.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })

    return sortQuestsByPriority(filtered)
  }, [quests, searchTerm, statusFilter, typeFilter, priorityFilter])

  // Stats
  const activeQuests = getActiveQuests(quests)
  const completedQuests = getCompletedQuests(quests)
  const notStartedQuests = filterQuestsByStatus(quests, 'not_started')

  const handleCreateQuest = (questData: Partial<Quest>) => {
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUpdated: new Date(),
      status: 'not_started',
      priority: 'medium',
      type: 'side',
      actions: [],
      rewards: [],
      connections: [],
      tags: [],
      relatedQuestIds: [],
      isKnownToPlayers: true,
      ...questData,
    } as Quest

    addQuest(newQuest)
    setIsCreateDialogOpen(false)
  }

  const handleUpdateQuest = (updatedQuest: Quest) => {
    updateQuest(updatedQuest.id, updatedQuest)
  }

  const handleDeleteQuest = (questId: string) => {
    removeQuest(questId)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setTypeFilter('all')
    setPriorityFilter('all')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Misiones
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona las aventuras y objetivos de tu campaña
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Misión
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Misión</DialogTitle>
            </DialogHeader>
            <QuestForm
              onSubmit={handleCreateQuest}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeQuests.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedQuests.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  No Iniciadas
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {notStartedQuests.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  {quests.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar misiones..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={value =>
                  setStatusFilter(value as QuestStatus | 'all')
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  {QUEST_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={typeFilter}
                onValueChange={value =>
                  setTypeFilter(value as QuestType | 'all')
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Tipos</SelectItem>
                  {QUEST_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={value =>
                  setPriorityFilter(value as QuestPriority | 'all')
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Prioridades</SelectItem>
                  {QUEST_PRIORITIES.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm ||
                statusFilter !== 'all' ||
                typeFilter !== 'all' ||
                priorityFilter !== 'all') && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quest List */}
      <div className="space-y-4">
        {filteredQuests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {quests.length === 0
                  ? 'No hay misiones creadas'
                  : 'No se encontraron misiones'}
              </h3>
              <p className="text-gray-600 mb-4">
                {quests.length === 0
                  ? 'Comienza creando tu primera misión para la campaña.'
                  : 'Prueba ajustando los filtros de búsqueda.'}
              </p>
              {quests.length === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Misión
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredQuests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onEdit={setSelectedQuest}
                onDelete={handleDeleteQuest}
                onViewTimeline={quest => {
                  setSelectedQuest(quest)
                  setIsTimelineOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Quest Dialog */}
      {selectedQuest && !isTimelineOpen && (
        <Dialog open={true} onOpenChange={() => setSelectedQuest(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Misión: {selectedQuest.title}</DialogTitle>
            </DialogHeader>
            <QuestForm
              quest={selectedQuest}
              onSubmit={questData => {
                const updated = {
                  ...selectedQuest,
                  ...questData,
                  updatedAt: new Date(),
                }
                handleUpdateQuest(updated)
                setSelectedQuest(null)
              }}
              onCancel={() => setSelectedQuest(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Timeline Dialog */}
      {selectedQuest && isTimelineOpen && (
        <Dialog
          open={true}
          onOpenChange={() => {
            setIsTimelineOpen(false)
            setSelectedQuest(null)
          }}
        >
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Línea de Tiempo: {selectedQuest.title}</DialogTitle>
            </DialogHeader>
            <QuestTimeline
              quest={selectedQuest}
              onUpdateQuest={handleUpdateQuest}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
