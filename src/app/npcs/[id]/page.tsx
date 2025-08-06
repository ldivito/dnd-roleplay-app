'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSessionStore } from '@/stores/sessionStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  User,
  Users,
  MapPin,
  Scroll,
  Heart,
  Shield,
  Sword,
  Brain,
  Eye,
  Smile,
  Target,
  Link,
  Anchor,
  AlertTriangle,
  BookOpen,
  Edit,
  Dice6,
  Tags,
  Star,
} from 'lucide-react'
import type { NPC, AlignmentChoice } from '@/types/npc'
import {
  RELATIONSHIP_TYPES,
  LOCATION_RELATION_TYPES,
  LORE_CONNECTION_TYPES,
} from '@/types/npc'

const STAT_ICONS = {
  strength: Sword,
  dexterity: Target,
  constitution: Shield,
  intelligence: Brain,
  wisdom: Eye,
  charisma: Smile,
} as const

const getAlignmentDisplay = (alignment?: AlignmentChoice) => {
  if (!alignment) return 'No definido'

  const lawAxis =
    alignment.law === 'lawful'
      ? 'Legal'
      : alignment.law === 'chaotic'
        ? 'Caótico'
        : 'Neutral'
  const goodAxis =
    alignment.good === 'good'
      ? 'Bueno'
      : alignment.good === 'evil'
        ? 'Malvado'
        : 'Neutral'

  if (alignment.law === 'neutral' && alignment.good === 'neutral') {
    return 'Neutral Verdadero'
  }

  return `${lawAxis} ${goodAxis}`
}

const StatBlock = ({ npc }: { npc: NPC }) => {
  const rollStat = (statName: string, value: number) => {
    const modifier = Math.floor((value - 10) / 2)
    const roll = Math.floor(Math.random() * 20) + 1 + modifier
    console.log(
      `${statName}: d20(${Math.floor(Math.random() * 20) + 1}) + ${modifier} = ${roll}`
    )
  }

  const stats = npc.abilityScores || {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(stats).map(([stat, value]) => {
        const Icon = STAT_ICONS[stat as keyof typeof STAT_ICONS]
        const modifier = Math.floor((value - 10) / 2)
        const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`

        return (
          <Card key={stat} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium capitalize">{stat}</p>
                  <p className="text-xs text-muted-foreground">{modifierStr}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => rollStat(stat, value)}
                  className="h-6 w-6 p-0"
                >
                  <Dice6 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

const PersonalitySection = ({ npc }: { npc: NPC }) => {
  const traits = npc.personality?.personality?.traits || []
  const ideals = npc.personality?.personality?.ideals || []
  const bonds = npc.personality?.personality?.bonds || []
  const flaws = npc.personality?.personality?.flaws || []
  const mannerisms = npc.personality?.personality?.mannerisms || []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="h-4 w-4" />
              Rasgos de Personalidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {traits.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {traits.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No definidos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Ideales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ideals.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {ideals.map((ideal, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {ideal}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No definidos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Anchor className="h-4 w-4" />
              Vínculos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bonds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {bonds.map((bond, index) => (
                  <Badge key={index} variant="default" className="text-xs">
                    {bond}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No definidos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Defectos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flaws.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {flaws.map((flaw, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {flaw}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No definidos</p>
            )}
          </CardContent>
        </Card>
      </div>

      {mannerisms.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Smile className="h-4 w-4" />
              Gestos y Muletillas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {mannerisms.map((mannerism, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {mannerism}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const RelationshipsSection = ({ npc }: { npc: NPC }) => {
  return (
    <div className="space-y-6">
      {/* NPC Relationships */}
      {npc.relationships.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Relaciones con NPCs ({npc.relationships.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {npc.relationships.map(relationship => {
              const typeInfo = RELATIONSHIP_TYPES.find(
                t => t.value === relationship.relationshipType
              )
              return (
                <div
                  key={relationship.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {relationship.npcName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {typeInfo?.label}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Nivel {relationship.strength}
                      </Badge>
                      {relationship.isSecret && (
                        <Badge variant="destructive" className="text-xs">
                          Secreto
                        </Badge>
                      )}
                    </div>
                    {relationship.description && (
                      <p className="text-sm text-muted-foreground">
                        {relationship.description}
                      </p>
                    )}
                    {relationship.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        {relationship.notes}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Location Relations */}
      {npc.locationRelations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Relaciones con Ubicaciones ({npc.locationRelations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {npc.locationRelations.map(relation => {
              const typeInfo = LOCATION_RELATION_TYPES.find(
                t => t.value === relation.relationType
              )
              return (
                <div
                  key={relation.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{typeInfo?.icon}</span>
                      <span className="font-medium text-sm">
                        {relation.locationName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {typeInfo?.label}
                      </Badge>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {relation.importance}
                      </Badge>
                      {relation.isSecret && (
                        <Badge variant="destructive" className="text-xs">
                          Secreto
                        </Badge>
                      )}
                    </div>
                    {relation.description && (
                      <p className="text-sm text-muted-foreground">
                        {relation.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Lore Connections */}
      {npc.loreConnections.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Scroll className="h-4 w-4" />
              Conexiones con Lore ({npc.loreConnections.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {npc.loreConnections.map(connection => {
              const typeInfo = LORE_CONNECTION_TYPES.find(
                t => t.value === connection.connectionType
              )
              return (
                <div
                  key={connection.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{typeInfo?.icon}</span>
                      <span className="font-medium text-sm">
                        {connection.loreTitle}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {typeInfo?.label}
                      </Badge>
                      {connection.isSecret && (
                        <Badge variant="destructive" className="text-xs">
                          Secreto
                        </Badge>
                      )}
                    </div>
                    {connection.description && (
                      <p className="text-sm text-muted-foreground">
                        {connection.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {npc.relationships.length === 0 &&
        npc.locationRelations.length === 0 &&
        npc.loreConnections.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Link className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Este NPC no tiene relaciones o conexiones definidas
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  )
}

export default function NPCDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { npcs } = useSessionStore()
  const [npc, setNpc] = useState<NPC | null>(null)

  useEffect(() => {
    if (params.id) {
      const foundNpc = npcs.find(n => n.id === params.id)
      setNpc(foundNpc || null)
    }
  }, [params.id, npcs])

  if (!npc) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">NPC no encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{npc.name}</h1>
            <p className="text-muted-foreground">
              {npc.race} • {npc.background} • {npc.npcType}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/npcs?edit=${npc.id}`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Raza</p>
              <p className="text-sm font-medium">{npc.race}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trasfondo</p>
              <p className="text-sm font-medium">{npc.background}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tipo</p>
              <Badge variant="outline" className="text-xs">
                {npc.npcType}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Importancia</p>
              <Badge variant="secondary" className="text-xs">
                {npc.importance}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Alineamiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                {getAlignmentDisplay(npc.alignment)}
              </p>
              {npc.alignment && (
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div
                    className={`p-1 border rounded ${npc.alignment.law === 'lawful' && npc.alignment.good === 'good' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    LB
                  </div>
                  <div
                    className={`p-1 border rounded ${npc.alignment.law === 'neutral' && npc.alignment.good === 'good' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    NB
                  </div>
                  <div
                    className={`p-1 border rounded ${npc.alignment.law === 'chaotic' && npc.alignment.good === 'good' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    CB
                  </div>
                  <div
                    className={`p-1 border rounded ${npc.alignment.law === 'lawful' && npc.alignment.good === 'neutral' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    LN
                  </div>
                  <div
                    className={`p-1 border rounded ${npc.alignment.law === 'neutral' && npc.alignment.good === 'neutral' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    N
                  </div>
                  <div
                    className={`p-1 border rounded ${npc.alignment.law === 'chaotic' && npc.alignment.good === 'neutral' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    CN
                  </div>
                  <div
                    className={`p-1 border rounded ${npc.alignment.law === 'lawful' && npc.alignment.good === 'evil' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    LM
                  </div>
                  <div
                    className={`p-1 border rounded ${npc.alignment.law === 'neutral' && npc.alignment.good === 'evil' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    NM
                  </div>
                  <div
                    className={`p-1 border rounded ${npc.alignment.law === 'chaotic' && npc.alignment.good === 'evil' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    CM
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Etiquetas y Ganchos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {npc.tags && npc.tags.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Etiquetas</p>
                <div className="flex flex-wrap gap-1">
                  {npc.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {npc.plotHooks && npc.plotHooks.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Ganchos de Historia
                </p>
                <div className="flex flex-wrap gap-1">
                  {npc.plotHooks.map((hook, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {hook}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {(!npc.tags || npc.tags.length === 0) &&
              (!npc.plotHooks || npc.plotHooks.length === 0) && (
                <p className="text-sm text-muted-foreground">No definidas</p>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {npc.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Descripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{npc.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs for detailed sections */}
      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Dice6 className="h-4 w-4" />
            Estadísticas
          </TabsTrigger>
          <TabsTrigger value="personality" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Personalidad
          </TabsTrigger>
          <TabsTrigger
            value="relationships"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Relaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <StatBlock npc={npc} />
        </TabsContent>

        <TabsContent value="personality">
          <PersonalitySection npc={npc} />
        </TabsContent>

        <TabsContent value="relationships">
          <RelationshipsSection npc={npc} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
