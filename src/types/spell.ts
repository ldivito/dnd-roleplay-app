import { z } from 'zod'

export const SpellSchoolSchema = z.enum([
  'Abjuración',
  'Conjuración',
  'Adivinación',
  'Encantamiento',
  'Evocación',
  'Ilusión',
  'Nigromancia',
  'Transmutación',
])

export const SpellLevelSchema = z.number().min(0).max(9)

export const SpellRangeSchema = z.enum([
  'Toque',
  'Personal',
  '30 pies',
  '60 pies',
  '90 pies',
  '120 pies',
  '150 pies',
  '300 pies',
  '500 pies',
  '1 milla',
  'Vista',
  'Ilimitado',
  'Especial',
])

export const SpellDurationSchema = z.enum([
  'Instantáneo',
  '1 acción',
  '1 acción adicional',
  '1 reacción',
  '1 minuto',
  '10 minutos',
  '1 hora',
  '8 horas',
  '24 horas',
  'Hasta ser disipado',
  'Concentración, hasta 1 minuto',
  'Concentración, hasta 10 minutos',
  'Concentración, hasta 1 hora',
  'Concentración, hasta 8 horas',
  'Concentración, hasta 24 horas',
  'Permanente',
])

export const SpellComponentsSchema = z.object({
  verbal: z.boolean().default(false),
  somatic: z.boolean().default(false),
  material: z.boolean().default(false),
  materialDescription: z.string().optional(),
})

export const SpellSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  level: SpellLevelSchema,
  school: SpellSchoolSchema,
  castingTime: z.string(),
  range: SpellRangeSchema,
  duration: SpellDurationSchema,
  components: SpellComponentsSchema,
  description: z.string().min(1),
  higherLevels: z.string().optional(),
  classes: z.array(z.string()).default([]),
  ritual: z.boolean().default(false),
  concentration: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  source: z.string().optional(),
  page: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Spell = z.infer<typeof SpellSchema>
export type SpellSchool = z.infer<typeof SpellSchoolSchema>
export type SpellComponents = z.infer<typeof SpellComponentsSchema>

export const DND_SPELL_SCHOOLS = [
  'Abjuración',
  'Conjuración',
  'Adivinación',
  'Encantamiento',
  'Evocación',
  'Ilusión',
  'Nigromancia',
  'Transmutación',
] as const

export const DND_SPELL_CLASSES = [
  'Bardo',
  'Brujo',
  'Clérigo',
  'Druida',
  'Explorador',
  'Hechicero',
  'Mago',
  'Paladín',
] as const
