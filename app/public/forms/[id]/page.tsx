import prisma from '@/lib/prisma'
import PublicFormView from './PublicFormView'

export default async function PublicFormPage({ params }: { params: { id: string } }) {
  const form = await prisma.form.findUnique({
    where: { id: params.id },
  })

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Formulário não encontrado</h1>
          <p className="text-gray-600">Este formulário não existe ou foi removido.</p>
        </div>
      </div>
    )
  }

  return <PublicFormView form={form} />
}

