'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Music,
  Volume2,
  Dice6,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  type Spell,
  type PerformanceQuality,
  PERFORMANCE_QUALITIES,
  INSTRUMENT_CATEGORIES,
  MUSIC_GENRES,
} from '@/types/spell'

interface MusicPerformanceDialogProps {
  spell: Spell
  isOpen: boolean
  onClose: () => void
  onPerformanceComplete?: (result: PerformanceResult) => void
}

interface PerformanceResult {
  spell: Spell
  performanceRoll: number
  quality: PerformanceQuality
  success: boolean
  effect: string
  criticalSuccess: boolean
  criticalFailure: boolean
}

export default function MusicPerformanceDialog({
  spell,
  isOpen,
  onClose,
  onPerformanceComplete,
}: MusicPerformanceDialogProps) {
  const [performanceRoll, setPerformanceRoll] = useState<number>(0)
  const [performanceBonus, setPerformanceBonus] = useState<number>(0)
  const [currentRound, setCurrentRound] = useState<number>(1)
  const [isPerforming, setIsPerforming] = useState<boolean>(false)
  const [performanceResult, setPerformanceResult] =
    useState<PerformanceResult | null>(null)
  const [notes, setNotes] = useState<string>('')

  if (!spell.isMusicBased || !spell.musicalComponents) {
    return null
  }

  const { musicalComponents } = spell
  const totalRoll = performanceRoll + performanceBonus
  const requiredDuration = musicalComponents.duration
  const difficulty = musicalComponents.difficulty

  const getPerformanceQuality = (roll: number): PerformanceQuality => {
    if (roll <= 5) return 'poor'
    if (roll <= 10) return 'adequate'
    if (roll <= 15) return 'good'
    if (roll <= 20) return 'excellent'
    return 'masterful'
  }

  const getQualityColor = (quality: PerformanceQuality) => {
    switch (quality) {
      case 'poor':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
      case 'adequate':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
      case 'good':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
      case 'excellent':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
      case 'masterful':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
    }
  }

  const getSpellEffect = (quality: PerformanceQuality): string => {
    if (spell.performanceEffects?.[quality]) {
      return spell.performanceEffects[quality]
    }

    // Default effects based on quality
    const defaultEffects = {
      poor: 'El hechizo falla o tiene efectos negativos. Posible daño al lanzador.',
      adequate:
        'El hechizo funciona con su efecto más básico, sin bonificaciones.',
      good: 'El hechizo funciona normalmente según su descripción.',
      excellent:
        'El hechizo tiene efectos mejorados: +50% duración o +25% daño/sanación.',
      masterful:
        'Efecto máximo: doble duración, +50% daño/sanación, y posibles efectos adicionales.',
    }

    return defaultEffects[quality]
  }

  const rollPerformance = () => {
    const roll = Math.floor(Math.random() * 20) + 1
    setPerformanceRoll(roll)

    const total = roll + performanceBonus
    const quality = getPerformanceQuality(total)
    const success = total >= difficulty
    const criticalSuccess = roll === 20
    const criticalFailure = roll === 1

    const result: PerformanceResult = {
      spell,
      performanceRoll: roll,
      quality,
      success,
      effect: getSpellEffect(quality),
      criticalSuccess,
      criticalFailure,
    }

    setPerformanceResult(result)

    if (onPerformanceComplete) {
      onPerformanceComplete(result)
    }
  }

  const nextRound = () => {
    if (currentRound < requiredDuration) {
      setCurrentRound(currentRound + 1)
      setPerformanceRoll(0)
      setPerformanceResult(null)
    } else {
      // Performance complete
      setIsPerforming(false)
    }
  }

  const startPerformance = () => {
    setIsPerforming(true)
    setCurrentRound(1)
    setPerformanceRoll(0)
    setPerformanceResult(null)
  }

  const resetPerformance = () => {
    setIsPerforming(false)
    setCurrentRound(1)
    setPerformanceRoll(0)
    setPerformanceResult(null)
    setNotes('')
  }

  const instrumentInfo = INSTRUMENT_CATEGORIES.find(
    cat => cat.id === musicalComponents.instrument
  )
  const genreInfo = MUSIC_GENRES.find(
    genre => genre.id === musicalComponents.genre
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span>Interpretación Musical: {spell.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Spell Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>Información del Hechizo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Instrumento:</span>{' '}
                  {instrumentInfo?.name} ({instrumentInfo?.description})
                </div>
                <div>
                  <span className="font-medium">Género:</span> {genreInfo?.name}{' '}
                  ({genreInfo?.description})
                </div>
                <div>
                  <span className="font-medium">Dificultad:</span> DC{' '}
                  {difficulty}
                </div>
                <div>
                  <span className="font-medium">Duración requerida:</span>{' '}
                  {requiredDuration} ronda{requiredDuration > 1 ? 's' : ''}
                </div>
              </div>

              {musicalComponents.requiredProficiency && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requiere competencia con el instrumento
                </Badge>
              )}

              <div className="mt-3">
                <span className="font-medium text-sm">Asociación mágica:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {instrumentInfo?.magicalAssociation}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Progress */}
          {isPerforming && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Progreso de Interpretación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        Ronda {currentRound} de {requiredDuration}
                      </span>
                      <span>
                        {Math.round((currentRound / requiredDuration) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(currentRound / requiredDuration) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Dice6 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Control de Interpretación</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bonus">Bonificador de Interpretación</Label>
                  <Input
                    id="bonus"
                    type="number"
                    value={performanceBonus}
                    onChange={e =>
                      setPerformanceBonus(parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Modificador por habilidad + competencia
                  </p>
                </div>

                <div className="flex flex-col justify-end">
                  <Button
                    onClick={rollPerformance}
                    disabled={!isPerforming}
                    className="w-full"
                  >
                    <Dice6 className="h-4 w-4 mr-2" />
                    Tirar Interpretación
                  </Button>
                </div>
              </div>

              {performanceRoll > 0 && (
                <Card className="border-2">
                  <CardContent className="pt-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold">
                        {performanceRoll} + {performanceBonus} = {totalRoll}
                      </div>

                      {performanceResult && (
                        <>
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getQualityColor(performanceResult.quality)}`}
                          >
                            {performanceResult.success ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {
                              PERFORMANCE_QUALITIES.find(
                                q => q.id === performanceResult.quality
                              )?.name
                            }
                            {performanceResult.criticalSuccess &&
                              ' (¡Crítico!)'}
                            {performanceResult.criticalFailure && ' (¡Pifia!)'}
                          </div>

                          <Separator />

                          <div className="text-left">
                            <h4 className="font-medium mb-2">
                              Efecto del hechizo:
                            </h4>
                            <p className="text-sm">
                              {performanceResult.effect}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex space-x-2">
                {!isPerforming ? (
                  <Button onClick={startPerformance} className="flex-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Comenzar Interpretación
                  </Button>
                ) : (
                  <>
                    {currentRound < requiredDuration && performanceResult && (
                      <Button onClick={nextRound} className="flex-1">
                        Siguiente Ronda ({currentRound + 1}/{requiredDuration})
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetPerformance}>
                      Reiniciar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Quality Reference */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Referencia de Calidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {PERFORMANCE_QUALITIES.map(quality => (
                  <div
                    key={quality.id}
                    className="flex justify-between items-center p-2 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`border ${getQualityColor(quality.id)}`}
                      >
                        {quality.name}
                      </Badge>
                      <span className="text-sm">({quality.range})</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {quality.effect}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas de la interpretación</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe la interpretación, efectos narrativos, reacciones de los personajes..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
