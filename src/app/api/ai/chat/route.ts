import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const POST = withAuth(async (request, user) => {
  try {
    const { messages, model = 'gpt-4' } = await request.json()

    // Save user message
    await prisma.chatMessage.create({
      data: {
        userId: user.userId,
        role: 'user',
        content: messages[messages.length - 1].content,
        model,
      },
    })

    // Generate AI response
    const response = await openai.chat.completions.create({
      model,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const content = response.choices[0]?.message?.content || ''

    // Save assistant message
    await prisma.chatMessage.create({
      data: {
        userId: user.userId,
        role: 'assistant',
        content,
        model,
      },
    })

    return NextResponse.json({
      role: 'assistant',
      content,
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
})
