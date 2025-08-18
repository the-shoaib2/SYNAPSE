import { useCallback, useState } from "react";
import { CanvasPanel } from "../components/Canvas/types";

export const useCanvasWindow = () => {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasPanels, setCanvasPanels] = useState<CanvasPanel[]>([]);
  const [canvasTitle, setCanvasTitle] = useState("Canvas Workspace");

  const openCanvas = useCallback((panels?: CanvasPanel[], title?: string) => {
    if (panels) {
      setCanvasPanels(panels);
    }
    if (title) {
      setCanvasTitle(title);
    }
    setIsCanvasOpen(true);
  }, []);

  const closeCanvas = useCallback(() => {
    setIsCanvasOpen(false);
  }, []);

  const addCanvasPanel = useCallback((panel: CanvasPanel) => {
    setCanvasPanels((prev) => [...prev, panel]);
  }, []);

  const removeCanvasPanel = useCallback((panelId: string) => {
    setCanvasPanels((prev) => prev.filter((p) => p.id !== panelId));
  }, []);

  return {
    isCanvasOpen,
    canvasPanels,
    canvasTitle,
    openCanvas,
    closeCanvas,
    addCanvasPanel,
    removeCanvasPanel,
  };
};
