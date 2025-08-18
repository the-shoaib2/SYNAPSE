import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCanvas } from "./CanvasContext";
import { PanelContent } from "./components/PanelContent";
import { PanelDragHandle } from "./components/PanelDragHandle";
import { PanelHeader } from "./components/PanelHeader";
import { PanelResizer } from "./components/PanelResizer";
import { PanelToolbar } from "./components/PanelToolbar";
import { CanvasPanel as CanvasPanelInterface, PanelState } from "./types";

export interface CanvasPanelProps {
  panel: CanvasPanelInterface;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (updates: Partial<CanvasPanelInterface>) => void;
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
  const { updatePanelState } = useCanvas();
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
      updatePanelState(panel.id, updatedState);

      // Call the panel's onStateChange callback if provided
      if (panel.onStateChange) {
        panel.onStateChange(updatedState);
      }
    },
    [localState, panel.id, panel.onStateChange, updatePanelState],
  );

  // Handle panel data updates
  const handleDataUpdate = useCallback(
    (newData: any) => {
      const updatedData = {
        ...panel.data,
        content: newData,
        timestamp: Date.now(),
      };

      // Update the panel data
      onUpdate({ data: updatedData });

      // Call the panel's onDataUpdate callback if provided
      if (panel.onDataUpdate) {
        panel.onDataUpdate(updatedData);
      }
    },
    [panel.data, panel.onDataUpdate, onUpdate],
  );

  // Handle panel actions
  const handleAction = useCallback(
    (actionId: string) => {
      if (panel.actions) {
        const action = panel.actions.find((a) => a.id === actionId);
        if (action && action.enabled) {
          action.action();

          // Call the panel's onAction callback if provided
          if (panel.onAction) {
            panel.onAction(actionId);
          }
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
    (newDimensions: { width: number; height: number }) => {
      // Update the panel dimensions
      onResize(newDimensions);

      // Call the panel's onResize callback if provided
      if (panel.onResize) {
        panel.onResize(newDimensions);
      }
    },
    [panel.onResize, onResize],
  );

  // Handle panel move
  const handleMove = useCallback(
    (newPosition: { x: number; y: number }) => {
      const newDimensions = panel.dimensions
        ? {
            ...panel.dimensions,
            position: newPosition,
          }
        : undefined;

      // Update the panel position
      onMove(newPosition);

      // Call the panel's onMove callback if provided
      if (panel.onMove) {
        panel.onMove(newPosition);
      }
    },
    [panel.dimensions, panel.onMove, onMove],
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (!panel.state.isDraggable) return;
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    },
    [panel.state.isDraggable],
  );

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && dragStartRef.current && panel.dimensions?.position) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        const newX = panel.dimensions.position.x + deltaX;
        const newY = panel.dimensions.position.y + deltaY;

        handleMove({ x: newX, y: newY });
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [isDragging, handleMove, panel.dimensions?.position],
  );

  // Handle mouse up for dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // Handle mouse move for resizing
  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing && panelRef.current && panel.dimensions) {
        const rect = panelRef.current.getBoundingClientRect();
        const newWidth = Math.max(200, e.clientX - rect.left);
        const newHeight = Math.max(150, e.clientY - rect.top);

        handleResize({ width: newWidth, height: newHeight });
      }
    },
    [isResizing, handleResize, panel.dimensions],
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

  // Add event listeners for dragging and resizing
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMouseMove);
      document.addEventListener("mouseup", handleResizeEnd);
      return () => {
        document.removeEventListener("mousemove", handleResizeMouseMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMouseMove, handleResizeEnd]);

  // Panel styles - with proper null checks
  const panelStyles = {
    position: "absolute" as const,
    left: panel.dimensions?.position?.x
      ? `${panel.dimensions.position.x}px`
      : "0px",
    top: panel.dimensions?.position?.y
      ? `${panel.dimensions.position.y}px`
      : "0px",
    width: panel.dimensions?.width ? `${panel.dimensions.width}px` : "300px",
    height: panel.dimensions?.height ? `${panel.dimensions.height}px` : "200px",
    minWidth: panel.dimensions?.minWidth
      ? `${panel.dimensions.minWidth}px`
      : "200px",
    minHeight: panel.dimensions?.minHeight
      ? `${panel.dimensions.minHeight}px`
      : "150px",
    maxWidth: panel.dimensions?.maxWidth
      ? `${panel.dimensions.maxWidth}px`
      : undefined,
    maxHeight: panel.dimensions?.maxHeight
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
      {panel.config?.showToolbar && (
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
          onResize={(width: number, height: number) =>
            handleResize({ width, height })
          }
          minWidth={panel.dimensions?.minWidth || 200}
          minHeight={panel.dimensions?.minHeight || 150}
          maxWidth={panel.dimensions?.maxWidth}
          maxHeight={panel.dimensions?.maxHeight}
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
      {localState.hasError && (
        <div className="panel-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">An error occurred</span>
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
