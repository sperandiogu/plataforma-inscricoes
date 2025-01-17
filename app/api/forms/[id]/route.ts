import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const form = await prisma.form.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!form) {
      return NextResponse.json({ error: 'Formulário não encontrado' }, { status: 404 })
    }

    // Parse the fields before sending
    const parsedForm = {
      ...form,
      fields: form.fields ? JSON.parse(form.fields as string) : []
    }

    return NextResponse.json(parsedForm)
  } catch (error) {
    console.error('Erro ao buscar formulário:', error)
    return NextResponse.json({ error: 'Erro ao buscar formulário' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, fields } = body

  try {
    const updatedForm = await prisma.form.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        fields: JSON.stringify(fields),
      },
    })

    return NextResponse.json(updatedForm)
  } catch (error) {
    console.error('Erro ao atualizar formulário:', error)
    return NextResponse.json({ error: 'Erro ao atualizar formulário' }, { status: 500 })
  }
}

