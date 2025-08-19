"use client"

import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export default function GifPreviewSection() {
  const [imgError, setImgError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the appropriate GIF based on theme
  const getGifSrc = () => {
    if (!mounted) return "/media/synapse-light.gif" // Default fallback
    return resolvedTheme === "dark" ? "/media/synapse-dark.gif" : "/media/synapse-light.gif"
  }

  return (
    <section className="w-full bg-muted/40 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Experience Synapse in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Synapse transforms your coding workflow with AI-powered assistance, 
            intelligent code completion, and seamless integration.
          </p>
        </div>
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl shadow-lg border border-border/50">
          {!imgError ? (
            <Image
              src={getGifSrc()}
              alt="Synapse AI Code Assistant Preview"
              fill
              className="object-cover transition-opacity duration-300"
              priority
              unoptimized // For GIFs to maintain animation
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <div>Synapse Preview</div>
                <div className="text-sm opacity-70">AI Code Assistant</div>
              </div>
            </div>
          )}
        </AspectRatio>
      </div>
    </section>
  )
} 