import { z } from 'zod'

export const AbilityScoreSchema = z.object({
  strength: z.number().min(1).max(30),
  dexterity: z.number().min(1).max(30),
  constitution: z.number().min(1).max(30),
  intelligence: z.number().min(1).max(30),
  wisdom: z.number().min(1).max(30),
  charisma: z.number().min(1).max(30),
})

export const CharacterSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  class: z.string(),
  level: z.number().min(1).max(20),
  race: z.string(),
  background: z.string().optional(),
  abilityScores: AbilityScoreSchema,
  hitPoints: z.object({
    current: z.number().min(0),
    maximum: z.number().min(1),
    temporary: z.number().min(0).default(0),
  }),
  armorClass: z.number().min(10),
  speed: z.number().min(0).default(30),
  proficiencyBonus: z.number().min(2),
  isNPC: z.boolean().default(false),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Character = z.infer<typeof CharacterSchema>
export type AbilityScore = z.infer<typeof AbilityScoreSchema>
