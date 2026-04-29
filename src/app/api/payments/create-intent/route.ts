import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'

export const POST = withAuth(async (request, user) => {
  try {
    const { amount, currency = 'INR', planType, description } = await request.json()

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await prisma.payment.create({
      data: {
        userId: user.userId,
        amount,
        currency,
        status: 'PENDING',
        method: 'UPI',
        description,
        metadata: {
          planType,
          createdAt: new Date().toISOString(),
        },
      },
    })

    // In production, integrate with UPI payment gateway (Razorpay, PhonePe, etc.)
    // For now, return a mock payment intent
    return NextResponse.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      clientSecret: `pi_${paymentIntent.id}_secret_${Date.now()}`,
    })
  } catch (error) {
    console.error('Payment intent error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
})
