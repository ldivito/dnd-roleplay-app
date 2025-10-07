import { z } from 'zod'
import {
  SpellSlotsSchema,
  HitDicePoolSchema,
  ClassResourceSchema,
} from './rest'

export const AbilityScoreSchema = z.object({
  strength: z.number().min(1).max(30),
  dexterity: z.number().min(1).max(30),
  constitution: z.number().min(1).max(30),
  intelligence: z.number().min(1).max(30),
  wisdom: z.number().min(1).max(30),
  charisma: z.number().min(1).max(30),
})

export const SavingThrowsSchema = z.object({
  strength: z.object({ proficient: z.boolean(), value: z.number() }),
  dexterity: z.object({ proficient: z.boolean(), value: z.number() }),
  constitution: z.object({ proficient: z.boolean(), value: z.number() }),
  intelligence: z.object({ proficient: z.boolean(), value: z.number() }),
  wisdom: z.object({ proficient: z.boolean(), value: z.number() }),
  charisma: z.object({ proficient: z.boolean(), value: z.number() }),
})

export const SkillSchema = z.object({
  proficient: z.boolean(),
  expertise: z.boolean().default(false),
  value: z.number(),
})

export const SkillsSchema = z.object({
  acrobatics: SkillSchema,
  animalHandling: SkillSchema,
  arcana: SkillSchema,
  athletics: SkillSchema,
  deception: SkillSchema,
  history: SkillSchema,
  insight: SkillSchema,
  intimidation: SkillSchema,
  investigation: SkillSchema,
  medicine: SkillSchema,
  nature: SkillSchema,
  perception: SkillSchema,
  performance: SkillSchema,
  persuasion: SkillSchema,
  religion: SkillSchema,
  sleightOfHand: SkillSchema,
  stealth: SkillSchema,
  survival: SkillSchema,
})

export const CharacterSchema = z.object({
  // Basic Information
  id: z.string().uuid(),
  name: z.string().min(1),
  class: z.string(),
  level: z.number().min(1).max(20),
  race: z.string(),
  subrace: z.string().optional(),
  background: z.string().optional(),
  alignment: z.string().optional(),
  experience: z.number().min(0).default(0),

  // Core Stats
  abilityScores: AbilityScoreSchema,
  savingThrows: SavingThrowsSchema,
  skills: SkillsSchema,

  // Combat Stats
  hitPoints: z.object({
    current: z.number().min(0),
    maximum: z.number().min(1),
    temporary: z.number().min(0).default(0),
    hitDice: z.string().default('1d8'),
  }),
  armorClass: z.number().min(10),
  initiative: z.number(),
  speed: z.number().min(0).default(30),
  proficiencyBonus: z.number().min(2),

  // Rest & Resource Management
  hitDicePool: HitDicePoolSchema.optional(),
  spellSlots: SpellSlotsSchema.optional(),
  classResources: z.array(ClassResourceSchema).optional(),

  // Features & Traits
  proficienciesAndLanguages: z.string().optional(),
  featuresAndTraits: z.string().optional(),

  // Equipment
  equipment: z.string().optional(),
  attacksAndSpellcasting: z.string().optional(),

  // Character Details
  personalityTraits: z.string().optional(),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),

  // Backstory
  backstory: z.string().optional(),
  alliesAndOrganizations: z.string().optional(),
  additionalFeaturesAndTraits: z.string().optional(),
  treasure: z.string().optional(),

  // Meta
  isNPC: z.boolean().default(false),
  playerName: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Character = z.infer<typeof CharacterSchema>
export type AbilityScore = z.infer<typeof AbilityScoreSchema>
export type SavingThrows = z.infer<typeof SavingThrowsSchema>
export type Skills = z.infer<typeof SkillsSchema>
export type Skill = z.infer<typeof SkillSchema>

// D&D Constants
export const DND_CLASSES = [
  'Bárbaro',
  'Bardo',
  'Clérigo',
  'Druida',
  'Explorador',
  'Guerrero',
  'Hechicero',
  'Mago',
  'Monje',
  'Paladín',
  'Pícaro',
  'Brujo',
] as const

export const DND_RACES = [
  'Humano',
  'Elfo',
  'Enano',
  'Mediano',
  'Dracónido',
  'Gnomo',
  'Semielfo',
  'Semiorco',
  'Tiefling',
  'Elfo Oscuro',
  'Aasimar',
] as const

export const DND_ALIGNMENTS = [
  'Legal Bueno',
  'Neutral Bueno',
  'Caótico Bueno',
  'Legal Neutral',
  'Neutral',
  'Caótico Neutral',
  'Legal Malvado',
  'Neutral Malvado',
  'Caótico Malvado',
] as const

export const DND_BACKGROUNDS = [
  'Acólito',
  'Criminal',
  'Artista',
  'Erudito',
  'Ermitaño',
  'Héroe del Pueblo',
  'Noble',
  'Forastero',
  'Marinero',
  'Soldado',
  'Charlatán',
  'Artesano de Gremio',
] as const
