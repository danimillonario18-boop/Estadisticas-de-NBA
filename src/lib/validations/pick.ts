import { z } from 'zod'

export const createPickSchema = z.object({
  eventId: z.string().optional(),
  sportId: z.string().min(1, 'El deporte es requerido'),
  leagueId: z.string().min(1, 'La liga es requerida'),
  marketType: z.enum(['MONEYLINE', 'SPREAD', 'TOTAL', 'PROP', 'OTHER']),
  selectionText: z.string().min(1, 'La selección es requerida'),
  line: z.number().optional(),
  oddsDecimal: z.number().min(1.01, 'La cuota debe ser mayor a 1.00'),
  stakeUnits: z.number().min(0.01, 'El stake debe ser mayor a 0'),
  bookId: z.string().optional(),
  note: z.string().optional(),
})

export const updatePickSchema = z.object({
  status: z.enum(['PENDING', 'WON', 'LOST', 'PUSH', 'VOID', 'CASHOUT']).optional(),
  profitUnits: z.number().optional(),
  note: z.string().optional(),
})

export const settlePickSchema = z.object({
  status: z.enum(['WON', 'LOST', 'PUSH', 'VOID', 'CASHOUT']),
  profitUnits: z.number(),
})

export type CreatePickInput = z.infer<typeof createPickSchema>
export type UpdatePickInput = z.infer<typeof updatePickSchema>
export type SettlePickInput = z.infer<typeof settlePickSchema>