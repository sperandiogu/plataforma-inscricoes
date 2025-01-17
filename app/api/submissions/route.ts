import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formId, data } = body

    const submission = await prisma.submission.create({
      data: {
        formId,
        data: JSON.stringify(data),
      },
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Erro ao criar submissão:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar formulário. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const formId = searchParams.get('formId')

  try {
    const submissions = await prisma.submission.findMany({
      where: formId ? { formId } : undefined,
      include: {
        form: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Erro ao buscar submissões:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar submissões. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}

