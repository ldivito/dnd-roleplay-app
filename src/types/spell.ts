import { z } from 'zod'

// Musical Instrument Categories
export const InstrumentCategorySchema = z.enum([
  'wind', // Viento - flutes, whistles, horns
  'percussion', // Percusión - drums, bells, chimes
  'strings', // Cuerdas - guitars, harps, violins
  'keys', // Teclas - pianos, organs, harpsichords
])

// Musical Genres/Styles that affect spell properties
export const MusicGenreSchema = z.enum([
  'ballad', // Balada - healing, peaceful, protective
  'march', // Marcha - buffs, movement, courage
  'lament', // Lamento - debuffs, fear, sorrow
  'battle', // Batalla - combat, aggressive, destructive
  'ritual', // Ritual - summoning, transformation, divination
  'folk', // Popular - utility, everyday magic
])

// Music Performance Quality - affects spell power
export const PerformanceQualitySchema = z.enum([
  'poor', // 1-5: Spell may fail or backfire
  'adequate', // 6-10: Basic spell effect
  'good', // 11-15: Standard spell effect
  'excellent', // 16-20: Enhanced spell effect
  'masterful', // 21+: Maximum effect + bonuses
])

// Traditional D&D Schools + Music-based schools
export const SpellSchoolSchema = z.enum([
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

export const SpellLevelSchema = z.number().min(0).max(9)

export const SpellRangeSchema = z.enum([
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

export const SpellDurationSchema = z.enum([
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

// Traditional spell components
export const SpellComponentsSchema = z.object({
  verbal: z.boolean().default(false),
  somatic: z.boolean().default(false),
  material: z.boolean().default(false),
  materialDescription: z.string().optional(),
})

// Musical components for music-based spells
export const MusicalComponentsSchema = z.object({
  instrument: InstrumentCategorySchema,
  genre: MusicGenreSchema,
  difficulty: z.number().min(5).max(30), // DC for performance check
  duration: z.number().min(1).max(10), // rounds of performance required
  requiredProficiency: z.boolean().default(false), // requires instrument proficiency
  additionalInstruments: z.array(InstrumentCategorySchema).default([]), // ensemble spells
})

// Base spell schema with optional musical components
export const SpellSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  level: SpellLevelSchema,
  school: SpellSchoolSchema,
  castingTime: z.string(),
  range: SpellRangeSchema,
  duration: SpellDurationSchema,
  components: SpellComponentsSchema,
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
  // Musical spell extensions
  isMusicBased: z.boolean().default(false),
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
})

export type Spell = z.infer<typeof SpellSchema>
export type SpellSchool = z.infer<typeof SpellSchoolSchema>
export type SpellComponents = z.infer<typeof SpellComponentsSchema>
export type MusicalComponents = z.infer<typeof MusicalComponentsSchema>
export type InstrumentCategory = z.infer<typeof InstrumentCategorySchema>
export type MusicGenre = z.infer<typeof MusicGenreSchema>
export type PerformanceQuality = z.infer<typeof PerformanceQualitySchema>

export const DND_SPELL_SCHOOLS = [
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

export const MUSIC_SPELL_SCHOOLS = [
  'Harmonía',
  'Disonancia',
  'Resonancia',
  'Melodía',
] as const

export const DND_SPELL_CLASSES = [
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

// Music genres with their spell effects
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
    effect: 'El hechizo puede fallar o tener efectos negativos',
  },
  {
    id: 'adequate' as const,
    name: 'Adecuado',
    range: '6-10',
    effect: 'Efecto básico del hechizo',
  },
  {
    id: 'good' as const,
    name: 'Bueno',
    range: '11-15',
    effect: 'Efecto estándar del hechizo',
  },
  {
    id: 'excellent' as const,
    name: 'Excelente',
    range: '16-20',
    effect: 'Efecto mejorado del hechizo',
  },
  {
    id: 'masterful' as const,
    name: 'Magistral',
    range: '21+',
    effect: 'Efecto máximo con bonificaciones adicionales',
  },
] as const
