import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import prisma from '@/lib/prisma'
import FormList from './FormList'
import { Loader2 } from 'lucide-react'

export default async function FormsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  let forms = []
  let error = null

  try {
    forms = await prisma.form.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        fields: true,
      },
    })

    // Parse the fields JSON string for each form
    forms = forms.map(form => ({
      ...form,
      fields: form.fields ? JSON.parse(form.fields as string) : []
    }))

  } catch (e) {
    console.error("Error fetching forms:", e)
    error = "Erro ao carregar formulários. Por favor, tente novamente."
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-lg font-semibold">
                  Dashboard
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Gerenciar Formulários</h1>
          
          {error ? (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          ) : (
            <FormList initialForms={forms} />
          )}
        </div>
      </main>
    </div>
  )
}

