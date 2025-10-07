import type { Character } from '@/types/character'
import type {
  SpellSlots,
  HitDicePool,
  ClassResource,
  ResourceRecoveryType,
} from '@/types/rest'
import { createEmptySpellSlots } from '@/types/rest'

/**
 * Calculate Constitution modifier from ability score
 */
export function getConstitutionModifier(constitution: number): number {
  return Math.floor((constitution - 10) / 2)
}

/**
 * Calculate how many hit dice are recovered on a long rest
 * D&D 5e Rule: Recover half your total hit dice (minimum 1)
 */
export function calculateHitDiceRecovery(characterLevel: number): number {
  return Math.max(1, Math.floor(characterLevel / 2))
}

/**
 * Roll hit dice with Constitution modifier
 * Returns the HP recovered
 */
export function rollHitDice(
  diceType: string,
  constitution: number,
  diceCount: number = 1
): number {
  const sides = parseInt(diceType.replace('d', ''))
  const conMod = getConstitutionModifier(constitution)

  let total = 0
  for (let i = 0; i < diceCount; i++) {
    const roll = Math.floor(Math.random() * sides) + 1
    // Minimum 1 HP per hit die (even with negative CON)
    total += Math.max(1, roll + conMod)
  }

  return total
}

/**
 * Get the hit dice type for a D&D class
 */
export function getHitDiceTypeForClass(className: string): string {
  const hitDiceMap: Record<string, string> = {
    Bárbaro: 'd12',
    Bardo: 'd8',
    Clérigo: 'd8',
    Druida: 'd8',
    Explorador: 'd10',
    Guerrero: 'd10',
    Hechicero: 'd6',
    Mago: 'd6',
    Monje: 'd8',
    Paladín: 'd10',
    Pícaro: 'd8',
    Brujo: 'd8',
  }

  return hitDiceMap[className] || 'd8'
}

/**
 * Check if a class is a spellcaster
 */
export function isSpellcaster(className: string): boolean {
  const spellcasters = [
    'Bardo',
    'Clérigo',
    'Druida',
    'Explorador',
    'Hechicero',
    'Mago',
    'Paladín',
    'Brujo',
  ]
  return spellcasters.includes(className)
}

/**
 * Check if a class is a full caster (gets 9th level spells)
 */
export function isFullCaster(className: string): boolean {
  const fullCasters = ['Bardo', 'Clérigo', 'Druida', 'Hechicero', 'Mago']
  return fullCasters.includes(className)
}

/**
 * Check if a class is a half caster (gets up to 5th level spells)
 */
export function isHalfCaster(className: string): boolean {
  const halfCasters = ['Explorador', 'Paladín']
  return halfCasters.includes(className)
}

/**
 * Get spell slots by class and level based on D&D 5e rules
 * Returns undefined for non-spellcasters
 */
export function calculateSpellSlotsByLevel(
  className: string,
  level: number
): SpellSlots | undefined {
  if (!isSpellcaster(className)) {
    return undefined
  }

  const slots = createEmptySpellSlots()

  // Warlock uses Pact Magic (different system)
  if (className === 'Brujo') {
    return calculateWarlockSlots(level)
  }

  // Full Casters (Bardo, Clérigo, Druida, Hechicero, Mago)
  if (isFullCaster(className)) {
    return calculateFullCasterSlots(level)
  }

  // Half Casters (Explorador, Paladín)
  if (isHalfCaster(className)) {
    return calculateHalfCasterSlots(level)
  }

  return slots
}

/**
 * Calculate spell slots for full casters (PHB p.113-114)
 */
function calculateFullCasterSlots(level: number): SpellSlots {
  const slots = createEmptySpellSlots()
  const slotTable: Record<number, number[]> = {
    1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  }

  const slotCounts = slotTable[level]
  if (!slotCounts) return slots

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

  levels.forEach((slotLevel, index) => {
    const count = slotCounts[index]
    if (count !== undefined) {
      slots[slotLevel] = { current: count, maximum: count }
    }
  })

  return slots
}

/**
 * Calculate spell slots for half casters (PHB p.89, 97)
 * Half casters start getting spells at level 2
 */
function calculateHalfCasterSlots(level: number): SpellSlots {
  const slots = createEmptySpellSlots()

  if (level < 2) return slots

  const slotTable: Record<number, number[]> = {
    2: [2, 0, 0, 0, 0],
    3: [3, 0, 0, 0, 0],
    4: [3, 0, 0, 0, 0],
    5: [4, 2, 0, 0, 0],
    6: [4, 2, 0, 0, 0],
    7: [4, 3, 0, 0, 0],
    8: [4, 3, 0, 0, 0],
    9: [4, 3, 2, 0, 0],
    10: [4, 3, 2, 0, 0],
    11: [4, 3, 3, 0, 0],
    12: [4, 3, 3, 0, 0],
    13: [4, 3, 3, 1, 0],
    14: [4, 3, 3, 1, 0],
    15: [4, 3, 3, 2, 0],
    16: [4, 3, 3, 2, 0],
    17: [4, 3, 3, 3, 1],
    18: [4, 3, 3, 3, 1],
    19: [4, 3, 3, 3, 2],
    20: [4, 3, 3, 3, 2],
  }

  const slotCounts = slotTable[level]
  if (!slotCounts) return slots

  const levels: Array<keyof SpellSlots> = [
    'level1',
    'level2',
    'level3',
    'level4',
    'level5',
  ]

  levels.forEach((slotLevel, index) => {
    const count = slotCounts[index]
    if (count !== undefined) {
      slots[slotLevel] = { current: count, maximum: count }
    }
  })

  return slots
}

/**
 * Calculate Warlock Pact Magic slots (PHB p.107)
 * Warlocks have fewer slots but they're all the same level and recharge on short rest
 */
function calculateWarlockSlots(level: number): SpellSlots {
  const slots = createEmptySpellSlots()

  // Determine slot level and count
  let slotLevel: keyof SpellSlots = 'level1'
  let slotCount = 1

  if (level >= 17) {
    slotLevel = 'level5'
    slotCount = 4
  } else if (level >= 11) {
    slotLevel = 'level5'
    slotCount = 3
  } else if (level >= 9) {
    slotLevel = 'level5'
    slotCount = 2
  } else if (level >= 7) {
    slotLevel = 'level4'
    slotCount = 2
  } else if (level >= 5) {
    slotLevel = 'level3'
    slotCount = 2
  } else if (level >= 3) {
    slotLevel = 'level2'
    slotCount = 2
  } else if (level >= 2) {
    slotLevel = 'level1'
    slotCount = 2
  } else {
    slotLevel = 'level1'
    slotCount = 1
  }

  slots[slotLevel] = { current: slotCount, maximum: slotCount }

  return slots
}

/**
 * Get default class resources based on class and level
 */
export function getDefaultClassResources(
  className: string,
  level: number
): ClassResource[] {
  const resources: ClassResource[] = []

  switch (className) {
    case 'Bárbaro':
      // Rage uses
      const rageUses =
        level < 3
          ? 2
          : level < 6
            ? 3
            : level < 12
              ? 4
              : level < 17
                ? 5
                : level < 20
                  ? 6
                  : 999
      resources.push({
        id: crypto.randomUUID(),
        name: 'Furia',
        current: rageUses,
        maximum: rageUses,
        recoveryType: 'long',
        description: 'Usos de Furia por descanso largo',
      })
      break

    case 'Monje':
      // Ki points
      resources.push({
        id: crypto.randomUUID(),
        name: 'Puntos de Ki',
        current: level,
        maximum: level,
        recoveryType: 'short',
        description: 'Puntos de Ki (se recuperan en descanso corto)',
      })
      break

    case 'Hechicero':
      // Sorcery points
      resources.push({
        id: crypto.randomUUID(),
        name: 'Puntos de Hechicería',
        current: level,
        maximum: level,
        recoveryType: 'long',
        description: 'Puntos de Hechicería para Metamagia',
      })
      break

    case 'Clérigo':
      // Channel Divinity (starts at level 2)
      if (level >= 2) {
        const channelUses = level < 6 ? 1 : level < 18 ? 2 : 3
        resources.push({
          id: crypto.randomUUID(),
          name: 'Canalizar Divinidad',
          current: channelUses,
          maximum: channelUses,
          recoveryType: 'short',
          description: 'Usos de Canalizar Divinidad',
        })
      }
      break

    case 'Druida':
      // Wild Shape (starts at level 2)
      if (level >= 2) {
        resources.push({
          id: crypto.randomUUID(),
          name: 'Forma Salvaje',
          current: 2,
          maximum: 2,
          recoveryType: 'short',
          description: 'Usos de Forma Salvaje',
        })
      }
      break

    case 'Guerrero':
      // Action Surge (starts at level 2)
      if (level >= 2) {
        const actionSurges = level < 17 ? 1 : 2
        resources.push({
          id: crypto.randomUUID(),
          name: 'Acción Adicional',
          current: actionSurges,
          maximum: actionSurges,
          recoveryType: 'short',
          description: 'Usos de Acción Adicional',
        })
      }
      // Second Wind (starts at level 1)
      resources.push({
        id: crypto.randomUUID(),
        name: 'Segundo Aliento',
        current: 1,
        maximum: 1,
        recoveryType: 'short',
        description: 'Usos de Segundo Aliento',
      })
      break

    case 'Brujo':
      // Warlock slots recover on short rest (handled separately)
      // Invocations that recharge might be added here
      break
  }

  return resources
}

/**
 * Initialize hit dice pool for a character
 */
export function initializeHitDicePool(
  character: Character
): HitDicePool | undefined {
  if (!character.hitPoints.hitDice) {
    return undefined
  }

  // Extract dice type from the hitDice string (e.g., "5d8" -> "d8")
  const match = character.hitPoints.hitDice.match(/\d*d(\d+)/)
  const diceType = match
    ? `d${match[1]}`
    : getHitDiceTypeForClass(character.class)

  return {
    available: character.level,
    total: character.level,
    diceType,
  }
}

/**
 * Perform a short rest for a character
 */
export function performShortRest(character: Character): {
  character: Character
  hpRestored: number
  resourcesRestored: string[]
} {
  const resourcesRestored: string[] = []

  // Recover short rest resources
  const updatedResources = character.classResources?.map(resource => {
    if (
      resource.recoveryType === 'short' &&
      resource.current < resource.maximum
    ) {
      resourcesRestored.push(resource.name)
      return { ...resource, current: resource.maximum }
    }
    return resource
  })

  // Warlock spell slots recover on short rest
  let updatedSpellSlots = character.spellSlots
  if (character.class === 'Brujo' && character.spellSlots) {
    updatedSpellSlots = { ...character.spellSlots }
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
    levels.forEach(level => {
      if (updatedSpellSlots && updatedSpellSlots[level].maximum > 0) {
        updatedSpellSlots[level] = {
          ...updatedSpellSlots[level],
          current: updatedSpellSlots[level].maximum,
        }
        if (updatedSpellSlots[level].maximum > 0) {
          resourcesRestored.push('Espacios de Conjuro')
        }
      }
    })
  }

  return {
    character: {
      ...character,
      classResources: updatedResources,
      spellSlots: updatedSpellSlots,
      updatedAt: new Date(),
    },
    hpRestored: 0, // HP is restored by spending hit dice, not automatically
    resourcesRestored: Array.from(new Set(resourcesRestored)), // Remove duplicates
  }
}

/**
 * Perform a long rest for a character
 */
export function performLongRest(character: Character): {
  character: Character
  hpRestored: number
  hitDiceRestored: number
  resourcesRestored: string[]
} {
  const resourcesRestored: string[] = []

  // Restore HP to maximum
  const hpRestored = character.hitPoints.maximum - character.hitPoints.current

  // Restore hit dice (half of total, minimum 1)
  const hitDiceToRestore = calculateHitDiceRecovery(character.level)
  const currentAvailable = character.hitDicePool?.available || 0
  const hitDiceTotal = character.hitDicePool?.total || character.level
  const newHitDiceAvailable = Math.min(
    currentAvailable + hitDiceToRestore,
    hitDiceTotal
  )
  const hitDiceRestored = newHitDiceAvailable - currentAvailable

  // Restore all spell slots (except Warlock, who already recovered on short rest)
  let updatedSpellSlots = character.spellSlots
  if (character.spellSlots && character.class !== 'Brujo') {
    updatedSpellSlots = { ...character.spellSlots }
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
    let spellSlotsRestored = false
    levels.forEach(level => {
      if (updatedSpellSlots && updatedSpellSlots[level].maximum > 0) {
        if (
          updatedSpellSlots[level].current < updatedSpellSlots[level].maximum
        ) {
          spellSlotsRestored = true
        }
        updatedSpellSlots[level] = {
          ...updatedSpellSlots[level],
          current: updatedSpellSlots[level].maximum,
        }
      }
    })
    if (spellSlotsRestored) {
      resourcesRestored.push('Espacios de Conjuro')
    }
  }

  // Restore class resources that recharge on long rest (or short rest)
  const updatedResources = character.classResources?.map(resource => {
    if (resource.current < resource.maximum) {
      resourcesRestored.push(resource.name)
      return { ...resource, current: resource.maximum }
    }
    return resource
  })

  return {
    character: {
      ...character,
      hitPoints: {
        ...character.hitPoints,
        current: character.hitPoints.maximum,
      },
      hitDicePool: character.hitDicePool
        ? {
            ...character.hitDicePool,
            available: newHitDiceAvailable,
          }
        : undefined,
      spellSlots: updatedSpellSlots,
      classResources: updatedResources,
      updatedAt: new Date(),
    },
    hpRestored,
    hitDiceRestored,
    resourcesRestored: Array.from(new Set(resourcesRestored)),
  }
}
