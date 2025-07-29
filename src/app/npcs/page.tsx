'use client'

import React, { useState } from 'react'
import AppLayout from '@/components/AppLayout'
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
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Heart,
  MapPin,
  Scroll,
  Crown,
  Edit,
  Trash2,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSessionStore } from '@/stores/sessionStore'
import NPCRelationshipManager from '@/components/NPCRelationshipManager'
import type { NPC, NPCType, NPCImportance } from '@/types/npc'
import {
  NPC_TYPES,
  NPC_IMPORTANCE,
  SOCIAL_CLASSES,
  getNPCTypeInfo,
  getNPCImportanceInfo,
  getSocialClassInfo,
} from '@/types/npc'

type NPCFormData = Omit<NPC, 'id' | 'createdAt' | 'updatedAt'>

export default function NPCsPage() {
  const {
    npcs,
    addNPC,
    updateNPC,
    removeNPC,
    getNPCsByType,
    getNPCsByImportance,
    getNPCsByLocation,
    getNPCsWithRelationships,
  } = useSessionStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNPC, setEditingNPC] = useState<NPC | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<NPCType | 'all'>('all')
  const [filterImportance, setFilterImportance] = useState<
    NPCImportance | 'all'
  >('all')
  const [showOnlyAlive, setShowOnlyAlive] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      name: '',
      race: '',
      class: '',
      level: 1,
      background: '',
      alignment: '',
      npcType: 'neutral',
      importance: 'minor',
      isAlive: true,
      // Stats
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      maxHitPoints: 1,
      currentHitPoints: 1,
      armorClass: 10,
      // Personality
      'personality.appearance': '',
      'personality.traits': '',
      'personality.ideals': '',
      'personality.bonds': '',
      'personality.flaws': '',
      'personality.mannerisms': '',
      'personality.socialClass': '',
      'personality.occupation': '',
      'personality.goals': '',
      'personality.secrets': '',
      'personality.fears': '',
      // Voice
      'personality.voice.accent': '',
      'personality.voice.pitch': 'medium',
      'personality.voice.speed': 'medium',
      'personality.voice.volume': 'medium',
      'personality.voice.description': '',
      // Meta
      voiceNotes: '',
      playerKnowledge: '',
      firstAppearance: '',
      plotHooks: '',
      tags: '',
      notes: '',
      // Relationships (managed separately)
      relationships: [],
      locationRelations: [],
      loreConnections: [],
    },
  })

  const watchedRelationships = watch('relationships') || []
  const watchedLocationRelations = watch('locationRelations') || []
  const watchedLoreConnections = watch('loreConnections') || []

  const onSubmit = (data: any) => {
    const npcData: NPC = {
      ...data,
      id: editingNPC?.id || crypto.randomUUID(),
      createdAt: editingNPC?.createdAt || new Date(),
      updatedAt: new Date(),
      // Parse array fields
      tags:
        typeof data.tags === 'string'
          ? data.tags
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
          : data.tags || [],
      plotHooks:
        typeof data.plotHooks === 'string'
          ? data.plotHooks
              .split(',')
              .map((h: string) => h.trim())
              .filter(Boolean)
          : data.plotHooks || [],
      // Parse personality nested objects
      personality: {
        appearance: data['personality.appearance'] || '',
        personality: {
          traits:
            typeof data['personality.traits'] === 'string'
              ? data['personality.traits']
                  .split(',')
                  .map((t: string) => t.trim())
                  .filter(Boolean)
              : [],
          ideals:
            typeof data['personality.ideals'] === 'string'
              ? data['personality.ideals']
                  .split(',')
                  .map((t: string) => t.trim())
                  .filter(Boolean)
              : [],
          bonds:
            typeof data['personality.bonds'] === 'string'
              ? data['personality.bonds']
                  .split(',')
                  .map((t: string) => t.trim())
                  .filter(Boolean)
              : [],
          flaws:
            typeof data['personality.flaws'] === 'string'
              ? data['personality.flaws']
                  .split(',')
                  .map((t: string) => t.trim())
                  .filter(Boolean)
              : [],
          mannerisms:
            typeof data['personality.mannerisms'] === 'string'
              ? data['personality.mannerisms']
                  .split(',')
                  .map((t: string) => t.trim())
                  .filter(Boolean)
              : [],
        },
        socialClass: data['personality.socialClass'] || undefined,
        occupation: data['personality.occupation'] || undefined,
        goals:
          typeof data['personality.goals'] === 'string'
            ? data['personality.goals']
                .split(',')
                .map((g: string) => g.trim())
                .filter(Boolean)
            : [],
        secrets:
          typeof data['personality.secrets'] === 'string'
            ? data['personality.secrets']
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
        fears:
          typeof data['personality.fears'] === 'string'
            ? data['personality.fears']
                .split(',')
                .map((f: string) => f.trim())
                .filter(Boolean)
            : [],
        voice: {
          accent: data['personality.voice.accent'] || undefined,
          pitch: data['personality.voice.pitch'] || undefined,
          speed: data['personality.voice.speed'] || undefined,
          volume: data['personality.voice.volume'] || undefined,
          description: data['personality.voice.description'] || undefined,
        },
      },
      items: [],
      spells: [],
    } as NPC

    if (editingNPC) {
      updateNPC(editingNPC.id, npcData)
    } else {
      addNPC(npcData)
    }

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingNPC(null)
    reset()
  }

  const handleEditNPC = (npc: NPC) => {
    setEditingNPC(npc)
    reset({
      ...npc,
      // Flatten personality for form
      'personality.appearance': npc.personality?.personality?.appearance || '',
      'personality.traits':
        npc.personality?.personality?.traits?.join(', ') || '',
      'personality.ideals':
        npc.personality?.personality?.ideals?.join(', ') || '',
      'personality.bonds':
        npc.personality?.personality?.bonds?.join(', ') || '',
      'personality.flaws':
        npc.personality?.personality?.flaws?.join(', ') || '',
      'personality.mannerisms':
        npc.personality?.personality?.mannerisms?.join(', ') || '',
      'personality.socialClass': npc.personality?.socialClass || '',
      'personality.occupation': npc.personality?.occupation || '',
      'personality.goals': npc.personality?.goals?.join(', ') || '',
      'personality.secrets': npc.personality?.secrets?.join(', ') || '',
      'personality.fears': npc.personality?.fears?.join(', ') || '',
      'personality.voice.accent': npc.personality?.voice?.accent || '',
      'personality.voice.pitch': npc.personality?.voice?.pitch || 'medium',
      'personality.voice.speed': npc.personality?.voice?.speed || 'medium',
      'personality.voice.volume': npc.personality?.voice?.volume || 'medium',
      'personality.voice.description':
        npc.personality?.voice?.description || '',
      plotHooks: npc.plotHooks?.join(', ') || '',
      tags: npc.tags?.join(', ') || '',
    })
    setIsDialogOpen(true)
  }

  const handleDeleteNPC = (npc: NPC) => {
    if (
      window.confirm(`¿Estás seguro de que quieres eliminar a "${npc.name}"?`)
    ) {
      removeNPC(npc.id)
    }
  }

  // Filter NPCs based on search and filters
  const filteredNPCs = npcs.filter(npc => {
    const matchesSearch =
      npc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      npc.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
      npc.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (npc.personality?.occupation &&
        npc.personality.occupation
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      npc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === 'all' || npc.npcType === filterType
    const matchesImportance =
      filterImportance === 'all' || npc.importance === filterImportance
    const matchesAlive = !showOnlyAlive || npc.isAlive

    return matchesSearch && matchesType && matchesImportance && matchesAlive
  })

  // Statistics
  const majorNPCs = getNPCsByImportance('major')
  const aliveNPCs = npcs.filter(npc => npc.isAlive)
  const npcWithRelationships = getNPCsWithRelationships()
  const friendlyNPCs = getNPCsByType('friendly')

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NPCs</h1>
            <p className="text-muted-foreground">
              Gestiona los personajes no jugadores de tu campaña con relaciones,
              personalidades y conexiones.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo NPC
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNPC ? 'Editar NPC' : 'Crear Nuevo NPC'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                    <TabsTrigger value="personality">Personalidad</TabsTrigger>
                    <TabsTrigger value="voice">Voz & RP</TabsTrigger>
                    <TabsTrigger value="relationships">Relaciones</TabsTrigger>
                  </TabsList>

                  {/* Basic Information */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                          id="name"
                          {...register('name', {
                            required: 'El nombre es requerido',
                          })}
                          placeholder="Nombre del NPC"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.name.message as string}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="race">Raza</Label>
                        <Input
                          id="race"
                          {...register('race')}
                          placeholder="ej: Humano, Elfo, Enano"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="class">Clase</Label>
                        <Input
                          id="class"
                          {...register('class')}
                          placeholder="ej: Guerrero, Mago"
                        />
                      </div>

                      <div>
                        <Label htmlFor="level">Nivel</Label>
                        <Input
                          id="level"
                          type="number"
                          min="1"
                          {...register('level', { valueAsNumber: true })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="background">Trasfondo</Label>
                        <Input
                          id="background"
                          {...register('background')}
                          placeholder="ej: Noble, Comerciante"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="npcType">Tipo</Label>
                        <Select
                          onValueChange={value => setValue('npcType', value)}
                          defaultValue="neutral"
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {NPC_TYPES.map(type => (
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
                          defaultValue="minor"
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {NPC_IMPORTANCE.map(imp => (
                              <SelectItem key={imp.value} value={imp.value}>
                                {imp.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="alignment">Alineamiento</Label>
                        <Input
                          id="alignment"
                          {...register('alignment')}
                          placeholder="ej: Legal Bueno"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isAlive"
                        defaultChecked
                        onCheckedChange={checked =>
                          setValue('isAlive', checked)
                        }
                      />
                      <Label htmlFor="isAlive">Está vivo</Label>
                    </div>

                    <div>
                      <Label htmlFor="tags">Etiquetas</Label>
                      <Input
                        id="tags"
                        {...register('tags')}
                        placeholder="nobleza, comerciante, misterioso (separadas por comas)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Notas</Label>
                      <Textarea
                        id="notes"
                        {...register('notes')}
                        placeholder="Notas generales sobre el NPC"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  {/* Stats */}
                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="strength">Fuerza</Label>
                        <Input
                          id="strength"
                          type="number"
                          min="1"
                          max="30"
                          {...register('strength', { valueAsNumber: true })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dexterity">Destreza</Label>
                        <Input
                          id="dexterity"
                          type="number"
                          min="1"
                          max="30"
                          {...register('dexterity', { valueAsNumber: true })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="constitution">Constitución</Label>
                        <Input
                          id="constitution"
                          type="number"
                          min="1"
                          max="30"
                          {...register('constitution', { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="intelligence">Inteligencia</Label>
                        <Input
                          id="intelligence"
                          type="number"
                          min="1"
                          max="30"
                          {...register('intelligence', { valueAsNumber: true })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="wisdom">Sabiduría</Label>
                        <Input
                          id="wisdom"
                          type="number"
                          min="1"
                          max="30"
                          {...register('wisdom', { valueAsNumber: true })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="charisma">Carisma</Label>
                        <Input
                          id="charisma"
                          type="number"
                          min="1"
                          max="30"
                          {...register('charisma', { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="maxHitPoints">PV Máximos</Label>
                        <Input
                          id="maxHitPoints"
                          type="number"
                          min="1"
                          {...register('maxHitPoints', { valueAsNumber: true })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentHitPoints">PV Actuales</Label>
                        <Input
                          id="currentHitPoints"
                          type="number"
                          min="0"
                          {...register('currentHitPoints', {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="armorClass">CA</Label>
                        <Input
                          id="armorClass"
                          type="number"
                          min="1"
                          {...register('armorClass', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Personality */}
                  <TabsContent value="personality" className="space-y-4">
                    <div>
                      <Label htmlFor="personality.appearance">
                        Apariencia Física
                      </Label>
                      <Textarea
                        id="personality.appearance"
                        {...register('personality.appearance')}
                        placeholder="Descripción física del NPC"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="personality.socialClass">
                          Clase Social
                        </Label>
                        <Select
                          onValueChange={value =>
                            setValue('personality.socialClass', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar clase social" />
                          </SelectTrigger>
                          <SelectContent>
                            {SOCIAL_CLASSES.map(cls => (
                              <SelectItem key={cls.value} value={cls.value}>
                                {cls.icon} {cls.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="personality.occupation">
                          Ocupación
                        </Label>
                        <Input
                          id="personality.occupation"
                          {...register('personality.occupation')}
                          placeholder="ej: Herrero, Posadero"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="personality.traits">
                        Rasgos de Personalidad
                      </Label>
                      <Input
                        id="personality.traits"
                        {...register('personality.traits')}
                        placeholder="amable, terco, curioso (separados por comas)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="personality.ideals">Ideales</Label>
                      <Input
                        id="personality.ideals"
                        {...register('personality.ideals')}
                        placeholder="justicia, libertad, poder (separados por comas)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="personality.bonds">Vínculos</Label>
                      <Input
                        id="personality.bonds"
                        {...register('personality.bonds')}
                        placeholder="familia, patria, mentor (separados por comas)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="personality.flaws">Defectos</Label>
                      <Input
                        id="personality.flaws"
                        {...register('personality.flaws')}
                        placeholder="cobarde, avaro, mentiroso (separados por comas)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="personality.mannerisms">
                        Gestos y Manías
                      </Label>
                      <Input
                        id="personality.mannerisms"
                        {...register('personality.mannerisms')}
                        placeholder="se toca la barba, tamborilea dedos (separados por comas)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="personality.goals">Objetivos</Label>
                      <Input
                        id="personality.goals"
                        {...register('personality.goals')}
                        placeholder="ser rico, encontrar amor, venganza (separados por comas)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="personality.secrets">Secretos</Label>
                      <Input
                        id="personality.secrets"
                        {...register('personality.secrets')}
                        placeholder="identidad oculta, crimen del pasado (separados por comas)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="personality.fears">Miedos</Label>
                      <Input
                        id="personality.fears"
                        {...register('personality.fears')}
                        placeholder="oscuridad, alturas, muerte (separados por comas)"
                      />
                    </div>
                  </TabsContent>

                  {/* Voice & Roleplay */}
                  <TabsContent value="voice" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="personality.voice.accent">Acento</Label>
                        <Input
                          id="personality.voice.accent"
                          {...register('personality.voice.accent')}
                          placeholder="ej: francés, cockney, rural"
                        />
                      </div>

                      <div>
                        <Label htmlFor="personality.voice.pitch">Tono</Label>
                        <Select
                          onValueChange={value =>
                            setValue('personality.voice.pitch', value)
                          }
                          defaultValue="medium"
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">Agudo</SelectItem>
                            <SelectItem value="medium">Medio</SelectItem>
                            <SelectItem value="low">Grave</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="personality.voice.speed">
                          Velocidad
                        </Label>
                        <Select
                          onValueChange={value =>
                            setValue('personality.voice.speed', value)
                          }
                          defaultValue="medium"
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fast">Rápido</SelectItem>
                            <SelectItem value="medium">Medio</SelectItem>
                            <SelectItem value="slow">Lento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="personality.voice.volume">
                          Volumen
                        </Label>
                        <Select
                          onValueChange={value =>
                            setValue('personality.voice.volume', value)
                          }
                          defaultValue="medium"
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loud">Alto</SelectItem>
                            <SelectItem value="medium">Medio</SelectItem>
                            <SelectItem value="quiet">Bajo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="personality.voice.description">
                        Descripción de Voz
                      </Label>
                      <Textarea
                        id="personality.voice.description"
                        {...register('personality.voice.description')}
                        placeholder="Descripción detallada de cómo suena la voz"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="voiceNotes">
                        Notas de Interpretación
                      </Label>
                      <Textarea
                        id="voiceNotes"
                        {...register('voiceNotes')}
                        placeholder="Notas para el DM sobre cómo interpretar este personaje"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="playerKnowledge">
                        Conocimiento de Jugadores
                      </Label>
                      <Textarea
                        id="playerKnowledge"
                        {...register('playerKnowledge')}
                        placeholder="Lo que los jugadores saben sobre este NPC"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="firstAppearance">Primera Aparición</Label>
                      <Input
                        id="firstAppearance"
                        {...register('firstAppearance')}
                        placeholder="Sesión o fecha de primera aparición"
                      />
                    </div>

                    <div>
                      <Label htmlFor="plotHooks">Ganchos de Historia</Label>
                      <Textarea
                        id="plotHooks"
                        {...register('plotHooks')}
                        placeholder="Ideas de tramas relacionadas con este NPC (separadas por comas)"
                        rows={2}
                      />
                    </div>
                  </TabsContent>

                  {/* Relationships */}
                  <TabsContent value="relationships" className="space-y-4">
                    <NPCRelationshipManager
                      relationships={watchedRelationships}
                      locationRelations={watchedLocationRelations}
                      loreConnections={watchedLoreConnections}
                      onRelationshipsChange={relationships =>
                        setValue('relationships', relationships)
                      }
                      onLocationRelationsChange={relations =>
                        setValue('locationRelations', relations)
                      }
                      onLoreConnectionsChange={connections =>
                        setValue('loreConnections', connections)
                      }
                      currentNPCId={editingNPC?.id}
                    />
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
                    {editingNPC ? 'Actualizar' : 'Crear'} NPC
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
              <CardTitle className="text-sm font-medium">Total NPCs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{npcs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                NPCs Principales
              </CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{majorNPCs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vivos</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aliveNPCs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Con Relaciones
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {npcWithRelationships.length}
              </div>
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
                    placeholder="Buscar NPCs..."
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
                    {NPC_TYPES.map(type => (
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
                    {NPC_IMPORTANCE.map(imp => (
                      <SelectItem key={imp.value} value={imp.value}>
                        {imp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={showOnlyAlive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowOnlyAlive(!showOnlyAlive)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NPCs Grid */}
        {filteredNPCs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No se encontraron NPCs
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Crea tu primer NPC'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredNPCs.map(npc => {
              const typeInfo = getNPCTypeInfo(npc.npcType)
              const importanceInfo = getNPCImportanceInfo(npc.importance)
              const socialClassInfo = getSocialClassInfo(
                npc.personality?.socialClass || ''
              )

              return (
                <Card
                  key={npc.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{npc.name}</CardTitle>
                          {!npc.isAlive && (
                            <Badge variant="destructive" className="text-xs">
                              Muerto
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {typeInfo && (
                            <Badge variant="outline" className={typeInfo.color}>
                              {typeInfo.label}
                            </Badge>
                          )}
                          {importanceInfo && (
                            <Badge
                              variant="outline"
                              className={importanceInfo.color}
                            >
                              {importanceInfo.label}
                            </Badge>
                          )}
                          {socialClassInfo && (
                            <Badge variant="secondary" className="text-xs">
                              {socialClassInfo.icon} {socialClassInfo.label}
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {npc.race && `${npc.race} `}
                          {npc.class && `${npc.class} `}
                          {npc.level > 1 && `Nivel ${npc.level}`}
                          {npc.personality?.occupation &&
                            ` • ${npc.personality.occupation}`}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditNPC(npc)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNPC(npc)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      {npc.personality?.personality?.appearance && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <strong>Apariencia:</strong>{' '}
                          {npc.personality.personality.appearance}
                        </p>
                      )}

                      {/* Relationship counts */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {npc.relationships.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {npc.relationships.length} relaciones
                          </span>
                        )}
                        {npc.locationRelations.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {npc.locationRelations.length} ubicaciones
                          </span>
                        )}
                        {npc.loreConnections.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Scroll className="h-3 w-3" />
                            {npc.loreConnections.length} lore
                          </span>
                        )}
                      </div>

                      {npc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {npc.tags.slice(0, 3).map(tag => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {npc.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{npc.tags.length - 3} más
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
