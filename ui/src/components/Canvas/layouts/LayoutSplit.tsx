import React from "react";
import { CanvasPanel } from "../CanvasPanel";
import { CanvasPanelType } from "../types";

export interface LayoutSplitProps {
  panels: CanvasPanelType[];
  onPanelActivate: (panelId: string) => void;
  onPanelUpdate: (panelId: string, updates: Partial<CanvasPanelType>) => void;
  onPanelRemove: (panelId: string) => void;
  onPanelResize: (
    panelId: string,
    dimensions: { width: number; height: number },
  ) => void;
  activePanelId: string | null;
  className?: string;
}

export const LayoutSplit: React.FC<LayoutSplitProps> = ({
  panels,
  onPanelActivate,
  onPanelUpdate,
  onPanelRemove,
  onPanelResize,
  activePanelId,
  className = "",
}) => {
  if (panels.length === 0) {
    return (
      <div className={`layout-split empty ${className}`}>
        <p>No panels available</p>
      </div>
    );
  }

  if (panels.length === 1) {
    return (
      <div className={`layout-split single ${className}`}>
        <CanvasPanel
          panel={panels[0]}
          isActive={activePanelId === panels[0].id}
          onActivate={() => onPanelActivate(panels[0].id)}
          onUpdate={(updates) => onPanelUpdate(panels[0].id, updates)}
          onRemove={() => onPanelRemove(panels[0].id)}
          onResize={(dimensions) => onPanelResize(panels[0].id, dimensions)}
          onMove={() => {}} // Split layout doesn't support moving
          className="split-panel"
        />
      </div>
    );
  }

  if (panels.length === 2) {
    return (
      <div className={`layout-split two-panels ${className}`}>
        <div className="split-panel left">
          <CanvasPanel
            panel={panels[0]}
            isActive={activePanelId === panels[0].id}
            onActivate={() => onPanelActivate(panels[0].id)}
            onUpdate={(updates) => onPanelUpdate(panels[0].id, updates)}
            onRemove={() => onPanelRemove(panels[0].id)}
            onResize={(dimensions) => onPanelResize(panels[0].id, dimensions)}
            onMove={() => {}}
            className="split-panel-content"
          />
        </div>
        <div className="split-divider vertical" />
        <div className="split-panel right">
          <CanvasPanel
            panel={panels[1]}
            isActive={activePanelId === panels[1].id}
            onActivate={() => onPanelActivate(panels[1].id)}
            onUpdate={(updates) => onPanelUpdate(panels[1].id, updates)}
            onRemove={() => onPanelRemove(panels[1].id)}
            onResize={(dimensions) => onPanelResize(panels[1].id, dimensions)}
            onMove={() => {}}
            className="split-panel-content"
          />
        </div>
      </div>
    );
  }

  // For more than 2 panels, use a grid-like split
  return (
    <div className={`layout-split grid ${className}`}>
      {panels.map((panel, index) => (
        <div key={panel.id} className={`split-panel grid-panel-${index}`}>
          <CanvasPanel
            panel={panel}
            isActive={activePanelId === panel.id}
            onActivate={() => onPanelActivate(panel.id)}
            onUpdate={(updates) => onPanelUpdate(panel.id, updates)}
            onRemove={() => onPanelRemove(panel.id)}
            onResize={(dimensions) => onPanelResize(panel.id, dimensions)}
            onMove={() => {}}
            className="split-panel-content"
          />
        </div>
      ))}
    </div>
  );
};

