"use client";

import { Button } from "@/components/ui/button";
import { Code2, Globe } from "lucide-react";
import { TextReveal } from "@/components/magicui/text-reveal";

export default function HeadlineSection() {
  return (
    <div className="bg-muted/30">
      {/* Text Reveal Section */}
      <TextReveal>
        Build Visualize Learn Innovate Faster with Synapse.
      </TextReveal>
      
      {/* Description and Buttons */}
      <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8 pb-16">
        <p className="text-lg sm:text-xl text-foreground max-w-4xl mx-auto mb-8">
          Synapse is an intelligent coding workspace that merges AI-driven assistance, visual workflows, and real-time collaboration — designed to supercharge developers, creators, and teams.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="group" asChild>
            <a 
              href="https://marketplace.visualstudio.com/items?itemName=Synapse.synapse-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Code2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Get Started Free
            </a>
          </Button>
          <Button variant="outline" size="lg" className="group">
            <Globe className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Explore Docs
          </Button>
        </div>
      </div>
    </div>
  );
}
