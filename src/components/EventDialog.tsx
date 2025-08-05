'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Calendar, Clock } from 'lucide-react'
import {
  CalendarEvent,
  CalendarConfiguration,
  EVENT_TYPES,
} from '@/types/calendar'

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (event: CalendarEvent) => void
  onDelete?: (eventId: string) => void
  existingEvent: CalendarEvent | null
  calendarConfig: CalendarConfiguration
  selectedDate?: { day: number; month: number; year: number } | null
}

export function EventDialog({
  open,
  onOpenChange,
  onSave,
  onDelete,
  existingEvent,
  calendarConfig,
  selectedDate,
}: EventDialogProps) {
  const [event, setEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    type: 'festival',
    day: 1,
    month: 1,
    year: calendarConfig.currentYear,
    duration: 1,
    isRecurring: false,
    color: EVENT_TYPES[0].color,
  })

  useEffect(() => {
    if (existingEvent) {
      setEvent(existingEvent)
    } else if (selectedDate) {
      setEvent(prev => ({
        ...prev,
        day: selectedDate.day,
        month: selectedDate.month,
        year: selectedDate.year,
        title: '',
        description: '',
        type: 'festival',
        duration: 1,
        isRecurring: false,
        color: EVENT_TYPES[0].color,
      }))
    } else {
      // Reset for new event
      setEvent({
        title: '',
        description: '',
        type: 'festival',
        day: calendarConfig.currentDay,
        month: calendarConfig.currentMonth,
        year: calendarConfig.currentYear,
        duration: 1,
        isRecurring: false,
        color: EVENT_TYPES[0].color,
      })
    }
  }, [existingEvent, selectedDate, calendarConfig, open])

  const handleTypeChange = (type: string) => {
    const eventType = EVENT_TYPES.find(t => t.value === type)
    setEvent(prev => ({
      ...prev,
      type: type as CalendarEvent['type'],
      color: eventType?.color || EVENT_TYPES[0].color,
    }))
  }

  const handleSave = () => {
    if (!event.title || !event.day || !event.month) {
      return
    }

    const fullEvent: CalendarEvent = {
      id: existingEvent?.id || crypto.randomUUID(),
      title: event.title || '',
      description: event.description || '',
      type: event.type || 'festival',
      day: event.day || 1,
      month: event.month || 1,
      duration: event.duration || 1,
      isRecurring: event.isRecurring || false,
      color: event.color || EVENT_TYPES[0].color,
      createdAt: existingEvent?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    // Only add year if not recurring
    if (!event.isRecurring) {
      fullEvent.year = event.year || calendarConfig.currentYear
    }

    onSave(fullEvent)
  }

  const handleDelete = () => {
    if (existingEvent && onDelete) {
      onDelete(existingEvent.id)
      onOpenChange(false)
    }
  }

  const getDaysInMonth = (month: number) => {
    // Simple implementation - divide total days evenly among months
    const baseDays = Math.floor(
      calendarConfig.daysPerYear / calendarConfig.monthsPerYear
    )
    const extraDays = calendarConfig.daysPerYear % calendarConfig.monthsPerYear
    return month <= extraDays ? baseDays + 1 : baseDays
  }

  const maxDay = event.month ? getDaysInMonth(event.month) : 31

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {existingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </DialogTitle>
          <DialogDescription>
            {existingEvent
              ? 'Actualiza los detalles de este evento del calendario.'
              : 'Agrega un nuevo evento a tu sistema de calendario.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título del Evento *</Label>
              <Input
                id="title"
                value={event.title || ''}
                onChange={e =>
                  setEvent(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder="ej., Festival de Verano, La Fiesta de la Luna"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={event.description || ''}
                onChange={e =>
                  setEvent(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Descripción opcional del evento..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo de Evento</Label>
              <Select
                value={event.type || 'festival'}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Fecha y Hora
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="month">Mes</Label>
                <Select
                  value={event.month?.toString() || '1'}
                  onValueChange={value =>
                    setEvent(prev => ({ ...prev, month: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {calendarConfig.monthNames.map((name, index) => (
                      <SelectItem
                        key={index + 1}
                        value={(index + 1).toString()}
                      >
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="day">Día</Label>
                <Input
                  id="day"
                  type="number"
                  min="1"
                  max={maxDay}
                  value={event.day || 1}
                  onChange={e =>
                    setEvent(prev => ({
                      ...prev,
                      day: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="duration">Duración (Días)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={event.duration || 1}
                  onChange={e =>
                    setEvent(prev => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isRecurring"
                checked={event.isRecurring || false}
                onCheckedChange={checked =>
                  setEvent(prev => ({ ...prev, isRecurring: checked }))
                }
              />
              <Label htmlFor="isRecurring">
                Evento Recurrente (ocurre cada año)
              </Label>
            </div>

            {!event.isRecurring && (
              <div>
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  value={event.year || calendarConfig.currentYear}
                  onChange={e =>
                    setEvent(prev => ({
                      ...prev,
                      year:
                        parseInt(e.target.value) || calendarConfig.currentYear,
                    }))
                  }
                />
              </div>
            )}
          </div>

          <div>
            <Label>Color del Evento</Label>
            <div className="flex gap-2 mt-2">
              {EVENT_TYPES.map(type => (
                <button
                  key={type.color}
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 ${
                    event.color === type.color
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: type.color }}
                  onClick={() =>
                    setEvent(prev => ({ ...prev, color: type.color }))
                  }
                  title={type.label}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {existingEvent && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Evento
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Evento</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que quieres eliminar &quot;
                      {existingEvent.title}&quot;? Esta acción no se puede
                      deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!event.title || !event.day || !event.month}
            >
              {existingEvent ? 'Actualizar Evento' : 'Crear Evento'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
