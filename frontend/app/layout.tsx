import type { Metadata } from 'next'
import { Space_Grotesk, Plus_Jakarta_Sans, Fira_Code } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const firaCode = Fira_Code({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'IntelliHire - AI-Powered Interview Intelligence',
  description: 'Land your dream job with AI-powered interview preparation, resume analysis, and coding practice.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${firaCode.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
