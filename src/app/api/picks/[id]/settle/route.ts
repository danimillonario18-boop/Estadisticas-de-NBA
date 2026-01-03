import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { settlePickSchema } from '@/lib/validations/pick'
import { calculateProfit } from '@/lib/metrics/calculations'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingPick = await prisma.pick.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingPick) {
      return NextResponse.json({ error: 'Pick not found' }, { status: 404 })
    }

    if (existingPick.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Pick is already settled' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = settlePickSchema.parse(body)

    // Calculate profit based on status
    const profitUnits = calculateProfit(
      validatedData.status,
      existingPick.stakeUnits,
      existingPick.oddsDecimal,
      validatedData.profitUnits
    )

    // Create audit log before settle
    await prisma.auditLog.create({
      data: {
        entityType: 'PICK',
        entityId: params.id,
        userId: session.user.id,
        action: 'SETTLE',
        beforeJson: JSON.stringify(existingPick),
      },
    })

    // Settle pick
    const pick = await prisma.pick.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        profitUnits,
        settledAt: new Date(),
      },
      include: {
        event: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
        sport: true,
        league: true,
        book: true,
      },
    })

    // Update audit log with after state
    await prisma.auditLog.create({
      data: {
        entityType: 'PICK',
        entityId: params.id,
        userId: session.user.id,
        action: 'SETTLE',
        afterJson: JSON.stringify(pick),
      },
    })

    return NextResponse.json({ pick })
  } catch (error: any) {
    console.error('Settle pick error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error settling pick' },
      { status: 500 }
    )
  }
}