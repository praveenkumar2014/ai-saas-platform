import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-signature')

    // Verify webhook signature (in production, verify with payment gateway)
    const webhookSecret = process.env.WEBHOOK_SECRET || 'test-secret'
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const { paymentIntentId, status, amount } = body

    // Update payment status
    const payment = await prisma.payment.update({
      where: { id: paymentIntentId },
      data: {
        status: status.toUpperCase() as any,
        metadata: {
          ...body,
          processedAt: new Date().toISOString(),
        },
      },
    })

    // If payment is successful, activate subscription
    if (status === 'succeeded' || status === 'completed') {
      const metadata = payment.metadata as Record<string, any> || {}
      const planType = metadata.planType as string

      if (planType) {
        // Calculate subscription end date based on plan type
        const startDate = new Date()
        const endDate = new Date()

        // Set duration based on plan type
        switch (planType) {
          case 'BASIC':
            endDate.setMonth(endDate.getMonth() + 1)
            break
          case 'PRO':
            endDate.setMonth(endDate.getMonth() + 3)
            break
          case 'ENTERPRISE':
            endDate.setFullYear(endDate.getFullYear() + 1)
            break
          default:
            endDate.setMonth(endDate.getMonth() + 1)
        }

        // Create or update subscription
        const existingSubscription = await prisma.subscription.findFirst({
          where: { userId: payment.userId },
        })

        if (existingSubscription) {
          await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              planType: planType as any,
              status: 'ACTIVE',
              startDate,
              endDate,
            },
          })
        } else {
          await prisma.subscription.create({
            data: {
              userId: payment.userId,
              planType: planType as any,
              status: 'ACTIVE',
              startDate,
              endDate,
            },
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
