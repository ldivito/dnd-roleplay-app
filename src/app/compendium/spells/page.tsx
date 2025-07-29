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
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SpellSchema,
  type Spell,
  DND_SPELL_SCHOOLS,
  DND_SPELL_CLASSES,
} from '@/types/spell'
import AppLayout from '@/components/AppLayout'

type SpellFormData = Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>

export default function SpellsPage() {
  const { spells, addSpell, updateSpell, removeSpell } = useSessionStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSpell, setEditingSpell] = useState<Spell | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('')
  const [filterSchool, setFilterSchool] = useState<string>('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SpellFormData>({
    defaultValues: {
      level: 0,
      components: { verbal: false, somatic: false, material: false },
      classes: [],
      ritual: false,
      concentration: false,
      tags: [],
    },
  })

  const watchedComponents = watch('components')

  const onSubmit = (data: SpellFormData) => {
    const spellData: Spell = {
      ...data,
      id: editingSpell?.id || crypto.randomUUID(),
      createdAt: editingSpell?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (editingSpell) {
      updateSpell(editingSpell.id, spellData)
    } else {
      addSpell(spellData)
    }

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingSpell(null)
    reset()
  }

  const handleEdit = (spell: Spell) => {
    setEditingSpell(spell)
    reset(spell)
    setIsDialogOpen(true)
  }

  const handleDelete = (spellId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hechizo?')) {
      removeSpell(spellId)
    }
  }

  const filteredSpells = spells.filter(spell => {
    const matchesSearch =
      spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spell.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel =
      !filterLevel ||
      filterLevel === '__ALL__' ||
      spell.level.toString() === filterLevel
    const matchesSchool =
      !filterSchool ||
      filterSchool === '__ALL__' ||
      spell.school === filterSchool

    return matchesSearch && matchesLevel && matchesSchool
  })

  const getSpellLevelText = (level: number) => {
    if (level === 0) return 'Truco'
    return `Nivel ${level}`
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hechizos</h1>
            <p className="text-muted-foreground">
              Gestiona los hechizos de tu campaña
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Hechizo
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSpell ? 'Editar Hechizo' : 'Nuevo Hechizo'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Nombre del hechizo"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="level">Nivel *</Label>
                    <Select
                      onValueChange={value =>
                        setValue('level', parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                          <SelectItem key={level} value={level.toString()}>
                            {getSpellLevelText(level)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="school">Escuela *</Label>
                    <Select
                      onValueChange={value =>
                        setValue('school', value as SpellFormData['school'])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la escuela" />
                      </SelectTrigger>
                      <SelectContent>
                        {DND_SPELL_SCHOOLS.map(school => (
                          <SelectItem key={school} value={school}>
                            {school}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="castingTime">Tiempo de Lanzamiento *</Label>
                    <Input
                      id="castingTime"
                      {...register('castingTime')}
                      placeholder="ej: 1 acción"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="range">Alcance *</Label>
                    <Input
                      id="range"
                      {...register('range')}
                      placeholder="ej: 60 pies"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duración *</Label>
                    <Input
                      id="duration"
                      {...register('duration')}
                      placeholder="ej: Instantáneo"
                    />
                  </div>
                </div>

                <div>
                  <Label>Componentes</Label>
                  <div className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verbal"
                        checked={watchedComponents.verbal}
                        onCheckedChange={checked =>
                          setValue('components.verbal', !!checked)
                        }
                      />
                      <Label htmlFor="verbal">Verbal (V)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="somatic"
                        checked={watchedComponents.somatic}
                        onCheckedChange={checked =>
                          setValue('components.somatic', !!checked)
                        }
                      />
                      <Label htmlFor="somatic">Somático (S)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="material"
                        checked={watchedComponents.material}
                        onCheckedChange={checked =>
                          setValue('components.material', !!checked)
                        }
                      />
                      <Label htmlFor="material">Material (M)</Label>
                    </div>
                  </div>

                  {watchedComponents.material && (
                    <div className="mt-2">
                      <Input
                        {...register('components.materialDescription')}
                        placeholder="Descripción de componentes materiales"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Descripción del hechizo"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="higherLevels">A Niveles Superiores</Label>
                  <Textarea
                    id="higherLevels"
                    {...register('higherLevels')}
                    placeholder="Efectos a niveles superiores (opcional)"
                    rows={2}
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ritual" {...register('ritual')} />
                    <Label htmlFor="ritual">Ritual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="concentration"
                      {...register('concentration')}
                    />
                    <Label htmlFor="concentration">Concentración</Label>
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
                    {editingSpell ? 'Actualizar' : 'Crear'} Hechizo
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
                placeholder="Buscar hechizos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">Todos los niveles</SelectItem>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                <SelectItem key={level} value={level.toString()}>
                  {getSpellLevelText(level)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSchool} onValueChange={setFilterSchool}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Escuela" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">Todas las escuelas</SelectItem>
              {DND_SPELL_SCHOOLS.map(school => (
                <SelectItem key={school} value={school}>
                  {school}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Spells List */}
        <div className="grid gap-4">
          {filteredSpells.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No se encontraron hechizos
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSpells.map(spell => (
              <Card key={spell.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{spell.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {getSpellLevelText(spell.level)}
                        </Badge>
                        <Badge variant="outline">{spell.school}</Badge>
                        {spell.ritual && (
                          <Badge variant="outline">Ritual</Badge>
                        )}
                        {spell.concentration && (
                          <Badge variant="outline">Concentración</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(spell)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(spell.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tiempo:</span>{' '}
                      {spell.castingTime}
                    </div>
                    <div>
                      <span className="font-medium">Alcance:</span>{' '}
                      {spell.range}
                    </div>
                    <div>
                      <span className="font-medium">Duración:</span>{' '}
                      {spell.duration}
                    </div>
                    <div>
                      <span className="font-medium">Componentes:</span>{' '}
                      {[
                        spell.components.verbal && 'V',
                        spell.components.somatic && 'S',
                        spell.components.material && 'M',
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>

                  <Separator />

                  <p className="text-sm">{spell.description}</p>

                  {spell.higherLevels && (
                    <>
                      <Separator />
                      <p className="text-sm">
                        <span className="font-medium">
                          A Niveles Superiores:
                        </span>{' '}
                        {spell.higherLevels}
                      </p>
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
