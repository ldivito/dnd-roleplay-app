import { z } from 'zod'

// Musical Instrument Categories
export const InstrumentCategorySchema = z.enum([
  'wind', // Viento - flutes, whistles, horns
  'percussion', // Percusión - drums, bells, chimes
  'strings', // Cuerdas - guitars, harps, violins
  'keys', // Teclas - pianos, organs, harpsichords
])

// Musical Genres/Styles that affect song properties
export const MusicGenreSchema = z.enum([
  'ballad', // Balada - healing, peaceful, protective
  'march', // Marcha - buffs, movement, courage
  'lament', // Lamento - debuffs, fear, sorrow
  'battle', // Batalla - combat, aggressive, destructive
  'ritual', // Ritual - summoning, transformation, divination
  'folk', // Popular - utility, everyday magic
])

// Music Performance Quality - affects song power
export const PerformanceQualitySchema = z.enum([
  'poor', // 1-5: Song may fail or backfire
  'adequate', // 6-10: Basic song effect
  'good', // 11-15: Standard song effect
  'excellent', // 16-20: Enhanced song effect
  'masterful', // 21+: Maximum effect + bonuses
])

// Traditional D&D Schools + Music-based schools
export const SongSchoolSchema = z.enum([
  'Abjuración',
  'Conjuración',
  'Adivinación',
  'Encantamiento',
  'Evocación',
  'Ilusión',
  'Nigromancia',
  'Transmutación',
  // New Music-based Schools
  'Harmonía', // Harmony - healing, buffs, cooperation
  'Disonancia', // Dissonance - debuffs, discord, chaos
  'Resonancia', // Resonance - manipulation of matter/energy
  'Melodía', // Melody - charm, emotion, mind effects
])

export const SongLevelSchema = z.number().min(0).max(9)

export const SongRangeSchema = z.enum([
  'Toque',
  'Personal',
  '30 pies',
  '60 pies',
  '90 pies',
  '120 pies',
  '150 pies',
  '300 pies',
  '500 pies',
  '1 milla',
  'Vista',
  'Ilimitado',
  'Especial',
])

export const SongDurationSchema = z.enum([
  'Instantáneo',
  '1 acción',
  '1 acción adicional',
  '1 reacción',
  '1 minuto',
  '10 minutos',
  '1 hora',
  '8 horas',
  '24 horas',
  'Hasta ser disipado',
  'Concentración, hasta 1 minuto',
  'Concentración, hasta 10 minutos',
  'Concentración, hasta 1 hora',
  'Concentración, hasta 8 horas',
  'Concentración, hasta 24 horas',
  'Permanente',
])

// Traditional song components
export const SongComponentsSchema = z.object({
  verbal: z.boolean().default(false),
  somatic: z.boolean().default(false),
  material: z.boolean().default(false),
  materialDescription: z.string().optional(),
})

// Musical components for music-based songs
export const MusicalComponentsSchema = z.object({
  instrument: InstrumentCategorySchema,
  genre: MusicGenreSchema,
  difficulty: z.number().min(5).max(30), // DC for performance check
  duration: z.number().min(1).max(10), // rounds of performance required
  requiredProficiency: z.boolean().default(false), // requires instrument proficiency
  additionalInstruments: z.array(InstrumentCategorySchema).default([]), // ensemble songs
})

// Base song schema with optional musical components
export const SongSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  level: SongLevelSchema,
  school: SongSchoolSchema,
  castingTime: z.string(),
  range: SongRangeSchema,
  duration: SongDurationSchema,
  components: SongComponentsSchema,
  description: z.string().min(1),
  higherLevels: z.string().optional(),
  classes: z.array(z.string()).default([]),
  ritual: z.boolean().default(false),
  concentration: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  source: z.string().optional(),
  page: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Musical song extensions
  isMusicBased: z.boolean().default(true), // Changed default to true since all songs are music-based
  musicalComponents: MusicalComponentsSchema.optional(),
  performanceEffects: z
    .object({
      poor: z.string().optional(), // Effect on poor performance
      adequate: z.string().optional(), // Effect on adequate performance
      good: z.string().optional(), // Effect on good performance
      excellent: z.string().optional(), // Effect on excellent performance
      masterful: z.string().optional(), // Effect on masterful performance
    })
    .optional(),
  instrumentSpecificEffects: z
    .record(InstrumentCategorySchema, z.string())
    .optional(),

  // NEW: Dynamic song properties (from taxonomies)
  songProperties: z.array(z.string()).default([]), // Array of property names from SongProperty taxonomy

  // NEW: Lore connections
  loreIds: z.array(z.string().uuid()).default([]), // Links to lore entries
})

export type Song = z.infer<typeof SongSchema>
export type SongSchool = z.infer<typeof SongSchoolSchema>
export type SongComponents = z.infer<typeof SongComponentsSchema>
export type MusicalComponents = z.infer<typeof MusicalComponentsSchema>
export type InstrumentCategory = z.infer<typeof InstrumentCategorySchema>
export type MusicGenre = z.infer<typeof MusicGenreSchema>
export type PerformanceQuality = z.infer<typeof PerformanceQualitySchema>

export const DND_SONG_SCHOOLS = [
  'Abjuración',
  'Conjuración',
  'Adivinación',
  'Encantamiento',
  'Evocación',
  'Ilusión',
  'Nigromancia',
  'Transmutación',
  'Harmonía',
  'Disonancia',
  'Resonancia',
  'Melodía',
] as const

export const MUSIC_SONG_SCHOOLS = [
  'Harmonía',
  'Disonancia',
  'Resonancia',
  'Melodía',
] as const

export const DND_SONG_CLASSES = [
  'Bardo',
  'Brujo',
  'Clérigo',
  'Druida',
  'Explorador',
  'Hechicero',
  'Mago',
  'Paladín',
] as const

// Instrument categories with their typical magical associations
export const INSTRUMENT_CATEGORIES = [
  {
    id: 'wind' as const,
    name: 'Viento',
    description: 'Flautas, silbatos, cuernos',
    magicalAssociation: 'Control del aire, comunicación, inspiración',
  },
  {
    id: 'percussion' as const,
    name: 'Percusión',
    description: 'Tambores, campanas, carillones',
    magicalAssociation: 'Ritmo vital, protección, invocación',
  },
  {
    id: 'strings' as const,
    name: 'Cuerdas',
    description: 'Guitarras, arpas, violines',
    magicalAssociation: 'Emociones, encantamiento, sanación',
  },
  {
    id: 'keys' as const,
    name: 'Teclas',
    description: 'Pianos, órganos, clavicordios',
    magicalAssociation: 'Armonía compleja, transformación, poder',
  },
] as const

// Music genres with their song effects
export const MUSIC_GENRES = [
  {
    id: 'ballad' as const,
    name: 'Balada',
    description: 'Música suave y melódica',
    effects: 'Sanación, paz, protección, emociones positivas',
  },
  {
    id: 'march' as const,
    name: 'Marcha',
    description: 'Ritmo fuerte y constante',
    effects: 'Mejoras, movimiento, valor, liderazgo',
  },
  {
    id: 'lament' as const,
    name: 'Lamento',
    description: 'Música triste y melancólica',
    effects: 'Debilitamiento, miedo, tristeza, maldiciones',
  },
  {
    id: 'battle' as const,
    name: 'Batalla',
    description: 'Música agresiva y poderosa',
    effects: 'Combate, destrucción, furia, poder',
  },
  {
    id: 'ritual' as const,
    name: 'Ritual',
    description: 'Música ceremonial y mística',
    effects: 'Invocación, transformación, adivinación, magia compleja',
  },
  {
    id: 'folk' as const,
    name: 'Popular',
    description: 'Música tradicional y sencilla',
    effects: 'Utilidad cotidiana, efectos simples, comunidad',
  },
] as const

// Performance quality descriptions
export const PERFORMANCE_QUALITIES = [
  {
    id: 'poor' as const,
    name: 'Deficiente',
    range: '1-5',
    effect: 'La canción puede fallar o tener efectos negativos',
  },
  {
    id: 'adequate' as const,
    name: 'Adecuado',
    range: '6-10',
    effect: 'Efecto básico de la canción',
  },
  {
    id: 'good' as const,
    name: 'Bueno',
    range: '11-15',
    effect: 'Efecto estándar de la canción',
  },
  {
    id: 'excellent' as const,
    name: 'Excelente',
    range: '16-20',
    effect: 'Efecto mejorado de la canción',
  },
  {
    id: 'masterful' as const,
    name: 'Magistral',
    range: '21+',
    effect: 'Efecto máximo con bonificaciones adicionales',
  },
] as const
