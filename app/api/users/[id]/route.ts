import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { id } = params
  const body = await request.json()
  const { name, email, role } = body

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { id } = params

  try {
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Usuário removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover usuário:', error)
    return NextResponse.json({ error: 'Erro ao remover usuário' }, { status: 500 })
  }
}

