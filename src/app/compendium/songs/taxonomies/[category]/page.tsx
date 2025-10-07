'use client'

import React, { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionStore } from '@/stores/sessionStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Search, ArrowLeft, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { Taxonomy, TaxonomyCategory } from '@/types/taxonomy'
import { TAXONOMY_CATEGORIES } from '@/types/taxonomy'
import { DynamicIcon } from '@/lib/iconResolver'

type TaxonomyFormData = Omit<Taxonomy, 'id' | 'createdAt' | 'updatedAt'>

export default function SongTaxonomyManagementPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const resolvedParams = use(params)
  const category = resolvedParams.category as TaxonomyCategory
  const router = useRouter()

  const {
    taxonomies,
    addTaxonomy,
    updateTaxonomy,
    removeTaxonomy,
    getTaxonomiesByCategory,
    hasHydrated,
  } = useSessionStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTaxonomy, setEditingTaxonomy] = useState<Taxonomy | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [taxonomyToDelete, setTaxonomyToDelete] = useState<Taxonomy | null>(
    null
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaxonomyFormData>({
    defaultValues: {
      category,
      name: '',
      description: '',
      color: '',
      icon: '',
      isSystem: false,
      sortOrder: 0,
      customFields: [],
      metadata: {},
    },
  })

  const categoryInfo = TAXONOMY_CATEGORIES[category]

  if (!categoryInfo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Categoría de taxonomía no válida
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Wait for store to hydrate before showing taxonomy data
  if (!hasHydrated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{categoryInfo.pluralLabel}</h1>
            <p className="text-muted-foreground">{categoryInfo.description}</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Cargando taxonomías...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const categoryTaxonomies = getTaxonomiesByCategory(category)

  const filteredTaxonomies = categoryTaxonomies.filter(taxonomy =>
    taxonomy.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSubmit = (data: TaxonomyFormData) => {
    if (editingTaxonomy) {
      updateTaxonomy(editingTaxonomy.id, {
        ...data,
        updatedAt: new Date(),
      })
    } else {
      const newTaxonomy: Taxonomy = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addTaxonomy(newTaxonomy)
    }
    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTaxonomy(null)
    reset({
      category,
      name: '',
      description: '',
      color: '',
      icon: '',
      isSystem: false,
      sortOrder: categoryTaxonomies.length,
      customFields: [],
      metadata: {},
    })
  }

  const handleEdit = (taxonomy: Taxonomy) => {
    setEditingTaxonomy(taxonomy)
    reset(taxonomy)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (taxonomy: Taxonomy) => {
    setTaxonomyToDelete(taxonomy)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (taxonomyToDelete) {
      removeTaxonomy(taxonomyToDelete.id)
      setTaxonomyToDelete(null)
    }
    setDeleteConfirmOpen(false)
  }

  const handleOpenNew = () => {
    setEditingTaxonomy(null)
    reset({
      category,
      name: '',
      description: '',
      color: '',
      icon: '',
      isSystem: false,
      sortOrder: categoryTaxonomies.length,
      customFields: [],
      metadata: {},
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{categoryInfo.pluralLabel}</h1>
          <p className="text-muted-foreground">{categoryInfo.description}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva {categoryInfo.label}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTaxonomy ? 'Editar' : 'Nueva'} {categoryInfo.label}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'El nombre es requerido' })}
                  placeholder={`Nombre de la ${categoryInfo.label.toLowerCase()}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descripción opcional"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icono/Emoji</Label>
                  <Input
                    id="icon"
                    {...register('icon')}
                    placeholder="🎵 o Music"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Emoji (🎵) o nombre de Lucide (Music, Zap, Star, etc.)
                  </p>
                  {watch('icon') && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Vista previa:
                      </span>
                      <DynamicIcon
                        icon={watch('icon') || ''}
                        className="h-5 w-5"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="color">Color (Hex)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      {...register('color')}
                      placeholder="#8B5CF6"
                    />
                    {watch('color') && (
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: watch('color') }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="sortOrder">Orden de Clasificación</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  {...register('sortOrder', { valueAsNumber: true })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Orden en que aparece en listas (menor = primero)
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTaxonomy ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Buscar ${categoryInfo.pluralLabel.toLowerCase()}...`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Taxonomies List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTaxonomies.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No se encontraron {categoryInfo.pluralLabel.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTaxonomies.map(taxonomy => (
            <Card key={taxonomy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {taxonomy.icon && (
                      <DynamicIcon icon={taxonomy.icon} className="h-6 w-6" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{taxonomy.name}</CardTitle>
                      {taxonomy.isSystem && (
                        <Badge variant="secondary" className="mt-1">
                          <Lock className="h-3 w-3 mr-1" />
                          Sistema
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(taxonomy)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!taxonomy.isSystem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(taxonomy)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {taxonomy.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {taxonomy.description}
                  </p>
                  {taxonomy.color && (
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: taxonomy.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {taxonomy.color}
                      </span>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Deseas eliminar &quot;{taxonomyToDelete?.name}&quot;? Esta acción
              no se puede deshacer.
              {taxonomyToDelete?.isSystem && (
                <span className="block mt-2 text-destructive font-medium">
                  Esta es una taxonomía del sistema y no debería eliminarse.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
