import { z } from 'zod'

export const DiceTypeSchema = z.enum([
  'd4',
  'd6',
  'd8',
  'd10',
  'd12',
  'd20',
  'd100',
])

export const DiceRollSchema = z.object({
  id: z.string().uuid(),
  type: DiceTypeSchema,
  count: z.number().min(1).max(20),
  modifier: z.number().default(0),
  result: z.number(),
  individual: z.array(z.number()),
  total: z.number(),
  timestamp: z.date(),
  rollerId: z.string().optional(),
  rollerName: z.string().optional(),
  description: z.string().optional(),
})

export const InitiativeSchema = z.object({
  characterId: z.string().uuid(),
  characterName: z.string(),
  initiative: z.number(),
  isPlayer: z.boolean(),
  hasActed: z.boolean().default(false),
})

export type DiceType = z.infer<typeof DiceTypeSchema>
export type DiceRoll = z.infer<typeof DiceRollSchema>
export type Initiative = z.infer<typeof InitiativeSchema>
