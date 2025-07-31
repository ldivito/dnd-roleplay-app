export interface MapTile {
  x: number
  y: number
  terrain: TerrainType
  elevation: number
  isBlocked: boolean
  hasWater: boolean
  hasCover: boolean
  lightLevel: 'bright' | 'dim' | 'dark'
  features: TileFeature[]
  notes?: string
}

export interface TileFeature {
  id: string
  type: FeatureType
  name: string
  description?: string
  icon?: string
  color?: string
  blocking?: boolean
  interactive?: boolean
}

export interface LocationMap {
  id: string
  locationId: string
  name: string
  description?: string
  width: number
  height: number
  gridSize: number // Size in pixels for display
  tiles: MapTile[]
  metadata: {
    createdAt: Date
    updatedAt: Date
    version: number
    tags: string[]
  }
  settings: {
    showGrid: boolean
    showCoordinates: boolean
    showElevation: boolean
    showLighting: boolean
    defaultTerrain: TerrainType
    backgroundColor: string
  }
}

export type TerrainType =
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'sand'
  | 'water'
  | 'mud'
  | 'snow'
  | 'ice'
  | 'lava'
  | 'wood'
  | 'metal'
  | 'carpet'
  | 'marble'
  | 'cobblestone'
  | 'gravel'
  | 'swamp'
  | 'forest'
  | 'mountain'
  | 'desert'
  | 'custom'

export type FeatureType =
  | 'wall'
  | 'door'
  | 'window'
  | 'stairs'
  | 'pillar'
  | 'tree'
  | 'rock'
  | 'furniture'
  | 'trap'
  | 'treasure'
  | 'spawn_point'
  | 'objective'
  | 'decoration'
  | 'lighting'
  | 'custom'

export interface TerrainDefinition {
  type: TerrainType
  name: string
  description: string
  color: string
  movementCost: number
  isBlocking: boolean
  canHaveCover: boolean
  icon: string
  category: 'natural' | 'constructed' | 'liquid' | 'special'
}

export interface FeatureDefinition {
  type: FeatureType
  name: string
  description: string
  color: string
  isBlocking: boolean
  icon: string
  category: 'structure' | 'nature' | 'interactive' | 'tactical' | 'decoration'
}

export const TERRAIN_DEFINITIONS: TerrainDefinition[] = [
  // Natural Terrains
  {
    type: 'grass',
    name: 'Césped',
    description: 'Hierba natural',
    color: '#4ade80',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '🟢',
    category: 'natural',
  },
  {
    type: 'dirt',
    name: 'Tierra',
    description: 'Suelo de tierra',
    color: '#a3a3a3',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '🟫',
    category: 'natural',
  },
  {
    type: 'sand',
    name: 'Arena',
    description: 'Arena suelta',
    color: '#fbbf24',
    movementCost: 1.5,
    isBlocking: false,
    canHaveCover: false,
    icon: '🟡',
    category: 'natural',
  },
  {
    type: 'stone',
    name: 'Piedra',
    description: 'Superficie rocosa',
    color: '#6b7280',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '⬜',
    category: 'natural',
  },
  {
    type: 'water',
    name: 'Agua',
    description: 'Agua profunda',
    color: '#3b82f6',
    movementCost: 2,
    isBlocking: false,
    canHaveCover: false,
    icon: '🔵',
    category: 'liquid',
  },
  {
    type: 'mud',
    name: 'Barro',
    description: 'Terreno pantanoso',
    color: '#92400e',
    movementCost: 2,
    isBlocking: false,
    canHaveCover: false,
    icon: '🟤',
    category: 'natural',
  },
  {
    type: 'snow',
    name: 'Nieve',
    description: 'Nieve profunda',
    color: '#f8fafc',
    movementCost: 2,
    isBlocking: false,
    canHaveCover: false,
    icon: '⚪',
    category: 'natural',
  },
  {
    type: 'ice',
    name: 'Hielo',
    description: 'Superficie helada',
    color: '#bae6fd',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '🔷',
    category: 'natural',
  },
  {
    type: 'forest',
    name: 'Bosque',
    description: 'Vegetación densa',
    color: '#166534',
    movementCost: 2,
    isBlocking: false,
    canHaveCover: true,
    icon: '🌲',
    category: 'natural',
  },
  {
    type: 'mountain',
    name: 'Montaña',
    description: 'Terreno rocoso elevado',
    color: '#374151',
    movementCost: 3,
    isBlocking: true,
    canHaveCover: true,
    icon: '⛰️',
    category: 'natural',
  },
  {
    type: 'swamp',
    name: 'Pantano',
    description: 'Terreno pantanoso',
    color: '#365314',
    movementCost: 3,
    isBlocking: false,
    canHaveCover: true,
    icon: '🌿',
    category: 'natural',
  },
  {
    type: 'desert',
    name: 'Desierto',
    description: 'Arena del desierto',
    color: '#fcd34d',
    movementCost: 1.5,
    isBlocking: false,
    canHaveCover: false,
    icon: '🏜️',
    category: 'natural',
  },

  // Constructed Terrains
  {
    type: 'wood',
    name: 'Madera',
    description: 'Suelo de madera',
    color: '#92400e',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '🟫',
    category: 'constructed',
  },
  {
    type: 'metal',
    name: 'Metal',
    description: 'Superficie metálica',
    color: '#6b7280',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '⬛',
    category: 'constructed',
  },
  {
    type: 'carpet',
    name: 'Alfombra',
    description: 'Superficie alfombrada',
    color: '#dc2626',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '🔴',
    category: 'constructed',
  },
  {
    type: 'marble',
    name: 'Mármol',
    description: 'Suelo de mármol',
    color: '#f1f5f9',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '🤍',
    category: 'constructed',
  },
  {
    type: 'cobblestone',
    name: 'Adoquín',
    description: 'Suelo empedrado',
    color: '#4b5563',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '🔘',
    category: 'constructed',
  },
  {
    type: 'gravel',
    name: 'Grava',
    description: 'Suelo de grava',
    color: '#9ca3af',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '▫️',
    category: 'constructed',
  },

  // Special Terrains
  {
    type: 'lava',
    name: 'Lava',
    description: 'Lava ardiente',
    color: '#dc2626',
    movementCost: 0,
    isBlocking: true,
    canHaveCover: false,
    icon: '🔥',
    category: 'special',
  },
  {
    type: 'custom',
    name: 'Personalizado',
    description: 'Terreno personalizado',
    color: '#8b5cf6',
    movementCost: 1,
    isBlocking: false,
    canHaveCover: false,
    icon: '❓',
    category: 'special',
  },
]

export const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  // Structures
  {
    type: 'wall',
    name: 'Muro',
    description: 'Muro sólido',
    color: '#374151',
    isBlocking: true,
    icon: '🧱',
    category: 'structure',
  },
  {
    type: 'door',
    name: 'Puerta',
    description: 'Puerta que se puede abrir',
    color: '#92400e',
    isBlocking: true,
    icon: '🚪',
    category: 'structure',
  },
  {
    type: 'window',
    name: 'Ventana',
    description: 'Ventana transparente',
    color: '#3b82f6',
    isBlocking: false,
    icon: '🪟',
    category: 'structure',
  },
  {
    type: 'stairs',
    name: 'Escaleras',
    description: 'Escalones o escaleras',
    color: '#6b7280',
    isBlocking: false,
    icon: '🪜',
    category: 'structure',
  },
  {
    type: 'pillar',
    name: 'Pilar',
    description: 'Columna o pilar',
    color: '#4b5563',
    isBlocking: true,
    icon: '⬜',
    category: 'structure',
  },

  // Nature
  {
    type: 'tree',
    name: 'Árbol',
    description: 'Árbol grande',
    color: '#166534',
    isBlocking: true,
    icon: '🌳',
    category: 'nature',
  },
  {
    type: 'rock',
    name: 'Roca',
    description: 'Roca grande',
    color: '#6b7280',
    isBlocking: true,
    icon: '🗿',
    category: 'nature',
  },

  // Interactive
  {
    type: 'furniture',
    name: 'Mobiliario',
    description: 'Muebles variados',
    color: '#92400e',
    isBlocking: true,
    icon: '🪑',
    category: 'interactive',
  },
  {
    type: 'trap',
    name: 'Trampa',
    description: 'Trampa oculta',
    color: '#dc2626',
    isBlocking: false,
    icon: '⚠️',
    category: 'interactive',
  },
  {
    type: 'treasure',
    name: 'Tesoro',
    description: 'Cofre del tesoro',
    color: '#fbbf24',
    isBlocking: false,
    icon: '💰',
    category: 'interactive',
  },

  // Tactical
  {
    type: 'spawn_point',
    name: 'Punto de Aparición',
    description: 'Punto de inicio',
    color: '#10b981',
    isBlocking: false,
    icon: '🎯',
    category: 'tactical',
  },
  {
    type: 'objective',
    name: 'Objetivo',
    description: 'Punto objetivo',
    color: '#f59e0b',
    isBlocking: false,
    icon: '🏁',
    category: 'tactical',
  },
  {
    type: 'lighting',
    name: 'Iluminación',
    description: 'Fuente de luz',
    color: '#fbbf24',
    isBlocking: false,
    icon: '💡',
    category: 'tactical',
  },

  // Decoration
  {
    type: 'decoration',
    name: 'Decoración',
    description: 'Elemento decorativo',
    color: '#8b5cf6',
    isBlocking: false,
    icon: '✨',
    category: 'decoration',
  },
  {
    type: 'custom',
    name: 'Personalizado',
    description: 'Elemento personalizado',
    color: '#8b5cf6',
    isBlocking: false,
    icon: '❓',
    category: 'decoration',
  },
]

export const MAP_SIZE_PRESETS = [
  {
    name: 'Pequeño',
    width: 10,
    height: 10,
    description: 'Ideal para encuentros rápidos',
  },
  { name: 'Mediano', width: 15, height: 15, description: 'Combates estándar' },
  { name: 'Grande', width: 20, height: 20, description: 'Batallas épicas' },
  {
    name: 'Rectangular',
    width: 25,
    height: 15,
    description: 'Pasillo o sala larga',
  },
  {
    name: 'Amplio',
    width: 30,
    height: 20,
    description: 'Campos de batalla masivos',
  },
  {
    name: 'Épico',
    width: 40,
    height: 30,
    description: 'Encuentros legendarios',
  },
  {
    name: 'Personalizado',
    width: 0,
    height: 0,
    description: 'Tamaño personalizado',
  },
]

export interface MapEditorTool {
  id: string
  name: string
  icon: string
  description: string
  type: 'terrain' | 'feature' | 'utility'
  data?: TerrainType | FeatureType
}

export const MAP_EDITOR_TOOLS: MapEditorTool[] = [
  // Basic Terrain Tools
  {
    id: 'terrain_grass',
    name: 'Césped',
    icon: '🟢',
    description: 'Pintar césped',
    type: 'terrain',
    data: 'grass',
  },
  {
    id: 'terrain_dirt',
    name: 'Tierra',
    icon: '🟫',
    description: 'Pintar tierra',
    type: 'terrain',
    data: 'dirt',
  },
  {
    id: 'terrain_stone',
    name: 'Piedra',
    icon: '⬜',
    description: 'Pintar piedra',
    type: 'terrain',
    data: 'stone',
  },
  {
    id: 'terrain_sand',
    name: 'Arena',
    icon: '🟡',
    description: 'Pintar arena',
    type: 'terrain',
    data: 'sand',
  },
  {
    id: 'terrain_water',
    name: 'Agua',
    icon: '🔵',
    description: 'Pintar agua',
    type: 'terrain',
    data: 'water',
  },
  {
    id: 'terrain_mud',
    name: 'Barro',
    icon: '🟤',
    description: 'Pintar barro',
    type: 'terrain',
    data: 'mud',
  },

  // Advanced Natural Terrain
  {
    id: 'terrain_forest',
    name: 'Bosque',
    icon: '🌲',
    description: 'Pintar bosque denso',
    type: 'terrain',
    data: 'forest',
  },
  {
    id: 'terrain_mountain',
    name: 'Montaña',
    icon: '⛰️',
    description: 'Pintar montaña rocosa',
    type: 'terrain',
    data: 'mountain',
  },
  {
    id: 'terrain_swamp',
    name: 'Pantano',
    icon: '🌿',
    description: 'Pintar pantano',
    type: 'terrain',
    data: 'swamp',
  },
  {
    id: 'terrain_desert',
    name: 'Desierto',
    icon: '🏜️',
    description: 'Pintar desierto',
    type: 'terrain',
    data: 'desert',
  },
  {
    id: 'terrain_snow',
    name: 'Nieve',
    icon: '⚪',
    description: 'Pintar nieve',
    type: 'terrain',
    data: 'snow',
  },
  {
    id: 'terrain_ice',
    name: 'Hielo',
    icon: '🔷',
    description: 'Pintar hielo',
    type: 'terrain',
    data: 'ice',
  },

  // Constructed Terrain
  {
    id: 'terrain_wood',
    name: 'Madera',
    icon: '🪵',
    description: 'Pintar suelo de madera',
    type: 'terrain',
    data: 'wood',
  },
  {
    id: 'terrain_metal',
    name: 'Metal',
    icon: '⬛',
    description: 'Pintar superficie metálica',
    type: 'terrain',
    data: 'metal',
  },
  {
    id: 'terrain_marble',
    name: 'Mármol',
    icon: '🤍',
    description: 'Pintar mármol',
    type: 'terrain',
    data: 'marble',
  },
  {
    id: 'terrain_cobblestone',
    name: 'Adoquín',
    icon: '🔘',
    description: 'Pintar adoquines',
    type: 'terrain',
    data: 'cobblestone',
  },

  // Special Terrain
  {
    id: 'terrain_lava',
    name: 'Lava',
    icon: '🔥',
    description: 'Pintar lava ardiente',
    type: 'terrain',
    data: 'lava',
  },

  // Structure Features
  {
    id: 'feature_wall',
    name: 'Muro',
    icon: '🧱',
    description: 'Colocar muro',
    type: 'feature',
    data: 'wall',
  },
  {
    id: 'feature_door',
    name: 'Puerta',
    icon: '🚪',
    description: 'Colocar puerta',
    type: 'feature',
    data: 'door',
  },
  {
    id: 'feature_window',
    name: 'Ventana',
    icon: '🪟',
    description: 'Colocar ventana',
    type: 'feature',
    data: 'window',
  },
  {
    id: 'feature_stairs',
    name: 'Escaleras',
    icon: '🪜',
    description: 'Colocar escaleras',
    type: 'feature',
    data: 'stairs',
  },
  {
    id: 'feature_pillar',
    name: 'Pilar',
    icon: '⬜',
    description: 'Colocar pilar',
    type: 'feature',
    data: 'pillar',
  },

  // Nature Features
  {
    id: 'feature_tree',
    name: 'Árbol',
    icon: '🌳',
    description: 'Colocar árbol',
    type: 'feature',
    data: 'tree',
  },
  {
    id: 'feature_rock',
    name: 'Roca',
    icon: '🗿',
    description: 'Colocar roca',
    type: 'feature',
    data: 'rock',
  },

  // Interactive Features
  {
    id: 'feature_furniture',
    name: 'Mobiliario',
    icon: '🪑',
    description: 'Colocar muebles',
    type: 'feature',
    data: 'furniture',
  },
  {
    id: 'feature_trap',
    name: 'Trampa',
    icon: '⚠️',
    description: 'Colocar trampa',
    type: 'feature',
    data: 'trap',
  },
  {
    id: 'feature_treasure',
    name: 'Tesoro',
    icon: '💰',
    description: 'Colocar tesoro',
    type: 'feature',
    data: 'treasure',
  },

  // Tactical Features
  {
    id: 'feature_spawn_point',
    name: 'Spawn',
    icon: '🎯',
    description: 'Punto de aparición',
    type: 'feature',
    data: 'spawn_point',
  },
  {
    id: 'feature_objective',
    name: 'Objetivo',
    icon: '🏁',
    description: 'Punto objetivo',
    type: 'feature',
    data: 'objective',
  },
  {
    id: 'feature_lighting',
    name: 'Luz',
    icon: '💡',
    description: 'Fuente de luz',
    type: 'feature',
    data: 'lighting',
  },

  // Utility Tools
  {
    id: 'util_eraser',
    name: 'Borrar',
    icon: '🧽',
    description: 'Borrar elementos',
    type: 'utility',
  },
  {
    id: 'util_fill',
    name: 'Rellenar',
    icon: '🪣',
    description: 'Rellenar área',
    type: 'utility',
  },
  {
    id: 'util_picker',
    name: 'Cuentagotas',
    icon: '💧',
    description: 'Copiar terreno/elemento',
    type: 'utility',
  },
]
