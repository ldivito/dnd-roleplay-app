'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Sword,
  Shield,
  Zap,
  Brain,
  Lightbulb,
  MessageSquare,
  Dice6,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSessionStore } from '@/stores/sessionStore'
import NPCRelationshipManager from '@/components/NPCRelationshipManager'
import type {
  NPC,
  NPCType,
  NPCImportance,
  AlignmentChoice,
  BackgroundOption,
  RaceOption,
  NPCTypeOption,
  NPCImportanceOption,
} from '@/types/npc'
import {
  NPC_TYPES,
  NPC_IMPORTANCE,
  SOCIAL_CLASSES,
  ALIGNMENT_OPTIONS,
  getNPCTypeInfo,
  getNPCImportanceInfo,
  getSocialClassInfo,
  getAlignmentDisplay,
} from '@/types/npc'
import TaxonomySelector from '@/components/TaxonomySelector'
import TagManager from '@/components/TagManager'
import MultiTaxonomySelector from '@/components/MultiTaxonomySelector'

type NPCFormData = Omit<NPC, 'id' | 'createdAt' | 'updatedAt'>

export default function NPCsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    npcs,
    backgrounds,
    races,
    npcTypes,
    npcImportance,
    traits,
    ideals,
    bonds,
    flaws,
    mannerisms,
    addNPC,
    updateNPC,
    removeNPC,
    addBackground,
    addRace,
    addNPCType,
    addNPCImportance,
    addTrait,
    addIdeal,
    addBond,
    addFlaw,
    addMannerism,
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
      level: 1,
      background: '',
      alignment: { law: 'neutral', good: 'neutral' },
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
      'personality.traits': [],
      'personality.ideals': [],
      'personality.bonds': [],
      'personality.flaws': [],
      'personality.mannerisms': [],
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
      plotHooks: [],
      tags: [],
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

  // Dice rolling function
  const rollDice = (sides: number = 6, count: number = 1) => {
    let total = 0
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1
    }
    return total
  }

  const rollStats = () => {
    // Roll 4d6, drop lowest for each stat
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => rollDice(6))
      rolls.sort((a, b) => b - a)
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
    }

    setValue('strength', rollStat())
    setValue('dexterity', rollStat())
    setValue('constitution', rollStat())
    setValue('intelligence', rollStat())
    setValue('wisdom', rollStat())
    setValue('charisma', rollStat())
  }

  const rollHitPoints = () => {
    const level = watch('level') || 1
    const constitution = watch('constitution') || 10
    const conModifier = Math.floor((constitution - 10) / 2)
    const baseHP = 8 + conModifier // Assuming d8 hit die
    const additionalHP = (level - 1) * (rollDice(8) + conModifier)
    const totalHP = Math.max(1, baseHP + additionalHP)

    setValue('maxHitPoints', totalHP)
    setValue('currentHitPoints', totalHP)
  }

  const onSubmit = (data: any) => {
    const npcData: NPC = {
      // Basic fields
      id: editingNPC?.id || crypto.randomUUID(),
      name: data.name || '',
      race: data.race || '',
      level: data.level || 1,
      background: data.background || '',
      alignment: data.alignment || { law: 'neutral', good: 'neutral' },

      // NPC specific
      npcType: data.npcType || 'neutral',
      importance: data.importance || 'minor',
      isAlive: data.isAlive !== false,

      // Stats - properly mapped from form
      strength: data.strength || 10,
      dexterity: data.dexterity || 10,
      constitution: data.constitution || 10,
      intelligence: data.intelligence || 10,
      wisdom: data.wisdom || 10,
      charisma: data.charisma || 10,
      maxHitPoints: data.maxHitPoints || 1,
      currentHitPoints: data.currentHitPoints || 1,
      armorClass: data.armorClass || 10,

      // Character inherited fields (using proper structure)
      abilityScores: {
        strength: data.strength || 10,
        dexterity: data.dexterity || 10,
        constitution: data.constitution || 10,
        intelligence: data.intelligence || 10,
        wisdom: data.wisdom || 10,
        charisma: data.charisma || 10,
      },
      savingThrows: editingNPC?.savingThrows || {
        strength: {
          proficient: false,
          value: Math.floor(((data.strength || 10) - 10) / 2),
        },
        dexterity: {
          proficient: false,
          value: Math.floor(((data.dexterity || 10) - 10) / 2),
        },
        constitution: {
          proficient: false,
          value: Math.floor(((data.constitution || 10) - 10) / 2),
        },
        intelligence: {
          proficient: false,
          value: Math.floor(((data.intelligence || 10) - 10) / 2),
        },
        wisdom: {
          proficient: false,
          value: Math.floor(((data.wisdom || 10) - 10) / 2),
        },
        charisma: {
          proficient: false,
          value: Math.floor(((data.charisma || 10) - 10) / 2),
        },
      },
      skills: editingNPC?.skills || {
        acrobatics: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.dexterity || 10) - 10) / 2),
        },
        animalHandling: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.wisdom || 10) - 10) / 2),
        },
        arcana: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.intelligence || 10) - 10) / 2),
        },
        athletics: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.strength || 10) - 10) / 2),
        },
        deception: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.charisma || 10) - 10) / 2),
        },
        history: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.intelligence || 10) - 10) / 2),
        },
        insight: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.wisdom || 10) - 10) / 2),
        },
        intimidation: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.charisma || 10) - 10) / 2),
        },
        investigation: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.intelligence || 10) - 10) / 2),
        },
        medicine: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.wisdom || 10) - 10) / 2),
        },
        nature: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.intelligence || 10) - 10) / 2),
        },
        perception: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.wisdom || 10) - 10) / 2),
        },
        performance: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.charisma || 10) - 10) / 2),
        },
        persuasion: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.charisma || 10) - 10) / 2),
        },
        religion: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.intelligence || 10) - 10) / 2),
        },
        sleightOfHand: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.dexterity || 10) - 10) / 2),
        },
        stealth: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.dexterity || 10) - 10) / 2),
        },
        survival: {
          proficient: false,
          expertise: false,
          value: Math.floor(((data.wisdom || 10) - 10) / 2),
        },
      },
      hitPoints: {
        current: data.currentHitPoints || 1,
        maximum: data.maxHitPoints || 1,
        temporary: 0,
        hitDice: `${data.level || 1}d8`,
      },
      initiative: Math.floor(((data.dexterity || 10) - 10) / 2),
      speed: 30,
      proficiencyBonus: Math.ceil((data.level || 1) / 4) + 1,
      experience: 0,
      isNPC: true,

      // Array fields (already arrays from form)
      tags: Array.isArray(data.tags) ? data.tags : [],
      plotHooks: Array.isArray(data.plotHooks) ? data.plotHooks : [],

      // Relationships
      relationships: data.relationships || [],
      locationRelations: data.locationRelations || [],
      loreConnections: data.loreConnections || [],

      // Parse personality nested objects - read from the correct location
      personality: {
        personality: {
          traits: Array.isArray(data.personality?.traits)
            ? data.personality.traits
            : Array.isArray(data['personality.traits'])
              ? data['personality.traits']
              : [],
          ideals: Array.isArray(data.personality?.ideals)
            ? data.personality.ideals
            : Array.isArray(data['personality.ideals'])
              ? data['personality.ideals']
              : [],
          bonds: Array.isArray(data.personality?.bonds)
            ? data.personality.bonds
            : Array.isArray(data['personality.bonds'])
              ? data['personality.bonds']
              : [],
          flaws: Array.isArray(data.personality?.flaws)
            ? data.personality.flaws
            : Array.isArray(data['personality.flaws'])
              ? data['personality.flaws']
              : [],
          mannerisms: Array.isArray(data.personality?.mannerisms)
            ? data.personality.mannerisms
            : Array.isArray(data['personality.mannerisms'])
              ? data['personality.mannerisms']
              : [],
          appearance:
            data.personality?.appearance ||
            data['personality.appearance'] ||
            '',
        },
        socialClass:
          data.personality?.socialClass ||
          data['personality.socialClass'] ||
          undefined,
        occupation:
          data.personality?.occupation ||
          data['personality.occupation'] ||
          undefined,
        goals: Array.isArray(data.personality?.goals)
          ? data.personality.goals
          : typeof data['personality.goals'] === 'string'
            ? data['personality.goals']
                .split(',')
                .map((g: string) => g.trim())
                .filter(Boolean)
            : [],
        secrets: Array.isArray(data.personality?.secrets)
          ? data.personality.secrets
          : typeof data['personality.secrets'] === 'string'
            ? data['personality.secrets']
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
        fears: Array.isArray(data.personality?.fears)
          ? data.personality.fears
          : typeof data['personality.fears'] === 'string'
            ? data['personality.fears']
                .split(',')
                .map((f: string) => f.trim())
                .filter(Boolean)
            : [],
        voice: {
          accent:
            data.personality?.voice?.accent ||
            data['personality.voice.accent'] ||
            undefined,
          pitch:
            data.personality?.voice?.pitch ||
            data['personality.voice.pitch'] ||
            undefined,
          speed:
            data.personality?.voice?.speed ||
            data['personality.voice.speed'] ||
            undefined,
          volume:
            data.personality?.voice?.volume ||
            data['personality.voice.volume'] ||
            undefined,
          description:
            data.personality?.voice?.description ||
            data['personality.voice.description'] ||
            undefined,
        },
      },

      // Additional fields
      currentLocation: data.currentLocation,
      lastSeenDate: data.lastSeenDate,
      firstAppearance: data.firstAppearance,
      lastAppearance: data.lastAppearance,
      playerKnowledge: data.playerKnowledge,
      imageUrl: data.imageUrl,
      voiceNotes: data.voiceNotes,
      notes: data.notes || '',
      items: [],
      spells: [],

      // Timestamps
      createdAt: editingNPC?.createdAt || new Date(),
      updatedAt: new Date(),
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

  const handleEditNPC = useCallback(
    (npc: NPC) => {
      setEditingNPC(npc)

      // Properly flatten and prepare data for form
      const formData = {
        ...npc,
        // Ensure alignment is properly set
        alignment: npc.alignment || { law: 'neutral', good: 'neutral' },
        // Flatten personality for form - use the actual property names expected by the form
        'personality.appearance':
          npc.personality?.personality?.appearance || '',
        'personality.traits': npc.personality?.personality?.traits || [],
        'personality.ideals': npc.personality?.personality?.ideals || [],
        'personality.bonds': npc.personality?.personality?.bonds || [],
        'personality.flaws': npc.personality?.personality?.flaws || [],
        'personality.mannerisms':
          npc.personality?.personality?.mannerisms || [],
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
        plotHooks: npc.plotHooks || [],
        tags: npc.tags || [],
        isAlive: npc.isAlive !== false, // Ensure boolean is set correctly
      }

      reset(formData)
      setIsDialogOpen(true)
    },
    [reset]
  )

  // Handle edit query parameter
  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId && !isDialogOpen) {
      const npcToEdit = npcs.find(npc => npc.id === editId)
      if (npcToEdit) {
        handleEditNPC(npcToEdit)
        // Clear the query parameter after opening the dialog
        router.replace('/npcs', { scroll: false })
      }
    }
  }, [searchParams, npcs, isDialogOpen, router, handleEditNPC])

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
      npc.background?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                      <TaxonomySelector
                        label="Raza"
                        placeholder="Seleccionar raza"
                        options={races}
                        value={watch('race')}
                        onChange={value => setValue('race', value)}
                        onAddNew={addRace}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                      <TaxonomySelector
                        label="Trasfondo"
                        placeholder="Seleccionar trasfondo"
                        options={backgrounds}
                        value={watch('background')}
                        onChange={value => setValue('background', value)}
                        onAddNew={addBackground}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <TaxonomySelector
                        label="Tipo"
                        placeholder="Seleccionar tipo"
                        options={npcTypes}
                        value={watch('npcType')}
                        onChange={value => setValue('npcType', value)}
                        onAddNew={addNPCType}
                        showColor={true}
                        defaultColor="bg-gray-100 text-gray-800"
                      />
                    </div>

                    <div>
                      <TaxonomySelector
                        label="Importancia"
                        placeholder="Seleccionar importancia"
                        options={npcImportance}
                        value={watch('importance')}
                        onChange={value => setValue('importance', value)}
                        onAddNew={addNPCImportance}
                        showColor={true}
                        defaultColor="bg-blue-100 text-blue-800"
                      />
                    </div>
                  </div>

                  {/* Alignment in its own row with better display */}
                  <div>
                    <Label className="text-base font-medium">
                      Alineamiento
                    </Label>
                    <div className="mt-2 space-y-3">
                      <div className="border rounded-lg p-4 bg-muted/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">
                            Selección Visual:
                          </span>
                          <div className="text-sm px-3 py-1 bg-primary/10 rounded-full font-medium">
                            {watch('alignment')
                              ? getAlignmentDisplay(watch('alignment'))
                              : 'Sin seleccionar'}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div></div>
                          {ALIGNMENT_OPTIONS.good.map(good => (
                            <div
                              key={good.value}
                              className="text-center font-medium text-xs bg-muted/50 p-1 rounded"
                            >
                              {good.label}
                            </div>
                          ))}
                          {ALIGNMENT_OPTIONS.law.map(law => (
                            <div
                              key={law.value}
                              className="col-span-4 grid grid-cols-4 gap-2"
                            >
                              <div className="text-center font-medium text-xs bg-muted/50 p-2 rounded flex items-center justify-center">
                                {law.label}
                              </div>
                              {ALIGNMENT_OPTIONS.good.map(good => (
                                <button
                                  key={`${law.value}-${good.value}`}
                                  type="button"
                                  className={`p-3 rounded border text-xs transition-all font-medium ${
                                    watch('alignment')?.law === law.value &&
                                    watch('alignment')?.good === good.value
                                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                                      : 'bg-background hover:bg-muted border-border hover:border-primary/50'
                                  }`}
                                  onClick={() =>
                                    setValue('alignment', {
                                      law: law.value,
                                      good: good.value,
                                    })
                                  }
                                >
                                  {law.short === 'N' && good.short === 'N'
                                    ? 'N'
                                    : `${law.short}${good.short}`}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">
                          Haz clic en una celda para seleccionar el alineamiento
                          del NPC
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAlive"
                      checked={watch('isAlive') !== false}
                      onCheckedChange={checked => setValue('isAlive', checked)}
                    />
                    <Label htmlFor="isAlive">Está vivo</Label>
                  </div>

                  <div>
                    <input type="hidden" {...register('tags')} />
                    <TagManager
                      label="Etiquetas"
                      tags={watch('tags') || []}
                      onChange={tags =>
                        setValue('tags', tags, { shouldDirty: true })
                      }
                      placeholder="nobleza, comerciante, misterioso..."
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
                <TabsContent value="stats" className="space-y-6">
                  {/* Global Actions */}
                  <div className="flex gap-2 p-4 bg-muted/50 rounded-lg">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={rollStats}
                      className="flex items-center gap-2"
                    >
                      <Dice6 className="h-4 w-4" />
                      Tirar Estadísticas (4d6)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={rollHitPoints}
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      Calcular PV
                    </Button>
                  </div>

                  {/* Ability Scores */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                      Puntuaciones de Habilidad
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Sword className="h-5 w-5 text-red-500" />
                        <div className="flex-1">
                          <Label
                            htmlFor="strength"
                            className="text-sm font-medium"
                          >
                            Fuerza
                          </Label>
                          <Input
                            id="strength"
                            type="number"
                            min="1"
                            max="30"
                            {...register('strength', { valueAsNumber: true })}
                            className="mt-1 text-center font-mono"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(((watch('strength') || 10) - 10) / 2) >= 0
                            ? '+'
                            : ''}
                          {Math.floor(((watch('strength') || 10) - 10) / 2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Zap className="h-5 w-5 text-green-500" />
                        <div className="flex-1">
                          <Label
                            htmlFor="dexterity"
                            className="text-sm font-medium"
                          >
                            Destreza
                          </Label>
                          <Input
                            id="dexterity"
                            type="number"
                            min="1"
                            max="30"
                            {...register('dexterity', { valueAsNumber: true })}
                            className="mt-1 text-center font-mono"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(((watch('dexterity') || 10) - 10) / 2) >=
                          0
                            ? '+'
                            : ''}
                          {Math.floor(((watch('dexterity') || 10) - 10) / 2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Heart className="h-5 w-5 text-red-600" />
                        <div className="flex-1">
                          <Label
                            htmlFor="constitution"
                            className="text-sm font-medium"
                          >
                            Constitución
                          </Label>
                          <Input
                            id="constitution"
                            type="number"
                            min="1"
                            max="30"
                            {...register('constitution', {
                              valueAsNumber: true,
                            })}
                            className="mt-1 text-center font-mono"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(
                            ((watch('constitution') || 10) - 10) / 2
                          ) >= 0
                            ? '+'
                            : ''}
                          {Math.floor(((watch('constitution') || 10) - 10) / 2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Brain className="h-5 w-5 text-blue-500" />
                        <div className="flex-1">
                          <Label
                            htmlFor="intelligence"
                            className="text-sm font-medium"
                          >
                            Inteligencia
                          </Label>
                          <Input
                            id="intelligence"
                            type="number"
                            min="1"
                            max="30"
                            {...register('intelligence', {
                              valueAsNumber: true,
                            })}
                            className="mt-1 text-center font-mono"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(
                            ((watch('intelligence') || 10) - 10) / 2
                          ) >= 0
                            ? '+'
                            : ''}
                          {Math.floor(((watch('intelligence') || 10) - 10) / 2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <div className="flex-1">
                          <Label
                            htmlFor="wisdom"
                            className="text-sm font-medium"
                          >
                            Sabiduría
                          </Label>
                          <Input
                            id="wisdom"
                            type="number"
                            min="1"
                            max="30"
                            {...register('wisdom', { valueAsNumber: true })}
                            className="mt-1 text-center font-mono"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(((watch('wisdom') || 10) - 10) / 2) >= 0
                            ? '+'
                            : ''}
                          {Math.floor(((watch('wisdom') || 10) - 10) / 2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <MessageSquare className="h-5 w-5 text-purple-500" />
                        <div className="flex-1">
                          <Label
                            htmlFor="charisma"
                            className="text-sm font-medium"
                          >
                            Carisma
                          </Label>
                          <Input
                            id="charisma"
                            type="number"
                            min="1"
                            max="30"
                            {...register('charisma', { valueAsNumber: true })}
                            className="mt-1 text-center font-mono"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(((watch('charisma') || 10) - 10) / 2) >= 0
                            ? '+'
                            : ''}
                          {Math.floor(((watch('charisma') || 10) - 10) / 2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Combat Stats */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                      Estadísticas de Combate
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Heart className="h-5 w-5 text-red-500" />
                        <div className="flex-1">
                          <Label
                            htmlFor="maxHitPoints"
                            className="text-sm font-medium"
                          >
                            PV Máximos
                          </Label>
                          <Input
                            id="maxHitPoints"
                            type="number"
                            min="1"
                            {...register('maxHitPoints', {
                              valueAsNumber: true,
                            })}
                            className="mt-1 text-center font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Heart className="h-5 w-5 text-orange-500" />
                        <div className="flex-1">
                          <Label
                            htmlFor="currentHitPoints"
                            className="text-sm font-medium"
                          >
                            PV Actuales
                          </Label>
                          <Input
                            id="currentHitPoints"
                            type="number"
                            min="0"
                            {...register('currentHitPoints', {
                              valueAsNumber: true,
                            })}
                            className="mt-1 text-center font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <div className="flex-1">
                          <Label
                            htmlFor="armorClass"
                            className="text-sm font-medium"
                          >
                            Clase de Armadura
                          </Label>
                          <Input
                            id="armorClass"
                            type="number"
                            min="1"
                            {...register('armorClass', { valueAsNumber: true })}
                            className="mt-1 text-center font-mono"
                          />
                        </div>
                      </div>
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
                        value={watch('personality.socialClass') || ''}
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
                      <Label htmlFor="personality.occupation">Ocupación</Label>
                      <Input
                        id="personality.occupation"
                        {...register('personality.occupation')}
                        placeholder="ej: Herrero, Posadero"
                      />
                    </div>
                  </div>

                  <div>
                    <input type="hidden" {...register('personality.traits')} />
                    <MultiTaxonomySelector
                      label="Rasgos de Personalidad"
                      placeholder="Seleccionar rasgo"
                      options={traits}
                      values={watch('personality.traits') || []}
                      onChange={values =>
                        setValue('personality.traits', values, {
                          shouldDirty: true,
                        })
                      }
                      onAddNew={addTrait}
                    />
                  </div>

                  <div>
                    <input type="hidden" {...register('personality.ideals')} />
                    <MultiTaxonomySelector
                      label="Ideales"
                      placeholder="Seleccionar ideal"
                      options={ideals}
                      values={watch('personality.ideals') || []}
                      onChange={values =>
                        setValue('personality.ideals', values, {
                          shouldDirty: true,
                        })
                      }
                      onAddNew={addIdeal}
                    />
                  </div>

                  <div>
                    <input type="hidden" {...register('personality.bonds')} />
                    <MultiTaxonomySelector
                      label="Vínculos"
                      placeholder="Seleccionar vínculo"
                      options={bonds}
                      values={watch('personality.bonds') || []}
                      onChange={values =>
                        setValue('personality.bonds', values, {
                          shouldDirty: true,
                        })
                      }
                      onAddNew={addBond}
                    />
                  </div>

                  <div>
                    <input type="hidden" {...register('personality.flaws')} />
                    <MultiTaxonomySelector
                      label="Defectos"
                      placeholder="Seleccionar defecto"
                      options={flaws}
                      values={watch('personality.flaws') || []}
                      onChange={values =>
                        setValue('personality.flaws', values, {
                          shouldDirty: true,
                        })
                      }
                      onAddNew={addFlaw}
                    />
                  </div>

                  <div>
                    <input
                      type="hidden"
                      {...register('personality.mannerisms')}
                    />
                    <MultiTaxonomySelector
                      label="Gestos y Manías"
                      placeholder="Seleccionar gesto"
                      options={mannerisms}
                      values={watch('personality.mannerisms') || []}
                      onChange={values =>
                        setValue('personality.mannerisms', values, {
                          shouldDirty: true,
                        })
                      }
                      onAddNew={addMannerism}
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
                        value={watch('personality.voice.pitch') || 'medium'}
                        onValueChange={value =>
                          setValue('personality.voice.pitch', value)
                        }
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
                      <Label htmlFor="personality.voice.speed">Velocidad</Label>
                      <Select
                        value={watch('personality.voice.speed') || 'medium'}
                        onValueChange={value =>
                          setValue('personality.voice.speed', value)
                        }
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
                      <Label htmlFor="personality.voice.volume">Volumen</Label>
                      <Select
                        value={watch('personality.voice.volume') || 'medium'}
                        onValueChange={value =>
                          setValue('personality.voice.volume', value)
                        }
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
                    <Label htmlFor="voiceNotes">Notas de Interpretación</Label>
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
                    <input type="hidden" {...register('plotHooks')} />
                    <TagManager
                      label="Ganchos de Historia"
                      tags={watch('plotHooks') || []}
                      onChange={tags =>
                        setValue('plotHooks', tags, { shouldDirty: true })
                      }
                      placeholder="Ideas de tramas..."
                    />
                  </div>
                </TabsContent>

                {/* Relationships */}
                <TabsContent value="relationships" className="space-y-4">
                  <input type="hidden" {...register('relationships')} />
                  <input type="hidden" {...register('locationRelations')} />
                  <input type="hidden" {...register('loreConnections')} />
                  <NPCRelationshipManager
                    relationships={watchedRelationships}
                    locationRelations={watchedLocationRelations}
                    loreConnections={watchedLoreConnections}
                    onRelationshipsChange={relationships =>
                      setValue('relationships', relationships, {
                        shouldDirty: true,
                      })
                    }
                    onLocationRelationsChange={relations =>
                      setValue('locationRelations', relations, {
                        shouldDirty: true,
                      })
                    }
                    onLoreConnectionsChange={connections =>
                      setValue('loreConnections', connections, {
                        shouldDirty: true,
                      })
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
            <h3 className="text-lg font-medium mb-2">No se encontraron NPCs</h3>
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
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => router.push(`/npcs/${npc.id}`)}
                    >
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
                        {npc.level > 1 && `Nivel ${npc.level}`}
                        {npc.background && ` • ${npc.background}`}
                        {npc.personality?.occupation &&
                          ` • ${npc.personality.occupation}`}
                        {npc.alignment &&
                          ` • ${getAlignmentDisplay(npc.alignment)}`}
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

                <CardContent
                  className="cursor-pointer"
                  onClick={() => router.push(`/npcs/${npc.id}`)}
                >
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
  )
}
