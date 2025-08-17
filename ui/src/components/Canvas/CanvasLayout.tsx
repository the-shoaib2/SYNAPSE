import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasContext } from "./CanvasContext";
import { CanvasPanel } from "./CanvasPanel";
import { LayoutFreeform } from "./layouts/LayoutFreeform";
import { LayoutSplit } from "./layouts/LayoutSplit";
import { LayoutTabs } from "./layouts/LayoutTabs";
import { CanvasLayoutType, CanvasPanelData } from "./types";

export interface CanvasLayoutProps {
  panels: CanvasPanelData[];
  onPanelUpdate: (panelId: string, updates: Partial<CanvasPanelData>) => void;
  onPanelRemove: (panelId: string) => void;
  onPanelActivate: (panelId: string | null) => void;
  activePanelId: string | null;
  className?: string;
}

export const CanvasLayout: React.FC<CanvasLayoutProps> = ({
  panels,
  onPanelUpdate,
  onPanelRemove,
  onPanelActivate,
  activePanelId,
  className = "",
}) => {
  const { layout, updateLayout } = useCanvasContext();
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  // Handle panel activation
  const handlePanelActivate = useCallback(
    (panelId: string) => {
      onPanelActivate(panelId);
    },
    [onPanelActivate],
  );

  // Handle panel updates
  const handlePanelUpdate = useCallback(
    (panelId: string, updates: Partial<CanvasPanelData>) => {
      onPanelUpdate(panelId, updates);
    },
    [onPanelUpdate],
  );

  // Handle panel removal
  const handlePanelRemove = useCallback(
    (panelId: string) => {
      onPanelRemove(panelId);
    },
    [onPanelRemove],
  );

  // Handle panel resize
  const handlePanelResize = useCallback(
    (panelId: string, dimensions: { width: number; height: number }) => {
      const panel = panels.find((p) => p.id === panelId);
      if (panel) {
        const updatedDimensions = {
          ...panel.dimensions,
          position: {
            ...panel.dimensions.position,
            width: dimensions.width,
            height: dimensions.height,
          },
        };

        onPanelUpdate(panelId, { dimensions: updatedDimensions });

        // Update layout if needed
        updateLayout({
          panelPositions: {
            ...layout.panelPositions,
            [panelId]: updatedDimensions.position,
          },
        });
      }
    },
    [panels, onPanelUpdate, layout.panelPositions, updateLayout],
  );

  // Handle panel move
  const handlePanelMove = useCallback(
    (panelId: string, position: { x: number; y: number }) => {
      const panel = panels.find((p) => p.id === panelId);
      if (panel) {
        const updatedDimensions = {
          ...panel.dimensions,
          position: {
            ...panel.dimensions.position,
            x: position.x,
            y: position.y,
          },
        };

        onPanelUpdate(panelId, { dimensions: updatedDimensions });

        // Update layout if needed
        updateLayout({
          panelPositions: {
            ...layout.panelPositions,
            [panelId]: updatedDimensions.position,
          },
        });
      }
    },
    [panels, onPanelUpdate, layout.panelPositions, updateLayout],
  );

  // Handle drag and drop between panels
  const handleDragStart = useCallback((panelId: string) => {
    setIsDragging(true);
    setDragTarget(panelId);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, panelId: string) => {
      e.preventDefault();
      if (dragTarget && dragTarget !== panelId) {
        setDropTarget(panelId);
      }
    },
    [dragTarget],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetPanelId: string) => {
      e.preventDefault();

      if (dragTarget && dropTarget && dragTarget !== dropTarget) {
        // Handle panel docking or merging logic here
        console.log(`Dropping panel ${dragTarget} onto ${dropTarget}`);

        // Reset drag state
        setIsDragging(false);
        setDragTarget(null);
        setDropTarget(null);
      }
    },
    [dragTarget, dropTarget],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragTarget(null);
    setDropTarget(null);
  }, []);

  // Auto-arrange panels if using grid layout
  useEffect(() => {
    if (layout.type === "grid" && panels.length > 0) {
      // Calculate grid positions manually
      const cellWidth = 100 / layout.columns;
      const cellHeight = 100 / layout.rows;
      const positions: Record<string, any> = {};

      panels.forEach((panel, index) => {
        const row = Math.floor(index / layout.columns);
        const col = index % layout.columns;

        if (row < layout.rows) {
          positions[panel.id] = {
            x: col * cellWidth,
            y: row * cellHeight,
            width: cellWidth,
            height: cellHeight,
          };
        }
      });

      // Update panel positions
      Object.entries(positions).forEach(([panelId, position]) => {
        const panel = panels.find((p) => p.id === panelId);
        if (panel) {
          const updatedDimensions = {
            ...panel.dimensions,
            position,
          };
          onPanelUpdate(panelId, {
            dimensions: {
              ...panel.dimensions,
              position: {
                x: position.x,
                y: position.y,
                width: position.width,
                height: position.height,
              },
            },
          });
        }
      });

      // Update layout
      updateLayout({ panelPositions: positions });
    }
  }, [
    layout.type,
    layout.columns,
    layout.rows,
    panels.length,
    onPanelUpdate,
    updateLayout,
  ]);

  // Render layout based on type
  const renderLayout = () => {
    switch (layout.type) {
      case "grid":
        return (
          <div className="grid-layout">
            {panels.map((panel) => (
              <CanvasPanel
                key={panel.id}
                panel={panel}
                isActive={activePanelId === panel.id}
                onActivate={() => handlePanelActivate(panel.id)}
                onRemove={() => handlePanelRemove(panel.id)}
                onUpdate={(updates) => handlePanelUpdate(panel.id, updates)}
                onResize={({ width, height }) =>
                  handlePanelResize(panel.id, { width, height })
                }
                onMove={({ x, y }) => handlePanelMove(panel.id, { x, y })}
                className="grid-panel"
              />
            ))}
          </div>
        );

      case "freeform":
        return (
          <LayoutFreeform
            panels={panels}
            onPanelActivate={handlePanelActivate}
            onPanelUpdate={handlePanelUpdate}
            onPanelRemove={handlePanelRemove}
            onPanelResize={handlePanelResize}
            onPanelMove={handlePanelMove}
            activePanelId={activePanelId}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        );

      case "tabs":
        return (
          <LayoutTabs
            panels={panels}
            onPanelActivate={handlePanelActivate}
            onPanelUpdate={handlePanelUpdate}
            onPanelRemove={handlePanelRemove}
            activePanelId={activePanelId}
          />
        );

      case "split":
        return (
          <LayoutSplit
            panels={panels}
            onPanelActivate={handlePanelActivate}
            onPanelUpdate={handlePanelUpdate}
            onPanelRemove={handlePanelRemove}
            onPanelResize={handlePanelResize}
            activePanelId={activePanelId}
          />
        );

      default:
        return (
          <LayoutFreeform
            panels={panels}
            onPanelActivate={handlePanelActivate}
            onPanelUpdate={handlePanelUpdate}
            onPanelRemove={handlePanelRemove}
            onPanelResize={handlePanelResize}
            onPanelMove={handlePanelMove}
            activePanelId={activePanelId}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        );
    }
  };

  // Handle layout change
  const handleLayoutChange = useCallback(
    (newLayout: Partial<CanvasLayoutType>) => {
      updateLayout(newLayout);
    },
    [updateLayout],
  );

  return (
    <div
      ref={layoutRef}
      className={`canvas-layout ${layout.type} ${isDragging ? "dragging" : ""} ${className}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      {/* Layout Controls */}
      <div className="layout-controls">
        <select
          value={layout.type}
          onChange={(e) => handleLayoutChange({ type: e.target.value as any })}
          className="layout-selector"
          aria-label="Select layout type"
        >
          <option value="grid">Grid Layout</option>
          <option value="freeform">Freeform Layout</option>
          <option value="tabs">Tab Layout</option>
          <option value="split">Split Layout</option>
        </select>

        {layout.type === "grid" && (
          <div className="grid-controls">
            <label>
              Columns:
              <input
                type="number"
                min="1"
                max="10"
                value={layout.columns}
                onChange={(e) =>
                  handleLayoutChange({ columns: parseInt(e.target.value) })
                }
                className="grid-input"
              />
            </label>
            <label>
              Rows:
              <input
                type="number"
                min="1"
                max="10"
                value={layout.rows}
                onChange={(e) =>
                  handleLayoutChange({ rows: parseInt(e.target.value) })
                }
                className="grid-input"
              />
            </label>
          </div>
        )}

        <button
          onClick={() => {
            // Auto-arrange panels
            if (layout.type === "grid") {
              // Calculate grid positions manually since LayoutGrid is a utility class
              const cellWidth = 100 / layout.columns;
              const cellHeight = 100 / layout.rows;
              const positions: Record<string, any> = {};

              panels.forEach((panel, index) => {
                const row = Math.floor(index / layout.columns);
                const col = index % layout.columns;

                if (row < layout.rows) {
                  positions[panel.id] = {
                    x: col * cellWidth,
                    y: row * cellHeight,
                    width: cellWidth,
                    height: cellHeight,
                  };
                }
              });
              updateLayout({ panelPositions: positions });
            }
          }}
          className="arrange-button"
        >
          Auto-arrange
        </button>
      </div>

      {/* Layout Content */}
      <div className="layout-content">{renderLayout()}</div>

      {/* Drop Zone Indicator */}
      {isDragging && !dropTarget && (
        <div className="drop-zone-indicator">
          <div className="drop-zone-content">
            <span className="drop-zone-text">Drop panel here to dock</span>
          </div>
        </div>
      )}
    </div>
  );
};
