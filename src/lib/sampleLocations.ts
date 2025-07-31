import type {
  AnyLocation,
  Plane,
  Continent,
  Region,
  Location,
} from '@/types/location'

// Generate comprehensive Spanish location template data
export function generateSpanishLocationTemplate(): AnyLocation[] {
  const locations: AnyLocation[] = []

  // PLANE: Plano Material
  const materialPlane: Plane = {
    id: 'plane-material',
    name: 'Plano Material',
    description:
      'El mundo físico donde transcurren la mayoría de aventuras. Un plano de equilibrio entre fuerzas mágicas y naturales, habitado por mortales y criaturas fantásticas.',
    type: 'plane',
    planeType: 'material',
    alignment: 'true-neutral',
    tags: ['principal', 'equilibrado', 'diverso'],
    inhabitants: [
      'Humanos',
      'Elfos',
      'Enanos',
      'Halflings',
      'Orcos',
      'Dragones',
    ],
    dominantForces: [
      'Magia Arcana',
      'Fuerzas Naturales',
      'Divinidades Menores',
    ],
    notes:
      'El plano principal donde se desarrollan las campañas estándar de D&D.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(materialPlane)

  // CONTINENT: Aethermoor
  const aethermoor: Continent = {
    id: 'continent-aethermoor',
    name: 'Aethermoor',
    description:
      'Un vasto continente de tierras diversas, desde las heladas montañas del norte hasta los desiertos ardientes del sur. Hogar de grandes reinos y territorios inexplorados.',
    type: 'continent',
    parentId: 'plane-material',
    climate: 'temperate',
    terrain: ['Montañas', 'Bosques', 'Llanuras', 'Costas', 'Desiertos'],
    majorFeatures: [
      'Cordillera de los Picos Etéreos',
      'Gran Bosque de Luminar',
      'Desierto de las Arenas Susurrantes',
    ],
    dominantRaces: ['Humanos', 'Elfos', 'Enanos', 'Halflings'],
    tags: ['continente principal', 'diverso', 'civilizado'],
    notes: 'El continente más poblado y civilizado del plano material.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(aethermoor)

  // REGIONS IN AETHERMOOR

  // Region 1: Reino de Valdris
  const valdris: Region = {
    id: 'region-valdris',
    name: 'Reino de Valdris',
    description:
      'Un próspero reino humano conocido por su comercio floreciente, academias de magia y caballeros honorables. Sus tierras fértiles y ubicación estratégica lo han convertido en el centro político del continente.',
    type: 'region',
    parentId: 'continent-aethermoor',
    regionType: 'kingdom',
    government: 'Monarquía Constitucional',
    ruler: 'Rey Aldric Valdris III',
    population: 2500000,
    majorSettlements: [
      'Ciudad de Aurelia (capital)',
      'Puerto Dorado',
      'Villa Esperanza',
    ],
    dangerLevel: 2,
    tags: ['reino', 'próspero', 'comercial', 'civilizado'],
    notes:
      'Reino estable con fuerte economía y buenas relaciones diplomáticas.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(valdris)

  // Region 2: Tierras Salvajes de Fenwick
  const fenwick: Region = {
    id: 'region-fenwick',
    name: 'Tierras Salvajes de Fenwick',
    description:
      'Vastos bosques inexplorados habitados por druidas, bestias mágicas y tribus bárbaras. Un territorio peligroso pero rico en recursos naturales y secretos ancestrales.',
    type: 'region',
    parentId: 'continent-aethermoor',
    regionType: 'wilderness',
    government: 'Círculos Druídicos y Clanes Tribales',
    ruler: 'Consejo de Ancianos del Bosque',
    population: 150000,
    majorSettlements: ['Refugio de Corteza Verde', 'Campamento Lobo Gris'],
    dangerLevel: 4,
    tags: ['salvaje', 'bosques', 'druidas', 'peligroso'],
    notes: 'Territorio no reclamado con presencia mágica fuerte.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(fenwick)

  // Region 3: Ducado de Montepiedra
  const montepiedra: Region = {
    id: 'region-montepiedra',
    name: 'Ducado de Montepiedra',
    description:
      'Un territorio montañoso gobernado por enanos y conocido por sus minas profundas, forjas legendarias y fortalezas inexpugnables talladas en la roca viva.',
    type: 'region',
    parentId: 'continent-aethermoor',
    regionType: 'duchy',
    government: 'Ducado Hereditario',
    ruler: 'Duquesa Morgana Barbaferro',
    population: 800000,
    majorSettlements: ['Fortaleza Yunque de Hierro', 'Minas de Gema Azul'],
    dangerLevel: 3,
    tags: ['montañas', 'enanos', 'minería', 'fortalezas'],
    notes:
      'Aliado tradicional del Reino de Valdris, fuente principal de metales y armas.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(montepiedra)

  // Region 4: Las Tierras Baldías
  const tierrasBaldias: Region = {
    id: 'region-tierras-baldias',
    name: 'Las Tierras Baldías',
    description:
      'Una extensión desolada marcada por una antigua guerra mágica. El terreno está corrompido por energías residuales, habitado por no-muertos y criaturas aberrantes.',
    type: 'region',
    parentId: 'continent-aethermoor',
    regionType: 'wasteland',
    government: 'Tierra de Nadie',
    ruler: 'Ninguno (Varios Señores de Guerra)',
    population: 50000,
    majorSettlements: ['Fortin Última Esperanza', 'Ruinas de Nethermoor'],
    dangerLevel: 5,
    tags: ['baldío', 'corrompido', 'peligroso', 'no-muertos'],
    notes: 'Zona de cuarentena establecida por los reinos vecinos.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(tierrasBaldias)

  // LOCATIONS IN VALDRIS

  // Capital City: Aurelia
  const aurelia: Location = {
    id: 'location-aurelia',
    name: 'Aurelia',
    description:
      'La magnífica capital del Reino de Valdris, una metrópolis bulliciosa con torres que se alzan hacia las nubes, mercados vibrantes, y la sede del poder real. Sus muros blancos brillan con encantamientos protectores.',
    type: 'location',
    parentId: 'region-valdris',
    locationType: 'city',
    population: 450000,
    government: 'Consejo Municipal bajo autoridad real',
    economy: ['Comercio', 'Artesanía', 'Servicios Mágicos', 'Administración'],
    defenses:
      'Murallas encantadas, Guardia Real (2000 soldados), Torres de vigilancia mágica',
    keyNPCs: [
      {
        name: 'Rey Aldric Valdris III',
        role: 'Monarca',
        description: 'Líder sabio y justo de 52 años',
      },
      {
        name: 'Archimago Lysander',
        role: 'Consejero Mágico',
        description: 'Elfo anciano experto en adivinación',
      },
      {
        name: 'Capitán Marcus Fortaleza',
        role: 'Comandante de la Guardia',
        description: 'Veterano paladin de Helm',
      },
      {
        name: 'Maestra Eldara',
        role: 'Directora de la Academia',
        description: 'Académica especialista en historia antigua',
      },
    ],
    services: [
      'Academia de Magia',
      'Templos Mayores',
      'Gremios de Artesanos',
      'Biblioteca Real',
      'Hospital',
    ],
    rumors: [
      'Se dice que hay túneles secretos bajo el palacio real',
      'Algunos mercaderes hablan de un gremio de ladrones muy organizado',
      'Se rumorea que la biblioteca guarda libros prohibidos de nigromancia',
    ],
    secrets: [
      'El rey sufre de una maldición que lo está envejeciendo prematuramente',
      'Existe un culto secreto a Cyric operando en los barrios bajos',
      'Los túneles bajo la ciudad conectan con antiguas ruinas élfico',
    ],
    tags: ['capital', 'ciudad', 'comercio', 'magia', 'política'],
    notes:
      'Centro político y cultural del reino. Lugar ideal para aventuras urbanas.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(aurelia)

  // Trading Port: Puerto Dorado
  const puertoDorado: Location = {
    id: 'location-puerto-dorado',
    name: 'Puerto Dorado',
    description:
      'Un bullicioso puerto comercial donde convergen rutas marítimas de todo el mundo conocido. Sus muelles nunca descansan y sus tabernas están llenas de marineros con historias fantásticas.',
    type: 'location',
    parentId: 'region-valdris',
    locationType: 'city',
    population: 180000,
    government: 'Consejo de Capitanes y Gremio de Comerciantes',
    economy: [
      'Comercio Marítimo',
      'Pesca',
      'Construcción Naval',
      'Contrabando',
    ],
    defenses:
      'Flota naval, Fortaleza costera, Milicia portuaria (800 guardias)',
    keyNPCs: [
      {
        name: 'Capitana Veridiana Marea',
        role: 'Maestra del Puerto',
        description: 'Ex-pirata convertida en administradora',
      },
      {
        name: 'Gormon Barbasal',
        role: 'Líder del Gremio',
        description: 'Enano comerciante muy influyente',
      },
      {
        name: 'Sussurro',
        role: 'Maestro de Información',
        description: 'Halfling que sabe todos los secretos del puerto',
      },
    ],
    services: [
      'Astilleros',
      'Casas de Cambio',
      'Almacenes',
      'Tabernas Internacionales',
    ],
    rumors: [
      'Llegó un barco fantasma la semana pasada y nadie habla de lo que transportaba',
      'Hay piratas organizando ataques desde una isla secreta',
      'Un mercader está buscando aventureros para una expedición peligrosa',
    ],
    secrets: [
      'Existe una red de contrabando que incluye a miembros del gobierno',
      'Hay sirenas aliadas que protegen el puerto a cambio de tributos',
      'Los sótanos del puerto conectan con cavernas submarinas',
    ],
    tags: ['puerto', 'comercio', 'marinero', 'diverso', 'aventura'],
    notes: 'Punto de partida ideal para aventuras marítimas y comerciales.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(puertoDorado)

  // Small town: Villa Esperanza
  const villaEsperanza: Location = {
    id: 'location-villa-esperanza',
    name: 'Villa Esperanza',
    description:
      'Un pintoresco pueblo agrícola conocido por sus campos de trigo dorado y sus festivales estacionales. Sus habitantes son hospitalarios pero desconfían de los extraños tras recientes problemas con bandidos.',
    type: 'location',
    parentId: 'region-valdris',
    locationType: 'town',
    population: 3500,
    government: 'Alcalde elegido y Consejo de Ancianos',
    economy: ['Agricultura', 'Ganadería', 'Artesanía Local', 'Comercio Menor'],
    defenses: 'Milicia local (50 voluntarios), Empalizada de madera',
    keyNPCs: [
      {
        name: 'Alcalde Tobias Campoalegre',
        role: 'Líder del pueblo',
        description: 'Halfling amable pero preocupado por la seguridad',
      },
      {
        name: 'Hermana Miriam',
        role: 'Sacerdotisa de Chauntea',
        description: 'Humana que bendice las cosechas',
      },
      {
        name: 'Gareth el Herrero',
        role: 'Artesano',
        description: 'Humano que repara herramientas y hace herraduras',
      },
    ],
    services: [
      'Templo de Chauntea',
      'Posada del Grano Dorado',
      'Herrería',
      'Mercado Semanal',
    ],
    rumors: [
      'Han visto luces extrañas en el bosque cercano por las noches',
      'Algunos animales del pueblo están actuando de forma extraña',
      'Un granjero encontró runas misteriosas en su campo',
    ],
    secrets: [
      'Hay un círculo druídico secreto que protege las cosechas',
      'Existe un túnel oculto que conecta con una red de cuevas',
      'El alcalde esconde un pasado como aventurero',
    ],
    tags: ['pueblo', 'agrícola', 'pacífico', 'rural', 'misterioso'],
    notes: 'Pueblo inicial perfecto para aventureros novatos.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(villaEsperanza)

  // LOCATIONS IN FENWICK (Wilderness)

  // Druid Sanctuary
  const refugioCortezaVerde: Location = {
    id: 'location-refugio-corteza-verde',
    name: 'Refugio de Corteza Verde',
    description:
      'Un santuario druídico construido en armonía con los árboles ancestrales. Sus estructuras parecen haber crecido naturalmente del bosque mismo, y está protegido por magia natural antigua.',
    type: 'location',
    parentId: 'region-fenwick',
    locationType: 'temple',
    population: 200,
    government: 'Círculo de Druidas Ancianos',
    economy: ['Herboristería', 'Guía de Cazadores', 'Rituales de Bendición'],
    defenses: 'Animales guardianes, Trampas naturales, Magia druídica',
    keyNPCs: [
      {
        name: 'Archidruida Sylvanus Ramavieja',
        role: 'Líder espiritual',
        description: 'Elfo de más de 500 años que habla con los árboles',
      },
      {
        name: 'Cazadora Luna',
        role: 'Guardabosques',
        description: 'Medio-elfa experta en rastreo y supervivencia',
      },
      {
        name: 'Espíritu del Roble',
        role: 'Guardián',
        description: 'Dríade ancestral que protege el bosque',
      },
    ],
    services: [
      'Sanación Natural',
      'Identificación de Plantas',
      'Rituales de Comunión',
    ],
    rumors: [
      'Los árboles antiguos susurran secretos a quienes saben escuchar',
      'Hay bestias mágicas que solo aparecen durante la luna llena',
      'Existe un portal a la Corte Feérica oculto en el bosque',
    ],
    secrets: [
      'Los druidas custodian un artefacto natural de gran poder',
      'Hay un pacto ancestral con los señores feéricos',
      'El bosque está conectado mágicamente con otros bosques sagrados',
    ],
    tags: ['druida', 'santuario', 'naturaleza', 'mágico', 'oculto'],
    notes: 'Centro de poder druídico y puerta a aventuras en la naturaleza.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(refugioCortezaVerde)

  // LOCATIONS IN MONTEPIEDRA (Dwarf Territory)

  // Dwarven Fortress
  const fortalezaYunqueHierro: Location = {
    id: 'location-fortaleza-yunque-hierro',
    name: 'Fortaleza Yunque de Hierro',
    description:
      'Una imponente ciudadela enana tallada directamente en la montaña. Sus pasillos resuenan con el martilleo constante de forjas y el eco de cánticos enanos. Sus defensas son legendarias.',
    type: 'location',
    parentId: 'region-montepiedra',
    locationType: 'fortress',
    population: 25000,
    government: 'Consejo de Clanes bajo la Duquesa',
    economy: ['Minería', 'Herrería Avanzada', 'Joyería', 'Ingeniería'],
    defenses:
      'Muros de piedra reforzada, Trampas mecánicas, Guardia de Élite (1500 guerreros)',
    keyNPCs: [
      {
        name: 'Duquesa Morgana Barbaferro',
        role: 'Gobernante',
        description: 'Enana noble con martillo de guerra +2',
      },
      {
        name: 'Maestro Forjador Thorin',
        role: 'Artesano Legendario',
        description: 'Crea armas y armaduras mágicas',
      },
      {
        name: 'General Kazak Puñoferro',
        role: 'Comandante Militar',
        description: 'Veterano de cien batallas',
      },
    ],
    services: [
      'Forjas Maestras',
      'Banco de Montepiedra',
      'Armería',
      'Talleres de Ingeniería',
    ],
    rumors: [
      'Se están excavando túneles que han despertado algo antiguo',
      'Hay una cámara secreta con tesoros de los antiguos reyes enanos',
      'Los mineros hablan de gemas que brillan con luz propia',
    ],
    secrets: [
      'Existe una forja ancestral que puede crear artefactos legendarios',
      'Hay túneles que conectan con el Underdark',
      'La montaña alberga un dragón antiguo dormido',
    ],
    tags: ['enanos', 'fortaleza', 'minería', 'artesanía', 'montaña'],
    notes: 'Centro de poder enano y fuente de equipamiento superior.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(fortalezaYunqueHierro)

  // LOCATIONS IN TIERRAS BALDÍAS (Wasteland)

  // Fortified Outpost
  const fortinUltimaEsperanza: Location = {
    id: 'location-fortin-ultima-esperanza',
    name: 'Fortín Última Esperanza',
    description:
      'El último puesto avanzado antes de adentrarse en las tierras malditas. Sus muros están marcados por batallas contra no-muertos y aberraciones. Es refugio para exploradores valientes y desesperados.',
    type: 'location',
    parentId: 'region-tierras-baldias',
    locationType: 'fortress',
    population: 800,
    government: 'Comandancia Militar',
    economy: [
      'Suministros de Supervivencia',
      'Guías del Páramo',
      'Mercenarios',
    ],
    defenses: 'Muros consagrados, Paladines, Clérigos, Ballestas mágicas',
    keyNPCs: [
      {
        name: 'Comandante Sarah Luzverde',
        role: 'Líder Militar',
        description: 'Paladín veterana con cicatrices de no-muertos',
      },
      {
        name: 'Padre Benedictus',
        role: 'Clérigo Sanador',
        description: 'Sacerdote de Lathander que mantiene la esperanza viva',
      },
      {
        name: 'Explorador Sombra',
        role: 'Guía del Páramo',
        description: 'Ranger misterioso que conoce los caminos seguros',
      },
    ],
    services: [
      'Santuario Consagrado',
      'Suministros Básicos',
      'Información de Rutas',
    ],
    rumors: [
      'Han llegado refugiados hablando de una ciudad fantasma que aparece y desaparece',
      'Algo grande se mueve en las profundidades de las ruinas de Nethermoor',
      'Se necesitan aventureros valientes para una misión de rescate',
    ],
    secrets: [
      'Hay túneles seguros bajo el fortín que evitan las zonas malditas',
      'El comandante busca desesperadamente una cura para la maldición',
      'Existe un artefacto sagrado oculto que podría purificar la región',
    ],
    tags: ['fortín', 'frontera', 'peligroso', 'militar', 'supervivencia'],
    notes: 'Base de operaciones para aventuras en territorio hostil.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(fortinUltimaEsperanza)

  // Ruined City
  const ruinasNethermoor: Location = {
    id: 'location-ruinas-nethermoor',
    name: 'Ruinas de Nethermoor',
    description:
      'Los restos espectrales de lo que una vez fue una gran ciudad mágica. Sus torres retorcidas y calles fantasmales están impregnadas de magia corrupta y habitadas por no-muertos y aberraciones.',
    type: 'location',
    parentId: 'region-tierras-baldias',
    locationType: 'ruins',
    population: 0,
    government: 'Sin gobierno (Territorio hostil)',
    economy: ['Ninguna (Solo saqueo y exploración)'],
    defenses: 'Ninguna (Peligros naturales y criaturas hostiles)',
    keyNPCs: [
      {
        name: 'El Lich de Nethermoor',
        role: 'Señor No-muerto',
        description: 'Antiguo archimago convertido en lich',
      },
      {
        name: 'Espíritus Atormentados',
        role: 'Habitantes Espectrales',
        description: 'Almas de los antiguos ciudadanos',
      },
      {
        name: 'Aberración Mutante',
        role: 'Bestia Corrupta',
        description: 'Criatura deformada por magia caótica',
      },
    ],
    services: ['Ninguno (Solo peligros)'],
    rumors: [
      'El tesoro de la antigua biblioteca mágica sigue intacto en algún lugar',
      'Hay un portal inestable que lleva a otros planos',
      'Solo en ciertas noches se puede escuchar el eco de la ciudad viva',
    ],
    secrets: [
      'La clave para revertir la maldición está oculta en la torre central',
      'Existe un sanctum temporal donde el tiempo se detuvo durante la catástrofe',
      'Algunos edificios contienen magia temporal que muestra el pasado',
    ],
    tags: ['ruinas', 'maldito', 'peligroso', 'magia', 'no-muertos'],
    notes: 'Dungeon de alto nivel con grandes recompensas y peligros extremos.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(ruinasNethermoor)

  // SPECIAL LOCATIONS (Cross-regional)

  // Ancient Temple
  const temploLunaEterna: Location = {
    id: 'location-templo-luna-eterna',
    name: 'Templo de la Luna Eterna',
    description:
      'Un antiguo templo élfico construido en la frontera entre Valdris y Fenwick. Sus pilares de mármol blanco brillan con luz lunar perpetua y es lugar de peregrinación para clérigos y druidas.',
    type: 'location',
    parentId: 'region-valdris',
    locationType: 'temple',
    population: 150,
    government: 'Orden Sagrada de Selûne',
    economy: ['Peregrinaciones', 'Rituales Sagrados', 'Herboristería'],
    defenses: 'Santidad consagrada, Guardianes celestiales convocados',
    keyNPCs: [
      {
        name: 'Suma Sacerdotisa Lunara',
        role: 'Líder Espiritual',
        description: 'Elfa que canaliza poder lunar directo',
      },
      {
        name: 'Guardián Estelar',
        role: 'Protector Celestial',
        description: 'Deva que protege el templo por las noches',
      },
      {
        name: 'Novicia Elena',
        role: 'Acólita',
        description: 'Humana joven con don profético',
      },
    ],
    services: ['Sanación Mayor', 'Rituales de Purificación', 'Adivinación'],
    rumors: [
      'Durante eclipses lunares, el templo revela visiones del futuro',
      'Hay una cripta secreta con reliquias de santos antiguos',
      'La luz del templo puede curar maldiciones poderosas',
    ],
    secrets: [
      'Existe un portal a los Reinos Feéricos que se abre solo en luna llena',
      'Los pilares del templo son en realidad fragmentos de una deidad caída',
      'Hay profecías grabadas en idioma celestial en la cámara subterránea',
    ],
    tags: ['templo', 'sagrado', 'élfico', 'lunar', 'mágico'],
    notes: 'Lugar de poder religioso y portal a aventuras planares.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(temploLunaEterna)

  // Mysterious Tavern
  const tabernaViajeroDimensional: Location = {
    id: 'location-taberna-viajero-dimensional',
    name: 'Taberna del Viajero Dimensional',
    description:
      'Una taberna mágica que aparece en diferentes ubicaciones según la necesidad de los viajeros. Su interior es más grande de lo que parece desde afuera y sirve bebidas de múltiples planos de existencia.',
    type: 'location',
    parentId: 'region-valdris', // Aparece principalmente en Valdris pero puede moverse
    locationType: 'tavern',
    population: 50,
    government: 'Propiedad privada (Posadero mágico)',
    economy: [
      'Hospitalidad Planar',
      'Comercio de Información',
      'Servicios Mágicos',
    ],
    defenses:
      'Neutralidad mágica forzada, Expulsión automática de problemáticos',
    keyNPCs: [
      {
        name: 'Dimensio el Posadero',
        role: 'Propietario',
        description: 'Ser de origen planar desconocido',
      },
      {
        name: 'Barkeep Temporal',
        role: 'Camarero',
        description: 'Gnomo que sirve bebidas de diferentes épocas',
      },
      {
        name: 'La Narradora',
        role: 'Entretenimiento',
        description: 'Bardo etéreo que cuenta historias de todos los planos',
      },
    ],
    services: [
      'Habitaciones Extradimensionales',
      'Comida Planar',
      'Transporte Mágico',
    ],
    rumors: [
      'Se dice que puedes encontrar cualquier persona que necesites hablar aquí',
      'Las bebidas pueden mostrar visiones de otros mundos',
      'Algunos huéspedes nunca envejecen mientras están dentro',
    ],
    secrets: [
      'La taberna existe simultáneamente en múltiples planos',
      'El posadero es en realidad un observador neutral de conflictos cósmicos',
      'Hay habitaciones que contienen fragmentos de realidades destruidas',
    ],
    tags: ['taberna', 'mágico', 'planar', 'misterioso', 'neutral'],
    notes:
      'Lugar de encuentro único para aventuras planares y contactos especiales.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  locations.push(tabernaViajeroDimensional)

  return locations
}

// Helper function to get locations by type for quick access
export function getLocationsByType(
  locations: AnyLocation[],
  type: string
): AnyLocation[] {
  return locations.filter(location => location.type === type)
}

// Function to get children of a specific location
export function getLocationChildren(
  locations: AnyLocation[],
  parentId: string
): AnyLocation[] {
  return locations.filter(location => location.parentId === parentId)
}

// Function to build the complete hierarchy tree
export function buildLocationHierarchy(locations: AnyLocation[]): any[] {
  const locationMap = new Map(
    locations.map(loc => [loc.id, { ...loc, children: [] as any[] }])
  )
  const roots: any[] = []

  for (const location of locations) {
    const locWithChildren = locationMap.get(location.id)!

    if (location.parentId) {
      const parent = locationMap.get(location.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(locWithChildren)
      }
    } else {
      roots.push(locWithChildren)
    }
  }

  return roots
}

// Export individual location generators for testing
export const SAMPLE_LOCATIONS = {
  planes: () => [generateSpanishLocationTemplate()[0]],
  continents: () => [generateSpanishLocationTemplate()[1]],
  regions: () =>
    generateSpanishLocationTemplate().filter(loc => loc.type === 'region'),
  locations: () =>
    generateSpanishLocationTemplate().filter(loc => loc.type === 'location'),
}
