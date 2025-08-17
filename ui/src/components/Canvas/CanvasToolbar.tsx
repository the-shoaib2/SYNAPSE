import React, { useCallback, useState } from "react";
import { PanelFactory } from "./PanelFactory";
import { PanelType } from "./types";

export interface CanvasToolbarProps {
  onToggleFullscreen: () => void;
  onAddPanel: (panelType: PanelType) => void;
  isFullscreen: boolean;
  className?: string;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onToggleFullscreen,
  onAddPanel,
  isFullscreen,
  className = "",
}) => {
  const [showPanelMenu, setShowPanelMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Panel categories and types
  const panelCategories = {
    execution: ["execution-trace", "variable-watch", "call-stack"],
    compiler: ["ast-visualizer", "cfg-graph"],
    simulation: ["algorithm-simulation"],
    editor: ["code-editor", "output-console"],
    ai: ["ai-annotations"],
    visualization: ["timeline", "table", "graph", "chart"],
  };

  // Handle panel addition
  const handleAddPanel = useCallback(
    (panelType: PanelType) => {
      onAddPanel(panelType);
      setShowPanelMenu(false);
    },
    [onAddPanel],
  );

  // Handle category selection
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // Get available panel types for selected category
  const getAvailablePanelTypes = () => {
    if (selectedCategory === "all") {
      return Object.values(panelCategories).flat();
    }
    return (
      panelCategories[selectedCategory as keyof typeof panelCategories] || []
    );
  };

  // Get panel type info
  const getPanelTypeInfo = (type: PanelType) => {
    const factory = new PanelFactory();
    return factory.getPanelTypeInfo(type);
  };

  return (
    <div className={`canvas-toolbar ${className}`}>
      {/* Left side - Panel controls */}
      <div className="toolbar-left">
        <button
          className="toolbar-button add-panel-button"
          onClick={() => setShowPanelMenu(!showPanelMenu)}
          aria-label="Add new panel"
        >
          <span className="button-icon">+</span>
          <span className="button-text">Add Panel</span>
        </button>

        {/* Panel Menu Dropdown */}
        {showPanelMenu && (
          <div className="panel-menu-dropdown">
            {/* Category Selector */}
            <div className="category-selector">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                aria-label="Select panel category"
              >
                <option value="all">All Categories</option>
                {Object.keys(panelCategories).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Panel Type List */}
            <div className="panel-type-list">
              {getAvailablePanelTypes().map((panelType) => {
                const info = getPanelTypeInfo(panelType as PanelType);
                return (
                  <button
                    key={panelType}
                    className="panel-type-item"
                    onClick={() => handleAddPanel(panelType as PanelType)}
                    title={info.description}
                  >
                    <span className="panel-type-icon">{info.icon}</span>
                    <span className="panel-type-name">{info.name}</span>
                    <span className="panel-type-description">
                      {info.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Center - Layout controls */}
      <div className="toolbar-center">
        <div className="layout-presets">
          <button
            className="toolbar-button layout-preset-button"
            onClick={() => {
              /* TODO: Apply grid layout */
            }}
            title="Grid Layout"
          >
            <span className="button-icon">⊞</span>
          </button>

          <button
            className="toolbar-button layout-preset-button"
            onClick={() => {
              /* TODO: Apply freeform layout */
            }}
            title="Freeform Layout"
          >
            <span className="button-icon">⊟</span>
          </button>

          <button
            className="toolbar-button layout-preset-button"
            onClick={() => {
              /* TODO: Apply tab layout */
            }}
            title="Tab Layout"
          >
            <span className="button-icon">⊡</span>
          </button>

          <button
            className="toolbar-button layout-preset-button"
            onClick={() => {
              /* TODO: Apply split layout */
            }}
            title="Split Layout"
          >
            <span className="button-icon">⊞⊞</span>
          </button>
        </div>
      </div>

      {/* Right side - View controls */}
      <div className="toolbar-right">
        <button
          className="toolbar-button view-button"
          onClick={() => {
            /* TODO: Toggle minimap */
          }}
          title="Toggle Minimap"
        >
          <span className="button-icon">🗺️</span>
        </button>

        <button
          className="toolbar-button view-button"
          onClick={() => {
            /* TODO: Toggle grid */
          }}
          title="Toggle Grid"
        >
          <span className="button-icon">#</span>
        </button>

        <button
          className="toolbar-button view-button"
          onClick={() => {
            /* TODO: Reset zoom */
          }}
          title="Reset Zoom"
        >
          <span className="button-icon">🔍</span>
        </button>

        <button
          className="toolbar-button view-button"
          onClick={() => {
            /* TODO: Fit to view */
          }}
          title="Fit to View"
        >
          <span className="button-icon">⤢</span>
        </button>

        <button
          className="toolbar-button fullscreen-button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <span className="button-icon">{isFullscreen ? "⤢" : "⤡"}</span>
        </button>
      </div>

      {/* Click outside to close panel menu */}
      {showPanelMenu && (
        <div
          className="panel-menu-overlay"
          onClick={() => setShowPanelMenu(false)}
        />
      )}
    </div>
  );
};

