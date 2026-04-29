import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'

export const GET = withAuth(async (request, user) => {
  const userData = await prisma.user.findUnique({
    where: { id: user.userId },
    include: {
      profile: true,
      subscriptions: true,
    },
  })

  if (!userData) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    id: userData.id,
    email: userData.email,
    name: userData.name,
    image: userData.image,
    role: userData.role,
    profile: userData.profile,
    subscriptions: userData.subscriptions,
  })
})
