import { useCallback, useState } from "react";
import { CanvasPanelType } from "../components/Canvas/types";

export const useCanvasWindow = () => {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasPanels, setCanvasPanels] = useState<CanvasPanelType[]>([]);
  const [canvasTitle, setCanvasTitle] = useState("Canvas Workspace");

  const openCanvas = useCallback(
    (panels?: CanvasPanelType[], title?: string) => {
      if (panels) {
        setCanvasPanels(panels);
      }
      if (title) {
        setCanvasTitle(title);
      }
      setIsCanvasOpen(true);
    },
    [],
  );

  const closeCanvas = useCallback(() => {
    setIsCanvasOpen(false);
  }, []);

  const addCanvasPanel = useCallback((panel: CanvasPanelType) => {
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
