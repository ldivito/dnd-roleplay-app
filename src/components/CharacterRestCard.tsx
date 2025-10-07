'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Heart, Sparkles, Zap, Dice6 } from 'lucide-react'
import type { Character } from '@/types/character'

interface CharacterRestCardProps {
  character: Character
  selected: boolean
  onSelectedChange: (selected: boolean) => void
  disabled?: boolean
}

export default function CharacterRestCard({
  character,
  selected,
  onSelectedChange,
  disabled = false,
}: CharacterRestCardProps) {
  const hpPercentage =
    (character.hitPoints.current / character.hitPoints.maximum) * 100
  const hitDiceAvailable = character.hitDicePool?.available ?? character.level
  const hitDiceTotal = character.hitDicePool?.total ?? character.level

  // Calculate total spell slots available/max
  const spellSlotInfo = character.spellSlots
    ? Object.entries(character.spellSlots).reduce(
        (acc, [level, slots]) => {
          if (slots.maximum > 0) {
            acc.current += slots.current
            acc.maximum += slots.maximum
          }
          return acc
        },
        { current: 0, maximum: 0 }
      )
    : null

  return (
    <Card
      className={`transition-all ${
        selected ? 'ring-2 ring-primary' : ''
      } ${disabled ? 'opacity-50' : 'hover:shadow-md cursor-pointer'}`}
      onClick={() => !disabled && onSelectedChange(!selected)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={selected}
              onCheckedChange={onSelectedChange}
              disabled={disabled}
              onClick={e => e.stopPropagation()}
            />
            <div className="flex-1">
              <CardTitle className="text-lg">{character.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {character.class} Nivel {character.level}
              </p>
            </div>
          </div>
          {character.isNPC && (
            <Badge variant="secondary" className="text-xs">
              NPC
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Hit Points */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-3 w-3" />
              Puntos de Golpe
            </span>
            <span className="font-medium">
              {character.hitPoints.current}/{character.hitPoints.maximum}
              {character.hitPoints.temporary > 0 && (
                <span className="text-blue-500">
                  {' '}
                  (+{character.hitPoints.temporary})
                </span>
              )}
            </span>
          </div>
          <Progress value={hpPercentage} className="h-2" />
        </div>

        {/* Hit Dice */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Dice6 className="h-3 w-3" />
            Dados de Golpe
          </span>
          <span className="font-medium">
            {hitDiceAvailable}/{hitDiceTotal}{' '}
            <span className="text-xs text-muted-foreground">
              ({character.hitDicePool?.diceType || character.hitPoints.hitDice})
            </span>
          </span>
        </div>

        {/* Spell Slots (if applicable) */}
        {spellSlotInfo && spellSlotInfo.maximum > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              Espacios de Conjuro
            </span>
            <span className="font-medium">
              {spellSlotInfo.current}/{spellSlotInfo.maximum}
            </span>
          </div>
        )}

        {/* Class Resources */}
        {character.classResources && character.classResources.length > 0 && (
          <div className="space-y-1 pt-1 border-t">
            {character.classResources.map(resource => (
              <div
                key={resource.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  {resource.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {resource.current}/{resource.maximum}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1 py-0 h-4"
                  >
                    {resource.recoveryType === 'short'
                      ? 'Desc. Corto'
                      : 'Desc. Largo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
