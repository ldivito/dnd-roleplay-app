'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sword, Settings, BarChart3, MessageSquare, Target } from 'lucide-react'
import CombatSetup from '@/components/CombatSetup'
import CombatGrid from '@/components/CombatGrid'
import CombatTurnManager from '@/components/CombatTurnManager'
import CombatLog from '@/components/CombatLog'
import CombatRecap from '@/components/CombatRecap'
import { useCombatStore } from '@/stores/combatStore'
import type { Character } from '@/types/character'
import type { NPC } from '@/types/npc'
import type { CombatMap } from '@/types/combat'

// Mock data - in a real app, this would come from your data stores
const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Aragorn',
    class: 'Explorador',
    level: 5,
    race: 'Humano',
    alignment: 'Legal Bueno',
    experience: 6500,
    abilityScores: {
      strength: 16,
      dexterity: 14,
      constitution: 15,
      intelligence: 12,
      wisdom: 15,
      charisma: 13,
    },
    savingThrows: {
      strength: { proficient: true, value: 6 },
      dexterity: { proficient: true, value: 5 },
      constitution: { proficient: false, value: 2 },
      intelligence: { proficient: false, value: 1 },
      wisdom: { proficient: false, value: 2 },
      charisma: { proficient: false, value: 1 },
    },
    skills: {
      acrobatics: { proficient: false, expertise: false, value: 2 },
      animalHandling: { proficient: true, expertise: false, value: 5 },
      arcana: { proficient: false, expertise: false, value: 1 },
      athletics: { proficient: true, expertise: false, value: 6 },
      deception: { proficient: false, expertise: false, value: 1 },
      history: { proficient: false, expertise: false, value: 1 },
      insight: { proficient: false, expertise: false, value: 2 },
      intimidation: { proficient: false, expertise: false, value: 1 },
      investigation: { proficient: true, expertise: false, value: 4 },
      medicine: { proficient: false, expertise: false, value: 2 },
      nature: { proficient: true, expertise: false, value: 4 },
      perception: { proficient: true, expertise: false, value: 5 },
      performance: { proficient: false, expertise: false, value: 1 },
      persuasion: { proficient: false, expertise: false, value: 1 },
      religion: { proficient: false, expertise: false, value: 1 },
      sleightOfHand: { proficient: false, expertise: false, value: 2 },
      stealth: { proficient: true, expertise: false, value: 5 },
      survival: { proficient: true, expertise: false, value: 5 },
    },
    hitPoints: {
      current: 45,
      maximum: 45,
      temporary: 0,
      hitDice: '5d10',
    },
    armorClass: 16,
    initiative: 2,
    speed: 30,
    proficiencyBonus: 3,
    isNPC: false,
    playerName: 'Juan',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockNPCs: NPC[] = [
  {
    id: '1',
    name: 'Orco Guerrero',
    race: 'Orco',
    class: 'Guerrero',
    level: 3,
    background: '',
    alignment: 'Caótico Malvado',
    experience: 900,
    abilityScores: {
      strength: 16,
      dexterity: 12,
      constitution: 16,
      intelligence: 7,
      wisdom: 11,
      charisma: 10,
    },
    savingThrows: {
      strength: { proficient: true, value: 6 },
      dexterity: { proficient: false, value: 1 },
      constitution: { proficient: true, value: 6 },
      intelligence: { proficient: false, value: -2 },
      wisdom: { proficient: false, value: 0 },
      charisma: { proficient: false, value: 0 },
    },
    skills: {
      acrobatics: { proficient: false, expertise: false, value: 1 },
      animalHandling: { proficient: false, expertise: false, value: 0 },
      arcana: { proficient: false, expertise: false, value: -2 },
      athletics: { proficient: true, expertise: false, value: 6 },
      deception: { proficient: false, expertise: false, value: 0 },
      history: { proficient: false, expertise: false, value: -2 },
      insight: { proficient: false, expertise: false, value: 0 },
      intimidation: { proficient: true, expertise: false, value: 3 },
      investigation: { proficient: false, expertise: false, value: -2 },
      medicine: { proficient: false, expertise: false, value: 0 },
      nature: { proficient: false, expertise: false, value: -2 },
      perception: { proficient: false, expertise: false, value: 0 },
      performance: { proficient: false, expertise: false, value: 0 },
      persuasion: { proficient: false, expertise: false, value: 0 },
      religion: { proficient: false, expertise: false, value: -2 },
      sleightOfHand: { proficient: false, expertise: false, value: 1 },
      stealth: { proficient: false, expertise: false, value: 1 },
      survival: { proficient: false, expertise: false, value: 0 },
    },
    hitPoints: {
      current: 26,
      maximum: 26,
      temporary: 0,
      hitDice: '3d8',
    },
    armorClass: 13,
    initiative: 1,
    speed: 30,
    proficiencyBonus: 2,
    npcType: 'enemy',
    importance: 'minor',
    relationships: [],
    locationRelations: [],
    loreConnections: [],
    personality: {
      goals: [],
      secrets: [],
      fears: [],
    },
    isAlive: true,
    tags: ['monstruo', 'combate'],
    notes: '',
    plotHooks: [],
    equipment: 'Hacha de Batalla, Armadura de Cuero',
    attacksAndSpellcasting:
      'Hacha de Batalla: +5 para golpear, 1d12+3 daño cortante',
    isNPC: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockMaps: CombatMap[] = [
  {
    id: '1',
    name: 'Claro del Bosque',
    description: 'Un pequeño claro rodeado de árboles densos',
    gridSize: { width: 15, height: 15 },
    cellSize: 30,
    obstacles: [
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 10, y: 8 },
      { x: 11, y: 8 },
      { x: 12, y: 8 },
    ],
    difficultTerrain: [
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 6, y: 10 },
      { x: 7, y: 10 },
    ],
  },
  {
    id: '2',
    name: 'Habitación de Mazmorra',
    description: 'Una habitación rectangular de piedra',
    gridSize: { width: 12, height: 10 },
    cellSize: 30,
    obstacles: [
      { x: 2, y: 2 },
      { x: 8, y: 7 },
    ],
    difficultTerrain: [],
  },
]

export default function CombatPage() {
  const { currentCombat, startCombat } = useCombatStore()
  const [activeTab, setActiveTab] = useState('setup')

  // Auto-switch tabs based on combat status
  useEffect(() => {
    if (currentCombat) {
      switch (currentCombat.status) {
        case 'setup':
          setActiveTab('setup')
          break
        case 'active':
        case 'paused':
          setActiveTab('combat')
          break
        case 'ended':
          setActiveTab('recap')
          break
      }
    }
  }, [currentCombat])

  const handleStartCombat = () => {
    startCombat()
    setActiveTab('combat')
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Sistema de Combate
            </h1>
            <p className="text-muted-foreground">
              Gestiona encuentros de combate turn-based en una cuadrícula
              táctica.
            </p>
          </div>

          {currentCombat && (
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  currentCombat.status === 'setup'
                    ? 'secondary'
                    : currentCombat.status === 'active'
                      ? 'default'
                      : currentCombat.status === 'paused'
                        ? 'outline'
                        : 'destructive'
                }
              >
                {currentCombat.status === 'setup'
                  ? 'Configuración'
                  : currentCombat.status === 'active'
                    ? 'En Curso'
                    : currentCombat.status === 'paused'
                      ? 'Pausado'
                      : 'Terminado'}
              </Badge>
              {currentCombat.status === 'active' && (
                <Badge variant="outline">
                  Ronda {currentCombat.currentRound}
                </Badge>
              )}
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
            <TabsTrigger
              value="combat"
              className="flex items-center gap-2"
              disabled={!currentCombat || currentCombat.status === 'setup'}
            >
              <Target className="h-4 w-4" />
              Combate
            </TabsTrigger>
            <TabsTrigger
              value="log"
              className="flex items-center gap-2"
              disabled={!currentCombat}
            >
              <MessageSquare className="h-4 w-4" />
              Registro
            </TabsTrigger>
            <TabsTrigger
              value="recap"
              className="flex items-center gap-2"
              disabled={!currentCombat || currentCombat.status !== 'ended'}
            >
              <BarChart3 className="h-4 w-4" />
              Resumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-6">
            <CombatSetup
              characters={mockCharacters}
              npcs={mockNPCs}
              maps={mockMaps}
              onStartCombat={handleStartCombat}
            />
          </TabsContent>

          <TabsContent value="combat" className="mt-6">
            {currentCombat && currentCombat.map ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <CombatGrid combat={currentCombat} map={currentCombat.map} />
                </div>
                <div>
                  <CombatTurnManager combat={currentCombat} />
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Sword className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No hay combate activo
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Configura un combate en la pestaña de Configuración para
                      comenzar.
                    </p>
                    <Button onClick={() => setActiveTab('setup')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Ir a Configuración
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="log" className="mt-6">
            {currentCombat ? (
              <div className="h-[600px]">
                <CombatLog combatId={currentCombat.id} />
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                    <p>No hay combate para mostrar el registro</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recap" className="mt-6">
            {currentCombat && currentCombat.status === 'ended' ? (
              <CombatRecap combatId={currentCombat.id} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                    <p>
                      El resumen estará disponible cuando termine el combate
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
