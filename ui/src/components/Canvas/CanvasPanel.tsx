import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasContext } from "./CanvasContext";
import { PanelContent } from "./components/PanelContent";
import { PanelDragHandle } from "./components/PanelDragHandle";
import { PanelHeader } from "./components/PanelHeader";
import { PanelResizer } from "./components/PanelResizer";
import { PanelToolbar } from "./components/PanelToolbar";
import { CanvasPanelType, PanelState } from "./types";

export interface CanvasPanelProps {
  panel: CanvasPanelType;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (updates: Partial<CanvasPanelType>) => void;
  onRemove: () => void;
  onResize: (dimensions: { width: number; height: number }) => void;
  onMove: (position: { x: number; y: number }) => void;
  className?: string;
}

export const CanvasPanel: React.FC<CanvasPanelProps> = ({
  panel,
  isActive,
  onActivate,
  onUpdate,
  onRemove,
  onResize,
  onMove,
  className = "",
}) => {
  const { updatePanel } = useCanvasContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [localState, setLocalState] = useState<PanelState>(panel.state);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Update local state when panel state changes
  useEffect(() => {
    setLocalState(panel.state);
  }, [panel.state]);

  // Handle panel activation
  const handleActivate = useCallback(() => {
    onActivate();
  }, [onActivate]);

  // Handle panel state changes
  const handleStateChange = useCallback(
    (newState: Partial<PanelState>) => {
      const updatedState = { ...localState, ...newState };
      setLocalState(updatedState);

      // Update the panel in the context
      updatePanel(panel.id, { state: updatedState });

      // Call the panel's onStateChange callback if provided
      if (panel.onStateChange) {
        panel.onStateChange(updatedState);
      }
    },
    [localState, panel.id, panel.onStateChange, updatePanel],
  );

  // Handle panel data updates
  const handleDataUpdate = useCallback(
    (newData: any) => {
      const updatedData = {
        ...panel.data,
        content: newData,
        timestamp: Date.now(),
      };

      // Update the panel in the context
      updatePanel(panel.id, { data: updatedData });

      // Call the panel's onDataUpdate callback if provided
      if (panel.onDataUpdate) {
        panel.onDataUpdate(updatedData);
      }
    },
    [panel.data, panel.id, panel.onDataUpdate, updatePanel],
  );

  // Handle panel actions
  const handleAction = useCallback(
    (actionId: string) => {
      const action = panel.actions.find((a) => a.id === actionId);
      if (action && action.enabled) {
        action.action();

        // Call the panel's onAction callback if provided
        if (panel.onAction) {
          panel.onAction(actionId);
        }
      }
    },
    [panel.actions, panel.onAction],
  );

  // Handle panel close
  const handleClose = useCallback(() => {
    if (panel.onClose) {
      panel.onClose();
    }
    onRemove();
  }, [panel.onClose, onRemove]);

  // Handle panel resize
  const handleResize = useCallback(
    (width: number, height: number) => {
      const newDimensions = {
        ...panel.dimensions,
        position: {
          ...panel.dimensions.position,
          width,
          height,
        },
      };

      // Update the panel in the context
      updatePanel(panel.id, { dimensions: newDimensions });

      // Call the onResize callback
      onResize({ width, height });

      // Call the panel's onResize callback if provided
      if (panel.onResize) {
        panel.onResize(newDimensions);
      }
    },
    [panel.dimensions, panel.id, panel.onResize, onResize, updatePanel],
  );

  // Handle panel move
  const handleMove = useCallback(
    (x: number, y: number) => {
      const newDimensions = {
        ...panel.dimensions,
        position: {
          ...panel.dimensions.position,
          x,
          y,
        },
      };

      // Update the panel in the context
      updatePanel(panel.id, { dimensions: newDimensions });

      // Call the onMove callback
      onMove({ x, y });

      // Call the panel's onMove callback if provided
      if (panel.onMove) {
        panel.onMove(newDimensions.position);
      }
    },
    [panel.dimensions, panel.id, panel.onMove, onMove, updatePanel],
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (!panel.state.isDraggable) return;

      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      // Add global mouse event listeners
      const handleMouseMove = (e: MouseEvent) => {
        if (dragStartRef.current) {
          const deltaX = e.clientX - dragStartRef.current.x;
          const deltaY = e.clientY - dragStartRef.current.y;

          const newX = panel.dimensions.position.x + deltaX;
          const newY = panel.dimensions.position.y + deltaY;

          handleMove(newX, newY);
          dragStartRef.current = { x: e.clientX, y: e.clientY };
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        dragStartRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [panel.state.isDraggable, panel.dimensions.position, handleMove],
  );

  // Handle resize start
  const handleResizeStart = useCallback(() => {
    if (!panel.state.isResizable) return;
    setIsResizing(true);
  }, [panel.state.isResizable]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Panel styles
  const panelStyles = {
    position: "absolute" as const,
    left: `${panel.dimensions.position.x}px`,
    top: `${panel.dimensions.position.y}px`,
    width: `${panel.dimensions.position.width}px`,
    height: `${panel.dimensions.position.height}px`,
    minWidth: `${panel.dimensions.minWidth}px`,
    minHeight: `${panel.dimensions.minHeight}px`,
    maxWidth: panel.dimensions.maxWidth
      ? `${panel.dimensions.maxWidth}px`
      : undefined,
    maxHeight: panel.dimensions.maxHeight
      ? `${panel.dimensions.maxHeight}px`
      : undefined,
    zIndex: isActive ? 10 : 1,
    opacity: localState.isMinimized ? 0.5 : 1,
    transform: localState.isMinimized ? "scale(0.8)" : "scale(1)",
    transition: "all 0.2s ease-in-out",
  };

  // Don't render if panel is not visible
  if (!localState.isVisible) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={`canvas-panel ${isActive ? "active" : ""} ${isDragging ? "dragging" : ""} ${isResizing ? "resizing" : ""} ${className}`}
      style={panelStyles}
      onClick={handleActivate}
      onMouseDown={handleDragStart}
    >
      {/* Panel Header */}
      <PanelHeader
        panel={panel}
        isActive={isActive}
        onClose={handleClose}
        onMinimize={() =>
          handleStateChange({ isMinimized: !localState.isMinimized })
        }
        onMaximize={() =>
          handleStateChange({ isMaximized: !localState.isMaximized })
        }
        onPin={() => handleStateChange({ isPinned: !localState.isPinned })}
      />

      {/* Panel Toolbar */}
      {panel.config.showToolbar && (
        <PanelToolbar panel={panel} onAction={handleAction} />
      )}

      {/* Panel Content */}
      <PanelContent
        panel={panel}
        isActive={isActive}
        onDataUpdate={handleDataUpdate}
        onStateChange={handleStateChange}
      />

      {/* Panel Resizer */}
      {panel.state.isResizable && (
        <PanelResizer
          onResizeStart={handleResizeStart}
          onResizeEnd={handleResizeEnd}
          onResize={handleResize}
          minWidth={panel.dimensions.minWidth}
          minHeight={panel.dimensions.minHeight}
          maxWidth={panel.dimensions.maxWidth}
          maxHeight={panel.dimensions.maxHeight}
        />
      )}

      {/* Panel Drag Handle */}
      {panel.state.isDraggable && (
        <PanelDragHandle
          onDragStart={handleDragStart}
          isDragging={isDragging}
        />
      )}

      {/* Error Display */}
      {localState.hasError && localState.errorMessage && (
        <div className="panel-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{localState.errorMessage}</span>
        </div>
      )}

      {/* Loading Indicator */}
      {localState.isLoading && (
        <div className="panel-loading">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading...</span>
        </div>
      )}
    </div>
  );
};

