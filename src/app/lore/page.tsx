'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Scroll,
  Plus,
  Search,
  Calendar,
  Clock,
  BookOpen,
  GitBranch,
  Filter,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSessionStore } from '@/stores/sessionStore'
import LoreTimeline from '@/components/LoreTimeline'
import LoreConnectionManager from '@/components/LoreConnectionManager'
import type {
  Lore,
  LoreType,
  LoreImportance,
  LoreConnection,
} from '@/types/lore'
import {
  LoreSchema,
  LORE_TYPES,
  LORE_IMPORTANCE,
  getLoreTypeInfo,
  getLoreImportanceInfo,
  DEFAULT_ERAS,
} from '@/types/lore'

type LoreFormData = Omit<Lore, 'id' | 'createdAt' | 'updatedAt'>

export default function LorePage() {
  const {
    lore,
    addLore,
    updateLore,
    removeLore,
    getLoreByImportance,
    getMainTimelineLore,
    eras,
  } = useSessionStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLore, setEditingLore] = useState<Lore | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<LoreType | 'all'>('all')
  const [filterImportance, setFilterImportance] = useState<
    LoreImportance | 'all'
  >('all')
  const [showOnlyPublic, setShowOnlyPublic] = useState(false)
  const [activeTab, setActiveTab] = useState('timeline')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      title: '',
      content: '',
      type: 'event',
      importance: 'secondary',
      year: undefined,
      era: '',
      dateDescription: '',
      isPublic: true,
      isMainTimeline: false,
      author: '',
      tags: [],
      connections: [],
      notes: '',
    },
  })

  const watchedConnections = watch('connections') || []

  const onSubmit = (data: any) => {
    const loreData: Lore = {
      ...data,
      id: editingLore?.id || crypto.randomUUID(),
      createdAt: editingLore?.createdAt || new Date(),
      updatedAt: new Date(),
      tags:
        typeof data.tags === 'string'
          ? data.tags
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
          : data.tags || [],
      year: data.year ? parseInt(data.year) : undefined,
    } as Lore

    if (editingLore) {
      updateLore(editingLore.id, loreData)
    } else {
      addLore(loreData)
    }

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingLore(null)
    reset()
  }

  const handleEditLore = (lore: Lore) => {
    setEditingLore(lore)
    reset({
      ...lore,
      tags: lore.tags.join(', '),
      year: lore.year?.toString() || '',
    })
    setIsDialogOpen(true)
  }

  const handleAddLore = (parentLore?: Lore) => {
    if (parentLore) {
      setValue('parentLoreId', parentLore.id)
      setValue('era', parentLore.era || '')
      setValue('year', parentLore.year?.toString() || '')
    }
    setIsDialogOpen(true)
  }

  const handleDeleteLore = (lore: Lore) => {
    if (
      window.confirm(`¿Estás seguro de que quieres eliminar "${lore.title}"?`)
    ) {
      removeLore(lore.id)
    }
  }

  // Filter lore based on search and filters
  const filteredLore = lore.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesType = filterType === 'all' || item.type === filterType
    const matchesImportance =
      filterImportance === 'all' || item.importance === filterImportance
    const matchesVisibility = !showOnlyPublic || item.isPublic

    return (
      matchesSearch && matchesType && matchesImportance && matchesVisibility
    )
  })

  // Timeline eras
  const timelineEras = eras.length > 0 ? eras : DEFAULT_ERAS

  // Statistics
  const mainTimelineLore = getMainTimelineLore()
  const importantLore = getLoreByImportance('main')
  const secretLore = lore.filter(l => !l.isPublic)
  const connectedLore = lore.filter(l => l.connections.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lore y Tradiciones
          </h1>
          <p className="text-muted-foreground">
            Gestiona la historia, leyendas y conocimiento de tu mundo con un
            sistema de timeline y conexiones.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleAddLore()}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Lore
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLore ? 'Editar Lore' : 'Crear Nuevo Lore'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Básica</h3>

                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    {...register('title', {
                      required: 'El título es requerido',
                    })}
                    placeholder="Título del lore"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      onValueChange={value => setValue('type', value)}
                      defaultValue="event"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LORE_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="importance">Importancia</Label>
                    <Select
                      onValueChange={value => setValue('importance', value)}
                      defaultValue="secondary"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LORE_IMPORTANCE.map(imp => (
                          <SelectItem key={imp.value} value={imp.value}>
                            {imp.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="author">Autor</Label>
                    <Input
                      id="author"
                      {...register('author')}
                      placeholder="Nombre del autor"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Contenido *</Label>
                  <Textarea
                    id="content"
                    {...register('content', {
                      required: 'El contenido es requerido',
                    })}
                    placeholder="Contenido del lore..."
                    rows={6}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.content.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tags">Etiquetas</Label>
                  <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="historia, guerra, magia (separadas por comas)"
                  />
                </div>
              </div>

              <Separator />

              {/* Timeline Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información de Timeline</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year">Año</Label>
                    <Input
                      id="year"
                      type="number"
                      {...register('year')}
                      placeholder="ej: 1450"
                    />
                  </div>

                  <div>
                    <Label htmlFor="era">Era</Label>
                    <Select onValueChange={value => setValue('era', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar era" />
                      </SelectTrigger>
                      <SelectContent>
                        {timelineEras.map(era => (
                          <SelectItem key={era.id} value={era.name}>
                            {era.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateDescription">
                      Descripción de Fecha
                    </Label>
                    <Input
                      id="dateDescription"
                      {...register('dateDescription')}
                      placeholder="ej: Inicio de primavera"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isMainTimeline"
                      onCheckedChange={checked =>
                        setValue('isMainTimeline', checked)
                      }
                    />
                    <Label htmlFor="isMainTimeline" className="text-sm">
                      Incluir en timeline principal
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPublic"
                      onCheckedChange={checked => setValue('isPublic', checked)}
                      defaultChecked
                    />
                    <Label htmlFor="isPublic" className="text-sm">
                      Visible para jugadores
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Connections */}
              <LoreConnectionManager
                connections={watchedConnections}
                onChange={connections => setValue('connections', connections)}
              />

              <Separator />

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notas del DM</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Notas privadas del DM..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingLore ? 'Actualizar' : 'Crear'} Lore
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lore</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lore.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Timeline Principal
            </CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mainTimelineLore.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lore Importante
            </CardTitle>
            <Scroll className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{importantLore.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Con Conexiones
            </CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedLore.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar en lore..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select
                value={filterType}
                onValueChange={value => setFilterType(value as any)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {LORE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterImportance}
                onValueChange={value => setFilterImportance(value as any)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Importancia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {LORE_IMPORTANCE.map(imp => (
                    <SelectItem key={imp.value} value={imp.value}>
                      {imp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showOnlyPublic ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowOnlyPublic(!showOnlyPublic)}
              >
                {showOnlyPublic ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="main-timeline">Timeline Principal</TabsTrigger>
          <TabsTrigger value="all">Todo el Lore</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Timeline Completo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LoreTimeline
                onEditLore={handleEditLore}
                onAddLore={handleAddLore}
                onDeleteLore={handleDeleteLore}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="main-timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scroll className="h-5 w-5" />
                Timeline Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LoreTimeline
                onEditLore={handleEditLore}
                onAddLore={handleAddLore}
                onDeleteLore={handleDeleteLore}
                showOnlyMainTimeline={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredLore.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No se encontró lore
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Crea tu primera entrada de lore'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredLore.map(loreItem => {
                const typeInfo = getLoreTypeInfo(loreItem.type)
                const importanceInfo = getLoreImportanceInfo(
                  loreItem.importance
                )

                return (
                  <Card
                    key={loreItem.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {loreItem.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            {typeInfo && (
                              <Badge variant="outline">{typeInfo.label}</Badge>
                            )}
                            {importanceInfo && (
                              <Badge
                                variant="outline"
                                className={importanceInfo.color}
                              >
                                {importanceInfo.label}
                              </Badge>
                            )}
                            {loreItem.isMainTimeline && (
                              <Badge variant="default">
                                Timeline Principal
                              </Badge>
                            )}
                            {!loreItem.isPublic && (
                              <Badge variant="secondary">Solo DM</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditLore(loreItem)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteLore(loreItem)}
                            className="text-destructive hover:text-destructive"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3 mb-3">
                        {loreItem.content}
                      </p>
                      {loreItem.connections.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-muted-foreground mr-2">
                            Conexiones:
                          </span>
                          {loreItem.connections.slice(0, 3).map(conn => (
                            <Badge
                              key={conn.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {conn.entityName}
                            </Badge>
                          ))}
                          {loreItem.connections.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{loreItem.connections.length - 3} más
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
