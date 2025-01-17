import { Toaster } from "@/components/ui/toaster"
import { getServerSession } from "next-auth/next"
import { Inter } from 'next/font/google'
import { authOptions } from "./api/auth/[...nextauth]/route"
import Provider from "./components/Provider"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Plataforma de Gerenciamento de Inscrições',
  description: 'Gerencie inscrições, formulários e equipe',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Provider session={session}>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  )
}
