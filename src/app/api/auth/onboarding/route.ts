import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, username, displayName, bio, country, currency, isPublic, bankroll } = body

    if (!userId || !username || !displayName) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Check if username is already taken
    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'El username ya está en uso' },
        { status: 400 }
      )
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        userId,
        username,
        displayName,
        bio: bio || null,
        country,
        currency,
        isPublic,
        bankroll,
      },
    })

    return NextResponse.json({ 
      profileId: profile.id,
      message: 'Perfil creado exitosamente' 
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Error al crear perfil' },
      { status: 500 }
    )
  }
}