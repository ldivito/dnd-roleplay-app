'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import {
  Map,
  Plus,
  Search,
  Globe,
  Mountain,
  MapPin,
  Building,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSessionStore } from '@/stores/sessionStore'
import LocationTreeView from '@/components/LocationTreeView'
import LocationHierarchyView from '@/components/LocationHierarchyView'
import { generateSpanishLocationTemplate } from '@/lib/sampleLocations'
import type {
  AnyLocation,
  LocationType,
  Plane,
  Continent,
  Region,
  Location,
  PLANE_TYPES,
  ALIGNMENTS,
  CLIMATES,
  REGION_TYPES,
  LOCATION_TYPES,
} from '@/types/location'
import {
  PlaneSchema,
  ContinentSchema,
  RegionSchema,
  LocationSchema,
  getLocationTypeLabel,
  getValidChildTypes,
  DANGER_LEVELS,
} from '@/types/location'

type LocationFormData = Omit<AnyLocation, 'id' | 'createdAt' | 'updatedAt'>

export default function MapsPage() {
  const {
    locations,
    addLocation,
    updateLocation,
    removeLocation,
    getLocationsByType,
  } = useSessionStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<AnyLocation | null>(
    null
  )
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>()
  const [selectedType, setSelectedType] = useState<LocationType>('plane')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'tree' | 'cards'>('cards')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      type: 'plane',
      name: '',
      description: '',
      tags: [],
      notes: '',
    },
  })

  const watchedType = watch('type')

  const onSubmit = (data: any) => {
    const locationData: AnyLocation = {
      ...data,
      id: editingLocation?.id || crypto.randomUUID(),
      createdAt: editingLocation?.createdAt || new Date(),
      updatedAt: new Date(),
      parentId: selectedParentId,
    } as AnyLocation

    if (editingLocation) {
      updateLocation(editingLocation.id, locationData)
    } else {
      addLocation(locationData)
    }

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingLocation(null)
    setSelectedParentId(undefined)
    setSelectedType('plane')
    reset()
  }

  const handleEditLocation = (location: AnyLocation) => {
    setEditingLocation(location)
    setSelectedType(location.type)
    setSelectedParentId(location.parentId)
    reset(location)
    setIsDialogOpen(true)
  }

  const handleAddLocation = (
    parentId: string | undefined,
    type: LocationType
  ) => {
    setSelectedParentId(parentId)
    setSelectedType(type)
    setValue('type', type)
    setValue('parentId', parentId)
    setIsDialogOpen(true)
  }

  const handleDeleteLocation = (location: AnyLocation) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar "${location.name}" y todas sus ubicaciones hijas?`
      )
    ) {
      removeLocation(location.id)
    }
  }

  const handleGenerateTemplate = () => {
    if (
      window.confirm(
        '¿Quieres generar un mundo de ejemplo completo? Esto añadirá múltiples ubicaciones conectadas en español que puedes usar como plantilla.'
      )
    ) {
      const templateLocations = generateSpanishLocationTemplate()
      templateLocations.forEach(location => addLocation(location))

      // Show success message
      alert(`¡Plantilla generada exitosamente! Se han añadido ${templateLocations.length} ubicaciones:
- 1 Plano Material
- 1 Continente (Aethermoor)  
- 4 Regiones diversas
- 8+ Ubicaciones específicas con NPCs, secretos y ganchos de aventura`)
    }
  }

  const filteredLocations = locations.filter(
    location =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const planes = getLocationsByType('plane')
  const continents = getLocationsByType('continent')
  const regions = getLocationsByType('region')
  const locationsList = getLocationsByType('location')

  const getAvailableParents = (type: LocationType) => {
    switch (type) {
      case 'continent':
        return planes
      case 'region':
        return continents
      case 'location':
        return regions
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mapas y Ubicaciones
          </h1>
          <p className="text-muted-foreground">
            Gestiona la jerarquía de ubicaciones de tu mundo: planos,
            continentes, regiones y lugares específicos.
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleGenerateTemplate}
            variant="outline"
            className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800"
          >
            <Sparkles className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
            Generar Mundo de Ejemplo
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleAddLocation(undefined, 'plane')}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Plano
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingLocation
                    ? `Editar ${getLocationTypeLabel(selectedType)}`
                    : `Crear ${getLocationTypeLabel(selectedType)}`}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información Básica</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Nombre de la ubicación"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message as string}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={selectedType}
                        onValueChange={(value: LocationType) => {
                          setSelectedType(value)
                          setValue('type', value)
                        }}
                        disabled={!!editingLocation}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plane">Plano</SelectItem>
                          <SelectItem value="continent">Continente</SelectItem>
                          <SelectItem value="region">Región</SelectItem>
                          <SelectItem value="location">Ubicación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedType !== 'plane' && (
                    <div>
                      <Label>Ubicación Padre *</Label>
                      <Select
                        value={selectedParentId || ''}
                        onValueChange={value => {
                          setSelectedParentId(value || undefined)
                          setValue('parentId', value || undefined)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la ubicación padre" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableParents(selectedType).map(parent => (
                            <SelectItem key={parent.id} value={parent.id}>
                              {parent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Descripción de la ubicación"
                      rows={3}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      {...register('notes')}
                      placeholder="Notas adicionales para el DM"
                      rows={2}
                    />
                  </div>
                </div>

                <Separator />

                {/* Type-specific fields */}
                {selectedType === 'plane' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Propiedades del Plano
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo de Plano</Label>
                        <Select
                          onValueChange={value =>
                            setValue('planeType', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="material">Material</SelectItem>
                            <SelectItem value="elemental">Elemental</SelectItem>
                            <SelectItem value="celestial">Celestial</SelectItem>
                            <SelectItem value="infernal">Infernal</SelectItem>
                            <SelectItem value="shadowfell">
                              Shadowfell
                            </SelectItem>
                            <SelectItem value="feywild">Feywild</SelectItem>
                            <SelectItem value="astral">Astral</SelectItem>
                            <SelectItem value="ethereal">Etéreo</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Alineamiento Dominante</Label>
                        <Select
                          onValueChange={value =>
                            setValue('alignment', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Alineamiento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lawful-good">
                              Legal Bueno
                            </SelectItem>
                            <SelectItem value="neutral-good">
                              Neutral Bueno
                            </SelectItem>
                            <SelectItem value="chaotic-good">
                              Caótico Bueno
                            </SelectItem>
                            <SelectItem value="lawful-neutral">
                              Legal Neutral
                            </SelectItem>
                            <SelectItem value="true-neutral">
                              Neutral Puro
                            </SelectItem>
                            <SelectItem value="chaotic-neutral">
                              Caótico Neutral
                            </SelectItem>
                            <SelectItem value="lawful-evil">
                              Legal Malvado
                            </SelectItem>
                            <SelectItem value="neutral-evil">
                              Neutral Malvado
                            </SelectItem>
                            <SelectItem value="chaotic-evil">
                              Caótico Malvado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === 'continent' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Propiedades del Continente
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Clima Predominante</Label>
                        <Select
                          onValueChange={value =>
                            setValue('climate', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el clima" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tropical">Tropical</SelectItem>
                            <SelectItem value="temperate">Templado</SelectItem>
                            <SelectItem value="arctic">Ártico</SelectItem>
                            <SelectItem value="desert">Desértico</SelectItem>
                            <SelectItem value="volcanic">Volcánico</SelectItem>
                            <SelectItem value="magical">Mágico</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === 'region' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Propiedades de la Región
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Tipo de Región</Label>
                        <Select
                          onValueChange={value =>
                            setValue('regionType', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de región" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kingdom">Reino</SelectItem>
                            <SelectItem value="duchy">Ducado</SelectItem>
                            <SelectItem value="province">Provincia</SelectItem>
                            <SelectItem value="wilderness">
                              Tierras Salvajes
                            </SelectItem>
                            <SelectItem value="wasteland">
                              Tierras Baldías
                            </SelectItem>
                            <SelectItem value="forest">Bosque</SelectItem>
                            <SelectItem value="mountains">Montañas</SelectItem>
                            <SelectItem value="desert">Desierto</SelectItem>
                            <SelectItem value="swamp">Pantano</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Nivel de Peligro</Label>
                        <Select
                          onValueChange={value =>
                            setValue('dangerLevel', parseInt(value) as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Nivel de peligro" />
                          </SelectTrigger>
                          <SelectContent>
                            {DANGER_LEVELS.map(level => (
                              <SelectItem
                                key={level.value}
                                value={level.value.toString()}
                              >
                                {level.value} - {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Población</Label>
                        <Input
                          type="number"
                          {...register('population', { valueAsNumber: true })}
                          placeholder="Número de habitantes"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Gobierno</Label>
                        <Input
                          {...register('government')}
                          placeholder="Tipo de gobierno"
                        />
                      </div>

                      <div>
                        <Label>Gobernante</Label>
                        <Input
                          {...register('ruler')}
                          placeholder="Nombre del gobernante"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === 'location' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Propiedades de la Ubicación
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Tipo de Ubicación</Label>
                        <Select
                          onValueChange={value =>
                            setValue('locationType', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de ubicación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="city">Ciudad</SelectItem>
                            <SelectItem value="town">Pueblo</SelectItem>
                            <SelectItem value="village">Aldea</SelectItem>
                            <SelectItem value="fortress">Fortaleza</SelectItem>
                            <SelectItem value="temple">Templo</SelectItem>
                            <SelectItem value="dungeon">Mazmorra</SelectItem>
                            <SelectItem value="ruins">Ruinas</SelectItem>
                            <SelectItem value="landmark">
                              Punto de Referencia
                            </SelectItem>
                            <SelectItem value="tavern">Taberna</SelectItem>
                            <SelectItem value="shop">Tienda</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Población</Label>
                        <Input
                          type="number"
                          {...register('population', { valueAsNumber: true })}
                          placeholder="Número de habitantes"
                        />
                      </div>

                      <div>
                        <Label>Gobierno</Label>
                        <Input
                          {...register('government')}
                          placeholder="Tipo de gobierno local"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Defensas</Label>
                      <Input
                        {...register('defenses')}
                        placeholder="Descripción de las defensas"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingLocation ? 'Actualizar' : 'Crear'}{' '}
                    {getLocationTypeLabel(selectedType)}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Continentes</CardTitle>
            <Mountain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{continents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regiones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubicaciones</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationsList.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar and View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ubicaciones..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="h-8"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Vista de Tarjetas
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('tree')}
            className="h-8"
          >
            <List className="h-4 w-4 mr-2" />
            Vista de Árbol
          </Button>
        </div>
      </div>

      {/* Location Display */}
      {viewMode === 'cards' ? (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Map className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Jerarquía de Ubicaciones</h2>
          </div>
          <LocationHierarchyView
            onEditLocation={handleEditLocation}
            onAddLocation={handleAddLocation}
            onDeleteLocation={handleDeleteLocation}
            searchTerm={searchTerm}
          />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Jerarquía de Ubicaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LocationTreeView
              onEditLocation={handleEditLocation}
              onAddLocation={handleAddLocation}
              onDeleteLocation={handleDeleteLocation}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
