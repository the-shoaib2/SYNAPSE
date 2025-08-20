"use client";

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme, type ThemeProviderProps } from "next-themes";
import * as React from "react";
import { useEffect } from "react";

// This wrapper ensures the theme is properly applied to the document
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useNextTheme()
  
  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all theme classes
    root.classList.remove('light', 'dark')
    
    // Add the current theme class
    if (resolvedTheme) {
      root.classList.add(resolvedTheme)
      // Also set data-theme attribute for better compatibility
      root.setAttribute('data-theme', resolvedTheme)
    }
  }, [resolvedTheme])
  
  return <>{children}</>
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey="synapse-theme"
      {...props}
    >
      <ThemeWrapper>
        {children}
      </ThemeWrapper>
    </NextThemesProvider>
  )
}
