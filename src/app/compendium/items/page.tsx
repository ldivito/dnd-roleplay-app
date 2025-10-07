'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSessionStore } from '@/stores/sessionStore'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Coins,
  Weight,
  Shield,
  Sword,
  Sparkles,
  Image as ImageIcon,
  X,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ItemSchema,
  type Item,
  DND_ABILITIES,
  type ResistanceType,
} from '@/types/item'
import { DynamicIcon } from '@/lib/iconResolver'

type ItemFormData = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>

export default function ItemsPage() {
  const {
    items,
    addItem,
    updateItem,
    removeItem,
    getTaxonomiesByCategory,
    lore,
  } = useSessionStore()

  // Get dynamic taxonomies from store
  const itemTypes = getTaxonomiesByCategory('ItemType')
  const itemRarities = getTaxonomiesByCategory('ItemRarity')
  const damageTypes = getTaxonomiesByCategory('DamageType')
  const equipmentSlots = getTaxonomiesByCategory('EquipmentSlot')
  const specialMaterials = getTaxonomiesByCategory('SpecialMaterial')
  const currencies = getTaxonomiesByCategory('Currency')
  const weaponTypes = getTaxonomiesByCategory('WeaponType')
  const armorTypes = getTaxonomiesByCategory('ArmorType')
  const resistanceTypes = getTaxonomiesByCategory('ResistanceType')
  const itemProperties = getTaxonomiesByCategory('ItemProperty')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterRarity, setFilterRarity] = useState<string>('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ItemFormData>({
    defaultValues: {
      requiresAttunement: false,
      isMagical: false,
      isCursed: false,
      isIdentified: true,
      isTradeable: true,
      isBound: false,
      consumable: false,
      stackable: false,
      tags: [],
      grantedResistances: [],
      grantedImmunities: [],
      advantageOn: [],
      disadvantageOn: [],
      itemProperties: [],
      loreIds: [],
      weaponProperties: {
        ammunition: false,
        finesse: false,
        heavy: false,
        light: false,
        loading: false,
        reach: false,
        special: false,
        twoHanded: false,
      },
      armorProperties: {
        stealthDisadvantage: false,
      },
    },
  })

  const watchedType = watch('type')
  const watchedValue = watch('value')
  const watchedValueRange = watch('estimatedValueRange')
  const watchedRequiresAttunement = watch('requiresAttunement')
  const watchedImageUrl = watch('imageUrl')
  const watchedDurability = watch('durability')
  const watchedGrantedResistances = watch('grantedResistances') || []
  const watchedGrantedImmunities = watch('grantedImmunities') || []
  const watchedAdvantageOn = watch('advantageOn') || []
  const watchedDisadvantageOn = watch('disadvantageOn') || []
  const watchedItemProperties = watch('itemProperties') || []
  const watchedLoreIds = watch('loreIds') || []

  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setValue('imageUrl', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const onSubmit = (data: ItemFormData) => {
    const itemData: Item = {
      ...data,
      id: editingItem?.id || crypto.randomUUID(),
      createdAt: editingItem?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (editingItem) {
      updateItem(editingItem.id, itemData)
    } else {
      addItem(itemData)
    }

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    reset()
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    reset(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (itemId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este objeto?')) {
      removeItem(itemId)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      !filterType || filterType === '__ALL__' || item.type === filterType
    const matchesRarity =
      !filterRarity ||
      filterRarity === '__ALL__' ||
      item.rarity === filterRarity

    return matchesSearch && matchesType && matchesRarity
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Común':
        return 'secondary'
      case 'Poco Común':
        return 'default'
      case 'Raro':
        return 'secondary'
      case 'Muy Raro':
        return 'destructive'
      case 'Legendario':
        return 'destructive'
      case 'Artefacto':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const addToArray = (
    field: 'grantedResistances' | 'grantedImmunities',
    value: ResistanceType
  ) => {
    const current = watch(field) || []
    if (!current.includes(value)) {
      setValue(field, [...current, value])
    }
  }

  const removeFromArray = (
    field: 'grantedResistances' | 'grantedImmunities',
    value: ResistanceType
  ) => {
    const current = watch(field) || []
    setValue(
      field,
      current.filter(v => v !== value)
    )
  }

  const addStringToArray = (field: 'advantageOn' | 'disadvantageOn') => {
    const current = watch(field) || []
    const value = prompt(
      `Agregar a ${field === 'advantageOn' ? 'Ventaja en' : 'Desventaja en'}:`
    )
    if (value && value.trim()) {
      setValue(field, [...current, value.trim()])
    }
  }

  const removeStringFromArray = (
    field: 'advantageOn' | 'disadvantageOn',
    index: number
  ) => {
    const current = watch(field) || []
    setValue(
      field,
      current.filter((_, i) => i !== index)
    )
  }

  const toggleItemProperty = (propertyName: string) => {
    const current = watch('itemProperties') || []
    if (current.includes(propertyName)) {
      setValue(
        'itemProperties',
        current.filter(p => p !== propertyName)
      )
    } else {
      setValue('itemProperties', [...current, propertyName])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Objetos y Equipo</h1>
          <p className="text-muted-foreground">
            Gestiona los objetos de tu campaña
          </p>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Gestionar Taxonomías
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Taxonomías de Objetos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/ItemProperty">
                  Propiedades de Objeto
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/ItemType">
                  Tipos de Objeto
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/ItemRarity">
                  Rarezas
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Armas y Armaduras</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/DamageType">
                  Tipos de Daño
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/WeaponType">
                  Tipos de Arma
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/ArmorType">
                  Tipos de Armadura
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/ResistanceType">
                  Tipos de Resistencia
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Otros</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/EquipmentSlot">
                  Ranuras de Equipo
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/SpecialMaterial">
                  Materiales Especiales
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/compendium/items/taxonomies/Currency">
                  Monedas
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Objeto
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Editar Objeto' : 'Nuevo Objeto'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="properties">Propiedades</TabsTrigger>
                    <TabsTrigger value="mechanics">Mecánicas</TabsTrigger>
                    <TabsTrigger value="practical">Práctico</TabsTrigger>
                    <TabsTrigger value="lore">Historia</TabsTrigger>
                  </TabsList>

                  {/* BASIC TAB */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                          id="name"
                          {...register('name')}
                          placeholder="Nombre del objeto"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="type">Tipo *</Label>
                        <Controller
                          name="type"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              {...(field.value && { value: field.value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {itemTypes.map(type => (
                                  <SelectItem key={type.id} value={type.name}>
                                    {type.icon && (
                                      <DynamicIcon
                                        icon={type.icon}
                                        className="h-4 w-4 mr-2 inline"
                                      />
                                    )}
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="rarity">Rareza *</Label>
                        <Controller
                          name="rarity"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              {...(field.value && { value: field.value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la rareza" />
                              </SelectTrigger>
                              <SelectContent>
                                {itemRarities.map(rarity => (
                                  <SelectItem
                                    key={rarity.id}
                                    value={rarity.name}
                                  >
                                    {rarity.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="weight">
                          <Weight className="inline h-4 w-4 mr-1" />
                          Peso (kg)
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          {...register('weight', { valueAsNumber: true })}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label>
                          <Coins className="inline h-4 w-4 mr-1" />
                          Valor
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={watchedValue?.amount || ''}
                            onChange={e =>
                              setValue('value', {
                                amount: parseFloat(e.target.value) || 0,
                                currency: watchedValue?.currency || 'gp',
                              })
                            }
                          />
                          <Select
                            onValueChange={value =>
                              setValue('value', {
                                amount: watchedValue?.amount || 0,
                                currency: value as
                                  | 'cp'
                                  | 'sp'
                                  | 'ep'
                                  | 'gp'
                                  | 'pp',
                              })
                            }
                            {...(watchedValue?.currency && {
                              value: watchedValue.currency,
                            })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Oro" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map(currency => {
                                const abbr = currency.metadata
                                  .abbreviation as string
                                return (
                                  <SelectItem key={currency.id} value={abbr}>
                                    {currency.icon && (
                                      <DynamicIcon
                                        icon={currency.icon}
                                        className="h-4 w-4 mr-1 inline"
                                      />
                                    )}
                                    {currency.name} ({abbr})
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <Label>Rango de Valor Estimado</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Mínimo
                            </Label>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="0"
                                value={watchedValueRange?.min || ''}
                                onChange={e =>
                                  setValue('estimatedValueRange', {
                                    min: parseFloat(e.target.value) || 0,
                                    minCurrency:
                                      watchedValueRange?.minCurrency || 'gp',
                                    max: watchedValueRange?.max || 0,
                                    maxCurrency:
                                      watchedValueRange?.maxCurrency || 'gp',
                                  })
                                }
                              />
                              <Select
                                onValueChange={value =>
                                  setValue('estimatedValueRange', {
                                    min: watchedValueRange?.min || 0,
                                    minCurrency: value as
                                      | 'cp'
                                      | 'sp'
                                      | 'ep'
                                      | 'gp'
                                      | 'pp',
                                    max: watchedValueRange?.max || 0,
                                    maxCurrency:
                                      watchedValueRange?.maxCurrency || 'gp',
                                  })
                                }
                                {...(watchedValueRange?.minCurrency && {
                                  value: watchedValueRange.minCurrency,
                                })}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Oro" />
                                </SelectTrigger>
                                <SelectContent>
                                  {currencies.map(currency => {
                                    const abbr = currency.metadata
                                      .abbreviation as string
                                    return (
                                      <SelectItem
                                        key={currency.id}
                                        value={abbr}
                                      >
                                        {currency.icon && (
                                          <span className="mr-1">
                                            {currency.icon}
                                          </span>
                                        )}
                                        {currency.name} ({abbr})
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Máximo
                            </Label>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="0"
                                value={watchedValueRange?.max || ''}
                                onChange={e =>
                                  setValue('estimatedValueRange', {
                                    min: watchedValueRange?.min || 0,
                                    minCurrency:
                                      watchedValueRange?.minCurrency || 'gp',
                                    max: parseFloat(e.target.value) || 0,
                                    maxCurrency:
                                      watchedValueRange?.maxCurrency || 'gp',
                                  })
                                }
                              />
                              <Select
                                onValueChange={value =>
                                  setValue('estimatedValueRange', {
                                    min: watchedValueRange?.min || 0,
                                    minCurrency:
                                      watchedValueRange?.minCurrency || 'gp',
                                    max: watchedValueRange?.max || 0,
                                    maxCurrency: value as
                                      | 'cp'
                                      | 'sp'
                                      | 'ep'
                                      | 'gp'
                                      | 'pp',
                                  })
                                }
                                {...(watchedValueRange?.maxCurrency && {
                                  value: watchedValueRange.maxCurrency,
                                })}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Oro" />
                                </SelectTrigger>
                                <SelectContent>
                                  {currencies.map(currency => {
                                    const abbr = currency.metadata
                                      .abbreviation as string
                                    return (
                                      <SelectItem
                                        key={currency.id}
                                        value={abbr}
                                      >
                                        {currency.icon && (
                                          <span className="mr-1">
                                            {currency.icon}
                                          </span>
                                        )}
                                        {currency.name} ({abbr})
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <Label>
                          <ImageIcon className="inline h-4 w-4 mr-1" />
                          Imagen del Objeto
                        </Label>

                        {/* Drag and Drop Zone */}
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            isDragging
                              ? 'border-primary bg-primary/10'
                              : 'border-muted-foreground/25 hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="file"
                            id="imageFile"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="imageFile"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Arrastra una imagen aquí o haz clic para
                              seleccionar
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, GIF hasta 5MB
                            </p>
                          </label>
                        </div>

                        {/* URL Input Alternative */}
                        <div className="mt-3">
                          <Label
                            htmlFor="imageUrl"
                            className="text-sm text-muted-foreground"
                          >
                            O introduce una URL
                          </Label>
                          <Input
                            id="imageUrl"
                            value={
                              watchedImageUrl?.startsWith('data:')
                                ? ''
                                : watchedImageUrl || ''
                            }
                            onChange={e => setValue('imageUrl', e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="mt-1"
                          />
                        </div>

                        {/* Image Preview */}
                        {watchedImageUrl && (
                          <div className="mt-4 relative">
                            <Label className="text-sm">Vista Previa</Label>
                            <div className="mt-2 relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                              <Image
                                src={watchedImageUrl}
                                alt="Vista previa"
                                fill
                                className="object-contain"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setValue('imageUrl', '')}
                              className="mt-2"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Eliminar imagen
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="col-span-2">
                        <Label>Durabilidad</Label>
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Actual"
                              value={watchedDurability?.current || ''}
                              onChange={e =>
                                setValue('durability', {
                                  current: parseFloat(e.target.value) || 0,
                                  max: watchedDurability?.max || 100,
                                })
                              }
                            />
                          </div>
                          <span className="flex items-center">/</span>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Máximo"
                              value={watchedDurability?.max || ''}
                              onChange={e =>
                                setValue('durability', {
                                  current: watchedDurability?.current || 0,
                                  max: parseFloat(e.target.value) || 100,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="description">Descripción *</Label>
                        <Textarea
                          id="description"
                          {...register('description')}
                          placeholder="Descripción del objeto"
                          rows={4}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-500">
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <Label>Propiedades del Objeto</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {itemProperties.map(property => (
                            <Badge
                              key={property.id}
                              variant={
                                watchedItemProperties.includes(property.name)
                                  ? 'default'
                                  : 'outline'
                              }
                              className="cursor-pointer"
                              onClick={() => toggleItemProperty(property.name)}
                            >
                              {property.icon && (
                                <span className="mr-1">{property.icon}</span>
                              )}
                              {property.name}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Haz clic en las propiedades para
                          activarlas/desactivarlas. Las propiedades
                          seleccionadas se mostrarán en la pestaña Práctico.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* PROPERTIES TAB */}
                  <TabsContent value="properties" className="space-y-4">
                    {watchedType === 'Arma' && (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <Sword className="mr-2 h-5 w-5" />
                          Propiedades de Arma
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="damage">Daño</Label>
                            <Input
                              id="damage"
                              {...register('damage')}
                              placeholder="ej: 1d8"
                            />
                          </div>

                          <div>
                            <Label htmlFor="damageType">Tipo de Daño</Label>
                            <Controller
                              name="damageType"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  {...(field.value && { value: field.value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tipo de daño" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {damageTypes.map(type => (
                                      <SelectItem
                                        key={type.id}
                                        value={type.name}
                                      >
                                        {type.icon && (
                                          <span className="mr-2">
                                            {type.icon}
                                          </span>
                                        )}
                                        {type.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="finesse"
                              {...register('weaponProperties.finesse')}
                            />
                            <Label htmlFor="finesse">Sutil</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="light"
                              {...register('weaponProperties.light')}
                            />
                            <Label htmlFor="light">Ligera</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="heavy"
                              {...register('weaponProperties.heavy')}
                            />
                            <Label htmlFor="heavy">Pesada</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="reach"
                              {...register('weaponProperties.reach')}
                            />
                            <Label htmlFor="reach">Alcance</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="twoHanded"
                              {...register('weaponProperties.twoHanded')}
                            />
                            <Label htmlFor="twoHanded">Dos manos</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="ammunition"
                              {...register('weaponProperties.ammunition')}
                            />
                            <Label htmlFor="ammunition">Munición</Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {watchedType === 'Armadura' && (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <Shield className="mr-2 h-5 w-5" />
                          Propiedades de Armadura
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="armorClass">
                              Clase de Armadura
                            </Label>
                            <Input
                              id="armorClass"
                              type="number"
                              {...register('armorProperties.armorClass', {
                                valueAsNumber: true,
                              })}
                              placeholder="10"
                            />
                          </div>

                          <div>
                            <Label htmlFor="maxDexBonus">Máx. Bonus Dex</Label>
                            <Input
                              id="maxDexBonus"
                              type="number"
                              {...register('armorProperties.maxDexBonus', {
                                valueAsNumber: true,
                              })}
                              placeholder="Sin límite"
                            />
                          </div>

                          <div>
                            <Label htmlFor="minStrength">Fuerza Mínima</Label>
                            <Input
                              id="minStrength"
                              type="number"
                              {...register('armorProperties.minStrength', {
                                valueAsNumber: true,
                              })}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="stealthDisadvantage"
                            {...register('armorProperties.stealthDisadvantage')}
                          />
                          <Label htmlFor="stealthDisadvantage">
                            Desventaja en Sigilo
                          </Label>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="equipmentSlot">Ranura de Equipo</Label>
                        <Controller
                          name="equipmentSlot"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              {...(field.value && { value: field.value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona ranura" />
                              </SelectTrigger>
                              <SelectContent>
                                {equipmentSlots.map(slot => (
                                  <SelectItem key={slot.id} value={slot.name}>
                                    {slot.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="specialMaterial">
                          Material Especial
                        </Label>
                        <Controller
                          name="specialMaterial"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              {...(field.value && { value: field.value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona material" />
                              </SelectTrigger>
                              <SelectContent>
                                {specialMaterials.map(material => (
                                  <SelectItem
                                    key={material.id}
                                    value={material.name}
                                  >
                                    {material.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* MECHANICS TAB */}
                  <TabsContent value="mechanics" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="armorClassBonus">
                          Bonus a Clase de Armadura
                        </Label>
                        <Input
                          id="armorClassBonus"
                          type="number"
                          {...register('armorClassBonus', {
                            valueAsNumber: true,
                          })}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Resistencias Otorgadas</Label>
                        <div className="flex flex-wrap gap-2">
                          {resistanceTypes.map(type => (
                            <Badge
                              key={type.id}
                              variant={
                                watchedGrantedResistances.includes(
                                  type.name as ResistanceType
                                )
                                  ? 'default'
                                  : 'outline'
                              }
                              className="cursor-pointer"
                              onClick={() =>
                                watchedGrantedResistances.includes(
                                  type.name as ResistanceType
                                )
                                  ? removeFromArray(
                                      'grantedResistances',
                                      type.name as ResistanceType
                                    )
                                  : addToArray(
                                      'grantedResistances',
                                      type.name as ResistanceType
                                    )
                              }
                            >
                              {type.icon && (
                                <DynamicIcon
                                  icon={type.icon}
                                  className="h-3 w-3 mr-1 inline"
                                />
                              )}
                              {type.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Inmunidades Otorgadas</Label>
                        <div className="flex flex-wrap gap-2">
                          {resistanceTypes.map(type => (
                            <Badge
                              key={type.id}
                              variant={
                                watchedGrantedImmunities.includes(
                                  type.name as ResistanceType
                                )
                                  ? 'default'
                                  : 'outline'
                              }
                              className="cursor-pointer"
                              onClick={() =>
                                watchedGrantedImmunities.includes(
                                  type.name as ResistanceType
                                )
                                  ? removeFromArray(
                                      'grantedImmunities',
                                      type.name as ResistanceType
                                    )
                                  : addToArray(
                                      'grantedImmunities',
                                      type.name as ResistanceType
                                    )
                              }
                            >
                              {type.icon && (
                                <DynamicIcon
                                  icon={type.icon}
                                  className="h-3 w-3 mr-1 inline"
                                />
                              )}
                              {type.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Ventaja en</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addStringToArray('advantageOn')}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {watchedAdvantageOn.map((item, index) => (
                            <Badge key={index} variant="default">
                              {item}
                              <X
                                className="ml-1 h-3 w-3 cursor-pointer"
                                onClick={() =>
                                  removeStringFromArray('advantageOn', index)
                                }
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Desventaja en</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addStringToArray('disadvantageOn')}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {watchedDisadvantageOn.map((item, index) => (
                            <Badge key={index} variant="destructive">
                              {item}
                              <X
                                className="ml-1 h-3 w-3 cursor-pointer"
                                onClick={() =>
                                  removeStringFromArray('disadvantageOn', index)
                                }
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* PRACTICAL TAB */}
                  <TabsContent value="practical" className="space-y-4">
                    <div className="space-y-4">
                      {/* Only show if "Tiene Almacenamiento" property is enabled */}
                      {watchedItemProperties.includes(
                        'Tiene Almacenamiento'
                      ) && (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <h3 className="font-medium">
                            Capacidad de Contenedor
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="containerVolume">
                                Volumen (litros)
                              </Label>
                              <Input
                                id="containerVolume"
                                type="number"
                                placeholder="0"
                                value={watch('containerCapacity')?.volume || ''}
                                onChange={e =>
                                  setValue('containerCapacity', {
                                    volume: parseFloat(e.target.value) || 0,
                                    weightLimit:
                                      watch('containerCapacity')?.weightLimit ||
                                      0,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="containerWeight">
                                Límite de Peso (kg)
                              </Label>
                              <Input
                                id="containerWeight"
                                type="number"
                                placeholder="0"
                                value={
                                  watch('containerCapacity')?.weightLimit || ''
                                }
                                onChange={e =>
                                  setValue('containerCapacity', {
                                    volume:
                                      watch('containerCapacity')?.volume || 0,
                                    weightLimit:
                                      parseFloat(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Only show if "Emite Luz" property is enabled */}
                      {watchedItemProperties.includes('Emite Luz') && (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <h3 className="font-medium">Fuente de Luz</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="lightRadius">Radio (pies)</Label>
                              <Input
                                id="lightRadius"
                                type="number"
                                placeholder="0"
                                value={watch('lightSource')?.radius || ''}
                                onChange={e =>
                                  setValue('lightSource', {
                                    radius: parseFloat(e.target.value) || 0,
                                    duration:
                                      watch('lightSource')?.duration || '',
                                    type:
                                      watch('lightSource')?.type || 'Bright',
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="lightDuration">Duración</Label>
                              <Input
                                id="lightDuration"
                                placeholder="ej: 1 hora, 8 horas"
                                value={watch('lightSource')?.duration || ''}
                                onChange={e =>
                                  setValue('lightSource', {
                                    radius: watch('lightSource')?.radius || 0,
                                    duration: e.target.value,
                                    type:
                                      watch('lightSource')?.type || 'Bright',
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="lightType">Tipo de Luz</Label>
                              {(() => {
                                const lightType = watch('lightSource')?.type
                                return (
                                  <Select
                                    onValueChange={value =>
                                      setValue('lightSource', {
                                        radius:
                                          watch('lightSource')?.radius || 0,
                                        duration:
                                          watch('lightSource')?.duration || '',
                                        type: value as
                                          | 'Bright'
                                          | 'Dim'
                                          | 'Both',
                                      })
                                    }
                                    {...(lightType ? { value: lightType } : {})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Tipo de luz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Bright">
                                        Brillante
                                      </SelectItem>
                                      <SelectItem value="Dim">Tenue</SelectItem>
                                      <SelectItem value="Both">
                                        Ambas
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                )
                              })()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Show if "Mágico" property is enabled */}
                      {watchedItemProperties.includes('Mágico') && (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <h3 className="font-medium">Propiedades Mágicas</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="charges">Cargas Actuales</Label>
                              <Input
                                id="charges"
                                type="number"
                                {...register('charges', {
                                  valueAsNumber: true,
                                })}
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <Label htmlFor="maxCharges">Cargas Máximas</Label>
                              <Input
                                id="maxCharges"
                                type="number"
                                {...register('maxCharges', {
                                  valueAsNumber: true,
                                })}
                                placeholder="0"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="hiddenProperties">
                              Propiedades Ocultas
                            </Label>
                            <Textarea
                              id="hiddenProperties"
                              {...register('hiddenProperties')}
                              placeholder="Propiedades que se revelan al identificar"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}

                      {/* Show if "Requiere Sintonización" property is enabled */}
                      {watchedItemProperties.includes(
                        'Requiere Sintonización'
                      ) && (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <h3 className="font-medium">
                            Requisitos de Sintonización
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="attunementClasses">
                                Clases (separadas por coma)
                              </Label>
                              <Input
                                id="attunementClasses"
                                placeholder="ej: Mago, Hechicero"
                                onChange={e => {
                                  const classes = e.target.value
                                    .split(',')
                                    .map(c => c.trim())
                                    .filter(Boolean)
                                  setValue('attunementRequirements', {
                                    ...watch('attunementRequirements'),
                                    classes,
                                  })
                                }}
                                value={
                                  watch(
                                    'attunementRequirements'
                                  )?.classes?.join(', ') || ''
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="attunementRaces">
                                Razas (separadas por coma)
                              </Label>
                              <Input
                                id="attunementRaces"
                                placeholder="ej: Elfo, Enano"
                                onChange={e => {
                                  const races = e.target.value
                                    .split(',')
                                    .map(r => r.trim())
                                    .filter(Boolean)
                                  setValue('attunementRequirements', {
                                    ...watch('attunementRequirements'),
                                    races,
                                  })
                                }}
                                value={
                                  watch('attunementRequirements')?.races?.join(
                                    ', '
                                  ) || ''
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="attunementAlignment">
                                Alineamiento
                              </Label>
                              <Input
                                id="attunementAlignment"
                                placeholder="ej: Caótico Bueno"
                                {...register(
                                  'attunementRequirements.alignment'
                                )}
                              />
                            </div>
                            <div>
                              <Label htmlFor="attunementMinLevel">
                                Nivel Mínimo
                              </Label>
                              <Input
                                id="attunementMinLevel"
                                type="number"
                                placeholder="1"
                                {...register(
                                  'attunementRequirements.minimumLevel',
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="attunementCustom">
                                Requisitos Personalizados
                              </Label>
                              <Input
                                id="attunementCustom"
                                placeholder="ej: Debe tener el don Iniciado en Magia"
                                {...register('attunementRequirements.custom')}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Always show item set fields */}
                      <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-medium">Conjunto de Objetos</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="itemSet">Nombre del Conjunto</Label>
                            <Input
                              id="itemSet"
                              {...register('itemSet')}
                              placeholder="ej: Armadura del Dragón Rojo"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="setBonus">Bonus del Conjunto</Label>
                          <Textarea
                            id="setBonus"
                            {...register('setBonus')}
                            placeholder="Descripción del bonus al completar el conjunto"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Message when no properties are selected */}
                      {!watchedItemProperties.includes(
                        'Tiene Almacenamiento'
                      ) &&
                        !watchedItemProperties.includes('Emite Luz') &&
                        !watchedItemProperties.includes('Mágico') &&
                        !watchedItemProperties.includes(
                          'Requiere Sintonización'
                        ) && (
                          <div className="p-6 text-center text-muted-foreground">
                            <p>
                              Selecciona propiedades en la pestaña Básico para
                              configurar características especiales del objeto.
                            </p>
                          </div>
                        )}
                    </div>
                  </TabsContent>

                  {/* LORE TAB */}
                  <TabsContent value="lore" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="crafter">Creador/Artesano</Label>
                        <Input
                          id="crafter"
                          {...register('crafter')}
                          placeholder="ej: Mordenkainen el Mago"
                        />
                      </div>

                      <div>
                        <Label htmlFor="historicalSignificance">
                          Significado Histórico
                        </Label>
                        <Textarea
                          id="historicalSignificance"
                          {...register('historicalSignificance')}
                          placeholder="Historia y leyendas sobre este objeto"
                          rows={4}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Entradas de Historia Vinculadas</Label>
                        <p className="text-sm text-muted-foreground">
                          Conecta este objeto con entradas del sistema de
                          historia del mundo
                        </p>
                        <div className="space-y-2 p-4 border rounded-lg">
                          {lore.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No hay entradas de historia disponibles. Crea
                              algunas en la sección de Historia.
                            </p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {lore.map(loreEntry => (
                                <Badge
                                  key={loreEntry.id}
                                  variant={
                                    watchedLoreIds.includes(loreEntry.id)
                                      ? 'default'
                                      : 'outline'
                                  }
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const current = watch('loreIds') || []
                                    if (current.includes(loreEntry.id)) {
                                      setValue(
                                        'loreIds',
                                        current.filter(
                                          id => id !== loreEntry.id
                                        )
                                      )
                                    } else {
                                      setValue('loreIds', [
                                        ...current,
                                        loreEntry.id,
                                      ])
                                    }
                                  }}
                                >
                                  {loreEntry.title}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label htmlFor="source">Fuente</Label>
                        <Input
                          id="source"
                          {...register('source')}
                          placeholder="ej: Manual del Jugador"
                        />
                      </div>

                      <div>
                        <Label htmlFor="page">Página</Label>
                        <Input
                          id="page"
                          type="number"
                          {...register('page', { valueAsNumber: true })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Actualizar' : 'Crear'} Objeto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar objetos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Todos los tipos</SelectItem>
            {itemTypes.map(type => (
              <SelectItem key={type.id} value={type.name}>
                {type.icon && <span className="mr-2">{type.icon}</span>}
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterRarity} onValueChange={setFilterRarity}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Rareza" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">Todas las rarezas</SelectItem>
            {itemRarities.map(rarity => (
              <SelectItem key={rarity.id} value={rarity.name}>
                {rarity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items List */}
      <div className="grid gap-4">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No se encontraron objetos</p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map(item => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {item.imageUrl && (
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover rounded border"
                        />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="secondary">{item.type}</Badge>
                        <Badge variant={getRarityColor(item.rarity)}>
                          {item.rarity}
                        </Badge>
                        {item.isMagical && (
                          <Badge variant="outline">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Mágico
                          </Badge>
                        )}
                        {item.requiresAttunement && (
                          <Badge variant="outline">Sintonización</Badge>
                        )}
                        {item.isCursed && (
                          <Badge variant="destructive">Maldito</Badge>
                        )}
                        {item.consumable && (
                          <Badge variant="outline">Consumible</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {item.weight && (
                    <div>
                      <span className="font-medium">Peso:</span> {item.weight}{' '}
                      kg
                    </div>
                  )}
                  {item.value && (
                    <div className="flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      <span className="font-medium">Valor:</span>{' '}
                      {item.value.amount} {item.value.currency}
                    </div>
                  )}
                  {item.durability && (
                    <div>
                      <span className="font-medium">Durabilidad:</span>{' '}
                      {item.durability.current}/{item.durability.max}
                    </div>
                  )}
                  {item.damage && (
                    <div>
                      <span className="font-medium">Daño:</span> {item.damage}{' '}
                      {item.damageType}
                    </div>
                  )}
                  {item.armorProperties?.armorClass && (
                    <div>
                      <span className="font-medium">CA:</span>{' '}
                      {item.armorProperties.armorClass}
                    </div>
                  )}
                  {item.armorClassBonus && (
                    <div>
                      <span className="font-medium">Bonus CA:</span> +
                      {item.armorClassBonus}
                    </div>
                  )}
                </div>

                <Separator />

                <p className="text-sm">{item.description}</p>

                {item.grantedResistances &&
                  item.grantedResistances.length > 0 && (
                    <>
                      <Separator />
                      <div className="text-sm">
                        <span className="font-medium">Resistencias:</span>{' '}
                        {item.grantedResistances.join(', ')}
                      </div>
                    </>
                  )}

                {item.grantedImmunities &&
                  item.grantedImmunities.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Inmunidades:</span>{' '}
                      {item.grantedImmunities.join(', ')}
                    </div>
                  )}

                {(item.charges !== undefined ||
                  item.crafter ||
                  item.specialMaterial) && (
                  <>
                    <Separator />
                    <div className="text-sm space-y-1">
                      {item.charges !== undefined && (
                        <p>
                          <span className="font-medium">Cargas:</span>{' '}
                          {item.charges}
                          {item.maxCharges && ` / ${item.maxCharges}`}
                        </p>
                      )}
                      {item.crafter && (
                        <p>
                          <span className="font-medium">Creador:</span>{' '}
                          {item.crafter}
                        </p>
                      )}
                      {item.specialMaterial &&
                        item.specialMaterial !== 'Ninguno' && (
                          <p>
                            <span className="font-medium">Material:</span>{' '}
                            {item.specialMaterial}
                          </p>
                        )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
