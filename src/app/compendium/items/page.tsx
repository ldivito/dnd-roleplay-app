'use client'

import React, { useState } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Search, Coins } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ItemSchema,
  type Item,
  DND_ITEM_TYPES,
  DND_RARITIES,
  DND_DAMAGE_TYPES,
  DND_CURRENCIES,
} from '@/types/item'
import AppLayout from '@/components/AppLayout'

type ItemFormData = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>

export default function ItemsPage() {
  const { items, addItem, updateItem, removeItem } = useSessionStore()
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
    formState: { errors },
  } = useForm<ItemFormData>({
    defaultValues: {
      requiresAttunement: false,
      consumable: false,
      stackable: false,
      tags: [],
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Objetos y Equipo</h1>
            <p className="text-muted-foreground">
              Gestiona los objetos de tu campaña
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Objeto
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Editar Objeto' : 'Nuevo Objeto'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
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
                    <Select
                      onValueChange={value =>
                        setValue('type', value as ItemFormData['type'])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {DND_ITEM_TYPES.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rarity">Rareza *</Label>
                    <Select
                      onValueChange={value =>
                        setValue('rarity', value as ItemFormData['rarity'])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la rareza" />
                      </SelectTrigger>
                      <SelectContent>
                        {DND_RARITIES.map(rarity => (
                          <SelectItem key={rarity} value={rarity}>
                            {rarity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="weight">Peso (lb)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      {...register('weight', { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label>Valor</Label>
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
                            currency: value as 'cp' | 'sp' | 'ep' | 'gp' | 'pp',
                          })
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="gp" />
                        </SelectTrigger>
                        <SelectContent>
                          {DND_CURRENCIES.map(currency => (
                            <SelectItem
                              key={currency.value}
                              value={currency.value}
                            >
                              {currency.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Weapon Properties */}
                {watchedType === 'Arma' && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium">Propiedades de Arma</h3>

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
                        <Select
                          onValueChange={value => setValue('damageType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de daño" />
                          </SelectTrigger>
                          <SelectContent>
                            {DND_DAMAGE_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

                {/* Armor Properties */}
                {watchedType === 'Armadura' && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium">Propiedades de Armadura</h3>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="armorClass">Clase de Armadura</Label>
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

                <div>
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

                {/* Magic Item Properties */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-medium">Propiedades Especiales</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requiresAttunement"
                        {...register('requiresAttunement')}
                      />
                      <Label htmlFor="requiresAttunement">
                        Requiere Sintonización
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="consumable" {...register('consumable')} />
                      <Label htmlFor="consumable">Consumible</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="charges">Cargas Actuales</Label>
                      <Input
                        id="charges"
                        type="number"
                        {...register('charges', { valueAsNumber: true })}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxCharges">Cargas Máximas</Label>
                      <Input
                        id="maxCharges"
                        type="number"
                        {...register('maxCharges', { valueAsNumber: true })}
                        placeholder="0"
                      />
                    </div>
                  </div>
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
                    {editingItem ? 'Actualizar' : 'Crear'} Objeto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
              {DND_ITEM_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
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
              {DND_RARITIES.map(rarity => (
                <SelectItem key={rarity} value={rarity}>
                  {rarity}
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
                <p className="text-muted-foreground">
                  No se encontraron objetos
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map(item => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{item.type}</Badge>
                        <Badge variant={getRarityColor(item.rarity)}>
                          {item.rarity}
                        </Badge>
                        {item.requiresAttunement && (
                          <Badge variant="outline">Sintonización</Badge>
                        )}
                        {item.consumable && (
                          <Badge variant="outline">Consumible</Badge>
                        )}
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
                        lb
                      </div>
                    )}
                    {item.value && (
                      <div className="flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        <span className="font-medium">Valor:</span>{' '}
                        {item.value.amount} {item.value.currency}
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
                  </div>

                  <Separator />

                  <p className="text-sm">{item.description}</p>

                  {(item.charges !== undefined ||
                    item.attunementRequirements) && (
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
                        {item.attunementRequirements && (
                          <p>
                            <span className="font-medium">Sintonización:</span>{' '}
                            {item.attunementRequirements}
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
    </AppLayout>
  )
}
