import { z } from 'zod'

export const ItemTypeSchema = z.enum([
  'Arma',
  'Armadura',
  'Escudo',
  'Objeto Mágico',
  'Poción',
  'Pergamino',
  'Herramienta',
  'Equipo de Aventurero',
  'Tesoro',
  'Varios',
])

export const ItemRaritySchema = z.enum([
  'Común',
  'Poco Común',
  'Raro',
  'Muy Raro',
  'Legendario',
  'Artefacto',
])

export const WeaponTypeSchema = z.enum([
  'Arma Simple Cuerpo a Cuerpo',
  'Arma Marcial Cuerpo a Cuerpo',
  'Arma Simple a Distancia',
  'Arma Marcial a Distancia',
])

export const ArmorTypeSchema = z.enum([
  'Armadura Ligera',
  'Armadura Media',
  'Armadura Pesada',
])

export const WeaponPropertiesSchema = z.object({
  ammunition: z.boolean().default(false),
  finesse: z.boolean().default(false),
  heavy: z.boolean().default(false),
  light: z.boolean().default(false),
  loading: z.boolean().default(false),
  range: z.string().optional(),
  reach: z.boolean().default(false),
  special: z.boolean().default(false),
  thrown: z.string().optional(),
  twoHanded: z.boolean().default(false),
  versatile: z.string().optional(),
})

export const ArmorPropertiesSchema = z.object({
  armorClass: z.number().min(10).max(25),
  maxDexBonus: z.number().optional(),
  minStrength: z.number().optional(),
  stealthDisadvantage: z.boolean().default(false),
})

export const EquipmentSlotSchema = z.enum([
  'Cabeza',
  'Cuello',
  'Hombros',
  'Espalda',
  'Torso',
  'Muñecas',
  'Manos',
  'Cintura',
  'Piernas',
  'Pies',
  'Anillo',
  'Mano Principal',
  'Mano Secundaria',
  'Dos Manos',
  'Amuleto',
  'Ninguno',
])

export const SpecialMaterialSchema = z.enum([
  'Adamantina',
  'Mithral',
  'Plateada',
  'Madera Oscura',
  'Madera de Sangre',
  'Ninguno',
])

export const ResistanceTypeSchema = z.enum([
  'Ácido',
  'Contundente',
  'Cortante',
  'Perforante',
  'Frío',
  'Fuego',
  'Fuerza',
  'Rayo',
  'Necrótico',
  'Veneno',
  'Psíquico',
  'Radiante',
  'Trueno',
])

export const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: ItemTypeSchema,
  rarity: ItemRaritySchema,
  description: z.string().min(1),

  // Basic properties - CHANGED TO METRIC
  weight: z.number().min(0).optional(), // Now in kg
  value: z
    .object({
      amount: z.number().min(0),
      currency: z.enum(['cp', 'sp', 'ep', 'gp', 'pp']),
    })
    .optional(),
  estimatedValueRange: z
    .object({
      min: z.number().min(0),
      minCurrency: z.enum(['cp', 'sp', 'ep', 'gp', 'pp']),
      max: z.number().min(0),
      maxCurrency: z.enum(['cp', 'sp', 'ep', 'gp', 'pp']),
    })
    .optional(),

  // NEW: Visual and physical properties
  imageUrl: z.string().optional(), // Can be URL or data URL from file upload
  durability: z
    .object({
      current: z.number().min(0),
      max: z.number().min(0),
    })
    .optional(),

  // Weapon properties
  weaponType: WeaponTypeSchema.optional(),
  damage: z.string().optional(), // e.g., "1d8"
  damageType: z.string().optional(), // e.g., "Cortante"
  weaponProperties: WeaponPropertiesSchema.optional(),

  // Armor properties
  armorType: ArmorTypeSchema.optional(),
  armorProperties: ArmorPropertiesSchema.optional(),

  // NEW: Attunement system expanded
  requiresAttunement: z.boolean().default(false),
  attunementRequirements: z
    .object({
      classes: z.array(z.string()).optional(),
      races: z.array(z.string()).optional(),
      alignment: z.string().optional(),
      minimumLevel: z.number().optional(),
      abilityScore: z
        .object({
          ability: z.enum(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']),
          minimum: z.number(),
        })
        .optional(),
      custom: z.string().optional(),
    })
    .optional(),

  // Magic item properties
  isMagical: z.boolean().default(false),
  isCursed: z.boolean().default(false),
  charges: z.number().optional(),
  maxCharges: z.number().optional(),

  // NEW: Item origin and lore
  crafter: z.string().optional(),
  historicalSignificance: z.string().optional(),
  specialMaterial: SpecialMaterialSchema.optional(),

  // NEW: Mechanical properties
  grantedResistances: z.array(ResistanceTypeSchema).default([]),
  grantedImmunities: z.array(ResistanceTypeSchema).default([]),
  advantageOn: z.array(z.string()).default([]), // e.g., ["Stealth checks", "Persuasion checks"]
  disadvantageOn: z.array(z.string()).default([]),
  armorClassBonus: z.number().optional(),

  // NEW: Practical details
  containerCapacity: z
    .object({
      volume: z.number(), // in liters
      weightLimit: z.number(), // in kg
    })
    .optional(),
  lightSource: z
    .object({
      radius: z.number(), // in feet
      duration: z.string(), // e.g., "1 hour", "8 hours"
      type: z.enum(['Bright', 'Dim', 'Both']),
    })
    .optional(),

  // NEW: Identification system
  isIdentified: z.boolean().default(true),
  hiddenProperties: z.string().optional(),

  // NEW: Item equipment and organization
  equipmentSlot: EquipmentSlotSchema.optional(),
  itemSet: z.string().optional(), // Name of the set this item belongs to
  setBonus: z.string().optional(), // Description of set bonus

  // NEW: Trading and binding
  isTradeable: z.boolean().default(true),
  isBound: z.boolean().default(false),
  bindingType: z
    .enum(['Soulbound', 'Bind on Pickup', 'Bind on Equip', 'None'])
    .optional(),

  // Additional properties
  consumable: z.boolean().default(false),
  stackable: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  source: z.string().optional(),
  page: z.number().optional(),

  // NEW: Dynamic item properties (from taxonomies)
  itemProperties: z.array(z.string()).default([]), // Array of property names from ItemProperty taxonomy

  // NEW: Lore connections
  loreIds: z.array(z.string().uuid()).default([]), // Links to lore entries

  // Meta
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Item = z.infer<typeof ItemSchema>
export type ItemType = z.infer<typeof ItemTypeSchema>
export type ItemRarity = z.infer<typeof ItemRaritySchema>
export type WeaponProperties = z.infer<typeof WeaponPropertiesSchema>
export type ArmorProperties = z.infer<typeof ArmorPropertiesSchema>
export type EquipmentSlot = z.infer<typeof EquipmentSlotSchema>
export type SpecialMaterial = z.infer<typeof SpecialMaterialSchema>
export type ResistanceType = z.infer<typeof ResistanceTypeSchema>

export const DND_ITEM_TYPES = [
  'Arma',
  'Armadura',
  'Escudo',
  'Objeto Mágico',
  'Poción',
  'Pergamino',
  'Herramienta',
  'Equipo de Aventurero',
  'Tesoro',
  'Varios',
] as const

export const DND_RARITIES = [
  'Común',
  'Poco Común',
  'Raro',
  'Muy Raro',
  'Legendario',
  'Artefacto',
] as const

export const DND_DAMAGE_TYPES = [
  'Ácido',
  'Contundente',
  'Cortante',
  'Perforante',
  'Frío',
  'Fuego',
  'Fuerza',
  'Rayo',
  'Necrótico',
  'Veneno',
  'Psíquico',
  'Radiante',
  'Trueno',
] as const

export const DND_CURRENCIES = [
  { value: 'cp', label: 'Cobre (cp)' },
  { value: 'sp', label: 'Plata (sp)' },
  { value: 'ep', label: 'Electro (ep)' },
  { value: 'gp', label: 'Oro (gp)' },
  { value: 'pp', label: 'Platino (pp)' },
] as const

export const DND_EQUIPMENT_SLOTS = [
  'Cabeza',
  'Cuello',
  'Hombros',
  'Espalda',
  'Torso',
  'Muñecas',
  'Manos',
  'Cintura',
  'Piernas',
  'Pies',
  'Anillo',
  'Mano Principal',
  'Mano Secundaria',
  'Dos Manos',
  'Amuleto',
  'Ninguno',
] as const

export const DND_SPECIAL_MATERIALS = [
  'Adamantina',
  'Mithral',
  'Plateada',
  'Madera Oscura',
  'Madera de Sangre',
  'Ninguno',
] as const

export const DND_ABILITIES = [
  { value: 'STR', label: 'Fuerza (STR)' },
  { value: 'DEX', label: 'Destreza (DEX)' },
  { value: 'CON', label: 'Constitución (CON)' },
  { value: 'INT', label: 'Inteligencia (INT)' },
  { value: 'WIS', label: 'Sabiduría (WIS)' },
  { value: 'CHA', label: 'Carisma (CHA)' },
] as const
