import {
  type Spell,
  type PerformanceQuality,
  type InstrumentCategory,
  type MusicGenre,
  INSTRUMENT_CATEGORIES,
  MUSIC_GENRES,
} from '@/types/spell'

export interface SpellEffectModifier {
  damageMultiplier: number
  healingMultiplier: number
  durationMultiplier: number
  dcModifier: number
  rangeMultiplier: number
  additionalEffects: string[]
}

export interface InstrumentMagicalProperties {
  category: InstrumentCategory
  name: string
  description: string
  magicalAssociation: string
  preferredSchools: string[]
  bonusEffects: {
    [key in PerformanceQuality]?: string[]
  }
}

export interface GenreMagicalProperties {
  genre: MusicGenre
  name: string
  description: string
  effects: string
  spellModifiers: Partial<SpellEffectModifier>
  compatibleInstruments: InstrumentCategory[]
}

// Enhanced instrument properties with magical associations
export const MAGICAL_INSTRUMENT_PROPERTIES: InstrumentMagicalProperties[] = [
  {
    category: 'wind',
    name: 'Instrumentos de Viento',
    description: 'Flautas, silbatos, cuernos',
    magicalAssociation: 'Control del aire, comunicación, inspiración, libertad',
    preferredSchools: ['Evocación', 'Encantamiento', 'Melodía'],
    bonusEffects: {
      excellent: ['Los hechizos de viento tienen doble alcance'],
      masterful: [
        'Los hechizos de viento pueden afectar criaturas voladoras sin penalización',
        'Creas corrientes de aire que otorgan ventaja en saltos',
      ],
    },
  },
  {
    category: 'percussion',
    name: 'Instrumentos de Percusión',
    description: 'Tambores, campanas, carillones',
    magicalAssociation: 'Ritmo vital, protección, invocación, poder primario',
    preferredSchools: ['Abjuración', 'Conjuración', 'Harmonía'],
    bonusEffects: {
      excellent: ['Los hechizos de protección duran 50% más tiempo'],
      masterful: [
        'Los hechizos de protección afectan a aliados adicionales',
        'Creas vibraciones que pueden detectar criaturas ocultas en 30 pies',
      ],
    },
  },
  {
    category: 'strings',
    name: 'Instrumentos de Cuerda',
    description: 'Guitarras, arpas, violines',
    magicalAssociation: 'Emociones, encantamiento, sanación, armonía del alma',
    preferredSchools: ['Encantamiento', 'Harmonía', 'Melodía'],
    bonusEffects: {
      excellent: ['Los hechizos de sanación restauran 25% más puntos de vida'],
      masterful: [
        'Los hechizos de sanación también eliminan una condición menor',
        'Creas resonancia emocional que puede calmar bestias hostiles',
      ],
    },
  },
  {
    category: 'keys',
    name: 'Instrumentos de Tecla',
    description: 'Pianos, órganos, clavicordios',
    magicalAssociation:
      'Armonía compleja, transformación, poder arcano, estructura',
    preferredSchools: ['Transmutación', 'Resonancia', 'Evocación'],
    bonusEffects: {
      excellent: [
        'Los hechizos de transformación son más estables (+2 DC para disiparlos)',
      ],
      masterful: [
        'Los hechizos de transformación pueden tener efectos duales',
        'Creas patrones de resonancia que pueden afectar objetos mágicos',
      ],
    },
  },
]

// Enhanced genre properties with spell modifiers
export const MAGICAL_GENRE_PROPERTIES: GenreMagicalProperties[] = [
  {
    genre: 'ballad',
    name: 'Balada',
    description: 'Música suave y melódica',
    effects: 'Sanación, paz, protección, emociones positivas',
    spellModifiers: {
      healingMultiplier: 1.2,
      durationMultiplier: 1.1,
      dcModifier: -1,
      additionalEffects: ['Calma emociones menores', 'Reduce el estrés'],
    },
    compatibleInstruments: ['strings', 'wind', 'keys'],
  },
  {
    genre: 'march',
    name: 'Marcha',
    description: 'Ritmo fuerte y constante',
    effects: 'Mejoras, movimiento, valor, liderazgo',
    spellModifiers: {
      durationMultiplier: 1.3,
      dcModifier: 1,
      additionalEffects: [
        'Aumenta velocidad de movimiento',
        'Mejora la moral del grupo',
      ],
    },
    compatibleInstruments: ['percussion', 'wind'],
  },
  {
    genre: 'lament',
    name: 'Lamento',
    description: 'Música triste y melancólica',
    effects: 'Debilitamiento, miedo, tristeza, maldiciones',
    spellModifiers: {
      damageMultiplier: 1.15,
      dcModifier: 2,
      additionalEffects: [
        'Causa melancolía menor',
        'Reduce la resistencia a efectos mentales',
      ],
    },
    compatibleInstruments: ['strings', 'wind'],
  },
  {
    genre: 'battle',
    name: 'Batalla',
    description: 'Música agresiva y poderosa',
    effects: 'Combate, destrucción, furia, poder',
    spellModifiers: {
      damageMultiplier: 1.25,
      dcModifier: 1,
      additionalEffects: [
        'Inspira furia de combate',
        'Aumenta la potencia de los ataques',
      ],
    },
    compatibleInstruments: ['percussion', 'wind'],
  },
  {
    genre: 'ritual',
    name: 'Ritual',
    description: 'Música ceremonial y mística',
    effects: 'Invocación, transformación, adivinación, magia compleja',
    spellModifiers: {
      durationMultiplier: 1.5,
      dcModifier: 3,
      rangeMultiplier: 1.2,
      additionalEffects: [
        'Amplifica otros efectos mágicos',
        'Facilita la comunicación con otros planos',
      ],
    },
    compatibleInstruments: ['keys', 'strings', 'wind', 'percussion'],
  },
  {
    genre: 'folk',
    name: 'Popular',
    description: 'Música tradicional y sencilla',
    effects: 'Utilidad cotidiana, efectos simples, comunidad',
    spellModifiers: {
      dcModifier: -2,
      additionalEffects: [
        'Facilita la interacción social',
        'Efectos más predecibles',
      ],
    },
    compatibleInstruments: ['strings', 'wind'],
  },
]

export function calculateSpellEffectModifiers(
  spell: Spell,
  quality: PerformanceQuality,
  instrumentCategory: InstrumentCategory,
  genre: MusicGenre
): SpellEffectModifier {
  const baseModifiers: SpellEffectModifier = {
    damageMultiplier: 1,
    healingMultiplier: 1,
    durationMultiplier: 1,
    dcModifier: 0,
    rangeMultiplier: 1,
    additionalEffects: [],
  }

  // Apply quality modifiers
  const qualityModifiers = getQualityModifiers(quality)

  // Apply genre modifiers
  const genreProperties = MAGICAL_GENRE_PROPERTIES.find(g => g.genre === genre)
  const genreModifiers = genreProperties?.spellModifiers || {}

  // Apply instrument modifiers
  const instrumentProperties = MAGICAL_INSTRUMENT_PROPERTIES.find(
    i => i.category === instrumentCategory
  )
  const instrumentEffects = instrumentProperties?.bonusEffects[quality] || []

  // Combine all modifiers
  return {
    damageMultiplier:
      baseModifiers.damageMultiplier *
      qualityModifiers.damageMultiplier *
      (genreModifiers.damageMultiplier || 1),

    healingMultiplier:
      baseModifiers.healingMultiplier *
      qualityModifiers.healingMultiplier *
      (genreModifiers.healingMultiplier || 1),

    durationMultiplier:
      baseModifiers.durationMultiplier *
      qualityModifiers.durationMultiplier *
      (genreModifiers.durationMultiplier || 1),

    dcModifier:
      baseModifiers.dcModifier +
      qualityModifiers.dcModifier +
      (genreModifiers.dcModifier || 0),

    rangeMultiplier:
      baseModifiers.rangeMultiplier *
      qualityModifiers.rangeMultiplier *
      (genreModifiers.rangeMultiplier || 1),

    additionalEffects: [
      ...baseModifiers.additionalEffects,
      ...qualityModifiers.additionalEffects,
      ...(genreModifiers.additionalEffects || []),
      ...instrumentEffects,
    ],
  }
}

function getQualityModifiers(quality: PerformanceQuality): SpellEffectModifier {
  switch (quality) {
    case 'poor':
      return {
        damageMultiplier: 0.5,
        healingMultiplier: 0.5,
        durationMultiplier: 0.5,
        dcModifier: -3,
        rangeMultiplier: 0.5,
        additionalEffects: [
          'Posibles efectos negativos',
          'Inestabilidad mágica',
        ],
      }

    case 'adequate':
      return {
        damageMultiplier: 0.8,
        healingMultiplier: 0.8,
        durationMultiplier: 0.8,
        dcModifier: -1,
        rangeMultiplier: 0.9,
        additionalEffects: [],
      }

    case 'good':
      return {
        damageMultiplier: 1,
        healingMultiplier: 1,
        durationMultiplier: 1,
        dcModifier: 0,
        rangeMultiplier: 1,
        additionalEffects: [],
      }

    case 'excellent':
      return {
        damageMultiplier: 1.25,
        healingMultiplier: 1.25,
        durationMultiplier: 1.5,
        dcModifier: 1,
        rangeMultiplier: 1.2,
        additionalEffects: ['Efecto mejorado', 'Mayor estabilidad'],
      }

    case 'masterful':
      return {
        damageMultiplier: 1.5,
        healingMultiplier: 1.5,
        durationMultiplier: 2,
        dcModifier: 2,
        rangeMultiplier: 1.5,
        additionalEffects: [
          'Efecto máximo',
          'Posibles efectos adicionales',
          'Resonancia mágica',
        ],
      }
  }
}

export function getInstrumentGenreCompatibility(
  instrument: InstrumentCategory,
  genre: MusicGenre
): 'perfect' | 'good' | 'adequate' | 'poor' {
  const genreProperties = MAGICAL_GENRE_PROPERTIES.find(g => g.genre === genre)

  if (!genreProperties) return 'adequate'

  if (genreProperties.compatibleInstruments.includes(instrument)) {
    // Check for perfect matches based on thematic synergy
    const perfectMatches: Array<[InstrumentCategory, MusicGenre]> = [
      ['strings', 'ballad'],
      ['percussion', 'march'],
      ['strings', 'lament'],
      ['percussion', 'battle'],
      ['keys', 'ritual'],
      ['strings', 'folk'],
    ]

    if (perfectMatches.some(([i, g]) => i === instrument && g === genre)) {
      return 'perfect'
    }

    return 'good'
  }

  return 'poor'
}

export function generateSpellEffectDescription(
  spell: Spell,
  quality: PerformanceQuality,
  modifiers: SpellEffectModifier
): string {
  const baseEffect = spell.description
  const qualityName = quality.charAt(0).toUpperCase() + quality.slice(1)

  let description = `**Interpretación ${qualityName}:**\n\n`

  // Add base effect
  description += baseEffect + '\n\n'

  // Add modifiers
  if (modifiers.damageMultiplier !== 1) {
    const percentage = Math.round((modifiers.damageMultiplier - 1) * 100)
    description += `• Daño ${percentage > 0 ? 'aumentado' : 'reducido'} en ${Math.abs(percentage)}%\n`
  }

  if (modifiers.healingMultiplier !== 1) {
    const percentage = Math.round((modifiers.healingMultiplier - 1) * 100)
    description += `• Sanación ${percentage > 0 ? 'aumentada' : 'reducida'} en ${Math.abs(percentage)}%\n`
  }

  if (modifiers.durationMultiplier !== 1) {
    const percentage = Math.round((modifiers.durationMultiplier - 1) * 100)
    description += `• Duración ${percentage > 0 ? 'aumentada' : 'reducida'} en ${Math.abs(percentage)}%\n`
  }

  if (modifiers.dcModifier !== 0) {
    description += `• DC de salvación ${modifiers.dcModifier > 0 ? 'increased by' : 'decreased by'} ${Math.abs(modifiers.dcModifier)}\n`
  }

  if (modifiers.rangeMultiplier !== 1) {
    const percentage = Math.round((modifiers.rangeMultiplier - 1) * 100)
    description += `• Alcance ${percentage > 0 ? 'aumentado' : 'reducido'} en ${Math.abs(percentage)}%\n`
  }

  // Add additional effects
  if (modifiers.additionalEffects.length > 0) {
    description += '\n**Efectos Adicionales:**\n'
    modifiers.additionalEffects.forEach(effect => {
      description += `• ${effect}\n`
    })
  }

  return description.trim()
}
