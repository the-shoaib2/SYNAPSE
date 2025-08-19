import type { CanvasPanel } from "../types";

export interface PanelHeaderProps {
  panel: CanvasPanel;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onPin: () => void;
  className?: string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  panel,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onPin,
  className = "",
}) => {
  return (
    <div className={`panel-header ${isActive ? "active" : ""} ${className}`}>
      {/* Panel Icon and Title */}
      <div className="panel-title-section">
        {panel.icon && (
          <span className="panel-icon" title={String(panel.description || "")}>
            {panel.icon}
          </span>
        )}
        <span className="panel-title" title={String(panel.description || "")}>
          {String(panel.config?.title || panel.title || "Untitled Panel")}
        </span>
        {panel.description && (
          <span className="panel-description" title={String(panel.description)}>
            {panel.description}
          </span>
        )}
      </div>

      {/* Panel Controls */}
      <div className="panel-controls">
        {/* Pin Button */}
        {panel.state.isPinned !== undefined && (
          <button
            type="button"
            className={`panel-control-button pin-button ${panel.state.isPinned ? "pinned" : ""}`}
            onClick={onPin}
            title={panel.state.isPinned ? "Unpin Panel" : "Pin Panel"}
            aria-label={panel.state.isPinned ? "Unpin Panel" : "Pin Panel"}
          >
            📌
          </button>
        )}

        {/* Minimize Button */}
        {panel.state.isMinimized !== undefined && (
          <button
            type="button"
            className={`panel-control-button minimize-button ${panel.state.isMinimized ? "minimized" : ""}`}
            onClick={onMinimize}
            title={panel.state.isMinimized ? "Restore Panel" : "Minimize Panel"}
            aria-label={
              panel.state.isMinimized ? "Restore Panel" : "Minimize Panel"
            }
          >
            {panel.state.isMinimized ? "⤢" : "⤢"}
          </button>
        )}

        {/* Maximize Button */}
        {panel.state.isMaximized !== undefined && (
          <button
            type="button"
            className={`panel-control-button maximize-button ${panel.state.isMaximized ? "maximized" : ""}`}
            onClick={onMaximize}
            title={panel.state.isMaximized ? "Restore Panel" : "Maximize Panel"}
            aria-label={
              panel.state.isMaximized ? "Restore Panel" : "Maximize Panel"
            }
          >
            {panel.state.isMaximized ? "⤢" : "⤡"}
          </button>
        )}

        {/* Close Button */}
        {panel.state.isClosable && (
          <button
            type="button"
            className="panel-control-button close-button"
            onClick={onClose}
            title="Close Panel"
            aria-label="Close Panel"
          >
            ✕
          </button>
        )}
      </div>

      {/* Panel Status Indicators */}
      <div className="panel-status">
        {panel.state.isLoading && (
          <span className="status-indicator loading" title="Loading">
            ⏳
          </span>
        )}
        {panel.state.hasError && (
          <span className="status-indicator error" title="Error">
            ⚠️
          </span>
        )}
        {panel.state.isPinned && (
          <span className="status-indicator pinned" title="Pinned">
            📌
          </span>
        )}
      </div>
    </div>
  );
};
