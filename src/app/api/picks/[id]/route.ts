import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updatePickSchema, settlePickSchema } from '@/lib/validations/pick'
import { calculateProfit } from '@/lib/metrics/calculations'

// GET single pick
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pick = await prisma.pick.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
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

    if (!pick) {
      return NextResponse.json({ error: 'Pick not found' }, { status: 404 })
    }

    return NextResponse.json({ pick })
  } catch (error) {
    console.error('Get pick error:', error)
    return NextResponse.json(
      { error: 'Error fetching pick' },
      { status: 500 }
    )
  }
}

// PATCH update pick
export async function PATCH(
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

    // Only allow editing pending picks
    if (existingPick.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only edit pending picks' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = updatePickSchema.parse(body)

    // Create audit log before update
    await prisma.auditLog.create({
      data: {
        entityType: 'PICK',
        entityId: params.id,
        userId: session.user.id,
        action: 'EDIT_PENDING',
        beforeJson: JSON.stringify(existingPick),
      },
    })

    // Update pick
    const pick = await prisma.pick.update({
      where: { id: params.id },
      data: validatedData,
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
        action: 'EDIT_PENDING',
        afterJson: JSON.stringify(pick),
      },
    })

    return NextResponse.json({ pick })
  } catch (error: any) {
    console.error('Update pick error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error updating pick' },
      { status: 500 }
    )
  }
}

// DELETE pick
export async function DELETE(
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

    // Only allow deleting pending picks
    if (existingPick.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only delete pending picks' },
        { status: 400 }
      )
    }

    // Create audit log before delete
    await prisma.auditLog.create({
      data: {
        entityType: 'PICK',
        entityId: params.id,
        userId: session.user.id,
        action: 'DELETE',
        beforeJson: JSON.stringify(existingPick),
      },
    })

    // Delete pick
    await prisma.pick.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Pick deleted successfully' })
  } catch (error) {
    console.error('Delete pick error:', error)
    return NextResponse.json(
      { error: 'Error deleting pick' },
      { status: 500 }
    )
  }
}