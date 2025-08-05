'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  Edit,
  Plus,
  MapPin,
  Globe,
  Mountain,
  Building,
  Users,
  Shield,
  Crown,
  Eye,
  EyeOff,
  ChevronRight,
  Save,
  X,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSessionStore } from '@/stores/sessionStore'
import type {
  AnyLocation,
  LocationType,
  Location as LocationInterface,
  Region,
} from '@/types/location'
import {
  getLocationTypeLabel,
  canHaveChildren,
  getValidChildTypes,
  DANGER_LEVELS,
  LOCATION_TYPES,
  REGION_TYPES,
} from '@/types/location'
import { cn } from '@/lib/utils'

const getLocationIcon = (type: LocationType, size: string = 'h-5 w-5') => {
  switch (type) {
    case 'plane':
      return <Globe className={size} />
    case 'continent':
      return <Mountain className={size} />
    case 'region':
      return <MapPin className={size} />
    case 'location':
      return <Building className={size} />
    default:
      return <MapPin className={size} />
  }
}

const getLocationColor = (type: LocationType) => {
  switch (type) {
    case 'plane':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'continent':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'region':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'location':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export default function LocationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const locationId = params.id as string

  const {
    locations,
    getLocationById,
    getLocationChildren,
    updateLocation,
    addLocation,
    getLocationsByType,
  } = useSessionStore()

  const location = getLocationById(locationId)
  const children = getLocationChildren(locationId)

  const [isEditing, setIsEditing] = useState(false)
  const [showDMInfo, setShowDMInfo] = useState(true)
  const [isAddingSubLocation, setIsAddingSubLocation] = useState(false)
  const [selectedSubLocationType, setSelectedSubLocationType] =
    useState<LocationType>('location')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: location,
  })

  const {
    register: subLocationRegister,
    handleSubmit: handleSubLocationSubmit,
    reset: resetSubLocation,
    setValue: setSubLocationValue,
    formState: { errors: subLocationErrors },
  } = useForm<any>({
    defaultValues: {
      type: 'location',
      name: '',
      description: '',
      notes: '',
      tags: [],
    },
  })

  React.useEffect(() => {
    if (location) {
      reset(location)
    }
  }, [location, reset])

  if (!location) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Ubicación no encontrada</h2>
          <Button onClick={() => router.push('/maps')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mapas
          </Button>
        </div>
      </div>
    )
  }

  const getBreadcrumb = () => {
    const breadcrumb: AnyLocation[] = []
    let current = location
    breadcrumb.unshift(current)

    while (current.parentId) {
      const parent = getLocationById(current.parentId)
      if (parent) {
        breadcrumb.unshift(parent)
        current = parent
      } else {
        break
      }
    }

    return breadcrumb
  }

  const onSave = (data: any) => {
    const updatedLocation: AnyLocation = {
      ...location,
      ...data,
      updatedAt: new Date(),
    } as AnyLocation

    updateLocation(location.id, updatedLocation)
    setIsEditing(false)
  }

  const onAddSubLocation = (data: any) => {
    const validChildTypes = getValidChildTypes(location.type)
    const subLocationType =
      validChildTypes.length > 0 && validChildTypes[0]
        ? validChildTypes[0]
        : selectedSubLocationType

    const newSubLocation: AnyLocation = {
      ...data,
      id: crypto.randomUUID(),
      type: subLocationType,
      parentId: location.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as AnyLocation

    addLocation(newSubLocation)
    setIsAddingSubLocation(false)
    resetSubLocation()
  }

  const getAvailableParents = () => {
    const validChildTypes = getValidChildTypes(location.type)
    return validChildTypes
  }

  const renderLocationSpecificInfo = (loc: AnyLocation) => {
    switch (loc.type) {
      case 'plane':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(loc as any).planeType && (
              <div>
                <Label className="text-sm font-medium">Tipo de Plano</Label>
                <p className="text-sm text-muted-foreground capitalize">
                  {(loc as any).planeType}
                </p>
              </div>
            )}
            {(loc as any).alignment && (
              <div>
                <Label className="text-sm font-medium">Alineamiento</Label>
                <p className="text-sm text-muted-foreground">
                  {(loc as any).alignment}
                </p>
              </div>
            )}
          </div>
        )

      case 'continent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(loc as any).climate && (
              <div>
                <Label className="text-sm font-medium">Clima</Label>
                <p className="text-sm text-muted-foreground capitalize">
                  {(loc as any).climate}
                </p>
              </div>
            )}
          </div>
        )

      case 'region':
        const region = loc as Region
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {region.regionType && (
              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                <p className="text-sm text-muted-foreground capitalize">
                  {region.regionType}
                </p>
              </div>
            )}
            {region.population && (
              <div>
                <Label className="text-sm font-medium">Población</Label>
                <p className="text-sm text-muted-foreground">
                  {region.population.toLocaleString()} hab.
                </p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium">Peligro</Label>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  DANGER_LEVELS.find(d => d.value === region.dangerLevel)?.color
                )}
              >
                Nivel {region.dangerLevel}
              </Badge>
            </div>
            {region.government && (
              <div>
                <Label className="text-sm font-medium">Gobierno</Label>
                <p className="text-sm text-muted-foreground">
                  {region.government}
                </p>
              </div>
            )}
            {region.ruler && (
              <div>
                <Label className="text-sm font-medium">Gobernante</Label>
                <p className="text-sm text-muted-foreground">{region.ruler}</p>
              </div>
            )}
          </div>
        )

      case 'location':
        const locationData = loc as LocationInterface
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {locationData.locationType && (
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p className="text-sm text-muted-foreground capitalize">
                    {locationData.locationType}
                  </p>
                </div>
              )}
              {locationData.population && (
                <div>
                  <Label className="text-sm font-medium">Población</Label>
                  <p className="text-sm text-muted-foreground">
                    {locationData.population.toLocaleString()} hab.
                  </p>
                </div>
              )}
              {locationData.government && (
                <div>
                  <Label className="text-sm font-medium">Gobierno</Label>
                  <p className="text-sm text-muted-foreground">
                    {locationData.government}
                  </p>
                </div>
              )}
            </div>

            {locationData.defenses && (
              <div>
                <Label className="text-sm font-medium">Defensas</Label>
                <p className="text-sm text-muted-foreground">
                  {locationData.defenses}
                </p>
              </div>
            )}

            {locationData.services && locationData.services.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Servicios</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {locationData.services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {locationData.keyNPCs && locationData.keyNPCs.length > 0 && (
              <div>
                <Label className="text-sm font-medium">NPCs Clave</Label>
                <div className="space-y-2 mt-1">
                  {locationData.keyNPCs.map((npc, index) => (
                    <div
                      key={index}
                      className="p-2 bg-muted/50 rounded-md flex items-start gap-2"
                    >
                      <Users className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{npc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {npc.role}
                        </p>
                        {npc.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {npc.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showDMInfo && (
              <>
                {locationData.rumors && locationData.rumors.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Rumores (Solo DM)
                    </Label>
                    <div className="space-y-1 mt-1">
                      {locationData.rumors.map((rumor, index) => (
                        <p
                          key={index}
                          className="text-sm text-muted-foreground p-2 bg-amber-50 dark:bg-amber-950/20 rounded-md border-l-4 border-amber-200 dark:border-amber-800"
                        >
                          {rumor}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {locationData.secrets && locationData.secrets.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-red-600 dark:text-red-400">
                      Secretos (Solo DM)
                    </Label>
                    <div className="space-y-1 mt-1">
                      {locationData.secrets.map((secret, index) => (
                        <p
                          key={index}
                          className="text-sm text-muted-foreground p-2 bg-red-50 dark:bg-red-950/20 rounded-md border-l-4 border-red-200 dark:border-red-800"
                        >
                          {secret}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const breadcrumb = getBreadcrumb()
  const validChildTypes = getValidChildTypes(location.type)

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/maps')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Mapas
          </Button>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1"
                  onClick={() => {
                    if (item.id !== location.id) {
                      router.push(`/maps/${item.id}`)
                    }
                  }}
                  disabled={item.id === location.id}
                >
                  <div className="flex items-center gap-1">
                    {getLocationIcon(item.type, 'h-4 w-4')}
                    <span className="text-sm">{item.name}</span>
                  </div>
                </Button>
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* DM Info Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDMInfo(!showDMInfo)}
            className="flex items-center gap-2"
          >
            {showDMInfo ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
            {showDMInfo ? 'Ocultar Info DM' : 'Mostrar Info DM'}
          </Button>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </>
            )}
          </Button>

          {/* Add Sub-location */}
          {validChildTypes.length > 0 && validChildTypes[0] && (
            <Dialog
              open={isAddingSubLocation}
              onOpenChange={setIsAddingSubLocation}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar {getLocationTypeLabel(validChildTypes[0])}
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    Crear {getLocationTypeLabel(validChildTypes[0])} en{' '}
                    {location.name}
                  </DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={handleSubLocationSubmit(onAddSubLocation)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sub-name">Nombre *</Label>
                      <Input
                        id="sub-name"
                        {...subLocationRegister('name', { required: true })}
                        placeholder="Nombre de la ubicación"
                      />
                    </div>

                    <div>
                      <Label>Tipo</Label>
                      <Select
                        value={selectedSubLocationType}
                        onValueChange={(value: LocationType) => {
                          setSelectedSubLocationType(value)
                          setSubLocationValue('type', value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {validChildTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {getLocationTypeLabel(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sub-description">Descripción</Label>
                    <Textarea
                      id="sub-description"
                      {...subLocationRegister('description')}
                      placeholder="Descripción de la ubicación"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingSubLocation(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Crear</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Location Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-muted rounded-lg">
          {getLocationIcon(location.type, 'h-8 w-8')}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {isEditing ? (
              <Input
                {...register('name', { required: true })}
                className="text-2xl font-bold"
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">
                {location.name}
              </h1>
            )}
            <Badge className={cn('text-sm', getLocationColor(location.type))}>
              {getLocationTypeLabel(location.type)}
            </Badge>
          </div>
          {isEditing ? (
            <Textarea
              {...register('description')}
              placeholder="Descripción de la ubicación"
              rows={2}
            />
          ) : (
            <p className="text-lg text-muted-foreground">
              {location.description}
            </p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSave)}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      )}

      <Separator />

      {/* Location Details */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Información General</TabsTrigger>
          <TabsTrigger value="children">
            Sub-ubicaciones ({children.length})
          </TabsTrigger>
          <TabsTrigger value="notes">Notas del DM</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Ubicación</CardTitle>
            </CardHeader>
            <CardContent>{renderLocationSpecificInfo(location)}</CardContent>
          </Card>

          {location.tags && location.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Etiquetas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {location.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="children" className="space-y-4">
          {children.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No hay sub-ubicaciones
                </h3>
                <p className="text-muted-foreground mb-4">
                  {validChildTypes.length > 0 && validChildTypes[0]
                    ? `Agrega ${getLocationTypeLabel(validChildTypes[0]).toLowerCase()}s para organizar mejor esta área.`
                    : 'Esta ubicación no puede tener sub-ubicaciones.'}
                </p>
                {validChildTypes.length > 0 && (
                  <Button onClick={() => setIsAddingSubLocation(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Sub-ubicación
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map(child => (
                <Card
                  key={child.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => router.push(`/maps/${child.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getLocationIcon(child.type)}
                        <Badge
                          className={cn(
                            'text-xs',
                            getLocationColor(child.type)
                          )}
                        >
                          {getLocationTypeLabel(child.type)}
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {child.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Notas del Dungeon Master
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  {...register('notes')}
                  placeholder="Notas privadas del DM sobre esta ubicación..."
                  rows={6}
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {location.notes ? (
                    <p className="whitespace-pre-wrap">{location.notes}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No hay notas del DM para esta ubicación.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
