"use client";

import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";

export interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export const Typewriter: FC<TypewriterProps> = ({
  text,
  className,
  speed = 7,
  delay = 33,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(
        () => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        },
        delay + currentIndex * speed,
      );

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, delay]);

  return (
    <div
      className={cn(
        "flex flex-wrap justify-center p-8 text-4xl font-bold md:p-10 md:text-5xl lg:p-12 lg:text-6xl xl:text-7xl 2xl:text-8xl",
        className,
      )}
    >
      <span className="text-foreground">
        {displayedText}
        {currentIndex < text.length && <span className="animate-pulse">|</span>}
      </span>
    </div>
  );
};
