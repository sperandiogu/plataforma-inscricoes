'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Field {
  name: string
  type: string
}

interface Form {
  id: string
  title: string
  description: string
  fields: Field[]
}

export default function PublicForm({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<Form | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    const fetchForm = async () => {
      const response = await fetch(`/api/forms/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setForm(data)
        // Initialize formData with empty strings for each field
        const initialFormData: Record<string, string> = {}
        data.fields.forEach((field: Field) => {
          initialFormData[field.name] = ''
        })
        setFormData(initialFormData)
      } else {
        console.error('Failed to fetch form')
      }
    }
    fetchForm()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId: params.id,
        data: formData,
      }),
    })

    if (response.ok) {
      alert('Formulário enviado com sucesso!')
      router.push('/') // Redirect to home page or a thank you page
    } else {
      alert('Erro ao enviar o formulário. Por favor, tente novamente.')
    }
  }

  if (!form) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6">{form.title}</h1>
            <p className="text-gray-600 mb-6">{form.description}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {form.fields.map((field: Field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.name}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

