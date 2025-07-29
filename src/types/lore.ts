import { z } from 'zod'

// Base lore types
export type LoreType =
  | 'event'
  | 'legend'
  | 'history'
  | 'prophecy'
  | 'secret'
  | 'rumor'
  | 'chronicle'
  | 'tale'
export type LoreImportance = 'main' | 'secondary' | 'minor'
export type ConnectionType =
  | 'character'
  | 'item'
  | 'spell'
  | 'location'
  | 'lore'

// Time period definitions
export interface Era {
  id: string
  name: string
  description: string
  startYear: number
  endYear?: number
  color: string
}

export interface LoreConnection {
  id: string
  type: ConnectionType
  entityId: string
  entityName: string
  relationshipType:
    | 'mentions'
    | 'involves'
    | 'created_by'
    | 'destroyed_by'
    | 'contains'
    | 'located_at'
    | 'related_to'
  description?: string
}

// Main lore interface
export interface Lore {
  id: string
  title: string
  content: string
  type: LoreType
  importance: LoreImportance

  // Timeline information
  year?: number
  era?: string
  dateDescription?: string // "Early spring", "The third moon", etc.

  // Metadata
  isPublic: boolean // Whether players can see this
  author?: string // DM or character who wrote it
  tags: string[]

  // Connections to other entities
  connections: LoreConnection[]

  // Organization
  parentLoreId?: string // For nested/related lore
  isMainTimeline: boolean // Whether it appears on the main timeline

  // Additional info
  imageUrl?: string
  notes?: string // DM-only notes

  createdAt: Date
  updatedAt: Date
}

// Zod schemas
export const EraSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  startYear: z.number(),
  endYear: z.number().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
})

export const LoreConnectionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['character', 'item', 'spell', 'location', 'lore']),
  entityId: z.string().uuid(),
  entityName: z.string(),
  relationshipType: z.enum([
    'mentions',
    'involves',
    'created_by',
    'destroyed_by',
    'contains',
    'located_at',
    'related_to',
  ]),
  description: z.string().optional(),
})

export const LoreSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum([
    'event',
    'legend',
    'history',
    'prophecy',
    'secret',
    'rumor',
    'chronicle',
    'tale',
  ]),
  importance: z.enum(['main', 'secondary', 'minor']),

  year: z.number().optional(),
  era: z.string().optional(),
  dateDescription: z.string().optional(),

  isPublic: z.boolean().default(true),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),

  connections: z.array(LoreConnectionSchema).default([]),

  parentLoreId: z.string().uuid().optional(),
  isMainTimeline: z.boolean().default(false),

  imageUrl: z.string().url().optional(),
  notes: z.string().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
})

// Constants for dropdowns
export const LORE_TYPES = [
  {
    value: 'event',
    label: 'Evento',
    description: 'Algo que ocurrió en el mundo',
  },
  {
    value: 'legend',
    label: 'Leyenda',
    description: 'Historia mítica o legendaria',
  },
  {
    value: 'history',
    label: 'Historia',
    description: 'Eventos históricos documentados',
  },
  {
    value: 'prophecy',
    label: 'Profecía',
    description: 'Predicciones sobre el futuro',
  },
  {
    value: 'secret',
    label: 'Secreto',
    description: 'Información oculta o confidencial',
  },
  { value: 'rumor', label: 'Rumor', description: 'Información no confirmada' },
  {
    value: 'chronicle',
    label: 'Crónica',
    description: 'Registro detallado de eventos',
  },
  { value: 'tale', label: 'Relato', description: 'Historia o cuento' },
] as const

export const LORE_IMPORTANCE = [
  {
    value: 'main',
    label: 'Principal',
    color: 'bg-red-100 text-red-800',
    description: 'Eventos cruciales para la campaña',
  },
  {
    value: 'secondary',
    label: 'Secundario',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Eventos importantes pero no críticos',
  },
  {
    value: 'minor',
    label: 'Menor',
    color: 'bg-gray-100 text-gray-800',
    description: 'Detalles menores del mundo',
  },
] as const

export const RELATIONSHIP_TYPES = [
  {
    value: 'mentions',
    label: 'Menciona',
    description: 'Se hace referencia a esta entidad',
  },
  {
    value: 'involves',
    label: 'Involucra',
    description: 'Esta entidad participa activamente',
  },
  {
    value: 'created_by',
    label: 'Creado por',
    description: 'Esta entidad creó algo',
  },
  {
    value: 'destroyed_by',
    label: 'Destruido por',
    description: 'Esta entidad destruyó algo',
  },
  {
    value: 'contains',
    label: 'Contiene',
    description: 'Esta entidad contiene algo',
  },
  {
    value: 'located_at',
    label: 'Ubicado en',
    description: 'Ocurre en esta ubicación',
  },
  {
    value: 'related_to',
    label: 'Relacionado con',
    description: 'Tiene alguna relación',
  },
] as const

// Default eras - can be customized by users
export const DEFAULT_ERAS: Era[] = [
  {
    id: 'era-1',
    name: 'Era de la Creación',
    description: 'El tiempo de los dioses y la formación del mundo',
    startYear: -10000,
    endYear: -5000,
    color: '#8B5CF6',
  },
  {
    id: 'era-2',
    name: 'Era Antigua',
    description: 'Los primeros imperios y civilizaciones',
    startYear: -5000,
    endYear: -1000,
    color: '#3B82F6',
  },
  {
    id: 'era-3',
    name: 'Era Clásica',
    description: 'El auge de las grandes naciones',
    startYear: -1000,
    endYear: 0,
    color: '#10B981',
  },
  {
    id: 'era-4',
    name: 'Era Moderna',
    description: 'La época actual',
    startYear: 0,
    color: '#F59E0B',
  },
]

// Helper functions
export function getLoreTypeInfo(type: LoreType) {
  return LORE_TYPES.find(t => t.value === type)
}

export function getLoreImportanceInfo(importance: LoreImportance) {
  return LORE_IMPORTANCE.find(i => i.value === importance)
}

export function getRelationshipTypeInfo(type: string) {
  return RELATIONSHIP_TYPES.find(r => r.value === type)
}

export function getEraForYear(year: number, eras: Era[]): Era | undefined {
  return eras.find(
    era =>
      year >= era.startYear &&
      (era.endYear === undefined || year <= era.endYear)
  )
}

export function sortLoreByTimeline(lore: Lore[]): Lore[] {
  return lore.sort((a, b) => {
    // First by year (if available)
    if (a.year !== undefined && b.year !== undefined) {
      return a.year - b.year
    }
    // Then by importance (main timeline items first)
    if (a.isMainTimeline !== b.isMainTimeline) {
      return a.isMainTimeline ? -1 : 1
    }
    // Finally by creation date
    return a.createdAt.getTime() - b.createdAt.getTime()
  })
}

export function groupLoreByEra(
  lore: Lore[],
  eras: Era[]
): Record<string, Lore[]> {
  const grouped: Record<string, Lore[]> = {}

  // Initialize with era names
  eras.forEach(era => {
    grouped[era.name] = []
  })
  grouped['Sin Era'] = []

  lore.forEach(item => {
    if (item.year !== undefined) {
      const era = getEraForYear(item.year, eras)
      const eraName = era?.name || 'Sin Era'
      if (grouped[eraName]) {
        grouped[eraName].push(item)
      }
    } else {
      if (grouped['Sin Era']) {
        grouped['Sin Era'].push(item)
      }
    }
  })

  return grouped
}
