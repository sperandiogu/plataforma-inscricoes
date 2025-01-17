'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Field {
  id: string
  name: string
  type: string
  required: boolean
  options?: string[]
}

interface Form {
  id: string
  title: string
  description: string
  fields: string | Field[] // Can be string (JSON) or already parsed array
}

export default function FormEditor({ initialForm }: { initialForm: Form }) {
  // Parse fields if they're a string, or use as is if already parsed
  const parsedFields = typeof initialForm.fields === 'string'
    ? JSON.parse(initialForm.fields)
    : initialForm.fields

  const [form, setForm] = useState({
    ...initialForm,
    fields: parsedFields || []
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prevForm => ({ ...prevForm, [name]: value }))
  }

  const handleFieldChange = (index: number, field: Partial<Field>) => {
    const newFields = [...form.fields]
    newFields[index] = { ...newFields[index], ...field }
    setForm(prevForm => ({ ...prevForm, fields: newFields }))
  }

  const addField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      required: false,
    }
    setForm(prevForm => ({
      ...prevForm,
      fields: [...prevForm.fields, newField]
    }))
  }

  const removeField = (index: number) => {
    setForm(prevForm => ({
      ...prevForm,
      fields: prevForm.fields.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        toast({
          title: "Formulário atualizado",
          description: "As alterações foram salvas com sucesso.",
        })
        router.push('/forms')
      } else {
        throw new Error('Falha ao atualizar formulário')
      }
    } catch (error) {
      console.error('Erro ao atualizar formulário:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título do Formulário</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Descrição do Formulário</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Campos do Formulário</h2>
        {Array.isArray(form.fields) && form.fields.map((field, index) => (
          <div key={field.id} className="space-y-2 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <Label htmlFor={`field-${index}-name`}>Nome do Campo</Label>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeField(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              id={`field-${index}-name`}
              value={field.name}
              onChange={(e) => handleFieldChange(index, { name: e.target.value })}
              required
            />
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor={`field-${index}-type`}>Tipo do Campo</Label>
                <Select
                  value={field.type}
                  onValueChange={(value) => handleFieldChange(index, { type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="date">Data</SelectItem>
                    <SelectItem value="select">Seleção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`field-${index}-required`}
                  checked={field.required}
                  onChange={(e) => handleFieldChange(index, { required: e.target.checked })}
                />
                <Label htmlFor={`field-${index}-required`}>Obrigatório</Label>
              </div>
            </div>
            {field.type === 'select' && (
              <div>
                <Label htmlFor={`field-${index}-options`}>Opções (separadas por vírgula)</Label>
                <Input
                  id={`field-${index}-options`}
                  value={field.options?.join(', ') || ''}
                  onChange={(e) => handleFieldChange(index, { options: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
            )}
          </div>
        ))}
        <Button type="button" onClick={addField} className="mt-4">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Campo
        </Button>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          'Salvar Alterações'
        )}
      </Button>
    </form>
  )
}
