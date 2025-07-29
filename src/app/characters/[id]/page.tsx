'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Edit, Trash2, Shield, Sword } from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'
import { getModifier } from '@/lib/dice'

export default function CharacterDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { characters, removeCharacter } = useSessionStore()

  const id = params.id as string
  const character = characters.find(c => c.id === id)

  if (!character) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-bold mb-4">Personaje no encontrado</h1>
          <Button onClick={() => router.push('/characters')}>
            Volver a Personajes
          </Button>
        </div>
      </AppLayout>
    )
  }

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar este personaje?')) {
      removeCharacter(character.id)
      router.push('/characters')
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {character.name}
                </h1>
                {character.isNPC ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Shield className="h-3 w-3" />
                    NPC
                  </Badge>
                ) : (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Sword className="h-3 w-3" />
                    Jugador
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {character.race} {character.class} de Nivel {character.level}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clase:</span>
                <span className="font-medium">{character.class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nivel:</span>
                <span className="font-medium">{character.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Raza:</span>
                <span className="font-medium">{character.race}</span>
              </div>
              {character.background && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trasfondo:</span>
                  <span className="font-medium">{character.background}</span>
                </div>
              )}
              {character.alignment && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alineamiento:</span>
                  <span className="font-medium">{character.alignment}</span>
                </div>
              )}
              {character.playerName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jugador:</span>
                  <span className="font-medium">{character.playerName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experiencia:</span>
                <span className="font-medium">{character.experience} XP</span>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Combate */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Combate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Puntos de Golpe:</span>
                <span className="font-medium">
                  {character.hitPoints.current}/{character.hitPoints.maximum}
                  {character.hitPoints.temporary > 0 &&
                    ` (+${character.hitPoints.temporary})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Clase de Armadura:
                </span>
                <span className="font-medium">{character.armorClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Iniciativa:</span>
                <span className="font-medium">
                  {character.initiative >= 0 ? '+' : ''}
                  {character.initiative}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Velocidad:</span>
                <span className="font-medium">{character.speed} pies</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Bono de Competencia:
                </span>
                <span className="font-medium">
                  +{character.proficiencyBonus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dados de Golpe:</span>
                <span className="font-medium">
                  {character.hitPoints.hitDice}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Puntuaciones de Habilidad */}
          <Card>
            <CardHeader>
              <CardTitle>Puntuaciones de Habilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(character.abilityScores).map(
                  ([ability, score]) => (
                    <div
                      key={ability}
                      className="text-center p-3 border rounded-lg"
                    >
                      <div className="text-xs text-muted-foreground uppercase mb-1">
                        {ability === 'strength' && 'FUE'}
                        {ability === 'dexterity' && 'DES'}
                        {ability === 'constitution' && 'CON'}
                        {ability === 'intelligence' && 'INT'}
                        {ability === 'wisdom' && 'SAB'}
                        {ability === 'charisma' && 'CAR'}
                      </div>
                      <div className="text-lg font-bold">{score}</div>
                      <div className="text-sm text-muted-foreground">
                        {getModifier(score) >= 0 ? '+' : ''}
                        {getModifier(score)}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personalidad y Trasfondo */}
        {(character.personalityTraits ||
          character.ideals ||
          character.bonds ||
          character.flaws) && (
          <Card>
            <CardHeader>
              <CardTitle>Personalidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.personalityTraits && (
                <div>
                  <h4 className="font-semibold mb-2">Rasgos de Personalidad</h4>
                  <p className="text-muted-foreground">
                    {character.personalityTraits}
                  </p>
                </div>
              )}
              {character.ideals && (
                <div>
                  <h4 className="font-semibold mb-2">Ideales</h4>
                  <p className="text-muted-foreground">{character.ideals}</p>
                </div>
              )}
              {character.bonds && (
                <div>
                  <h4 className="font-semibold mb-2">Vínculos</h4>
                  <p className="text-muted-foreground">{character.bonds}</p>
                </div>
              )}
              {character.flaws && (
                <div>
                  <h4 className="font-semibold mb-2">Defectos</h4>
                  <p className="text-muted-foreground">{character.flaws}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Historia Personal */}
        {character.backstory && (
          <Card>
            <CardHeader>
              <CardTitle>Historia Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {character.backstory}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Equipamiento y Habilidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {character.equipment && (
            <Card>
              <CardHeader>
                <CardTitle>Equipamiento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {character.equipment}
                </p>
              </CardContent>
            </Card>
          )}

          {character.featuresAndTraits && (
            <Card>
              <CardHeader>
                <CardTitle>Características y Rasgos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {character.featuresAndTraits}
                </p>
              </CardContent>
            </Card>
          )}

          {character.proficienciesAndLanguages && (
            <Card>
              <CardHeader>
                <CardTitle>Competencias e Idiomas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {character.proficienciesAndLanguages}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Notas del DM */}
        {character.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notas del DM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {character.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
