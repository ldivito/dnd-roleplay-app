import { z } from 'zod'

// Rest Types
export type RestType = 'short' | 'long'
export type ResourceRecoveryType = 'short' | 'long' | 'none'

// Spell Slots (for spellcasting characters)
export interface SpellSlots {
  level1: { current: number; maximum: number }
  level2: { current: number; maximum: number }
  level3: { current: number; maximum: number }
  level4: { current: number; maximum: number }
  level5: { current: number; maximum: number }
  level6: { current: number; maximum: number }
  level7: { current: number; maximum: number }
  level8: { current: number; maximum: number }
  level9: { current: number; maximum: number }
}

// Hit Dice Pool
export interface HitDicePool {
  available: number // How many hit dice the character can still use
  total: number // Total hit dice (usually equal to character level)
  diceType: string // e.g., 'd8', 'd10', 'd12'
}

// Class-specific resources (Ki, Rage, Sorcery Points, etc.)
export interface ClassResource {
  id: string
  name: string
  current: number
  maximum: number
  recoveryType: ResourceRecoveryType
  description?: string
}

// Rest Event (historical record)
export interface RestEvent {
  id: string
  type: RestType
  startTime: Date
  endTime: Date
  participantIds: string[] // Character IDs who participated
  location?: string
  notes?: string
  resourcesRestored: {
    characterId: string
    characterName: string
    hpRestored: number
    hitDiceRestored: number
    spellSlotsRestored?: number
    resourcesRestored: string[] // Names of class resources restored
  }[]
  interrupted: boolean
  createdAt: Date
}

// Zod Schemas
export const SpellSlotsSchema = z.object({
  level1: z.object({ current: z.number().min(0), maximum: z.number().min(0) }),
  level2: z.object({ current: z.number().min(0), maximum: z.number().min(0) }),
  level3: z.object({ current: z.number().min(0), maximum: z.number().min(0) }),
  level4: z.object({ current: z.number().min(0), maximum: z.number().min(0) }),
  level5: z.object({ current: z.number().min(0), maximum: z.number().min(0) }),
  level6: z.object({ current: z.number().min(0), maximum: z.number().min(0) }),
  level7: z.object({ current: z.number().min(0), maximum: z.number().min(0) }),
  level8: z.object({ current: z.number().min(0), maximum: z.number().min(0) }),
  level9: z.object({ current: z.number().min(0), maximum: z.number().min(0) }),
})

export const HitDicePoolSchema = z.object({
  available: z.number().min(0),
  total: z.number().min(0),
  diceType: z.string(),
})

export const ClassResourceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  current: z.number().min(0),
  maximum: z.number().min(0),
  recoveryType: z.enum(['short', 'long', 'none']),
  description: z.string().optional(),
})

export const RestEventSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['short', 'long']),
  startTime: z.date(),
  endTime: z.date(),
  participantIds: z.array(z.string().uuid()),
  location: z.string().optional(),
  notes: z.string().optional(),
  resourcesRestored: z.array(
    z.object({
      characterId: z.string().uuid(),
      characterName: z.string(),
      hpRestored: z.number().min(0),
      hitDiceRestored: z.number().min(0),
      spellSlotsRestored: z.number().min(0).optional(),
      resourcesRestored: z.array(z.string()),
    })
  ),
  interrupted: z.boolean(),
  createdAt: z.date(),
})

// Helper function to create empty spell slots
export function createEmptySpellSlots(): SpellSlots {
  return {
    level1: { current: 0, maximum: 0 },
    level2: { current: 0, maximum: 0 },
    level3: { current: 0, maximum: 0 },
    level4: { current: 0, maximum: 0 },
    level5: { current: 0, maximum: 0 },
    level6: { current: 0, maximum: 0 },
    level7: { current: 0, maximum: 0 },
    level8: { current: 0, maximum: 0 },
    level9: { current: 0, maximum: 0 },
  }
}

// Helper to restore all spell slots
export function restoreAllSpellSlots(slots: SpellSlots): SpellSlots {
  return {
    level1: { ...slots.level1, current: slots.level1.maximum },
    level2: { ...slots.level2, current: slots.level2.maximum },
    level3: { ...slots.level3, current: slots.level3.maximum },
    level4: { ...slots.level4, current: slots.level4.maximum },
    level5: { ...slots.level5, current: slots.level5.maximum },
    level6: { ...slots.level6, current: slots.level6.maximum },
    level7: { ...slots.level7, current: slots.level7.maximum },
    level8: { ...slots.level8, current: slots.level8.maximum },
    level9: { ...slots.level9, current: slots.level9.maximum },
  }
}

// Helper to count total spell slots restored
export function countRestoredSpellSlots(
  before: SpellSlots,
  after: SpellSlots
): number {
  let count = 0
  const levels: Array<keyof SpellSlots> = [
    'level1',
    'level2',
    'level3',
    'level4',
    'level5',
    'level6',
    'level7',
    'level8',
    'level9',
  ]

  for (const level of levels) {
    count += after[level].current - before[level].current
  }

  return count
}
