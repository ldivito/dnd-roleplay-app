'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, Sword, Shield } from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'

export default function CharactersPage() {
  const { characters } = useSessionStore()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personajes</h1>
          <p className="text-muted-foreground">
            Gestiona los personajes de los jugadores y NPCs en tu campaña.
          </p>
        </div>
        <Button asChild>
          <Link href="/characters/new">
            <Plus className="h-4 w-4 mr-2" />
            Crear Personaje
          </Link>
        </Button>
      </div>

      {characters.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              No hay personajes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Aún no has creado ningún personaje para tu campaña.
            </p>
            <Button asChild>
              <Link href="/characters/new">
                <Plus className="h-4 w-4 mr-2" />
                Crear tu Primer Personaje
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map(character => (
            <Card
              key={character.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{character.name}</span>
                  {character.isNPC ? (
                    <Shield className="h-4 w-4 text-purple-500" />
                  ) : (
                    <Sword className="h-4 w-4 text-blue-500" />
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {character.race} {character.class} - Nivel {character.level}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>HP:</span>
                    <span>
                      {character.hitPoints.current}/
                      {character.hitPoints.maximum}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CA:</span>
                    <span>{character.armorClass}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Velocidad:</span>
                    <span>{character.speed} pies</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/characters/${character.id}`}>Ver Detalles</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
