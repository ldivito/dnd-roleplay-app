'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dice6, Heart, TrendingUp, X } from 'lucide-react'
import type { Character } from '@/types/character'
import { useSessionStore } from '@/stores/sessionStore'
import { getConstitutionModifier } from '@/lib/restHelpers'

interface HitDiceRollerProps {
  character: Character
  onClose?: () => void
}

export default function HitDiceRoller({
  character,
  onClose,
}: HitDiceRollerProps) {
  const { spendHitDice } = useSessionStore()
  const [diceCount, setDiceCount] = useState(1)
  const [lastRoll, setLastRoll] = useState<{
    diceResults: number[]
    conModifier: number
    totalHealed: number
  } | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const hitDiceAvailable = character.hitDicePool?.available ?? character.level
  const hitDiceType =
    character.hitDicePool?.diceType || character.hitPoints.hitDice
  const conModifier = getConstitutionModifier(
    character.abilityScores.constitution
  )
  const currentHP = character.hitPoints.current
  const maxHP = character.hitPoints.maximum
  const hpNeeded = maxHP - currentHP

  const handleRoll = () => {
    if (hitDiceAvailable <= 0 || currentHP >= maxHP) {
      return
    }

    setIsRolling(true)

    // Simulate dice rolling animation
    setTimeout(() => {
      const hpRecovered = spendHitDice(character.id, diceCount)

      // Calculate individual dice results (for display purposes)
      // This is a reconstruction since we already rolled in the store
      const diceResults: number[] = []
      let remaining = hpRecovered
      for (let i = 0; i < diceCount; i++) {
        if (i === diceCount - 1) {
          // Last die gets the remaining value
          diceResults.push(remaining)
        } else {
          // Estimate individual die results
          const avgPerDie = Math.floor(remaining / (diceCount - i))
          diceResults.push(avgPerDie)
          remaining -= avgPerDie
        }
      }

      setLastRoll({
        diceResults,
        conModifier: conModifier * diceCount,
        totalHealed: hpRecovered,
      })
      setIsRolling(false)

      // Reset dice count if no more available
      const newAvailable =
        (character.hitDicePool?.available ?? character.level) - diceCount
      if (newAvailable < diceCount) {
        setDiceCount(Math.max(1, newAvailable))
      }
    }, 600)
  }

  const canRoll = hitDiceAvailable > 0 && currentHP < maxHP && !isRolling

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Dice6 className="h-5 w-5" />
            Gastar Dados de Golpe - {character.name}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">HP Actual</p>
            <p className="text-lg font-bold">
              {currentHP}/{maxHP}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dados Disponibles</p>
            <p className="text-lg font-bold">
              {hitDiceAvailable} {hitDiceType}
            </p>
          </div>
        </div>

        {/* Dice Selection */}
        {canRoll ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Número de Dados</Label>
              <Select
                value={diceCount.toString()}
                onValueChange={v => setDiceCount(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: Math.min(hitDiceAvailable, 5) },
                    (_, i) => i + 1
                  ).map(count => (
                    <SelectItem key={count} value={count.toString()}>
                      {count} {count === 1 ? 'dado' : 'dados'} ({count}
                      {hitDiceType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>
                Modificador de CON: {conModifier >= 0 ? '+' : ''}
                {conModifier} por dado
              </span>
            </div>

            <Button
              onClick={handleRoll}
              disabled={!canRoll}
              className="w-full"
              size="lg"
            >
              {isRolling ? (
                <>
                  <Dice6 className="h-4 w-4 mr-2 animate-spin" />
                  Tirando dados...
                </>
              ) : (
                <>
                  <Dice6 className="h-4 w-4 mr-2" />
                  Tirar {diceCount} {diceCount === 1 ? 'Dado' : 'Dados'}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            {currentHP >= maxHP ? (
              <div className="text-muted-foreground">
                <Heart className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>HP al máximo - no necesitas usar dados de golpe</p>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <Dice6 className="h-8 w-8 mx-auto mb-2" />
                <p>No tienes dados de golpe disponibles</p>
                <p className="text-xs mt-1">
                  Recuperarás dados en un descanso largo
                </p>
              </div>
            )}
          </div>
        )}

        {/* Roll Result */}
        {lastRoll && (
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-green-700 dark:text-green-300">
                Resultado de la Tirada
              </span>
              <Badge
                variant="outline"
                className="bg-green-100 dark:bg-green-900"
              >
                +{lastRoll.totalHealed} HP
              </Badge>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Dados:</span>
                <span className="font-mono">
                  {lastRoll.diceResults.map((roll, i) => (
                    <span key={i}>
                      {i > 0 && ' + '}
                      {roll}
                    </span>
                  ))}
                </span>
              </div>
              {lastRoll.conModifier !== 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Modificador CON:
                  </span>
                  <span className="font-mono">
                    {lastRoll.conModifier >= 0 ? '+' : ''}
                    {lastRoll.conModifier}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 pt-1 border-t border-green-200 dark:border-green-800">
                <span className="text-muted-foreground">HP Recuperados:</span>
                <span className="font-bold">{lastRoll.totalHealed}</span>
              </div>
            </div>
          </div>
        )}

        {/* Healing Needed Info */}
        {hpNeeded > 0 && canRoll && (
          <p className="text-xs text-center text-muted-foreground">
            Necesitas recuperar {hpNeeded} HP para llegar al máximo
          </p>
        )}
      </CardContent>
    </Card>
  )
}
