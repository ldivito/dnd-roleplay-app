export interface CalendarEvent {
  id: string
  title: string
  description?: string
  type: 'festival' | 'religious' | 'political' | 'natural' | 'custom'
  day: number
  month: number
  year?: number // Optional for recurring events
  duration: number // Duration in days
  isRecurring: boolean
  color?: string
  createdAt: Date
  updatedAt: Date
}

export interface Season {
  id: string
  name: string
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
  color: string
  description?: string
}

export interface CalendarConfiguration {
  id: string
  name: string
  daysPerYear: number
  hoursPerDay: number
  daysPerWeek: number
  monthsPerYear: number
  dayNames: string[]
  monthNames: string[]
  yearPrefix?: string // e.g., "Year of the", "AC", "DR"
  yearSuffix?: string
  currentYear: number
  currentMonth: number
  currentDay: number
  seasons: Season[]
  createdAt: Date
  updatedAt: Date
}

export interface CalendarData {
  configuration: CalendarConfiguration
  events: CalendarEvent[]
}

// Calendar event type options
export const EVENT_TYPES = [
  { value: 'festival', label: 'Festival', color: '#f59e0b' },
  { value: 'religious', label: 'Religioso', color: '#8b5cf6' },
  { value: 'political', label: 'Político', color: '#ef4444' },
  { value: 'natural', label: 'Evento Natural', color: '#22c55e' },
  { value: 'custom', label: 'Personalizado', color: '#6b7280' },
] as const

// Default season colors
export const SEASON_COLORS = [
  '#22c55e', // Spring - Green
  '#f59e0b', // Summer - Yellow
  '#ea580c', // Autumn - Orange
  '#3b82f6', // Winter - Blue
] as const

// Preset calendar configurations
export const PRESET_CALENDARS: Omit<
  CalendarConfiguration,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: 'Calendario Gregoriano',
    daysPerYear: 365,
    hoursPerDay: 24,
    daysPerWeek: 7,
    monthsPerYear: 12,
    dayNames: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ],
    monthNames: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    yearPrefix: 'Año',
    currentYear: 2024,
    currentMonth: 1,
    currentDay: 1,
    seasons: [
      {
        id: 'spring',
        name: 'Primavera',
        startMonth: 3,
        startDay: 20,
        endMonth: 6,
        endDay: 20,
        color: SEASON_COLORS[0],
        description: 'Estación de renovación y crecimiento',
      },
      {
        id: 'summer',
        name: 'Verano',
        startMonth: 6,
        startDay: 21,
        endMonth: 9,
        endDay: 22,
        color: SEASON_COLORS[1],
        description: 'Estación de calor y abundancia',
      },
      {
        id: 'autumn',
        name: 'Otoño',
        startMonth: 9,
        startDay: 23,
        endMonth: 12,
        endDay: 20,
        color: SEASON_COLORS[2],
        description: 'Estación de cosecha y preparación',
      },
      {
        id: 'winter',
        name: 'Invierno',
        startMonth: 12,
        startDay: 21,
        endMonth: 3,
        endDay: 19,
        color: SEASON_COLORS[3],
        description: 'Estación de descanso y reflexión',
      },
    ],
  },
  {
    name: 'Calendario de Reinos Olvidados (Harptos)',
    daysPerYear: 365,
    hoursPerDay: 24,
    daysPerWeek: 10,
    monthsPerYear: 12,
    dayNames: [
      'Primer Día',
      'Segundo Día',
      'Tercer Día',
      'Cuarto Día',
      'Quinto Día',
      'Sexto Día',
      'Séptimo Día',
      'Octavo Día',
      'Noveno Día',
      'Décimo Día',
    ],
    monthNames: [
      'Hammer',
      'Alturiak',
      'Ches',
      'Tarsakh',
      'Mirtul',
      'Kythorn',
      'Flamerule',
      'Eleasis',
      'Eleint',
      'Marpenoth',
      'Uktar',
      'Nightal',
    ],
    yearPrefix: 'DR',
    currentYear: 1495,
    currentMonth: 1,
    currentDay: 1,
    seasons: [
      {
        id: 'spring',
        name: 'Primavera',
        startMonth: 3,
        startDay: 19,
        endMonth: 6,
        endDay: 20,
        color: SEASON_COLORS[0],
        description: 'El tiempo de renovación en Faerûn',
      },
      {
        id: 'summer',
        name: 'Verano',
        startMonth: 6,
        startDay: 21,
        endMonth: 9,
        endDay: 21,
        color: SEASON_COLORS[1],
        description: 'El punto máximo de calor y actividad',
      },
      {
        id: 'autumn',
        name: 'Otoño',
        startMonth: 9,
        startDay: 22,
        endMonth: 12,
        endDay: 20,
        color: SEASON_COLORS[2],
        description: 'El tiempo de cosecha y preparación',
      },
      {
        id: 'winter',
        name: 'Invierno',
        startMonth: 12,
        startDay: 21,
        endMonth: 3,
        endDay: 18,
        color: SEASON_COLORS[3],
        description: 'Los meses fríos en Faerûn',
      },
    ],
  },
  {
    name: 'Calendario Fantástico Personalizado',
    daysPerYear: 400,
    hoursPerDay: 20,
    daysPerWeek: 8,
    monthsPerYear: 10,
    dayNames: [
      'Vigilasol',
      'Lundía',
      'Astrocaída',
      'Terrenal',
      'Ventoleva',
      'Ignisdía',
      'Aguaflujo',
      'Vacíodescanso',
    ],
    monthNames: [
      'Primebrote',
      'Solalto',
      'Orotiempo',
      'Lunacosecha',
      'Hojaotoño',
      'Heladaviene',
      'Profundfrío',
      'Rompehielo',
      'Nuevocrecer',
      'Tormentaviento',
    ],
    yearPrefix: 'Era de',
    currentYear: 1,
    currentMonth: 1,
    currentDay: 1,
    seasons: [
      {
        id: 'growing',
        name: 'Estación de Crecimiento',
        startMonth: 1,
        startDay: 1,
        endMonth: 3,
        endDay: 40,
        color: SEASON_COLORS[0],
        description: 'Tiempo de crecimiento y nuevos comienzos',
      },
      {
        id: 'abundance',
        name: 'Estación de Abundancia',
        startMonth: 4,
        startDay: 1,
        endMonth: 6,
        endDay: 40,
        color: SEASON_COLORS[1],
        description: 'Tiempo de abundancia y celebración',
      },
      {
        id: 'gathering',
        name: 'Estación de Recolección',
        startMonth: 7,
        startDay: 1,
        endMonth: 8,
        endDay: 40,
        color: SEASON_COLORS[2],
        description: 'Tiempo de cosecha y preparación',
      },
      {
        id: 'dormancy',
        name: 'Estación de Letargo',
        startMonth: 9,
        startDay: 1,
        endMonth: 10,
        endDay: 40,
        color: SEASON_COLORS[3],
        description: 'Tiempo de descanso y reflexión',
      },
    ],
  },
]

// Utility functions
export function getDaysInMonth(
  month: number,
  config: CalendarConfiguration
): number {
  // Simple implementation - divide total days evenly among months
  const baseDays = Math.floor(config.daysPerYear / config.monthsPerYear)
  const extraDays = config.daysPerYear % config.monthsPerYear

  // Distribute extra days among the first months
  return month <= extraDays ? baseDays + 1 : baseDays
}

export function getCurrentSeason(
  day: number,
  month: number,
  config: CalendarConfiguration
): Season | undefined {
  return config.seasons.find(season => {
    // Handle seasons that span year boundary
    if (season.startMonth > season.endMonth) {
      return (
        (month >= season.startMonth && day >= season.startDay) ||
        (month <= season.endMonth && day <= season.endDay)
      )
    } else {
      return (
        (month > season.startMonth ||
          (month === season.startMonth && day >= season.startDay)) &&
        (month < season.endMonth ||
          (month === season.endMonth && day <= season.endDay))
      )
    }
  })
}

export function formatDate(
  day: number,
  month: number,
  year: number,
  config: CalendarConfiguration
): string {
  const monthName = config.monthNames[month - 1] || `Month ${month}`
  const yearDisplay = config.yearPrefix
    ? `${config.yearPrefix} ${year}`
    : `${year}${config.yearSuffix || ''}`
  return `${day} ${monthName}, ${yearDisplay}`
}

export function getEventsForDate(
  day: number,
  month: number,
  year: number,
  events: CalendarEvent[]
): CalendarEvent[] {
  return events.filter(event => {
    if (event.isRecurring) {
      return event.day === day && event.month === month
    } else {
      return event.day === day && event.month === month && event.year === year
    }
  })
}
