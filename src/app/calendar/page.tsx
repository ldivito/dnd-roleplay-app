'use client'

import { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CalendarConfiguration,
  CalendarEvent,
  CalendarData,
  PRESET_CALENDARS,
  getDaysInMonth,
  getCurrentSeason,
  formatDate,
  getEventsForDate,
} from '@/types/calendar'
import { CalendarConfigDialog } from '@/components/CalendarConfigDialog'
import { EventDialog } from '@/components/EventDialog'
export default function CalendarPage() {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [currentView, setCurrentView] = useState<{
    month: number
    year: number
  }>({ month: 1, year: 1 })
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [eventDialogOpen, setEventDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<{
    day: number
    month: number
    year: number
  } | null>(null)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  useEffect(() => {
    // Load calendar data from localStorage
    const savedData = localStorage.getItem('dnd-calendar-data')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setCalendarData(parsed)
        setCurrentView({
          month: parsed.configuration.currentMonth,
          year: parsed.configuration.currentYear,
        })
      } catch (error) {
        console.error('Failed to parse calendar data:', error)
      }
    }
  }, [])

  const saveCalendarData = (data: CalendarData) => {
    setCalendarData(data)
    localStorage.setItem('dnd-calendar-data', JSON.stringify(data))
  }

  const handleConfigSave = (config: CalendarConfiguration) => {
    const newData: CalendarData = {
      configuration: config,
      events: calendarData?.events || [],
    }
    saveCalendarData(newData)
    setCurrentView({ month: config.currentMonth, year: config.currentYear })
    setConfigDialogOpen(false)
  }

  const handleEventSave = (event: CalendarEvent) => {
    if (!calendarData) return

    const updatedEvents = editingEvent
      ? calendarData.events.map(e => (e.id === editingEvent.id ? event : e))
      : [...calendarData.events, event]

    saveCalendarData({
      ...calendarData,
      events: updatedEvents,
    })

    setEventDialogOpen(false)
    setEditingEvent(null)
    setSelectedDate(null)
  }

  const handleEventDelete = (eventId: string) => {
    if (!calendarData) return

    saveCalendarData({
      ...calendarData,
      events: calendarData.events.filter(e => e.id !== eventId),
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (!calendarData) return

    const config = calendarData.configuration
    let newMonth = currentView.month
    let newYear = currentView.year

    if (direction === 'next') {
      newMonth++
      if (newMonth > config.monthsPerYear) {
        newMonth = 1
        newYear++
      }
    } else {
      newMonth--
      if (newMonth < 1) {
        newMonth = config.monthsPerYear
        newYear--
      }
    }

    setCurrentView({ month: newMonth, year: newYear })
  }

  const openEventDialog = (day?: number) => {
    if (day && calendarData) {
      setSelectedDate({ day, month: currentView.month, year: currentView.year })
    }
    setEventDialogOpen(true)
  }

  const editEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setEventDialogOpen(true)
  }

  if (!calendarData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <CalendarIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Calendar System</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Welcome to your Campaign Calendar</CardTitle>
            <CardDescription>
              Create a custom calendar system for your world, including seasons,
              events, and festivals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Start by configuring your calendar system. You can choose from
                preset calendars or create your own custom configuration.
              </p>
              <Button
                onClick={() => setConfigDialogOpen(true)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure Calendar System
              </Button>
            </div>
          </CardContent>
        </Card>

        <CalendarConfigDialog
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
          onSave={handleConfigSave}
          existingConfig={null}
        />
      </div>
    )
  }

  const config = calendarData.configuration
  const daysInMonth = getDaysInMonth(currentView.month, config)
  const currentSeason = getCurrentSeason(
    config.currentDay,
    config.currentMonth,
    config
  )
  const monthName =
    config.monthNames[currentView.month - 1] || `Month ${currentView.month}`

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">{config.name}</h1>
            <p className="text-muted-foreground">
              {formatDate(
                config.currentDay,
                config.currentMonth,
                config.currentYear,
                config
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setConfigDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => openEventDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {currentSeason && (
        <Card className="mb-6" style={{ borderColor: currentSeason.color }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: currentSeason.color }}
              />
              <CardTitle className="text-lg">
                Current Season: {currentSeason.name}
              </CardTitle>
            </div>
            {currentSeason.description && (
              <CardDescription>{currentSeason.description}</CardDescription>
            )}
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl">
                {monthName} {config.yearPrefix} {currentView.year}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {config.dayNames.map((dayName, index) => (
              <div
                key={index}
                className="text-center text-sm font-medium p-2 text-muted-foreground"
              >
                {dayName}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const events = getEventsForDate(
                day,
                currentView.month,
                currentView.year,
                calendarData.events
              )
              const isCurrentDay =
                day === config.currentDay &&
                currentView.month === config.currentMonth &&
                currentView.year === config.currentYear

              return (
                <div
                  key={day}
                  className={`min-h-[80px] p-2 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                    isCurrentDay
                      ? 'bg-primary/10 border-primary'
                      : 'border-border'
                  }`}
                  onClick={() => openEventDialog(day)}
                >
                  <div className="text-sm font-medium mb-1">{day}</div>
                  <div className="space-y-1">
                    {events.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                        style={{
                          backgroundColor: event.color || '#6b7280',
                          color: 'white',
                        }}
                        onClick={e => {
                          e.stopPropagation()
                          editEvent(event)
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {calendarData.events.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {calendarData.events
                .filter(event => {
                  if (event.isRecurring) return true
                  if (!event.year) return true
                  return event.year >= currentView.year
                })
                .slice(0, 10)
                .map(event => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => editEvent(event)}
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: event.color || '#6b7280' }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(
                          event.day,
                          event.month,
                          event.year || currentView.year,
                          config
                        )}
                        {event.isRecurring && (
                          <Badge variant="secondary" className="ml-2">
                            Recurring
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <CalendarConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        onSave={handleConfigSave}
        existingConfig={config}
      />

      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        existingEvent={editingEvent}
        calendarConfig={config}
        selectedDate={selectedDate}
      />
    </div>
  )
}
