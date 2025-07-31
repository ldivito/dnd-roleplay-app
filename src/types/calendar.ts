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
  { value: 'religious', label: 'Religious', color: '#8b5cf6' },
  { value: 'political', label: 'Political', color: '#ef4444' },
  { value: 'natural', label: 'Natural Event', color: '#22c55e' },
  { value: 'custom', label: 'Custom', color: '#6b7280' },
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
    name: 'Gregorian Calendar',
    daysPerYear: 365,
    hoursPerDay: 24,
    daysPerWeek: 7,
    monthsPerYear: 12,
    dayNames: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    yearPrefix: 'Year',
    currentYear: 2024,
    currentMonth: 1,
    currentDay: 1,
    seasons: [
      {
        id: 'spring',
        name: 'Spring',
        startMonth: 3,
        startDay: 20,
        endMonth: 6,
        endDay: 20,
        color: SEASON_COLORS[0],
        description: 'Season of renewal and growth',
      },
      {
        id: 'summer',
        name: 'Summer',
        startMonth: 6,
        startDay: 21,
        endMonth: 9,
        endDay: 22,
        color: SEASON_COLORS[1],
        description: 'Season of warmth and abundance',
      },
      {
        id: 'autumn',
        name: 'Autumn',
        startMonth: 9,
        startDay: 23,
        endMonth: 12,
        endDay: 20,
        color: SEASON_COLORS[2],
        description: 'Season of harvest and preparation',
      },
      {
        id: 'winter',
        name: 'Winter',
        startMonth: 12,
        startDay: 21,
        endMonth: 3,
        endDay: 19,
        color: SEASON_COLORS[3],
        description: 'Season of rest and reflection',
      },
    ],
  },
  {
    name: 'Forgotten Realms Calendar (Harptos)',
    daysPerYear: 365,
    hoursPerDay: 24,
    daysPerWeek: 10,
    monthsPerYear: 12,
    dayNames: [
      'First Day',
      'Second Day',
      'Third Day',
      'Fourth Day',
      'Fifth Day',
      'Sixth Day',
      'Seventh Day',
      'Eighth Day',
      'Ninth Day',
      'Tenth Day',
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
        name: 'Spring',
        startMonth: 3,
        startDay: 19,
        endMonth: 6,
        endDay: 20,
        color: SEASON_COLORS[0],
        description: 'The time of renewal in Faerûn',
      },
      {
        id: 'summer',
        name: 'Summer',
        startMonth: 6,
        startDay: 21,
        endMonth: 9,
        endDay: 21,
        color: SEASON_COLORS[1],
        description: 'The height of warmth and activity',
      },
      {
        id: 'autumn',
        name: 'Autumn',
        startMonth: 9,
        startDay: 22,
        endMonth: 12,
        endDay: 20,
        color: SEASON_COLORS[2],
        description: 'The time of harvest and preparation',
      },
      {
        id: 'winter',
        name: 'Winter',
        startMonth: 12,
        startDay: 21,
        endMonth: 3,
        endDay: 18,
        color: SEASON_COLORS[3],
        description: 'The cold months in Faerûn',
      },
    ],
  },
  {
    name: 'Custom Fantasy Calendar',
    daysPerYear: 400,
    hoursPerDay: 20,
    daysPerWeek: 8,
    monthsPerYear: 10,
    dayNames: [
      'Sunwatch',
      'Moonday',
      'Starfall',
      'Earthen',
      'Windrise',
      'Fireday',
      'Waterflow',
      'Voidrest',
    ],
    monthNames: [
      'Firstbud',
      'Sunhigh',
      'Goldtime',
      'Harvestmoon',
      'Leaffall',
      'Frostcome',
      'Deepcold',
      'Icebreak',
      'Newgrowth',
      'Stormwind',
    ],
    yearPrefix: 'Age of',
    currentYear: 1,
    currentMonth: 1,
    currentDay: 1,
    seasons: [
      {
        id: 'growing',
        name: 'Growing Season',
        startMonth: 1,
        startDay: 1,
        endMonth: 3,
        endDay: 40,
        color: SEASON_COLORS[0],
        description: 'Time of growth and new beginnings',
      },
      {
        id: 'abundance',
        name: 'Abundance Season',
        startMonth: 4,
        startDay: 1,
        endMonth: 6,
        endDay: 40,
        color: SEASON_COLORS[1],
        description: 'Time of plenty and celebration',
      },
      {
        id: 'gathering',
        name: 'Gathering Season',
        startMonth: 7,
        startDay: 1,
        endMonth: 8,
        endDay: 40,
        color: SEASON_COLORS[2],
        description: 'Time of harvest and preparation',
      },
      {
        id: 'dormancy',
        name: 'Dormancy Season',
        startMonth: 9,
        startDay: 1,
        endMonth: 10,
        endDay: 40,
        color: SEASON_COLORS[3],
        description: 'Time of rest and reflection',
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
