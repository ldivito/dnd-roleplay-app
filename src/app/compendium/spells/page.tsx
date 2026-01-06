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
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Music,
  Volume2,
  Zap,
  Play,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SpellSchema,
  type Spell,
  DND_SPELL_SCHOOLS,
  DND_SPELL_CLASSES,
  MUSIC_SPELL_SCHOOLS,
  INSTRUMENT_CATEGORIES,
  MUSIC_GENRES,
  PERFORMANCE_QUALITIES,
  type InstrumentCategory,
  type MusicGenre,
} from '@/types/spell'
import MusicPerformanceDialog from '@/components/MusicPerformanceDialog'
import { getSampleSpellsWithIds } from '@/lib/sampleMusicSpells'

type SpellFormData = Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>

export default function SpellsPage() {
  const { spells, addSpell, updateSpell, removeSpell } = useSessionStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSpell, setEditingSpell] = useState<Spell | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('')
  const [filterSchool, setFilterSchool] = useState<string>('')
  const [showOnlyMusicSpells, setShowOnlyMusicSpells] = useState(false)
  const [performanceSpell, setPerformanceSpell] = useState<Spell | null>(null)
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false)

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
      isMusicBased: false,
      musicalComponents: {
        instrument: 'strings',
        genre: 'ballad',
        difficulty: 10,
        duration: 1,
        requiredProficiency: false,
        additionalInstruments: [],
      },
      performanceEffects: {},
      instrumentSpecificEffects: {},
    },
  })

  const watchedComponents = watch('components')
  const watchedIsMusicBased = watch('isMusicBased')
  const watchedMusicalComponents = watch('musicalComponents')

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

  const handlePerformSpell = (spell: Spell) => {
    setPerformanceSpell(spell)
    setIsPerformanceDialogOpen(true)
  }

  const handlePerformanceComplete = (result: any) => {
    console.log('Performance completed:', result)
    // Here you can integrate with combat system or session notes
  }

  const loadSampleSpells = () => {
    const samples = getSampleSpellsWithIds()
    samples.forEach(spell => addSpell(spell))
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
    const matchesMusicFilter = !showOnlyMusicSpells || spell.isMusicBased

    return matchesSearch && matchesLevel && matchesSchool && matchesMusicFilter
  })

  const getSpellLevelText = (level: number) => {
    if (level === 0) return 'Truco'
    return `Nivel ${level}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hechizos</h1>
          <p className="text-muted-foreground">
            Gestiona los hechizos de tu campaña
          </p>
        </div>

        <div className="flex space-x-2">
          <Button onClick={loadSampleSpells} variant="outline">
            <Music className="mr-2 h-4 w-4" />
            Cargar Hechizos de Ejemplo
          </Button>

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

                {/* Music-Based Spell Toggle */}
                <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
                  <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isMusicBased"
                      checked={watchedIsMusicBased}
                      onCheckedChange={checked =>
                        setValue('isMusicBased', !!checked)
                      }
                    />
                    <Label htmlFor="isMusicBased" className="font-medium">
                      Hechizo basado en música
                    </Label>
                  </div>
                </div>

                {/* Musical Components - Only show if music-based spell */}
                {watchedIsMusicBased && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-2 mb-3">
                      <Volume2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                        Componentes Musicales
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="instrument">
                          Instrumento Principal *
                        </Label>
                        <Select
                          onValueChange={value =>
                            setValue(
                              'musicalComponents.instrument',
                              value as InstrumentCategory
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona instrumento" />
                          </SelectTrigger>
                          <SelectContent>
                            {INSTRUMENT_CATEGORIES.map(instrument => (
                              <SelectItem
                                key={instrument.id}
                                value={instrument.id}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {instrument.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {instrument.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="genre">Género Musical *</Label>
                        <Select
                          onValueChange={value =>
                            setValue(
                              'musicalComponents.genre',
                              value as MusicGenre
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona género" />
                          </SelectTrigger>
                          <SelectContent>
                            {MUSIC_GENRES.map(genre => (
                              <SelectItem key={genre.id} value={genre.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {genre.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {genre.effects}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="difficulty">
                          Dificultad de Interpretación (DC) *
                        </Label>
                        <Input
                          id="difficulty"
                          type="number"
                          min="5"
                          max="30"
                          {...register('musicalComponents.difficulty', {
                            valueAsNumber: true,
                          })}
                          placeholder="10"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          DC 5-10: Fácil, DC 11-15: Moderado, DC 16-20: Difícil,
                          DC 21+: Épico
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="duration">
                          Duración de Interpretación *
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          max="10"
                          {...register('musicalComponents.duration', {
                            valueAsNumber: true,
                          })}
                          placeholder="1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Rondas requeridas para completar el hechizo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requiredProficiency"
                        checked={
                          watchedMusicalComponents?.requiredProficiency || false
                        }
                        onCheckedChange={checked =>
                          setValue(
                            'musicalComponents.requiredProficiency',
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor="requiredProficiency">
                        Requiere competencia con el instrumento
                      </Label>
                    </div>

                    {/* Performance Effects */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <Label className="font-medium">
                          Efectos según Calidad de Interpretación
                        </Label>
                      </div>

                      {PERFORMANCE_QUALITIES.map(quality => (
                        <div key={quality.id}>
                          <Label htmlFor={`performance-${quality.id}`}>
                            {quality.name} ({quality.range})
                          </Label>
                          <Textarea
                            id={`performance-${quality.id}`}
                            {...register(`performanceEffects.${quality.id}`)}
                            placeholder={`Efecto cuando la interpretación es ${quality.name.toLowerCase()}...`}
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="musicFilter"
            checked={showOnlyMusicSpells}
            onCheckedChange={checked => setShowOnlyMusicSpells(!!checked)}
          />
          <Label htmlFor="musicFilter" className="flex items-center space-x-1">
            <Music className="h-4 w-4" />
            <span>Solo hechizos musicales</span>
          </Label>
        </div>
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
                      {spell.ritual && <Badge variant="outline">Ritual</Badge>}
                      {spell.concentration && (
                        <Badge variant="outline">Concentración</Badge>
                      )}
                      {spell.isMusicBased && (
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800"
                        >
                          <Music className="h-3 w-3 mr-1" />
                          Musical
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {spell.isMusicBased && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePerformSpell(spell)}
                        className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 dark:border-purple-800"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
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
                    <span className="font-medium">Alcance:</span> {spell.range}
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

                {/* Musical Components Display */}
                {spell.isMusicBased && spell.musicalComponents && (
                  <>
                    <Separator />
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <Volume2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-purple-800 dark:text-purple-200">
                          Componentes Musicales
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Instrumento:</span>{' '}
                          {INSTRUMENT_CATEGORIES.find(
                            cat =>
                              cat.id === spell.musicalComponents?.instrument
                          )?.name || spell.musicalComponents.instrument}
                        </div>
                        <div>
                          <span className="font-medium">Género:</span>{' '}
                          {MUSIC_GENRES.find(
                            genre => genre.id === spell.musicalComponents?.genre
                          )?.name || spell.musicalComponents.genre}
                        </div>
                        <div>
                          <span className="font-medium">Dificultad:</span> DC{' '}
                          {spell.musicalComponents.difficulty}
                        </div>
                        <div>
                          <span className="font-medium">Duración:</span>{' '}
                          {spell.musicalComponents.duration} ronda
                          {spell.musicalComponents.duration > 1 ? 's' : ''}
                        </div>
                      </div>

                      {spell.musicalComponents.requiredProficiency && (
                        <div className="mt-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            Requiere competencia con el instrumento
                          </Badge>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {spell.higherLevels && (
                  <>
                    <Separator />
                    <p className="text-sm">
                      <span className="font-medium">A Niveles Superiores:</span>{' '}
                      {spell.higherLevels}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Music Performance Dialog */}
      <MusicPerformanceDialog
        spell={performanceSpell ?? undefined}
        isOpen={isPerformanceDialogOpen}
        onClose={() => {
          setIsPerformanceDialogOpen(false)
          setPerformanceSpell(null)
        }}
        onPerformanceComplete={handlePerformanceComplete}
      />
    </div>
  )
}
