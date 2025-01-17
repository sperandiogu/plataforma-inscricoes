import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"

interface Submission {
  id: string
  formId: string
  data: string
  createdAt: string
  form: {
    title: string
  }
}

async function getSubmissions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch submissions')
  }
  return res.json()
}

export default async function Submissions() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const submissions: Submission[] = await getSubmissions()

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
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Submissões de Formulários</h1>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <li key={submission.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {submission.form.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Recebido
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          ID da Submissão: {submission.id}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Enviado em {new Date(submission.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Dados da Submissão:</h4>
                      <pre className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(submission.data), null, 2)}
                      </pre>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

