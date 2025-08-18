import React from "react";
import { CanvasPanel } from "../types";

export interface PanelToolbarProps {
  panel: CanvasPanel;
  onAction: (actionId: string) => void;
  className?: string;
}

export const PanelToolbar: React.FC<PanelToolbarProps> = ({
  panel,
  onAction,
  className = "",
}) => {
  return (
    <div className={`panel-toolbar ${className}`}>
      {panel.actions &&
        panel.actions.map((action) => (
          <button
            key={action.id}
            className={`toolbar-action ${action.enabled ? "enabled" : "disabled"}`}
            onClick={() => onAction(action.id)}
            disabled={!action.enabled}
            title={action.description}
            aria-label={action.label}
          >
            {action.icon && <span className="action-icon">{action.icon}</span>}
            <span className="action-name">{action.name || action.label}</span>
          </button>
        ))}
    </div>
  );
};
