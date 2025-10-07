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
  Filter,
  Music,
  Volume2,
  Zap,
  Play,
  FileText,
  Stars,
  Sparkles,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SongSchema,
  type Song,
  DND_SONG_CLASSES,
  type InstrumentCategory,
  type MusicGenre,
} from '@/types/song'
import MusicPerformanceDialog from '@/components/MusicPerformanceDialog'
import { getSampleSongsWithIds } from '@/lib/sampleSongs'

type SongFormData = Omit<Song, 'id' | 'createdAt' | 'updatedAt'>

export default function SongsPage() {
  const { songs, addSong, updateSong, removeSong, getTaxonomiesByCategory } =
    useSessionStore()

  // Get dynamic taxonomies from store
  const songSchools = getTaxonomiesByCategory('SongSchool')
  const instrumentTypes = getTaxonomiesByCategory('InstrumentType')
  const musicGenres = getTaxonomiesByCategory('MusicGenre')
  const songComponents = getTaxonomiesByCategory('SongComponent')
  const performanceQualities = getTaxonomiesByCategory('PerformanceQuality')
  const songRanges = getTaxonomiesByCategory('SongRange')
  const songDurations = getTaxonomiesByCategory('SongDuration')
  const songProperties = getTaxonomiesByCategory('SongProperty')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('')
  const [filterSchool, setFilterSchool] = useState<string>('')
  const [showOnlyMusicSongs, setShowOnlyMusicSongs] = useState(false)
  const [performanceSong, setPerformanceSong] = useState<Song | null>(null)
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SongFormData>({
    defaultValues: {
      level: 0,
      components: { verbal: false, somatic: false, material: false },
      classes: [],
      ritual: false,
      concentration: false,
      tags: [],
      isMusicBased: true,
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
      songProperties: [],
      loreIds: [],
    },
  })

  const watchedComponents = watch('components')
  const watchedIsMusicBased = watch('isMusicBased')
  const watchedMusicalComponents = watch('musicalComponents')

  const onSubmit = (data: SongFormData) => {
    const songData: Song = {
      ...data,
      id: editingSong?.id || crypto.randomUUID(),
      createdAt: editingSong?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (editingSong) {
      updateSong(editingSong.id, songData)
    } else {
      addSong(songData)
    }

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingSong(null)
    reset()
  }

  const handleEdit = (song: Song) => {
    setEditingSong(song)
    reset(song)
    setIsDialogOpen(true)
  }

  const handleDelete = (songId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta canción?')) {
      removeSong(songId)
    }
  }

  const handlePerformSong = (song: Song) => {
    setPerformanceSong(song)
    setIsPerformanceDialogOpen(true)
  }

  const handlePerformanceComplete = (result: any) => {
    console.log('Performance completed:', result)
    // Here you can integrate with combat system or session notes
  }

  const loadSampleSongs = () => {
    const samples = getSampleSongsWithIds()
    samples.forEach(song => addSong(song))
  }

  const filteredSongs = songs.filter(song => {
    const matchesSearch =
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel =
      !filterLevel ||
      filterLevel === '__ALL__' ||
      song.level.toString() === filterLevel
    const matchesSchool =
      !filterSchool ||
      filterSchool === '__ALL__' ||
      song.school === filterSchool
    const matchesMusicFilter = !showOnlyMusicSongs || song.isMusicBased

    return matchesSearch && matchesLevel && matchesSchool && matchesMusicFilter
  })

  const getSongLevelText = (level: number) => {
    if (level === 0) return 'Truco'
    return `Nivel ${level}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Canciones</h1>
          <p className="text-muted-foreground">
            Gestiona las canciones de tu campaña
          </p>
        </div>

        <div className="flex space-x-2">
          <Button onClick={loadSampleSongs} variant="outline">
            <Music className="mr-2 h-4 w-4" />
            Cargar Canciones de Ejemplo
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Canción
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-purple-600" />
                  {editingSong ? 'Editar Canción' : 'Nueva Canción'}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <Tabs
                  defaultValue="general"
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                      value="general"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      General
                    </TabsTrigger>
                    <TabsTrigger
                      value="components"
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Componentes
                    </TabsTrigger>
                    <TabsTrigger
                      value="musical"
                      className="flex items-center gap-2"
                    >
                      <Volume2 className="h-4 w-4" />
                      Musical
                    </TabsTrigger>
                    <TabsTrigger
                      value="properties"
                      className="flex items-center gap-2"
                    >
                      <Stars className="h-4 w-4" />
                      Propiedades
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-y-auto mt-4 pr-2">
                    {/* General Tab */}
                    <TabsContent value="general" className="space-y-4 mt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nombre *</Label>
                          <Input
                            id="name"
                            {...register('name')}
                            placeholder="Nombre de la canción"
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
                            value={watch('level')?.toString()}
                            onValueChange={value =>
                              setValue('level', parseInt(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el nivel" />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                                <SelectItem
                                  key={level}
                                  value={level.toString()}
                                >
                                  {getSongLevelText(level)}
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
                            value={watch('school') || ''}
                            onValueChange={value =>
                              setValue(
                                'school',
                                value as SongFormData['school']
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona la escuela" />
                            </SelectTrigger>
                            <SelectContent>
                              {songSchools.map(school => (
                                <SelectItem key={school.id} value={school.name}>
                                  <div className="flex items-center gap-2">
                                    {school.icon && <span>{school.icon}</span>}
                                    {school.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="castingTime">
                            Tiempo de Lanzamiento *
                          </Label>
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
                          <Select
                            value={watch('range') || ''}
                            onValueChange={value =>
                              setValue('range', value as SongFormData['range'])
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el alcance" />
                            </SelectTrigger>
                            <SelectContent>
                              {songRanges.map(range => (
                                <SelectItem key={range.id} value={range.name}>
                                  {range.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="duration">Duración *</Label>
                          <Select
                            value={watch('duration') || ''}
                            onValueChange={value =>
                              setValue(
                                'duration',
                                value as SongFormData['duration']
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona la duración" />
                            </SelectTrigger>
                            <SelectContent>
                              {songDurations.map(duration => (
                                <SelectItem
                                  key={duration.id}
                                  value={duration.name}
                                >
                                  {duration.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Descripción *</Label>
                        <Textarea
                          id="description"
                          {...register('description')}
                          placeholder="Descripción de la canción y sus efectos"
                          rows={6}
                          className="resize-none"
                        />
                        {errors.description && (
                          <p className="text-sm text-red-500">
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="higherLevels">
                          A Niveles Superiores
                        </Label>
                        <Textarea
                          id="higherLevels"
                          {...register('higherLevels')}
                          placeholder="Cómo cambia la canción cuando se lanza con espacios de mayor nivel"
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </TabsContent>

                    {/* Components Tab */}
                    <TabsContent value="components" className="space-y-6 mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Componentes de Lanzamiento
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex space-x-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="verbal"
                                checked={watchedComponents.verbal}
                                onCheckedChange={checked =>
                                  setValue('components.verbal', !!checked)
                                }
                              />
                              <Label
                                htmlFor="verbal"
                                className="cursor-pointer"
                              >
                                <div className="font-medium">Verbal (V)</div>
                                <div className="text-xs text-muted-foreground">
                                  Requiere recitar palabras mágicas
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="somatic"
                                checked={watchedComponents.somatic}
                                onCheckedChange={checked =>
                                  setValue('components.somatic', !!checked)
                                }
                              />
                              <Label
                                htmlFor="somatic"
                                className="cursor-pointer"
                              >
                                <div className="font-medium">Somático (S)</div>
                                <div className="text-xs text-muted-foreground">
                                  Requiere gestos con las manos
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="material"
                                checked={watchedComponents.material}
                                onCheckedChange={checked =>
                                  setValue('components.material', !!checked)
                                }
                              />
                              <Label
                                htmlFor="material"
                                className="cursor-pointer"
                              >
                                <div className="font-medium">Material (M)</div>
                                <div className="text-xs text-muted-foreground">
                                  Requiere componentes físicos
                                </div>
                              </Label>
                            </div>
                          </div>

                          {watchedComponents.material && (
                            <div>
                              <Label htmlFor="materialDescription">
                                Componentes Materiales
                              </Label>
                              <Input
                                id="materialDescription"
                                {...register('components.materialDescription')}
                                placeholder="ej: Una gota de agua y polvo de diamante valorado en 50 po"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Propiedades Especiales
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex space-x-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="ritual" {...register('ritual')} />
                              <Label
                                htmlFor="ritual"
                                className="cursor-pointer"
                              >
                                <div className="font-medium">Ritual</div>
                                <div className="text-xs text-muted-foreground">
                                  Puede lanzarse como ritual (+10 min)
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="concentration"
                                {...register('concentration')}
                              />
                              <Label
                                htmlFor="concentration"
                                className="cursor-pointer"
                              >
                                <div className="font-medium">Concentración</div>
                                <div className="text-xs text-muted-foreground">
                                  Requiere mantener la concentración
                                </div>
                              </Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Musical Tab */}
                    <TabsContent value="musical" className="space-y-4 mt-0">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
                        <Checkbox
                          id="isMusicBased"
                          checked={watchedIsMusicBased}
                          onCheckedChange={checked =>
                            setValue('isMusicBased', !!checked)
                          }
                        />
                        <Label
                          htmlFor="isMusicBased"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          <div>
                            <div className="font-medium">
                              Canción Basada en Música
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Esta canción utiliza interpretación musical en
                              lugar de componentes tradicionales
                            </div>
                          </div>
                        </Label>
                      </div>

                      {watchedIsMusicBased ? (
                        <div className="space-y-4">
                          <Card className="border-purple-200 dark:border-purple-800">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Volume2 className="h-5 w-5 text-purple-600" />
                                Configuración Musical
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="instrument">
                                    Instrumento Principal *
                                  </Label>
                                  <Select
                                    value={
                                      watch('musicalComponents.instrument') ||
                                      ''
                                    }
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
                                      {instrumentTypes.map(instrument => (
                                        <SelectItem
                                          key={instrument.id}
                                          value={instrument.name.toLowerCase()}
                                        >
                                          <div className="flex items-center gap-2">
                                            {instrument.icon && (
                                              <span>{instrument.icon}</span>
                                            )}
                                            <div className="flex flex-col">
                                              <span className="font-medium">
                                                {instrument.name}
                                              </span>
                                              {instrument.description && (
                                                <span className="text-xs text-muted-foreground">
                                                  {instrument.description}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="genre">
                                    Género Musical *
                                  </Label>
                                  <Select
                                    value={
                                      watch('musicalComponents.genre') || ''
                                    }
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
                                      {musicGenres.map(genre => (
                                        <SelectItem
                                          key={genre.id}
                                          value={genre.name.toLowerCase()}
                                        >
                                          <div className="flex items-center gap-2">
                                            {genre.icon && (
                                              <span>{genre.icon}</span>
                                            )}
                                            <div className="flex flex-col">
                                              <span className="font-medium">
                                                {genre.name}
                                              </span>
                                              {genre.description && (
                                                <span className="text-xs text-muted-foreground">
                                                  {genre.description}
                                                </span>
                                              )}
                                            </div>
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
                                    {...register(
                                      'musicalComponents.difficulty',
                                      {
                                        valueAsNumber: true,
                                      }
                                    )}
                                    placeholder="10"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    DC 5-10: Fácil • DC 11-15: Moderado • DC
                                    16-20: Difícil • DC 21+: Épico
                                  </p>
                                </div>

                                <div>
                                  <Label htmlFor="musicalDuration">
                                    Duración de Interpretación *
                                  </Label>
                                  <Input
                                    id="musicalDuration"
                                    type="number"
                                    min="1"
                                    max="10"
                                    {...register('musicalComponents.duration', {
                                      valueAsNumber: true,
                                    })}
                                    placeholder="1"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Rondas necesarias para completar la
                                    interpretación
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="requiredProficiency"
                                  checked={
                                    watchedMusicalComponents?.requiredProficiency ||
                                    false
                                  }
                                  onCheckedChange={checked =>
                                    setValue(
                                      'musicalComponents.requiredProficiency',
                                      !!checked
                                    )
                                  }
                                />
                                <Label
                                  htmlFor="requiredProficiency"
                                  className="cursor-pointer"
                                >
                                  Requiere competencia con el instrumento
                                </Label>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-amber-200 dark:border-amber-800">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-600" />
                                Efectos según Calidad de Interpretación
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {performanceQualities.map(quality => {
                                const qualityKey = quality.name.toLowerCase()
                                return (
                                  <div key={quality.id}>
                                    <Label
                                      htmlFor={`performance-${qualityKey}`}
                                      className="flex items-center gap-2"
                                    >
                                      {quality.icon && (
                                        <span>{quality.icon}</span>
                                      )}
                                      <span className="font-medium">
                                        {quality.name}
                                      </span>
                                      {quality.metadata?.range && (
                                        <span className="text-xs text-muted-foreground">
                                          ({quality.metadata.range})
                                        </span>
                                      )}
                                    </Label>
                                    <Textarea
                                      id={`performance-${qualityKey}`}
                                      value={
                                        (
                                          watch('performanceEffects') as Record<
                                            string,
                                            string
                                          >
                                        )?.[qualityKey] || ''
                                      }
                                      onChange={e => {
                                        const current =
                                          (watch(
                                            'performanceEffects'
                                          ) as Record<string, string>) || {}
                                        setValue('performanceEffects', {
                                          ...current,
                                          [qualityKey]: e.target.value,
                                        })
                                      }}
                                      placeholder={
                                        quality.metadata?.effect ||
                                        `Describe el efecto cuando la interpretación es ${quality.name.toLowerCase()}...`
                                      }
                                      rows={2}
                                      className="mt-1 resize-none"
                                    />
                                  </div>
                                )
                              })}
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <Card className="border-dashed">
                          <CardContent className="p-12 text-center">
                            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">
                              Marca la casilla de &quot;Canción Basada en
                              Música&quot; para configurar las propiedades
                              musicales
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    {/* Properties Tab */}
                    <TabsContent value="properties" className="space-y-4 mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Stars className="h-5 w-5" />
                            Propiedades de Canción
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Selecciona las propiedades especiales que aplican a
                            esta canción
                          </p>
                        </CardHeader>
                        <CardContent>
                          {songProperties.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                              {songProperties.map(property => (
                                <div
                                  key={property.id}
                                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                                >
                                  <Checkbox
                                    id={`property-${property.id}`}
                                    checked={
                                      watch('songProperties')?.includes(
                                        property.name
                                      ) || false
                                    }
                                    onCheckedChange={checked => {
                                      const current =
                                        watch('songProperties') || []
                                      if (checked) {
                                        setValue('songProperties', [
                                          ...current,
                                          property.name,
                                        ])
                                      } else {
                                        setValue(
                                          'songProperties',
                                          current.filter(
                                            p => p !== property.name
                                          )
                                        )
                                      }
                                    }}
                                  />
                                  <Label
                                    htmlFor={`property-${property.id}`}
                                    className="flex-1 cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2 font-medium">
                                      {property.icon && (
                                        <span>{property.icon}</span>
                                      )}
                                      {property.name}
                                    </div>
                                    {property.description && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {property.description}
                                      </div>
                                    )}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center p-8 text-muted-foreground">
                              <p>No hay propiedades de canción disponibles.</p>
                              <p className="text-sm mt-2">
                                Puedes crear nuevas propiedades desde la gestión
                                de taxonomías.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Music className="h-4 w-4 mr-2" />
                    {editingSong ? 'Actualizar' : 'Crear'} Canción
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
              placeholder="Buscar canciones..."
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
                {getSongLevelText(level)}
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
            {songSchools.map(school => (
              <SelectItem key={school.id} value={school.name}>
                {school.icon && <span className="mr-2">{school.icon}</span>}
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="musicFilter"
            checked={showOnlyMusicSongs}
            onCheckedChange={checked => setShowOnlyMusicSongs(!!checked)}
          />
          <Label htmlFor="musicFilter" className="flex items-center space-x-1">
            <Music className="h-4 w-4" />
            <span>Solo canciones musicales</span>
          </Label>
        </div>
      </div>

      {/* Songs List */}
      <div className="grid gap-4">
        {filteredSongs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No se encontraron canciones
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSongs.map(song => (
            <Card key={song.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{song.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">
                        {getSongLevelText(song.level)}
                      </Badge>
                      <Badge variant="outline">{song.school}</Badge>
                      {song.ritual && <Badge variant="outline">Ritual</Badge>}
                      {song.concentration && (
                        <Badge variant="outline">Concentración</Badge>
                      )}
                      {song.isMusicBased && (
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
                    {song.isMusicBased && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePerformSong(song)}
                        className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 dark:border-purple-800"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(song)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(song.id)}
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
                    {song.castingTime}
                  </div>
                  <div>
                    <span className="font-medium">Alcance:</span> {song.range}
                  </div>
                  <div>
                    <span className="font-medium">Duración:</span>{' '}
                    {song.duration}
                  </div>
                  <div>
                    <span className="font-medium">Componentes:</span>{' '}
                    {[
                      song.components.verbal && 'V',
                      song.components.somatic && 'S',
                      song.components.material && 'M',
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                </div>

                <Separator />

                <p className="text-sm">{song.description}</p>

                {/* Musical Components Display */}
                {song.isMusicBased && song.musicalComponents && (
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
                          {instrumentTypes.find(
                            cat => cat.id === song.musicalComponents?.instrument
                          )?.name || song.musicalComponents.instrument}
                        </div>
                        <div>
                          <span className="font-medium">Género:</span>{' '}
                          {musicGenres.find(
                            genre => genre.id === song.musicalComponents?.genre
                          )?.name || song.musicalComponents.genre}
                        </div>
                        <div>
                          <span className="font-medium">Dificultad:</span> DC{' '}
                          {song.musicalComponents.difficulty}
                        </div>
                        <div>
                          <span className="font-medium">Duración:</span>{' '}
                          {song.musicalComponents.duration} ronda
                          {song.musicalComponents.duration > 1 ? 's' : ''}
                        </div>
                      </div>

                      {song.musicalComponents.requiredProficiency && (
                        <div className="mt-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            Requiere competencia con el instrumento
                          </Badge>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {song.higherLevels && (
                  <>
                    <Separator />
                    <p className="text-sm">
                      <span className="font-medium">A Niveles Superiores:</span>{' '}
                      {song.higherLevels}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Music Performance Dialog */}
      {performanceSong && (
        <MusicPerformanceDialog
          song={performanceSong}
          isOpen={isPerformanceDialogOpen}
          onClose={() => {
            setIsPerformanceDialogOpen(false)
            setPerformanceSong(null)
          }}
          onPerformanceComplete={handlePerformanceComplete}
        />
      )}
    </div>
  )
}
