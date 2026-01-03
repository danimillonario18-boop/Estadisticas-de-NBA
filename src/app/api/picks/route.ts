import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPickSchema } from '@/lib/validations/pick'
import { calculateProfit } from '@/lib/metrics/calculations'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      userId: session.user.id,
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    const picks = await prisma.pick.findMany({
      where,
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
      orderBy: { placedAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.pick.count({ where })

    return NextResponse.json({ picks, total })
  } catch (error) {
    console.error('Get picks error:', error)
    return NextResponse.json(
      { error: 'Error fetching picks' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createPickSchema.parse(body)

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Create pick
    const pick = await prisma.pick.create({
      data: {
        userId: session.user.id,
        profileId: profile.id,
        ...validatedData,
        status: 'PENDING',
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

    // Create audit log
    await prisma.auditLog.create({
      data: {
        entityType: 'PICK',
        entityId: pick.id,
        userId: session.user.id,
        action: 'CREATE',
        afterJson: JSON.stringify(pick),
      },
    })

    return NextResponse.json({ pick }, { status: 201 })
  } catch (error: any) {
    console.error('Create pick error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating pick' },
      { status: 500 }
    )
  }
}