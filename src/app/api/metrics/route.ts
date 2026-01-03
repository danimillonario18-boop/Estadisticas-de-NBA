import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateMetrics } from '@/lib/metrics/calculations'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const sportId = searchParams.get('sportId')
    const leagueId = searchParams.get('leagueId')
    const marketType = searchParams.get('marketType')
    const bookId = searchParams.get('bookId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      userId: session.user.id,
    }

    if (sportId) where.sportId = sportId
    if (leagueId) where.leagueId = leagueId
    if (marketType) where.marketType = marketType
    if (bookId) where.bookId = bookId
    if (startDate || endDate) {
      where.placedAt = {}
      if (startDate) where.placedAt.gte = new Date(startDate)
      if (endDate) where.placedAt.lte = new Date(endDate)
    }

    const picks = await prisma.pick.findMany({
      where,
      orderBy: { placedAt: 'desc' },
    })

    const metrics = calculateMetrics(picks)

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Get metrics error:', error)
    return NextResponse.json(
      { error: 'Error fetching metrics' },
      { status: 500 }
    )
  }
}