'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import AppLayout from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, Dice6 } from 'lucide-react'
import {
  CharacterSchema,
  DND_CLASSES,
  DND_RACES,
  DND_ALIGNMENTS,
  DND_BACKGROUNDS,
  type Character,
} from '@/types/character'

// Crear un tipo para el formulario que no incluya campos opcionales problemáticos
type CharacterFormData = Omit<Character, 'createdAt' | 'updatedAt'> & {
  createdAt?: Date
  updatedAt?: Date
}
import { useSessionStore } from '@/stores/sessionStore'
import { rollAbilityScore, getModifier } from '@/lib/dice'

export default function NewCharacterPage() {
  const router = useRouter()
  const { addCharacter } = useSessionStore()

  const form = useForm<CharacterFormData>({
    defaultValues: {
      id: uuidv4(),
      name: '',
      class: '',
      level: 1,
      race: '',
      subrace: '',
      background: '',
      alignment: '',
      experience: 0,
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      savingThrows: {
        strength: { proficient: false, value: 0 },
        dexterity: { proficient: false, value: 0 },
        constitution: { proficient: false, value: 0 },
        intelligence: { proficient: false, value: 0 },
        wisdom: { proficient: false, value: 0 },
        charisma: { proficient: false, value: 0 },
      },
      skills: {
        acrobatics: { proficient: false, expertise: false, value: 0 },
        animalHandling: { proficient: false, expertise: false, value: 0 },
        arcana: { proficient: false, expertise: false, value: 0 },
        athletics: { proficient: false, expertise: false, value: 0 },
        deception: { proficient: false, expertise: false, value: 0 },
        history: { proficient: false, expertise: false, value: 0 },
        insight: { proficient: false, expertise: false, value: 0 },
        intimidation: { proficient: false, expertise: false, value: 0 },
        investigation: { proficient: false, expertise: false, value: 0 },
        medicine: { proficient: false, expertise: false, value: 0 },
        nature: { proficient: false, expertise: false, value: 0 },
        perception: { proficient: false, expertise: false, value: 0 },
        performance: { proficient: false, expertise: false, value: 0 },
        persuasion: { proficient: false, expertise: false, value: 0 },
        religion: { proficient: false, expertise: false, value: 0 },
        sleightOfHand: { proficient: false, expertise: false, value: 0 },
        stealth: { proficient: false, expertise: false, value: 0 },
        survival: { proficient: false, expertise: false, value: 0 },
      },
      hitPoints: {
        current: 10,
        maximum: 10,
        temporary: 0,
        hitDice: '1d8',
      },
      armorClass: 10,
      initiative: 0,
      speed: 30,
      proficiencyBonus: 2,
      isNPC: false,
    },
  })

  const rollAllAbilities = () => {
    const newScores = {
      strength: rollAbilityScore(),
      dexterity: rollAbilityScore(),
      constitution: rollAbilityScore(),
      intelligence: rollAbilityScore(),
      wisdom: rollAbilityScore(),
      charisma: rollAbilityScore(),
    }
    form.setValue('abilityScores', newScores)
  }

  const onSubmit = (data: CharacterFormData) => {
    const characterData: Character = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    addCharacter(characterData)
    router.push('/characters')
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Crear Personaje
            </h1>
            <p className="text-muted-foreground">
              Completa los detalles del personaje basados en la hoja de D&D 5e.
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Personaje *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Gandalf el Gris"
                    {...form.register('name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="playerName">Nombre del Jugador</Label>
                  <Input
                    id="playerName"
                    placeholder="Nombre del jugador"
                    {...form.register('playerName')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Clase *</Label>
                  <Select
                    onValueChange={value => form.setValue('class', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una clase" />
                    </SelectTrigger>
                    <SelectContent>
                      {DND_CLASSES.map(cls => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Nivel</Label>
                  <Input
                    id="level"
                    type="number"
                    min="1"
                    max="20"
                    {...form.register('level', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="race">Raza *</Label>
                  <Select onValueChange={value => form.setValue('race', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una raza" />
                    </SelectTrigger>
                    <SelectContent>
                      {DND_RACES.map(race => (
                        <SelectItem key={race} value={race}>
                          {race}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background">Trasfondo</Label>
                  <Select
                    onValueChange={value => form.setValue('background', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un trasfondo" />
                    </SelectTrigger>
                    <SelectContent>
                      {DND_BACKGROUNDS.map(bg => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alignment">Alineamiento</Label>
                  <Select
                    onValueChange={value => form.setValue('alignment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona alineamiento" />
                    </SelectTrigger>
                    <SelectContent>
                      {DND_ALIGNMENTS.map(alignment => (
                        <SelectItem key={alignment} value={alignment}>
                          {alignment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Puntos de Experiencia</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    {...form.register('experience', { valueAsNumber: true })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNPC"
                    checked={form.watch('isNPC')}
                    onCheckedChange={checked =>
                      form.setValue('isNPC', !!checked)
                    }
                  />
                  <Label htmlFor="isNPC">Es un NPC</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Puntuaciones de Habilidad */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Puntuaciones de Habilidad</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={rollAllAbilities}
              >
                <Dice6 className="h-4 w-4 mr-2" />
                Tirar Todo (4d6 eliminar menor)
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(form.watch('abilityScores') || {}).map(
                  ([ability, score]) => (
                    <div key={ability} className="space-y-2 text-center">
                      <Label className="text-sm font-medium capitalize">
                        {ability === 'strength' && 'Fuerza'}
                        {ability === 'dexterity' && 'Destreza'}
                        {ability === 'constitution' && 'Constitución'}
                        {ability === 'intelligence' && 'Inteligencia'}
                        {ability === 'wisdom' && 'Sabiduría'}
                        {ability === 'charisma' && 'Carisma'}
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        className="text-center"
                        {...form.register(`abilityScores.${ability}` as any, {
                          valueAsNumber: true,
                        })}
                      />
                      <div className="text-xs text-muted-foreground">
                        Mod:{' '}
                        {score
                          ? (getModifier(score) >= 0 ? '+' : '') +
                            getModifier(score)
                          : '+0'}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Combate */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Combate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hitPointsMax">HP Máximos</Label>
                  <Input
                    id="hitPointsMax"
                    type="number"
                    min="1"
                    {...form.register('hitPoints.maximum', {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hitPointsCurrent">HP Actuales</Label>
                  <Input
                    id="hitPointsCurrent"
                    type="number"
                    min="0"
                    {...form.register('hitPoints.current', {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="armorClass">Clase de Armadura</Label>
                  <Input
                    id="armorClass"
                    type="number"
                    min="1"
                    {...form.register('armorClass', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="speed">Velocidad</Label>
                  <Input
                    id="speed"
                    type="number"
                    min="0"
                    {...form.register('speed', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initiative">Iniciativa</Label>
                  <Input
                    id="initiative"
                    type="number"
                    {...form.register('initiative', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proficiencyBonus">Bono de Competencia</Label>
                  <Input
                    id="proficiencyBonus"
                    type="number"
                    min="2"
                    {...form.register('proficiencyBonus', {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hitDice">Dados de Golpe</Label>
                  <Input
                    id="hitDice"
                    placeholder="Ej: 1d8"
                    {...form.register('hitPoints.hitDice')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalidad y Trasfondo */}
          <Card>
            <CardHeader>
              <CardTitle>Personalidad y Trasfondo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personalityTraits">
                    Rasgos de Personalidad
                  </Label>
                  <Textarea
                    id="personalityTraits"
                    placeholder="Describe los rasgos de personalidad del personaje"
                    {...form.register('personalityTraits')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ideals">Ideales</Label>
                  <Textarea
                    id="ideals"
                    placeholder="¿Qué principios motivan al personaje?"
                    {...form.register('ideals')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonds">Vínculos</Label>
                  <Textarea
                    id="bonds"
                    placeholder="¿Qué conecta al personaje con el mundo?"
                    {...form.register('bonds')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flaws">Defectos</Label>
                  <Textarea
                    id="flaws"
                    placeholder="¿Cuáles son las debilidades del personaje?"
                    {...form.register('flaws')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backstory">Historia Personal</Label>
                <Textarea
                  id="backstory"
                  placeholder="Cuenta la historia del personaje..."
                  className="min-h-[100px]"
                  {...form.register('backstory')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipamiento y Habilidades */}
          <Card>
            <CardHeader>
              <CardTitle>Equipamiento y Habilidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipamiento</Label>
                <Textarea
                  id="equipment"
                  placeholder="Lista el equipamiento del personaje..."
                  {...form.register('equipment')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuresAndTraits">
                  Características y Rasgos
                </Label>
                <Textarea
                  id="featuresAndTraits"
                  placeholder="Habilidades de clase, características raciales, etc."
                  {...form.register('featuresAndTraits')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proficienciesAndLanguages">
                  Competencias e Idiomas
                </Label>
                <Textarea
                  id="proficienciesAndLanguages"
                  placeholder="Armas, armaduras, herramientas, idiomas..."
                  {...form.register('proficienciesAndLanguages')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notas del DM */}
          <Card>
            <CardHeader>
              <CardTitle>Notas del DM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  placeholder="Notas privadas del DM sobre este personaje..."
                  {...form.register('notes')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Crear Personaje
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
