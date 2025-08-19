"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SynapseLogoProps {
  type?: "gif" | "svg"
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export function SynapseLogo({ 
  type = "svg", 
  className,
  width = 32,
  height = 32,
  priority = false 
}: SynapseLogoProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getImageSrc = () => {
    if (type === "svg") {
      return "/media/SYNAPSE.svg"
    }
    
    if (!mounted) return "/media/synapse-light.gif"
    return resolvedTheme === "dark" ? "/media/synapse-dark.gif" : "/media/synapse-light.gif"
  }

  return (
    <Image
      src={getImageSrc()}
      alt="Synapse AI Code Assistant"
      width={width}
      height={height}
      className={cn("transition-opacity duration-300", className)}
      priority={priority}
      unoptimized={type === "gif"} // Preserve GIF animation
    />
  )
}
