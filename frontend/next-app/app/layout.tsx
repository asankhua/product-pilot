import { Toaster } from "sonner"

import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="font-sans antialiased"
    >
      <body className="bg-gradient-to-br from-sky-50 to-white min-h-screen">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
