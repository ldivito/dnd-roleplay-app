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

export const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: ItemTypeSchema,
  rarity: ItemRaritySchema,
  description: z.string().min(1),

  // Basic properties
  weight: z.number().min(0).optional(),
  value: z
    .object({
      amount: z.number().min(0),
      currency: z.enum(['cp', 'sp', 'ep', 'gp', 'pp']),
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

  // Magic item properties
  requiresAttunement: z.boolean().default(false),
  attunementRequirements: z.string().optional(),
  charges: z.number().optional(),
  maxCharges: z.number().optional(),

  // Additional properties
  consumable: z.boolean().default(false),
  stackable: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  source: z.string().optional(),
  page: z.number().optional(),

  // Meta
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Item = z.infer<typeof ItemSchema>
export type ItemType = z.infer<typeof ItemTypeSchema>
export type ItemRarity = z.infer<typeof ItemRaritySchema>
export type WeaponProperties = z.infer<typeof WeaponPropertiesSchema>
export type ArmorProperties = z.infer<typeof ArmorPropertiesSchema>

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
