"use client"

import IntroductionSection from "@/components/install/IntroductionSection"
import HeadlineSection from "@/components/magicui/headline-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "motion/react"
import { Palette, Puzzle, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI-Powered Editor",
    description: "Autocomplete, debugging, and code explanations with multiple AI models."
  },
  {
    icon: Puzzle,
    title: "Plugin Ecosystem",
    description: "Extend with integrations for cloud, APIs, compilers, and visualization tools."
  },
  {
    icon: Palette,
    title: "Visual Canvas",
    description: "Plan, design, and collaborate on code, systems, and architectures visually."
  },
  {
    icon: Shield,
    title: "End-to-End Security",
    description: "Privacy-first, encrypted by default."
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <IntroductionSection />
      
      {/* Headline Section */}
      <HeadlineSection />

      {/* Key Features */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Key Features</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-center">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
