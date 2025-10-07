import { type Song } from '@/types/song'

export const SAMPLE_MUSIC_SONGS: Omit<
  Song,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: 'Melodía Curativa',
    level: 1,
    school: 'Harmonía',
    castingTime: '1 acción',
    range: '30 pies',
    duration: 'Instantáneo',
    components: {
      verbal: false,
      somatic: true,
      material: false,
    },
    description:
      'Tocas una suave melodía que restaura la vitalidad de tus aliados. Todas las criaturas amigas en un radio de 30 pies recuperan 1d4 + tu modificador de Carisma puntos de vida.',
    higherLevels:
      'Cuando lanzas esta canción usando un espacio de hechizo de nivel 2 o superior, la curación aumenta en 1d4 por cada nivel por encima del 1.',
    classes: ['Bardo'],
    ritual: false,
    concentration: false,
    tags: ['sanación', 'música'],
    isMusicBased: true,
    musicalComponents: {
      instrument: 'strings',
      genre: 'ballad',
      difficulty: 12,
      duration: 2,
      requiredProficiency: false,
      additionalInstruments: [],
    },
    performanceEffects: {
      poor: 'La canción falla. El intérprete sufre 1d4 de daño psíquico por la disonancia.',
      adequate: 'Las criaturas amigas recuperan 1d4 puntos de vida.',
      good: 'Las criaturas amigas recuperan 1d4 + modificador de Carisma puntos de vida.',
      excellent:
        'Las criaturas amigas recuperan 1d4 + modificador de Carisma puntos de vida y obtienen ventaja en su próxima tirada de salvación.',
      masterful:
        'Las criaturas amigas recuperan el máximo (4 + modificador de Carisma) puntos de vida, obtienen ventaja en su próxima tirada de salvación y son inmunes al miedo durante 1 minuto.',
    },
    songProperties: [],
    loreIds: [],
  },
  {
    name: 'Rugido de Guerra',
    level: 2,
    school: 'Disonancia',
    castingTime: '1 acción',
    range: '60 pies',
    duration: 'Concentración, hasta 1 minuto',
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    description:
      'Emites un rugido musical discordante que infunde terror en tus enemigos. Todas las criaturas hostiles en un cono de 60 pies deben realizar una tirada de salvación de Sabiduría o quedan asustadas durante la duración.',
    higherLevels:
      'Cuando lanzas esta canción usando un espacio de hechizo de nivel 3 o superior, el cono se extiende 15 pies adicionales por cada nivel por encima del 2.',
    classes: ['Bardo'],
    ritual: false,
    concentration: true,
    tags: ['miedo', 'combate', 'música'],
    isMusicBased: true,
    musicalComponents: {
      instrument: 'percussion',
      genre: 'battle',
      difficulty: 15,
      duration: 1,
      requiredProficiency: true,
      additionalInstruments: [],
    },
    performanceEffects: {
      poor: 'El rugido se vuelve contra ti. Debes realizar una tirada de salvación de Sabiduría o quedar asustado de ti mismo durante 1 ronda.',
      adequate:
        'Los enemigos en el cono deben realizar tiradas de salvación de Sabiduría (DC 12) o quedar asustados durante 1 minuto.',
      good: 'Los enemigos en el cono deben realizar tiradas de salvación de Sabiduría (DC 13) o quedar asustados durante 1 minuto.',
      excellent:
        'Los enemigos en el cono deben realizar tiradas de salvación de Sabiduría (DC 14) o quedar asustados durante 1 minuto. Los asustados tienen desventaja en tiradas de ataque.',
      masterful:
        'Los enemigos en el cono deben realizar tiradas de salvación de Sabiduría (DC 15) o quedar asustados durante 1 minuto. Los asustados tienen desventaja en tiradas de ataque y no pueden acercarse voluntariamente a ti.',
    },
    songProperties: [],
    loreIds: [],
  },
  {
    name: 'Sinfonía de Transformación',
    level: 4,
    school: 'Resonancia',
    castingTime: '1 minuto',
    range: 'Toque',
    duration: '1 hora',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Un diapasón de oro valorado en al menos 100 po',
    },
    description:
      'Mediante una compleja sinfonía, alteras la estructura molecular de un objeto no mágico que no sea más grande que un cubo de 3 pies. Puedes cambiar su forma, material o propiedades básicas.',
    higherLevels:
      'Cuando lanzas esta canción usando un espacio de hechizo de nivel 5 o superior, el tamaño máximo del objeto aumenta en un cubo de 1 pie por cada nivel por encima del 4.',
    classes: ['Bardo'],
    ritual: true,
    concentration: false,
    tags: ['transformación', 'ritual', 'música'],
    isMusicBased: true,
    musicalComponents: {
      instrument: 'keys',
      genre: 'ritual',
      difficulty: 18,
      duration: 5,
      requiredProficiency: true,
      additionalInstruments: ['strings', 'wind'],
    },
    performanceEffects: {
      poor: 'La transformación falla espectacularmente. El objeto explota causando 2d6 de daño de fuerza en un radio de 10 pies.',
      adequate:
        'La transformación es imperfecta. El objeto cambia pero mantiene algunas de sus propiedades originales.',
      good: 'La transformación funciona según lo previsto.',
      excellent:
        'La transformación es perfecta y el objeto obtiene una propiedad menor beneficiosa adicional.',
      masterful:
        'La transformación es perfecta, el objeto obtiene propiedades beneficiosas adicionales y la duración se duplica.',
    },
    songProperties: [],
    loreIds: [],
  },
  {
    name: 'Canción del Viento Susurrante',
    level: 1,
    school: 'Melodía',
    castingTime: '1 acción',
    range: '120 pies',
    duration: '10 minutos',
    components: {
      verbal: true,
      somatic: false,
      material: false,
    },
    description:
      'Tarareas una melodía etérea que permite que el viento lleve tus palabras. Puedes comunicarte telepáticamente con una criatura que puedas ver dentro del alcance.',
    classes: ['Bardo'],
    ritual: false,
    concentration: true,
    tags: ['comunicación', 'utilidad', 'música'],
    isMusicBased: true,
    musicalComponents: {
      instrument: 'wind',
      genre: 'folk',
      difficulty: 10,
      duration: 1,
      requiredProficiency: false,
      additionalInstruments: [],
    },
    performanceEffects: {
      poor: 'La comunicación falla y produces un ruido molesto. Todas las criaturas en 30 pies deben realizar tiradas de salvación de Constitución o quedar ensordecidas durante 1 ronda.',
      adequate:
        'Puedes comunicarte telepáticamente con una criatura durante 10 minutos.',
      good: 'Puedes comunicarte telepáticamente con una criatura durante 10 minutos. La criatura puede responderte.',
      excellent:
        'Puedes comunicarte telepáticamente con hasta 3 criaturas durante 10 minutos. Todas pueden responder.',
      masterful:
        'Puedes comunicarte telepáticamente con hasta 5 criaturas durante 10 minutos. Todas pueden responder y comunicarse entre sí a través de ti.',
    },
    songProperties: [],
    loreIds: [],
  },
  {
    name: 'Marcha del Valor Inquebrantable',
    level: 3,
    school: 'Harmonía',
    castingTime: '1 acción',
    range: '30 pies',
    duration: 'Concentración, hasta 10 minutos',
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    description:
      'Tocas una marcha inspiradora que infunde valor y determinación en tus aliados. Hasta 6 criaturas amigas en el alcance obtienen ventaja en tiradas de salvación contra el miedo y +2 a las tiradas de ataque.',
    higherLevels:
      'Cuando lanzas esta canción usando un espacio de hechizo de nivel 4 o superior, puedes afectar 2 criaturas adicionales por cada nivel por encima del 3.',
    classes: ['Bardo'],
    ritual: false,
    concentration: true,
    tags: ['mejora', 'valor', 'música'],
    isMusicBased: true,
    musicalComponents: {
      instrument: 'percussion',
      genre: 'march',
      difficulty: 14,
      duration: 3,
      requiredProficiency: false,
      additionalInstruments: ['wind'],
    },
    performanceEffects: {
      poor: 'La marcha se vuelve discordante. Todos los aliados en el alcance sufren desventaja en su próxima tirada de ataque.',
      adequate:
        'Los aliados obtienen ventaja en tiradas de salvación contra el miedo durante 10 minutos.',
      good: 'Los aliados obtienen ventaja en tiradas de salvación contra el miedo y +1 a las tiradas de ataque durante 10 minutos.',
      excellent:
        'Los aliados obtienen ventaja en tiradas de salvación contra el miedo y +2 a las tiradas de ataque durante 10 minutos.',
      masterful:
        'Los aliados obtienen ventaja en tiradas de salvación contra el miedo, +2 a las tiradas de ataque, y velocidad de movimiento +10 pies durante 10 minutos.',
    },
    songProperties: [],
    loreIds: [],
  },
  {
    name: 'Lamento de las Almas Perdidas',
    level: 5,
    school: 'Disonancia',
    castingTime: '1 acción',
    range: '60 pies',
    duration: 'Concentración, hasta 1 minuto',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'Un fragmento de hueso de una criatura que murió de tristeza',
    },
    description:
      'Entonas un lamento que resuena con las almas perdidas. Todas las criaturas en un radio de 60 pies deben realizar una tirada de salvación de Sabiduría. Las que fallan sufren 4d8 de daño psíquico y quedan hechizadas. Mientras estén hechizadas, se mueven a la mitad de velocidad y tienen desventaja en todas las tiradas.',
    higherLevels:
      'Cuando lanzas esta canción usando un espacio de hechizo de nivel 6 o superior, el daño aumenta en 1d8 por cada nivel por encima del 5.',
    classes: ['Bardo'],
    ritual: false,
    concentration: true,
    tags: ['debilitación', 'psíquico', 'música'],
    isMusicBased: true,
    musicalComponents: {
      instrument: 'strings',
      genre: 'lament',
      difficulty: 20,
      duration: 4,
      requiredProficiency: true,
      additionalInstruments: [],
    },
    performanceEffects: {
      poor: 'El lamento te consume. Sufres el efecto completo de la canción.',
      adequate:
        'Los enemigos deben realizar tiradas de salvación de Sabiduría (DC 15) o sufrir 3d8 de daño psíquico.',
      good: 'Los enemigos deben realizar tiradas de salvación de Sabiduría (DC 16) o sufrir 4d8 de daño psíquico y quedar hechizados.',
      excellent:
        'Los enemigos deben realizar tiradas de salvación de Sabiduría (DC 17) o sufrir 4d8 de daño psíquico y quedar hechizados. Los aliados son inmunes al efecto.',
      masterful:
        'Los enemigos deben realizar tiradas de salvación de Sabiduría (DC 18) o sufrir 5d8 de daño psíquico y quedar hechizados. Los aliados obtienen resistencia al daño psíquico durante 1 hora.',
    },
    songProperties: [],
    loreIds: [],
  },
]

export function getSampleSongsWithIds(): Song[] {
  return SAMPLE_MUSIC_SONGS.map(song => ({
    ...song,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}
