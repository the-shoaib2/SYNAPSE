import {
  AtSymbolIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "../ui";
import { ToolTip } from "../ui/Tooltip";

interface InputContextToolbarProps {
  onAddContextItem?: () => void;
  hideAddContext?: boolean;
  isVisible?: boolean; // Control visibility - hide when prompt sent, show when typing
  currentFileName?: string; // Current file name to display
}

export default function InputContextToolbar(props: InputContextToolbarProps) {
  const [showAutoContext, setShowAutoContext] = useState(true);

  const addCurrentFileAsContext = () => {
    // Use the existing context system
    props.onAddContextItem?.();
  };

  const removeAutoContext = () => {
    setShowAutoContext(false);
  };

  // Hide when context is disabled, when not visible, or when streaming
  if (props.hideAddContext || !props.isVisible) {
    return null;
  }

  return (
    <div className="mb-1 flex justify-start gap-2">
      {/* @ button for manual context attachment */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => props.onAddContextItem?.()}
        title="Insert @ character"
        className="flex h-5 w-5 items-center justify-center p-0"
      >
        <AtSymbolIcon className="h-3 w-3" />
      </Button>
      <ToolTip id="insert-at-symbol-tooltip" place="top">
        Insert @ character
      </ToolTip>

      {/* Auto-add current file button - only show if auto-context is enabled and there's a current file */}
      {showAutoContext && props.currentFileName && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={addCurrentFileAsContext}
            title={`Add ${props.currentFileName} as context`}
            className="flex h-5 w-5 items-center justify-center p-0"
          >
            <DocumentIcon className="h-3 w-3" />
          </Button>
          <span className="max-w-32 truncate text-xs text-gray-500">
            {props.currentFileName}
          </span>
        </div>
      )}
      {showAutoContext && props.currentFileName && (
        <ToolTip id="add-current-file-tooltip" place="top">
          Add {props.currentFileName} as context
        </ToolTip>
      )}

      {/* Remove auto-context button */}
      {showAutoContext && (
        <Button
          variant="ghost"
          size="sm"
          onClick={removeAutoContext}
          title="Remove auto-context"
          className="flex h-4 w-4 items-center justify-center p-0"
        >
          <XMarkIcon className="h-3 w-3" />
        </Button>
      )}
      {showAutoContext && (
        <ToolTip id="remove-auto-context-tooltip" place="top">
          Remove auto-context
        </ToolTip>
      )}
    </div>
  );
}
