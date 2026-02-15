import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { TaskProvider } from '@/app/context/TaskContext'
import { AuthProvider } from '@/app/context/AuthContext'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow - Project Management',
  description: 'Modern task board for managing your projects and tasks efficiently',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <TaskProvider>{children}</TaskProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
