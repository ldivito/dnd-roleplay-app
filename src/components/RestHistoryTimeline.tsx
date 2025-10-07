'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Moon,
  Sun,
  MapPin,
  Users,
  Heart,
  Dice6,
  Sparkles,
  Clock,
} from 'lucide-react'
import type { RestEvent } from '@/types/rest'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface RestHistoryTimelineProps {
  restEvents: RestEvent[]
  maxHeight?: string
}

export default function RestHistoryTimeline({
  restEvents,
  maxHeight = '500px',
}: RestHistoryTimelineProps) {
  if (restEvents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No hay descansos registrados aún</p>
          <p className="text-sm mt-1">
            Los descansos que tomes aparecerán aquí
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Descansos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ maxHeight }} className="pr-4">
          <div className="space-y-4">
            {restEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline Line */}
                {index < restEvents.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                )}

                {/* Event Card */}
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      event.type === 'long'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        : 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400'
                    }`}
                  >
                    {event.type === 'long' ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {event.type === 'long'
                            ? 'Descanso Largo'
                            : 'Descanso Corto'}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(event.startTime), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </p>
                      </div>
                      <Badge
                        variant={
                          event.interrupted ? 'destructive' : 'secondary'
                        }
                      >
                        {event.interrupted ? 'Interrumpido' : 'Completado'}
                      </Badge>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {/* Participants */}
                    <div className="flex items-center gap-1 text-sm mb-3">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {event.resourcesRestored.length}{' '}
                        {event.resourcesRestored.length === 1
                          ? 'participante'
                          : 'participantes'}
                      </span>
                    </div>

                    {/* Resources Restored */}
                    <div className="space-y-2">
                      {event.resourcesRestored.map(restore => {
                        const hasRecovery =
                          restore.hpRestored > 0 ||
                          restore.hitDiceRestored > 0 ||
                          (restore.spellSlotsRestored ?? 0) > 0 ||
                          restore.resourcesRestored.length > 0

                        if (!hasRecovery) return null

                        return (
                          <div
                            key={restore.characterId}
                            className="text-sm bg-muted/50 rounded p-2 space-y-1"
                          >
                            <p className="font-medium">
                              {restore.characterName}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {restore.hpRestored > 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs flex items-center gap-1"
                                >
                                  <Heart className="h-3 w-3 text-red-500" />+
                                  {restore.hpRestored} HP
                                </Badge>
                              )}
                              {restore.hitDiceRestored > 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs flex items-center gap-1"
                                >
                                  <Dice6 className="h-3 w-3 text-purple-500" />+
                                  {restore.hitDiceRestored} Dados
                                </Badge>
                              )}
                              {restore.spellSlotsRestored &&
                                restore.spellSlotsRestored > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs flex items-center gap-1"
                                  >
                                    <Sparkles className="h-3 w-3 text-blue-500" />
                                    Hechizos
                                  </Badge>
                                )}
                              {restore.resourcesRestored.map(
                                (resource, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {resource}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Notes */}
                    {event.notes && (
                      <div className="mt-2 text-sm text-muted-foreground italic">
                        &ldquo;{event.notes}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
