"use client"

import BackgroundPaths from "@/components/background-paths"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export default function IntroductionSection() {
  const { theme } = useTheme()
  
  return (
    <section className="relative w-full min-h-screen bg-background flex flex-col items-center justify-center text-center overflow-hidden">
      <BackgroundPaths 
        title="Welcome to" 
        subtitle="Your AI-Powered Coding Companion"
        showGif={true}
        gifSrc={theme === 'dark' ? '/media/synapse-dark.gif' : '/media/synapse-light.gif'}
      />
    </section>
  )
} 