'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Play,
  Pause,
  Square,
  Clock,
  Users,
  Target,
  Crown,
  Map,
  Calendar,
  Sword,
  Dice1,
  UserPlus,
  FileText,
  Scroll,
  Building,
  Zap,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  Timer,
  MapPin,
} from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'
import { useCombatStore } from '@/stores/combatStore'

export default function DMDashboard() {
  const router = useRouter()
  const {
    currentSession,
    characters,
    npcs,
    quests,
    factions,
    locations,
    lore,
    items,
    songs,
    maps,
    startSession,
    pauseSession,
    endSession,
    getActiveQuests,
    getCompletedQuests,
    getActiveFactions,
    getNPCsByImportance,
    getMainTimelineLore,
  } = useSessionStore()

  const { currentCombat, combats } = useCombatStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [calendarData, setCalendarData] = useState<any>(null)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Load calendar data
  useEffect(() => {
    const savedData = localStorage.getItem('dnd-calendar-data')
    if (savedData) {
      try {
        setCalendarData(JSON.parse(savedData))
      } catch (error) {
        console.error('Failed to parse calendar data:', error)
      }
    }
  }, [])

  // Calculate campaign statistics
  const activeQuests = getActiveQuests()
  const completedQuests = getCompletedQuests()
  const activeFactions = getActiveFactions()
  const majorNPCs = getNPCsByImportance('major')
  const timelineLore = getMainTimelineLore()
  const alivePlayers = characters.filter(char => char.hitPoints.current > 0)
  const criticalNPCs = npcs.filter(
    npc => npc.importance === 'major' && npc.isAlive
  )

  // Get session duration
  const getSessionDuration = () => {
    if (!currentSession?.startTime) return '0m'
    const now =
      currentSession.status === 'completed' && currentSession.endTime
        ? new Date(currentSession.endTime)
        : currentTime
    const diff = now.getTime() - new Date(currentSession.startTime).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  // Get session status info
  const getSessionStatus = () => {
    if (!currentSession)
      return {
        status: 'No Iniciada',
        color: 'bg-gray-500',
        action: 'Iniciar Sesión',
      }
    switch (currentSession.status) {
      case 'active':
        return {
          status: 'Activa',
          color: 'bg-green-500',
          action: 'Pausar Sesión',
        }
      case 'paused':
        return {
          status: 'Pausada',
          color: 'bg-yellow-500',
          action: 'Reanudar Sesión',
        }
      case 'completed':
        return {
          status: 'Completada',
          color: 'bg-blue-500',
          action: 'Nueva Sesión',
        }
      default:
        return {
          status: 'No Iniciada',
          color: 'bg-gray-500',
          action: 'Iniciar Sesión',
        }
    }
  }

  const sessionStatus = getSessionStatus()
  const questCompletionRate =
    completedQuests.length + activeQuests.length > 0
      ? Math.round(
          (completedQuests.length /
            (completedQuests.length + activeQuests.length)) *
            100
        )
      : 0

  const handleSessionAction = () => {
    if (
      !currentSession ||
      currentSession.status === 'not-started' ||
      currentSession.status === 'completed'
    ) {
      startSession()
    } else if (currentSession.status === 'active') {
      pauseSession()
    } else if (currentSession.status === 'paused') {
      startSession()
    }
  }

  // Get today's calendar events
  const getTodaysEvents = () => {
    if (!calendarData) return []
    const today = calendarData.configuration
    return calendarData.events.filter(
      (event: any) =>
        event.day === today.currentDay &&
        event.month === today.currentMonth &&
        (event.isRecurring || event.year === today.currentYear)
    )
  }

  const todaysEvents = getTodaysEvents()

  return (
    <div className="space-y-6">
      {/* Top Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Estado de Sesión
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${sessionStatus.color}`}
                  />
                  <p className="font-semibold">{sessionStatus.status}</p>
                </div>
              </div>
              <Play className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Misiones Activas
                </p>
                <p className="text-2xl font-bold text-green-500">
                  {activeQuests.length}
                </p>
              </div>
              <Target className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Combate</p>
                <p className="text-lg font-semibold">
                  {currentCombat ? 'Activo' : 'Inactivo'}
                </p>
              </div>
              <Sword
                className={`h-6 w-6 ${currentCombat ? 'text-red-500' : 'text-muted-foreground'}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Jugadores Activos
                </p>
                <p className="text-2xl font-bold text-purple-500">
                  {alivePlayers.length}/{characters.length}
                </p>
              </div>
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Control de Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duración:</span>
                <Badge variant="outline" className="font-mono">
                  <Timer className="h-3 w-3 mr-1" />
                  {getSessionDuration()}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Jugadores:
                </span>
                <span className="font-medium">
                  {alivePlayers.length}/{characters.length}
                </span>
              </div>

              {currentCombat && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-500">
                    <Sword className="h-4 w-4" />
                    <span className="font-medium">Combate en Curso</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentCombat.name}
                  </p>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => router.push('/combat')}
                  >
                    Ir a Combate
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            <Button
              className="w-full"
              onClick={handleSessionAction}
              variant={
                currentSession?.status === 'active' ? 'destructive' : 'default'
              }
            >
              {currentSession?.status === 'active' ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {sessionStatus.action}
            </Button>

            {currentSession?.status === 'active' && (
              <Button variant="outline" className="w-full" onClick={endSession}>
                <Square className="h-4 w-4 mr-2" />
                Finalizar Sesión
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Campaign Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estadísticas de Campaña
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Misiones Completadas:
                </span>
                <div className="text-right">
                  <span className="font-medium">
                    {completedQuests.length}/
                    {completedQuests.length + activeQuests.length}
                  </span>
                  <Progress
                    value={questCompletionRate}
                    className="w-20 h-2 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-lg font-bold text-blue-500">
                    {npcs.length}
                  </p>
                  <p className="text-xs text-muted-foreground">NPCs Total</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-lg font-bold text-green-500">
                    {locations.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Ubicaciones</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-lg font-bold text-purple-500">
                    {activeFactions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Facciones</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-lg font-bold text-orange-500">
                    {lore.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Entradas Lore</p>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Recursos:
                  </span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {songs.length} Canciones
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {items.length} Objetos
                  </span>
                  <span className="flex items-center gap-1">
                    <Map className="h-3 w-3" />
                    {maps.length} Mapas
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dice1 className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/combat')}
            >
              <Sword className="h-4 w-4 mr-2" />
              {currentCombat ? 'Continuar Combate' : 'Iniciar Combate'}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/npcs')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar NPC
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/quests')}
            >
              <Target className="h-4 w-4 mr-2" />
              Nueva Misión
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agregar Evento
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/lore')}
            >
              <Scroll className="h-4 w-4 mr-2" />
              Nota de Lore
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Quests & Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Misiones Activas
              </div>
              <Badge variant="secondary">{activeQuests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeQuests.length > 0 ? (
              <div className="space-y-3">
                {activeQuests.slice(0, 4).map(quest => (
                  <div
                    key={quest.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push('/quests')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate">{quest.title}</h4>
                      <Badge
                        variant={
                          quest.priority === 'high'
                            ? 'destructive'
                            : quest.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {quest.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {quest.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground capitalize">
                        {quest.type}
                      </span>
                      <div className="flex items-center gap-1">
                        {quest.status === 'active' ? (
                          <AlertCircle className="h-3 w-3 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                        <span className="text-xs capitalize">
                          {quest.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {activeQuests.length > 4 && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => router.push('/quests')}
                  >
                    Ver {activeQuests.length - 4} misiones más
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No hay misiones activas</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => router.push('/quests')}
                >
                  Crear nueva misión
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* NPCs & Characters Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personajes y NPCs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Player Characters */}
              {characters.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Jugadores</h4>
                  <div className="space-y-2">
                    {characters.slice(0, 3).map(character => (
                      <div
                        key={character.id}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${character.hitPoints.current > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          />
                          <span className="font-medium text-sm">
                            {character.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {character.hitPoints.current}/
                          {character.hitPoints.maximum} HP
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Major NPCs */}
              {criticalNPCs.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">NPCs Principales</h4>
                  <div className="space-y-2">
                    {criticalNPCs.slice(0, 3).map(npc => (
                      <div
                        key={npc.id}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Crown className="h-3 w-3 text-yellow-500" />
                          <span className="font-medium text-sm">
                            {npc.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {npc.npcType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/characters')}
              >
                Ver todos los personajes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Calendar Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Eventos de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysEvents.length > 0 ? (
              <div className="space-y-2">
                {todaysEvents.map((event: any, index: number) => (
                  <div
                    key={index}
                    className="p-2 border rounded flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {event.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay eventos hoy
                </p>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() => router.push('/calendar')}
            >
              Ver calendario completo
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timelineLore.slice(0, 4).map(entry => (
                <div key={entry.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="font-medium">{entry.title}</span>
                  </div>
                  <p className="text-muted-foreground text-xs ml-4">
                    {entry.year && `Año ${entry.year} - `}
                    {(() => {
                      const diff =
                        currentTime.getTime() - entry.createdAt.getTime()
                      const minutes = Math.floor(diff / 60000)
                      const hours = Math.floor(minutes / 60)
                      const days = Math.floor(hours / 24)
                      if (days > 0) return `hace ${days} días`
                      if (hours > 0) return `hace ${hours}h`
                      return `hace ${minutes}m`
                    })()}
                  </p>
                </div>
              ))}

              {timelineLore.length === 0 && (
                <div className="text-center py-4">
                  <Scroll className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No hay actividad reciente
                  </p>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() => router.push('/lore')}
            >
              Ver línea de tiempo completa
            </Button>
          </CardContent>
        </Card>

        {/* Campaign Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Resumen de Campaña
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {calendarData && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-500">
                    Fecha Actual
                  </span>
                </div>
                <p className="text-sm">
                  Día {calendarData.configuration.currentDay} de{' '}
                  {
                    calendarData.configuration.monthNames[
                      calendarData.configuration.currentMonth - 1
                    ]
                  }
                  , {calendarData.configuration.yearPrefix}{' '}
                  {calendarData.configuration.currentYear}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-muted/30 rounded text-center">
                <p className="font-medium text-green-600">
                  {completedQuests.length}
                </p>
                <p className="text-muted-foreground">Misiones Completadas</p>
              </div>
              <div className="p-2 bg-muted/30 rounded text-center">
                <p className="font-medium text-blue-600">{combats.length}</p>
                <p className="text-muted-foreground">Combates Totales</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Progreso de Misiones:
                </span>
                <span className="font-medium">{questCompletionRate}%</span>
              </div>
              <Progress value={questCompletionRate} className="h-2" />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/settings')}
            >
              Configuración de Campaña
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
