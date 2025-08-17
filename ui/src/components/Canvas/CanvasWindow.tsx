import React from "react";
import { Canvas } from "./Canvas";
import { CanvasPanelType } from "./types";

interface CanvasWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialPanels?: CanvasPanelType[];
  title?: string;
  onContentAvailable?: (hasContent: boolean) => void;
}

export const CanvasWindow: React.FC<CanvasWindowProps> = ({
  isOpen,
  onClose,
  initialPanels = [],
  title = "Canvas Workspace",
  onContentAvailable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="canvas-tab-container">
      {/* VS Code-like tab header */}
      <div className="canvas-tab-header">
        <div className="canvas-tab-title">
          <span className="canvas-tab-icon">🎨</span>
          <span className="canvas-tab-text">{title}</span>
        </div>
        <button
          onClick={onClose}
          className="canvas-tab-close"
          title="Close Canvas"
        >
          ✕
        </button>
      </div>

      {/* Canvas content area */}
      <div className="canvas-tab-content">
        <Canvas
          initialPanels={initialPanels}
          onContentAvailable={onContentAvailable}
        />
      </div>
    </div>
  );
};

export default CanvasWindow;
