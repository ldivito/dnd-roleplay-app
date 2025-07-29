import { z } from 'zod'

// Location Types Hierarchy: Plane > Continent > Region > Location
export type LocationType = 'plane' | 'continent' | 'region' | 'location'

// Base location interface
export interface BaseLocation {
  id: string
  name: string
  description: string
  type: LocationType
  parentId?: string
  imageUrl?: string
  notes?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Plane (Top level - different planes of existence)
export interface Plane extends BaseLocation {
  type: 'plane'
  planeType:
    | 'material'
    | 'elemental'
    | 'celestial'
    | 'infernal'
    | 'shadowfell'
    | 'feywild'
    | 'astral'
    | 'ethereal'
    | 'other'
  alignment?:
    | 'lawful-good'
    | 'neutral-good'
    | 'chaotic-good'
    | 'lawful-neutral'
    | 'true-neutral'
    | 'chaotic-neutral'
    | 'lawful-evil'
    | 'neutral-evil'
    | 'chaotic-evil'
  inhabitants?: string[]
  dominantForces?: string[]
}

// Continent (Large landmasses within a plane)
export interface Continent extends BaseLocation {
  type: 'continent'
  parentId: string // Must belong to a plane
  climate:
    | 'tropical'
    | 'temperate'
    | 'arctic'
    | 'desert'
    | 'volcanic'
    | 'magical'
    | 'other'
  terrain: string[]
  majorFeatures?: string[]
  dominantRaces?: string[]
}

// Region (Areas within a continent)
export interface Region extends BaseLocation {
  type: 'region'
  parentId: string // Must belong to a continent
  regionType:
    | 'kingdom'
    | 'duchy'
    | 'province'
    | 'wilderness'
    | 'wasteland'
    | 'forest'
    | 'mountains'
    | 'desert'
    | 'swamp'
    | 'other'
  government?: string
  ruler?: string
  population?: number
  majorSettlements?: string[]
  dangerLevel: 1 | 2 | 3 | 4 | 5 // 1 = safe, 5 = extremely dangerous
}

// Location (Specific places within regions)
export interface Location extends BaseLocation {
  type: 'location'
  parentId: string // Must belong to a region
  locationType:
    | 'city'
    | 'town'
    | 'village'
    | 'fortress'
    | 'temple'
    | 'dungeon'
    | 'ruins'
    | 'landmark'
    | 'tavern'
    | 'shop'
    | 'other'
  population?: number
  government?: string
  economy?: string[]
  defenses?: string
  keyNPCs?: Array<{
    name: string
    role: string
    description?: string
  }>
  services?: string[]
  rumors?: string[]
  secrets?: string[]
}

// Union type for all location types
export type AnyLocation = Plane | Continent | Region | Location

// Zod schemas for validation
export const BaseLocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  parentId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const PlaneSchema = BaseLocationSchema.extend({
  type: z.literal('plane'),
  planeType: z.enum([
    'material',
    'elemental',
    'celestial',
    'infernal',
    'shadowfell',
    'feywild',
    'astral',
    'ethereal',
    'other',
  ]),
  alignment: z
    .enum([
      'lawful-good',
      'neutral-good',
      'chaotic-good',
      'lawful-neutral',
      'true-neutral',
      'chaotic-neutral',
      'lawful-evil',
      'neutral-evil',
      'chaotic-evil',
    ])
    .optional(),
  inhabitants: z.array(z.string()).optional(),
  dominantForces: z.array(z.string()).optional(),
})

export const ContinentSchema = BaseLocationSchema.extend({
  type: z.literal('continent'),
  parentId: z.string().uuid(),
  climate: z.enum([
    'tropical',
    'temperate',
    'arctic',
    'desert',
    'volcanic',
    'magical',
    'other',
  ]),
  terrain: z.array(z.string()).default([]),
  majorFeatures: z.array(z.string()).optional(),
  dominantRaces: z.array(z.string()).optional(),
})

export const RegionSchema = BaseLocationSchema.extend({
  type: z.literal('region'),
  parentId: z.string().uuid(),
  regionType: z.enum([
    'kingdom',
    'duchy',
    'province',
    'wilderness',
    'wasteland',
    'forest',
    'mountains',
    'desert',
    'swamp',
    'other',
  ]),
  government: z.string().optional(),
  ruler: z.string().optional(),
  population: z.number().min(0).optional(),
  majorSettlements: z.array(z.string()).optional(),
  dangerLevel: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
})

export const LocationSchema = BaseLocationSchema.extend({
  type: z.literal('location'),
  parentId: z.string().uuid(),
  locationType: z.enum([
    'city',
    'town',
    'village',
    'fortress',
    'temple',
    'dungeon',
    'ruins',
    'landmark',
    'tavern',
    'shop',
    'other',
  ]),
  population: z.number().min(0).optional(),
  government: z.string().optional(),
  economy: z.array(z.string()).optional(),
  defenses: z.string().optional(),
  keyNPCs: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
  services: z.array(z.string()).optional(),
  rumors: z.array(z.string()).optional(),
  secrets: z.array(z.string()).optional(),
})

// Constants for dropdowns
export const PLANE_TYPES = [
  'material',
  'elemental',
  'celestial',
  'infernal',
  'shadowfell',
  'feywild',
  'astral',
  'ethereal',
  'other',
] as const

export const ALIGNMENTS = [
  'lawful-good',
  'neutral-good',
  'chaotic-good',
  'lawful-neutral',
  'true-neutral',
  'chaotic-neutral',
  'lawful-evil',
  'neutral-evil',
  'chaotic-evil',
] as const

export const CLIMATES = [
  'tropical',
  'temperate',
  'arctic',
  'desert',
  'volcanic',
  'magical',
  'other',
] as const

export const REGION_TYPES = [
  'kingdom',
  'duchy',
  'province',
  'wilderness',
  'wasteland',
  'forest',
  'mountains',
  'desert',
  'swamp',
  'other',
] as const

export const LOCATION_TYPES = [
  'city',
  'town',
  'village',
  'fortress',
  'temple',
  'dungeon',
  'ruins',
  'landmark',
  'tavern',
  'shop',
  'other',
] as const

export const DANGER_LEVELS = [
  { value: 1, label: 'Muy Seguro', color: 'bg-green-100 text-green-800' },
  { value: 2, label: 'Seguro', color: 'bg-blue-100 text-blue-800' },
  { value: 3, label: 'Moderado', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'Peligroso', color: 'bg-orange-100 text-orange-800' },
  {
    value: 5,
    label: 'Extremadamente Peligroso',
    color: 'bg-red-100 text-red-800',
  },
] as const

// Helper functions
export function getLocationTypeLabel(type: LocationType): string {
  const labels: Record<LocationType, string> = {
    plane: 'Plano',
    continent: 'Continente',
    region: 'Región',
    location: 'Ubicación',
  }
  return labels[type]
}

export function canHaveChildren(type: LocationType): boolean {
  return type !== 'location'
}

export function getValidChildTypes(parentType: LocationType): LocationType[] {
  const childMap: Record<LocationType, LocationType[]> = {
    plane: ['continent'],
    continent: ['region'],
    region: ['location'],
    location: [],
  }
  return childMap[parentType] || []
}

export function isValidParentChild(
  parentType: LocationType,
  childType: LocationType
): boolean {
  return getValidChildTypes(parentType).includes(childType)
}
