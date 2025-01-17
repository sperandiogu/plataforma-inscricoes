import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, fields } = body

    const form = await prisma.form.create({
      data: {
        title,
        description,
        fields: JSON.stringify(fields || []),
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('Erro ao criar formulário:', error)
    return NextResponse.json(
      { error: 'Erro ao criar formulário. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const forms = await prisma.form.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error('Erro ao buscar formulários:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar formulários. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}

