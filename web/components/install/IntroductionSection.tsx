"use client";

import BackgroundPaths from "@/components/background-paths";
import { useTheme } from "next-themes";

export default function IntroductionSection() {
  const { theme } = useTheme();

  return (
    <section className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden text-center">
      <BackgroundPaths
        title="Welcome to"
        subtitle="Your AI-Powered Coding Companion"
        showGif={true}
        gifSrc={
          theme === "dark"
            ? "/media/synapse-dark.gif"
            : "/media/synapse-light.gif"
        }
      />
    </section>
  );
}
