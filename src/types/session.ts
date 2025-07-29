import { z } from 'zod'

export const SessionStatusSchema = z.enum([
  'not-started',
  'active',
  'paused',
  'completed',
])

export const SessionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  campaignId: z.string().uuid(),
  status: SessionStatusSchema,
  currentLocation: z.string().optional(),
  sessionNumber: z.number().min(1),
  playerCount: z.number().min(0).max(8),
  maxPlayers: z.number().min(1).max(8).default(6),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CampaignSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  currentSession: z.number().min(0).default(0),
  totalSessions: z.number().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Session = z.infer<typeof SessionSchema>
export type Campaign = z.infer<typeof CampaignSchema>
export type SessionStatus = z.infer<typeof SessionStatusSchema>
