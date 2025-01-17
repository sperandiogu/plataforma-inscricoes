'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { GripVertical, Loader2, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface FormField {
  id: string
  name: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
}

export default function FormBuilder() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const [fields, setFields] = useState<FormField[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      required: false,
      placeholder: '',
    }
    setFields([...fields, newField])
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    setFields(newFields)
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fields,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao criar formulário')
      }

      const result = await response.json()

      toast({
        title: "Formulário criado",
        description: "O formulário foi criado com sucesso.",
      })

      router.push(`/forms/${result.id}`)
    } catch (error) {
      console.error('Erro ao criar formulário:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o formulário. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Formulário</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título do formulário"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Digite uma descrição para o formulário"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Campos do Formulário</h2>
          <Button type="button" onClick={addField} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Campo
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-sm font-medium">Campo {index + 1}</h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`field-${index}-name`}>Nome do Campo</Label>
                    <Input
                      id={`field-${index}-name`}
                      value={field.name}
                      onChange={(e) => updateField(index, { name: e.target.value })}
                      placeholder="Nome do campo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`field-${index}-type`}>Tipo do Campo</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(index, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="tel">Telefone</SelectItem>
                        <SelectItem value="date">Data</SelectItem>
                        <SelectItem value="select">Seleção</SelectItem>
                        <SelectItem value="textarea">Área de Texto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`field-${index}-placeholder`}>Placeholder</Label>
                    <Input
                      id={`field-${index}-placeholder`}
                      value={field.placeholder}
                      onChange={(e) => updateField(index, { placeholder: e.target.value })}
                      placeholder="Texto de exemplo"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`field-${index}-required`}
                      checked={field.required}
                      onChange={(e) => updateField(index, { required: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <Label htmlFor={`field-${index}-required`}>Campo Obrigatório</Label>
                  </div>
                </div>

                {field.type === 'select' && (
                  <div>
                    <Label htmlFor={`field-${index}-options`}>Opções (separadas por vírgula)</Label>
                    <Input
                      id={`field-${index}-options`}
                      value={field.options?.join(', ') || ''}
                      onChange={(e) => updateField(index, {
                        options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="Opção 1, Opção 2, Opção 3"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando Formulário...
            </>
          ) : (
            'Criar Formulário'
          )}
        </Button>
      </div>
    </form>
  )
}
