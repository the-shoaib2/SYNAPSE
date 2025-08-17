import React from "react";

export interface PanelResizerProps {
  onResizeStart: () => void;
  onResizeEnd: () => void;
  onResize: (width: number, height: number) => void;
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}

export const PanelResizer: React.FC<PanelResizerProps> = ({
  onResizeStart,
  onResizeEnd,
  onResize,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  className = "",
}) => {
  return (
    <div className={`panel-resizer ${className}`}>
      <div className="resize-handle resize-handle-se" />
      <div className="resize-handle resize-handle-sw" />
      <div className="resize-handle resize-handle-ne" />
      <div className="resize-handle resize-handle-nw" />
    </div>
  );
};

