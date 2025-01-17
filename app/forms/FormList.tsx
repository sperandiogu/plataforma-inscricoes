'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ClipboardCopy, Plus, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Form {
  id: string
  title: string
  description: string | null
  createdAt: string | Date
  fields: any[]
}

export default function FormList({ initialForms }: { initialForms: Form[] }) {
  const [forms] = useState<Form[]>(initialForms)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateForm = () => {
    router.push('/forms/new')
  }

  const copyPublicLink = async (formId: string) => {
    const link = `${window.location.origin}/public/forms/${formId}`
    await navigator.clipboard.writeText(link)
    toast({
      title: "Link copiado!",
      description: "O link público do formulário foi copiado para sua área de transferência.",
    })
  }

  if (!forms || forms.length === 0) {
    return (
      <div className="text-center">
        <Button onClick={handleCreateForm} className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Criar Novo Formulário
        </Button>
        <p className="text-gray-500">Nenhum formulário encontrado. Crie um novo para começar!</p>
      </div>
    )
  }

  return (
    <div>
      <Button onClick={handleCreateForm} className="mb-4">
        <Plus className="h-4 w-4 mr-2" />
        Criar Novo Formulário
      </Button>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {forms.map((form) => (
            <li key={form.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <Link href={`/forms/${form.id}`} className="block flex-grow hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {form.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {form.fields?.length || 0} campos
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {form.description || 'Sem descrição'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Criado em {new Date(form.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="ml-4 flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPublicLink(form.id)}
                      title="Copiar link público"
                    >
                      <ClipboardCopy className="h-4 w-4" />
                    </Button>
                    <Link href={`/forms/${form.id}/submissions`}>
                      <Button
                        variant="outline"
                        size="sm"
                        title="Ver respostas"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
