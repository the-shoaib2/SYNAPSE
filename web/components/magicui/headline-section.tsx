"use client";

import { Typewriter } from "@/components/magicui/typewriter";
import { Button } from "@/components/ui/button";
import { Code2, Globe } from "lucide-react";

export default function HeadlineSection() {
  return (
    <div className="bg-muted/30">
      {/* Typewriter Section */}
      <div className="flex h-screen items-center justify-center">
        <Typewriter
          text="Build Visualize Learn Innovate Faster with Synapse."
          speed={5}
          delay={17}
        />
      </div>

      {/* Description and Buttons */}
      <div className="mx-auto max-w-7xl px-4 pb-16 text-center sm:px-6 lg:px-8">
        <p className="text-foreground mx-auto mb-8 max-w-4xl text-lg sm:text-xl">
          Synapse is an intelligent coding workspace that merges AI-driven
          assistance, visual workflows, and real-time collaboration — designed
          to supercharge developers, creators, and teams.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="group" asChild>
            <a
              href="https://marketplace.visualstudio.com/items?itemName=Synapse.synapse-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Code2 className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Get Started Free
            </a>
          </Button>
          <Button variant="outline" size="lg" className="group">
            <Globe className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            Explore Docs
          </Button>
        </div>
      </div>
    </div>
  );
}
