import React from "react";
import { CanvasPanelType } from "../types";

export interface PanelToolbarProps {
  panel: CanvasPanelType;
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
      {panel.actions.map((action) => (
        <button
          key={action.id}
          className={`toolbar-button ${action.enabled ? "enabled" : "disabled"}`}
          onClick={() => action.enabled && onAction(action.id)}
          disabled={!action.enabled}
          title={action.description}
        >
          {action.icon && <span className="action-icon">{action.icon}</span>}
          <span className="action-name">{action.name}</span>
        </button>
      ))}
    </div>
  );
};

