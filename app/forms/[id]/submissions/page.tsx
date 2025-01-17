import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { authOptions } from "../../../api/auth/[...nextauth]/route"
import SubmissionsList from './SubmissionsList'

export default async function FormSubmissionsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: {
      Submission: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!form) {
    redirect("/forms")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/forms" className="text-lg font-semibold">
                  Voltar para Formulários
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Olá, {session.user.name}
              </span>
              <Link href="/api/auth/signout" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Sair
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Respostas: {form.title}
            </h1>
            <Button
              variant="outline"
              onClick={() => copyPublicLink(form.id)}
            >
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copiar Link do Formulário
            </Button>
          </div>
          <SubmissionsList form={form} submissions={form.Submission} />
        </div>
      </main>
    </div>
  )
}
