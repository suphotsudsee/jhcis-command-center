import './globals.css'
import 'leaflet/dist/leaflet.css'
import type { Metadata } from 'next'
import { Prompt } from 'next/font/google'

const prompt = Prompt({ subsets: ['thai', 'latin'], weight: ['300','400','500','600','700','800'] })

export const metadata: Metadata = {
  title: 'JHCIS Provincial Command Center',
  description: 'Ubon Ratchathani Primary Care Command Center',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={prompt.className}>{children}</body>
    </html>
  )
}
