"use client";

import IntroductionSection from "@/components/install/IntroductionSection";
import HeadlineSection from "@/components/magicui/headline-section";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Puzzle, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Editor",
    description:
      "Autocomplete, debugging, and code explanations with multiple AI models.",
  },
  {
    icon: Puzzle,
    title: "Plugin Ecosystem",
    description:
      "Extend with integrations for cloud, APIs, compilers, and visualization tools.",
  },
  {
    icon: Palette,
    title: "Visual Canvas",
    description:
      "Plan, design, and collaborate on code, systems, and architectures visually.",
  },
  {
    icon: Shield,
    title: "End-to-End Security",
    description: "Privacy-first, encrypted by default.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <IntroductionSection />

      {/* Headline Section */}
      <HeadlineSection />

      {/* Key Features */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
              Key Features
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                <Card className="hover:border-primary/20 h-full border-2 border-transparent transition-all duration-300 hover:shadow-xl">
                  <CardContent className="pt-6">
                    <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
                      <feature.icon className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="text-foreground mb-2 text-center font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-center text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
