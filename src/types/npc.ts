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
export interface NPC extends Omit<Character, 'type'> {
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
  class: z.string().default(''),
  level: z.number().min(1).default(1),
  background: z.string().default(''),
  alignment: z.string().default(''),

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
