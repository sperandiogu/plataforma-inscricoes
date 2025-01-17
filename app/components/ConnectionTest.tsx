'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'

export default function ConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const testConnection = async () => {
    setStatus('loading')
    try {
      const response = await fetch('https://nodejs-production-6c16.up.railway.app/api/test')
      if (!response.ok) {
        throw new Error('Falha na conexão com o back-end')
      }
      const data = await response.json()
      setMessage(data.message)
      setStatus('success')
    } catch (error) {
      setMessage('Erro ao conectar com o back-end')
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={testConnection} disabled={status === 'loading'}>
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testando conexão...
          </>
        ) : (
          'Testar Conexão com o Back-end'
        )}
      </Button>
      
      {status === 'success' && (
        <Alert variant="default">
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

