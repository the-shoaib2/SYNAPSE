import React from "react";
import { CanvasPanel } from "../CanvasPanel";
import { CanvasPanelType } from "../types";

export interface LayoutFreeformProps {
  panels: CanvasPanelType[];
  onPanelActivate: (panelId: string) => void;
  onPanelUpdate: (panelId: string, updates: Partial<CanvasPanelType>) => void;
  onPanelRemove: (panelId: string) => void;
  onPanelResize: (
    panelId: string,
    dimensions: { width: number; height: number },
  ) => void;
  onPanelMove: (panelId: string, position: { x: number; y: number }) => void;
  onDragStart: (panelId: string) => void;
  onDragOver: (e: React.DragEvent, panelId: string) => void;
  onDrop: (e: React.DragEvent, targetPanelId: string) => void;
  onDragEnd: () => void;
  activePanelId: string | null;
  className?: string;
}

export const LayoutFreeform: React.FC<LayoutFreeformProps> = ({
  panels,
  onPanelActivate,
  onPanelUpdate,
  onPanelRemove,
  onPanelResize,
  onPanelMove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  activePanelId,
  className = "",
}) => {
  return (
    <div className={`layout-freeform ${className}`}>
      {panels.map((panel) => (
        <CanvasPanel
          key={panel.id}
          panel={panel}
          isActive={activePanelId === panel.id}
          onActivate={() => onPanelActivate(panel.id)}
          onUpdate={(updates) => onPanelUpdate(panel.id, updates)}
          onRemove={() => onPanelRemove(panel.id)}
          onResize={(dimensions) => onPanelResize(panel.id, dimensions)}
          onMove={(position) => onPanelMove(panel.id, position)}
          className="freeform-panel"
        />
      ))}
    </div>
  );
};

