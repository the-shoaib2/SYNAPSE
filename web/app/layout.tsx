import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { getServerAuthSession } from "@/lib/auth/auth"

import { ToastProvider } from "@/components/providers/toast-provider"
import InternetStatusBanner from "@/components/internet-status-card"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { LoadingBar } from "@/components/loading-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Synapse - Your AI-Powered Coding Companion",
  description: "Open-source AI code assistant with VS Code and JetBrains extensions. Features agent mode, inline editing, autocomplete, and multi-model support for enhanced development productivity.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerAuthSession()
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <SessionProvider session={session}>
          <QueryProvider>
            <ThemeProvider>
              <>
                <InternetStatusBanner />
                <div className="flex flex-col overflow-hidden min-h-screen">
                  <LoadingBar />
                  <PublicHeader />
                  <main className="flex-1 w-full overflow-y-auto">
                    {children}
                    <PublicFooter />
                  </main>
                </div>
                <ToastProvider />
              </>
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
