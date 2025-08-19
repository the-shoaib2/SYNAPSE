import { useState } from "react";
import { CanvasPanel } from "../CanvasPanel";
import type { CanvasPanelType } from "../types";

export interface LayoutTabsProps {
  panels: CanvasPanelType[];
  onPanelActivate: (panelId: string) => void;
  onPanelUpdate: (panelId: string, updates: Partial<CanvasPanelType>) => void;
  onPanelRemove: (panelId: string) => void;
  activePanelId: string | null;
  className?: string;
}

export const LayoutTabs: React.FC<LayoutTabsProps> = ({
  panels,
  onPanelActivate,
  onPanelUpdate,
  onPanelRemove,
  activePanelId,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    activePanelId || panels[0]?.id || "",
  );

  const handleTabClick = (panelId: string) => {
    setActiveTab(panelId);
    onPanelActivate(panelId);
  };

  const handleTabClose = (panelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPanelRemove(panelId);

    // If we're closing the active tab, switch to another tab
    if (panelId === activeTab) {
      const remainingPanels = panels.filter((p) => p.id !== panelId);
      if (remainingPanels.length > 0) {
        setActiveTab(remainingPanels[0].id);
        onPanelActivate(remainingPanels[0].id);
      }
    }
  };

  if (panels.length === 0) {
    return (
      <div className={`layout-tabs empty ${className}`}>
        <p>No panels available</p>
      </div>
    );
  }

  return (
    <div className={`layout-tabs ${className}`}>
      {/* Tab Headers */}
      <div className="tab-headers">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={`tab-header ${activeTab === panel.id ? "active" : ""}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleTabClick(panel.id);
              }
            }}
            onClick={() => handleTabClick(panel.id)}
          >
            <span className="tab-icon">{panel.icon}</span>
            <span className="tab-title">
              {String(panel.config?.title || "Untitled")}
            </span>
            {panel.state.isClosable && (
              <button
                type="button"
                className="tab-close-button"
                onClick={(e) => handleTabClose(panel.id, e)}
                title="Close tab"
                aria-label="Close tab"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={`tab-panel ${activeTab === panel.id ? "active" : ""}`}
            style={{ display: activeTab === panel.id ? "block" : "none" }}
          >
            <CanvasPanel
              panel={panel}
              isActive={activePanelId === panel.id}
              onActivate={() => onPanelActivate(panel.id)}
              onUpdate={(updates) => onPanelUpdate(panel.id, updates)}
              onRemove={() => onPanelRemove(panel.id)}
              onResize={() => {}} // Tabs don't support resizing
              onMove={() => {}} // Tabs don't support moving
              className="tab-panel-content"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
