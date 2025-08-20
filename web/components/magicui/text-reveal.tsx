"use client";

import { motion } from "motion/react";
import { ComponentPropsWithoutRef, FC, ReactNode, useRef, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string;
}

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string");
  }

  const words = children.split(" ");

  return (
    <div ref={containerRef} className={cn("relative z-0 h-[400vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-screen items-center justify-center bg-transparent px-[1rem]">
        <span className="flex flex-wrap justify-center p-8 text-4xl font-bold text-foreground/20 md:p-10 md:text-5xl lg:p-12 lg:text-6xl xl:text-7xl 2xl:text-8xl">
          {words.map((word, i) => (
            <Word key={i} index={i} totalWords={words.length} scrollY={scrollY} isMounted={isMounted}>
              {word}
            </Word>
          ))}
        </span>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  index: number;
  totalWords: number;
  scrollY: number;
  isMounted: boolean;
}

const Word: FC<WordProps> = ({ children, index, totalWords, scrollY, isMounted }) => {
  const containerHeight = 400 * 16; // 400vh in pixels
  const wordStart = (index / totalWords) * containerHeight;
  const wordEnd = ((index + 1) / totalWords) * containerHeight;
  
  const isVisible = scrollY >= wordStart && scrollY <= wordEnd;
  
  if (!isMounted) {
    return (
      <span className="relative mx-2 lg:mx-3">
        <span className="text-foreground">{children}</span>
      </span>
    );
  }
  
  return (
    <span className="relative mx-2 lg:mx-3">
      <span className="absolute text-foreground/20">{children}</span>
      <motion.span
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0.5, 
          y: isVisible ? 0 : 30 
        }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut"
        }}
        className="text-foreground inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
};
