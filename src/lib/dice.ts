import { Dice } from 'dice-typescript'
import { v4 as uuidv4 } from 'uuid'
import type { DiceRoll, DiceType } from '@/types/dice'

const dice = new Dice()

export function rollDice(
  type: DiceType,
  count: number = 1,
  modifier: number = 0,
  description?: string
): DiceRoll {
  const diceString = `${count}${type}${modifier >= 0 ? '+' : ''}${modifier || ''}`
  const result = dice.roll(diceString)

  // Parse individual rolls from dice result
  const individual: number[] = []
  for (let i = 0; i < count; i++) {
    individual.push(dice.roll(`1${type}`).total)
  }

  return {
    id: uuidv4(),
    type,
    count,
    modifier,
    result: result.total - modifier,
    individual,
    total: result.total,
    timestamp: new Date(),
    description,
  }
}

export function rollInitiative(): number {
  return dice.roll('1d20').total
}

export function rollAbilityScore(): number {
  // Roll 4d6, drop lowest
  const rolls = [
    dice.roll('1d6').total,
    dice.roll('1d6').total,
    dice.roll('1d6').total,
    dice.roll('1d6').total,
  ].sort((a, b) => b - a)

  return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
}

export function getModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2)
}
