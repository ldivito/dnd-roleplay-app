import { z } from 'zod'
import type { Character } from './character'

// NPC-specific types extending base character
export type NPCType =
  | 'friendly'
  | 'neutral'
  | 'hostile'
  | 'ally'
  | 'enemy'
  | 'unknown'
export type NPCImportance = 'major' | 'minor' | 'background'
export type RelationshipType =
  | 'family'
  | 'friend'
  | 'enemy'
  | 'rival'
  | 'lover'
  | 'spouse'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'colleague'
  | 'mentor'
  | 'student'
  | 'business'
  | 'political'
  | 'unknown'

export type LocationRelationType =
  | 'lives_in'
  | 'works_at'
  | 'owns'
  | 'frequents'
  | 'avoids'
  | 'guards'
  | 'rules'
  | 'born_in'

// NPC Relationship interface
export interface NPCRelationship {
  id: string
  npcId: string // The other NPC in the relationship
  npcName: string
  relationshipType: RelationshipType
  description?: string
  isSecret?: boolean // Hidden relationship
  strength: 1 | 2 | 3 | 4 | 5 // 1 = weak, 5 = very strong
  notes?: string
}

// Location relationship interface
export interface NPCLocationRelation {
  id: string
  locationId: string
  locationName: string
  relationType: LocationRelationType
  description?: string
  isSecret?: boolean
  importance: 'primary' | 'secondary' | 'minor'
}

// Voice and personality traits
export interface NPCPersonality {
  voice?: {
    accent?: string
    pitch?: 'high' | 'medium' | 'low'
    speed?: 'fast' | 'medium' | 'slow'
    volume?: 'loud' | 'medium' | 'quiet'
    description?: string
  }
  personality?: {
    traits: string[] // Personality traits
    ideals: string[] // What drives them
    bonds: string[] // Important connections
    flaws: string[] // Character flaws
    mannerisms: string[] // Quirks and habits
    appearance: string // Physical description
  }
  socialClass?:
    | 'nobility'
    | 'merchant'
    | 'commoner'
    | 'criminal'
    | 'clergy'
    | 'military'
    | 'other'
  occupation?: string
  goals?: string[] // What they want to achieve
  secrets?: string[] // Hidden information
  fears?: string[] // What they're afraid of
}

// Connection to lore system
export interface NPCLoreConnection {
  id: string
  loreId: string
  loreTitle: string
  connectionType:
    | 'witnessed'
    | 'participated'
    | 'knows_about'
    | 'caused'
    | 'victim_of'
    | 'related_to'
  description?: string
  isSecret?: boolean // Whether this connection is known publicly
}

// Main NPC interface extending Character
export interface NPC extends Omit<Character, 'type' | 'class' | 'alignment'> {
  // Override alignment with our new system
  alignment: AlignmentChoice
  // NPC-specific fields
  npcType: NPCType
  importance: NPCImportance

  // Relationships
  relationships: NPCRelationship[]
  locationRelations: NPCLocationRelation[]
  loreConnections: NPCLoreConnection[]

  // Personality and roleplay
  personality: NPCPersonality

  // Status and tracking
  isAlive: boolean
  currentLocation?: string // Current location ID
  lastSeenDate?: Date

  // Inventory and abilities (inherited from Character but can be extended)
  // items, spells are already in Character base

  // Campaign tracking
  firstAppearance?: string // Session or date first introduced
  lastAppearance?: string // Last time they appeared
  playerKnowledge?: string // What players know about this NPC

  // Additional metadata
  imageUrl?: string
  voiceNotes?: string // Notes for DM about how to voice this character
  plotHooks?: string[] // Story hooks related to this NPC
  tags: string[] // For organization and searching

  // Inventory and abilities
  items: string[] // Item IDs
  spells: string[] // Spell IDs
  notes: string
}

// Zod schemas for validation
export const NPCRelationshipSchema = z.object({
  id: z.string().uuid(),
  npcId: z.string().uuid(),
  npcName: z.string(),
  relationshipType: z.enum([
    'family',
    'friend',
    'enemy',
    'rival',
    'lover',
    'spouse',
    'child',
    'parent',
    'sibling',
    'colleague',
    'mentor',
    'student',
    'business',
    'political',
    'unknown',
  ]),
  description: z.string().optional(),
  isSecret: z.boolean().default(false),
  strength: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  notes: z.string().optional(),
})

export const NPCLocationRelationSchema = z.object({
  id: z.string().uuid(),
  locationId: z.string().uuid(),
  locationName: z.string(),
  relationType: z.enum([
    'lives_in',
    'works_at',
    'owns',
    'frequents',
    'avoids',
    'guards',
    'rules',
    'born_in',
  ]),
  description: z.string().optional(),
  isSecret: z.boolean().default(false),
  importance: z.enum(['primary', 'secondary', 'minor']),
})

export const NPCLoreConnectionSchema = z.object({
  id: z.string().uuid(),
  loreId: z.string().uuid(),
  loreTitle: z.string(),
  connectionType: z.enum([
    'witnessed',
    'participated',
    'knows_about',
    'caused',
    'victim_of',
    'related_to',
  ]),
  description: z.string().optional(),
  isSecret: z.boolean().default(false),
})

export const NPCPersonalitySchema = z.object({
  voice: z
    .object({
      accent: z.string().optional(),
      pitch: z.enum(['high', 'medium', 'low']).optional(),
      speed: z.enum(['fast', 'medium', 'slow']).optional(),
      volume: z.enum(['loud', 'medium', 'quiet']).optional(),
      description: z.string().optional(),
    })
    .optional(),
  personality: z
    .object({
      traits: z.array(z.string()).default([]),
      ideals: z.array(z.string()).default([]),
      bonds: z.array(z.string()).default([]),
      flaws: z.array(z.string()).default([]),
      mannerisms: z.array(z.string()).default([]),
      appearance: z.string().default(''),
    })
    .optional(),
  socialClass: z
    .enum([
      'nobility',
      'merchant',
      'commoner',
      'criminal',
      'clergy',
      'military',
      'other',
    ])
    .optional(),
  occupation: z.string().optional(),
  goals: z.array(z.string()).default([]),
  secrets: z.array(z.string()).default([]),
  fears: z.array(z.string()).default([]),
})

export const NPCSchema = z.object({
  // Base character fields
  id: z.string().uuid(),
  name: z.string().min(1),
  race: z.string().default(''),
  level: z.number().min(1).default(1),
  background: z.string().default(''),
  alignment: z
    .object({
      law: z.enum(['lawful', 'neutral', 'chaotic']).default('neutral'),
      good: z.enum(['good', 'neutral', 'evil']).default('neutral'),
    })
    .default({ law: 'neutral', good: 'neutral' }),

  // Stats
  strength: z.number().min(1).max(30).default(10),
  dexterity: z.number().min(1).max(30).default(10),
  constitution: z.number().min(1).max(30).default(10),
  intelligence: z.number().min(1).max(30).default(10),
  wisdom: z.number().min(1).max(30).default(10),
  charisma: z.number().min(1).max(30).default(10),

  // Health
  maxHitPoints: z.number().min(1).default(1),
  currentHitPoints: z.number().min(0).default(1),
  armorClass: z.number().min(1).default(10),

  // NPC-specific
  npcType: z.enum([
    'friendly',
    'neutral',
    'hostile',
    'ally',
    'enemy',
    'unknown',
  ]),
  importance: z.enum(['major', 'minor', 'background']),

  relationships: z.array(NPCRelationshipSchema).default([]),
  locationRelations: z.array(NPCLocationRelationSchema).default([]),
  loreConnections: z.array(NPCLoreConnectionSchema).default([]),

  personality: NPCPersonalitySchema.default({
    goals: [],
    secrets: [],
    fears: [],
  }),

  isAlive: z.boolean().default(true),
  currentLocation: z.string().optional(),
  lastSeenDate: z.date().optional(),

  firstAppearance: z.string().optional(),
  lastAppearance: z.string().optional(),
  playerKnowledge: z.string().optional(),

  imageUrl: z.string().url().optional(),
  voiceNotes: z.string().optional(),
  plotHooks: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  notes: z.string().default(''),
  items: z.array(z.string()).default([]), // Item IDs
  spells: z.array(z.string()).default([]), // Spell IDs

  createdAt: z.date(),
  updatedAt: z.date(),
})

// Constants for dropdowns
export const NPC_TYPES = [
  {
    value: 'friendly',
    label: 'Amigable',
    color: 'bg-green-100 text-green-800',
  },
  { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 text-gray-800' },
  { value: 'hostile', label: 'Hostil', color: 'bg-red-100 text-red-800' },
  { value: 'ally', label: 'Aliado', color: 'bg-blue-100 text-blue-800' },
  { value: 'enemy', label: 'Enemigo', color: 'bg-red-100 text-red-800' },
  {
    value: 'unknown',
    label: 'Desconocido',
    color: 'bg-yellow-100 text-yellow-800',
  },
] as const

export const NPC_IMPORTANCE = [
  {
    value: 'major',
    label: 'Principal',
    color: 'bg-purple-100 text-purple-800',
  },
  { value: 'minor', label: 'Secundario', color: 'bg-blue-100 text-blue-800' },
  {
    value: 'background',
    label: 'Trasfondo',
    color: 'bg-gray-100 text-gray-800',
  },
] as const

export const RELATIONSHIP_TYPES = [
  { value: 'family', label: 'Familia', category: 'personal' },
  { value: 'friend', label: 'Amigo', category: 'personal' },
  { value: 'enemy', label: 'Enemigo', category: 'personal' },
  { value: 'rival', label: 'Rival', category: 'personal' },
  { value: 'lover', label: 'Amante', category: 'personal' },
  { value: 'spouse', label: 'Cónyuge', category: 'personal' },
  { value: 'child', label: 'Hijo/a', category: 'family' },
  { value: 'parent', label: 'Padre/Madre', category: 'family' },
  { value: 'sibling', label: 'Hermano/a', category: 'family' },
  { value: 'colleague', label: 'Colega', category: 'professional' },
  { value: 'mentor', label: 'Mentor', category: 'professional' },
  { value: 'student', label: 'Estudiante', category: 'professional' },
  { value: 'business', label: 'Socio Comercial', category: 'professional' },
  { value: 'political', label: 'Político', category: 'professional' },
  { value: 'unknown', label: 'Desconocido', category: 'other' },
] as const

export const LOCATION_RELATION_TYPES = [
  { value: 'lives_in', label: 'Vive en', icon: '🏠' },
  { value: 'works_at', label: 'Trabaja en', icon: '💼' },
  { value: 'owns', label: 'Posee', icon: '👑' },
  { value: 'frequents', label: 'Frecuenta', icon: '🚶' },
  { value: 'avoids', label: 'Evita', icon: '🚫' },
  { value: 'guards', label: 'Protege', icon: '🛡️' },
  { value: 'rules', label: 'Gobierna', icon: '👑' },
  { value: 'born_in', label: 'Nació en', icon: '🌟' },
] as const

export const LORE_CONNECTION_TYPES = [
  { value: 'witnessed', label: 'Fue testigo', icon: '👁️' },
  { value: 'participated', label: 'Participó', icon: '⚔️' },
  { value: 'knows_about', label: 'Conoce sobre', icon: '📚' },
  { value: 'caused', label: 'Causó', icon: '🔥' },
  { value: 'victim_of', label: 'Víctima de', icon: '💔' },
  { value: 'related_to', label: 'Relacionado con', icon: '🔗' },
] as const

export const SOCIAL_CLASSES = [
  { value: 'nobility', label: 'Nobleza', icon: '👑' },
  { value: 'merchant', label: 'Comerciante', icon: '💰' },
  { value: 'commoner', label: 'Plebeyo', icon: '👨‍🌾' },
  { value: 'criminal', label: 'Criminal', icon: '🗡️' },
  { value: 'clergy', label: 'Clero', icon: '⛪' },
  { value: 'military', label: 'Militar', icon: '⚔️' },
  { value: 'other', label: 'Otro', icon: '❓' },
] as const

// Helper functions
export function getNPCTypeInfo(type: NPCType) {
  return NPC_TYPES.find(t => t.value === type)
}

export function getNPCImportanceInfo(importance: NPCImportance) {
  return NPC_IMPORTANCE.find(i => i.value === importance)
}

export function getRelationshipTypeInfo(type: RelationshipType) {
  return RELATIONSHIP_TYPES.find(r => r.value === type)
}

export function getLocationRelationInfo(type: LocationRelationType) {
  return LOCATION_RELATION_TYPES.find(r => r.value === type)
}

export function getLoreConnectionInfo(type: string) {
  return LORE_CONNECTION_TYPES.find(r => r.value === type)
}

export function getSocialClassInfo(socialClass: string) {
  return SOCIAL_CLASSES.find(s => s.value === socialClass)
}

// Utility functions for relationships
export function getRelationshipStrength(strength: number): string {
  const strengths = ['Muy débil', 'Débil', 'Moderada', 'Fuerte', 'Muy fuerte']
  return strengths[strength - 1] || 'Desconocida'
}

export function getRelationshipsByType(
  relationships: NPCRelationship[],
  type: RelationshipType
) {
  return relationships.filter(r => r.relationshipType === type)
}

export function getLocationsByRelationType(
  relations: NPCLocationRelation[],
  type: LocationRelationType
) {
  return relations.filter(r => r.relationType === type)
}

// Taxonomy system for reusable options
export interface TaxonomyOption {
  id: string
  name: string
  description?: string
  isCustom: boolean
  createdAt: Date
}

// Background taxonomy
export type BackgroundOption = TaxonomyOption

export const DEFAULT_BACKGROUNDS: BackgroundOption[] = [
  { id: 'acolito', name: 'Acólito', isCustom: false, createdAt: new Date() },
  { id: 'criminal', name: 'Criminal', isCustom: false, createdAt: new Date() },
  { id: 'artista', name: 'Artista', isCustom: false, createdAt: new Date() },
  { id: 'erudito', name: 'Erudito', isCustom: false, createdAt: new Date() },
  { id: 'ermitano', name: 'Ermitaño', isCustom: false, createdAt: new Date() },
  {
    id: 'heroe-pueblo',
    name: 'Héroe del Pueblo',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'noble', name: 'Noble', isCustom: false, createdAt: new Date() },
  {
    id: 'forastero',
    name: 'Forastero',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'marinero', name: 'Marinero', isCustom: false, createdAt: new Date() },
  { id: 'soldado', name: 'Soldado', isCustom: false, createdAt: new Date() },
  {
    id: 'charlatan',
    name: 'Charlatán',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'artesano-gremio',
    name: 'Artesano de Gremio',
    isCustom: false,
    createdAt: new Date(),
  },
]

// Race taxonomy
export type RaceOption = TaxonomyOption

export const DEFAULT_RACES: RaceOption[] = [
  { id: 'humano', name: 'Humano', isCustom: false, createdAt: new Date() },
  { id: 'elfo', name: 'Elfo', isCustom: false, createdAt: new Date() },
  { id: 'enano', name: 'Enano', isCustom: false, createdAt: new Date() },
  { id: 'mediano', name: 'Mediano', isCustom: false, createdAt: new Date() },
  {
    id: 'draconido',
    name: 'Dracónido',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'gnomo', name: 'Gnomo', isCustom: false, createdAt: new Date() },
  { id: 'semielfo', name: 'Semielfo', isCustom: false, createdAt: new Date() },
  { id: 'semiorco', name: 'Semiorco', isCustom: false, createdAt: new Date() },
  { id: 'tiefling', name: 'Tiefling', isCustom: false, createdAt: new Date() },
  {
    id: 'elfo-oscuro',
    name: 'Elfo Oscuro',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'aasimar', name: 'Aasimar', isCustom: false, createdAt: new Date() },
]

// NPC Type taxonomy
export type NPCTypeOption = TaxonomyOption & {
  color: string
}

export const DEFAULT_NPC_TYPES: NPCTypeOption[] = [
  {
    id: 'friendly',
    name: 'Amigable',
    color: 'bg-green-100 text-green-800',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'neutral',
    name: 'Neutral',
    color: 'bg-gray-100 text-gray-800',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'hostile',
    name: 'Hostil',
    color: 'bg-red-100 text-red-800',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'ally',
    name: 'Aliado',
    color: 'bg-blue-100 text-blue-800',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'enemy',
    name: 'Enemigo',
    color: 'bg-red-100 text-red-800',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'unknown',
    name: 'Desconocido',
    color: 'bg-yellow-100 text-yellow-800',
    isCustom: false,
    createdAt: new Date(),
  },
]

// NPC Importance taxonomy
export type NPCImportanceOption = TaxonomyOption & {
  color: string
}

export const DEFAULT_NPC_IMPORTANCE: NPCImportanceOption[] = [
  {
    id: 'major',
    name: 'Principal',
    color: 'bg-purple-100 text-purple-800',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'minor',
    name: 'Secundario',
    color: 'bg-blue-100 text-blue-800',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'background',
    name: 'Trasfondo',
    color: 'bg-gray-100 text-gray-800',
    isCustom: false,
    createdAt: new Date(),
  },
]

// Personality taxonomy options
export const DEFAULT_TRAITS: TaxonomyOption[] = [
  { id: 'friendly', name: 'Amigable', isCustom: false, createdAt: new Date() },
  {
    id: 'aggressive',
    name: 'Agresivo',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'curious', name: 'Curioso', isCustom: false, createdAt: new Date() },
  { id: 'stubborn', name: 'Terco', isCustom: false, createdAt: new Date() },
  { id: 'brave', name: 'Valiente', isCustom: false, createdAt: new Date() },
  { id: 'cowardly', name: 'Cobarde', isCustom: false, createdAt: new Date() },
  {
    id: 'intelligent',
    name: 'Inteligente',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'wise', name: 'Sabio', isCustom: false, createdAt: new Date() },
  {
    id: 'charming',
    name: 'Encantador',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'suspicious',
    name: 'Desconfiado',
    isCustom: false,
    createdAt: new Date(),
  },
]

export const DEFAULT_IDEALS: TaxonomyOption[] = [
  { id: 'justice', name: 'Justicia', isCustom: false, createdAt: new Date() },
  { id: 'freedom', name: 'Libertad', isCustom: false, createdAt: new Date() },
  { id: 'power', name: 'Poder', isCustom: false, createdAt: new Date() },
  {
    id: 'knowledge',
    name: 'Conocimiento',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'wealth', name: 'Riqueza', isCustom: false, createdAt: new Date() },
  { id: 'family', name: 'Familia', isCustom: false, createdAt: new Date() },
  { id: 'honor', name: 'Honor', isCustom: false, createdAt: new Date() },
  { id: 'revenge', name: 'Venganza', isCustom: false, createdAt: new Date() },
  { id: 'peace', name: 'Paz', isCustom: false, createdAt: new Date() },
  {
    id: 'tradition',
    name: 'Tradición',
    isCustom: false,
    createdAt: new Date(),
  },
]

export const DEFAULT_BONDS: TaxonomyOption[] = [
  {
    id: 'family-bond',
    name: 'Mi familia',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'hometown',
    name: 'Mi ciudad natal',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'mentor', name: 'Mi mentor', isCustom: false, createdAt: new Date() },
  {
    id: 'organization',
    name: 'Mi organización',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'sacred-place',
    name: 'Un lugar sagrado',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'artifact',
    name: 'Un artefacto especial',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'promise',
    name: 'Una promesa que hice',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'lost-love',
    name: 'Un amor perdido',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'homeland', name: 'Mi patria', isCustom: false, createdAt: new Date() },
  { id: 'god', name: 'Mi deidad', isCustom: false, createdAt: new Date() },
]

export const DEFAULT_FLAWS: TaxonomyOption[] = [
  { id: 'greedy', name: 'Avaro', isCustom: false, createdAt: new Date() },
  { id: 'proud', name: 'Orgulloso', isCustom: false, createdAt: new Date() },
  { id: 'jealous', name: 'Celoso', isCustom: false, createdAt: new Date() },
  {
    id: 'impulsive',
    name: 'Impulsivo',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'lazy', name: 'Perezoso', isCustom: false, createdAt: new Date() },
  { id: 'liar', name: 'Mentiroso', isCustom: false, createdAt: new Date() },
  {
    id: 'alcoholic',
    name: 'Alcohólico',
    isCustom: false,
    createdAt: new Date(),
  },
  { id: 'paranoid', name: 'Paranoico', isCustom: false, createdAt: new Date() },
  { id: 'naive', name: 'Ingenuo', isCustom: false, createdAt: new Date() },
  { id: 'vengeful', name: 'Vengativo', isCustom: false, createdAt: new Date() },
]

export const DEFAULT_MANNERISMS: TaxonomyOption[] = [
  {
    id: 'beard-stroking',
    name: 'Se toca la barba',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'finger-tapping',
    name: 'Tamborilea los dedos',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'eye-contact',
    name: 'Evita el contacto visual',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'loud-voice',
    name: 'Habla muy alto',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'whispers',
    name: 'Siempre susurra',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'nervous-laugh',
    name: 'Ríe nerviosamente',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'nail-biting',
    name: 'Se muerde las uñas',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'coin-flipping',
    name: 'Juguetea con monedas',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'humming',
    name: 'Tararea constantemente',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'staring',
    name: 'Mira fijamente',
    isCustom: false,
    createdAt: new Date(),
  },
]

// Alignment system with 3x3 grid
export type AlignmentLaw = 'lawful' | 'neutral' | 'chaotic'
export type AlignmentGood = 'good' | 'neutral' | 'evil'

export interface AlignmentChoice {
  law: AlignmentLaw
  good: AlignmentGood
}

export const ALIGNMENT_OPTIONS = {
  law: [
    { value: 'lawful', label: 'Legal', short: 'L' },
    { value: 'neutral', label: 'Neutral', short: 'N' },
    { value: 'chaotic', label: 'Caótico', short: 'C' },
  ] as const,
  good: [
    { value: 'good', label: 'Bueno', short: 'B' },
    { value: 'neutral', label: 'Neutral', short: 'N' },
    { value: 'evil', label: 'Malvado', short: 'M' },
  ] as const,
}

export function getAlignmentDisplay(alignment: AlignmentChoice): string {
  const lawLabel =
    ALIGNMENT_OPTIONS.law.find(l => l.value === alignment.law)?.label || ''
  const goodLabel =
    ALIGNMENT_OPTIONS.good.find(g => g.value === alignment.good)?.label || ''

  if (alignment.law === 'neutral' && alignment.good === 'neutral') {
    return 'Neutral'
  }

  return `${lawLabel} ${goodLabel}`.trim()
}
