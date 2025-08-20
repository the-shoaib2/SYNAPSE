"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    // Use shadcn color for stroke
    color: undefined, // not used
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="text-foreground/60 h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.3 + path.id * 0.01}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function BackgroundPaths({
  title = "Background Paths",
  subtitle,
  showGif = false,
  gifSrc,
}: {
  title?: string;
  subtitle?: string;
  showGif?: boolean;
  gifSrc?: string;
}) {
  // Use provided subtitle or split title if a line break is present
  const mainTitle = title;
  const finalSubtitle =
    subtitle || (title.includes("\n") ? title.split("\n")[1] : undefined);
  return (
    <div className="bg-background dark:bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="text-foreground from-primary to-secondary mb-4 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl">
            {mainTitle.split(" ").map((word, wordIndex) => (
              <span key={wordIndex} className="mr-4 inline-block last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="from-primary to-secondary inline-block bg-gradient-to-r bg-clip-text text-transparent"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {showGif && gifSrc && (
            <div className="mb-6">
              <img
                src={gifSrc}
                alt="Synapse Demo"
                className="mx-auto h-auto w-full max-w-2xl rounded-lg shadow-lg"
              />
            </div>
          )}

          {finalSubtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: showGif ? 1.5 : 0.5 }}
              className="text-muted-foreground from-primary/70 to-secondary/70 mb-8 bg-gradient-to-r bg-clip-text text-xl font-medium text-transparent sm:text-2xl md:text-3xl"
            >
              {finalSubtitle}
            </motion.div>
          )}
          <div className="mt-2 flex justify-center gap-4">
            <Button
              variant="ghost"
              className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary/10 focus:ring-primary/50 rounded-full border px-8 py-6 text-lg font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 group-hover:-translate-y-0.5"
              asChild
            >
              <a
                href="https://marketplace.visualstudio.com/items?itemName=Synapse.synapse-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <span className="opacity-90 transition-opacity group-hover:opacity-100">
                  Try Extension
                </span>
                <span className="ml-3 opacity-70 transition-all duration-300 group-hover:translate-x-1.5 group-hover:opacity-100">
                  →
                </span>
              </a>
            </Button>

            <Button
              variant="ghost"
              className="relative overflow-hidden rounded-full border border-blue-400/30 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-8 py-6 text-lg font-semibold text-white shadow-md transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 group-hover:-translate-y-0.5"
              asChild
            >
              <a
                href="https://canvas-synapse.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center"
              >
                <span className="opacity-90 transition-opacity group-hover:opacity-100">
                  Try Canvas
                </span>
                <span className="ml-3 opacity-70 transition-all duration-300 group-hover:translate-x-1.5 group-hover:opacity-100">
                  →
                </span>
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
