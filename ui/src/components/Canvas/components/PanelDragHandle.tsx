import React from "react";

export interface PanelDragHandleProps {
  onDragStart: (e: React.MouseEvent) => void;
  isDragging: boolean;
  className?: string;
}

export const PanelDragHandle: React.FC<PanelDragHandleProps> = ({
  onDragStart,
  isDragging,
  className = "",
}) => {
  return (
    <div
      className={`panel-drag-handle ${isDragging ? "dragging" : ""} ${className}`}
    >
      <div className="drag-indicator">⋮⋮</div>
    </div>
  );
};

