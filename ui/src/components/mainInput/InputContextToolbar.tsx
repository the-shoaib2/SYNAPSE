import { AtSymbolIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { Button } from "../ui";
import { ToolTip } from "../ui/Tooltip";
import FileIcon from "../FileIcon";

/**
 * InputContextToolbar component
 * Controls the context-related buttons displayed above the input area
 */
interface InputContextToolbarProps {
  onAddContextItem?: () => void; // Callback when @ button is clicked
  hideAddContext?: boolean; // Whether to hide the entire context toolbar
  isVisible?: boolean; // Control visibility - hide when prompt sent, show when typing
  currentFileName?: string; // Current file name to display for auto-context
}

/**
 * InputContextToolbar - Displays context-related buttons above the chat input
 * Shows @ button, current file context, and auto-context controls
 */
export default function InputContextToolbar(props: InputContextToolbarProps) {
  // State to control whether auto-context feature is enabled
  const [showAutoContext, setShowAutoContext] = useState(true);
  // State to track hover state for the file context button
  const [isFileContextHovered, setIsFileContextHovered] = useState(false);

  /**
   * Handler for adding the current file as context
   * Uses the existing context system via the parent component
   */
  const addCurrentFileAsContext = () => {
    props.onAddContextItem?.();
  };

  /**
   * Handler for removing the auto-context feature
   * Hides the current file context and remove button
   */
  const removeAutoContext = () => {
    setShowAutoContext(false);
  };

  // Early return if context is disabled, not visible, or when streaming
  if (props.hideAddContext || !props.isVisible) {
    return null;
  }

  return (
    <div className="mb-1 flex justify-start gap-2">
      {/* @ Button - Manual context attachment button */}
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

      {/* Current File Context Section - Shows file icon + filename + add button */}
      {showAutoContext && props.currentFileName && (
        <Button
          variant="outline"
          size="sm"
          onClick={addCurrentFileAsContext}
          title={`Add ${props.currentFileName} as context`}
          className="flex h-5 items-center justify-center gap-1 hover:text-red-700"
          onMouseEnter={() => setIsFileContextHovered(true)}
          onMouseLeave={() => setIsFileContextHovered(false)}
        >
          {isFileContextHovered ? (
            <XMarkIcon className="h-3 w-3" />
          ) : (
            <FileIcon
              filename={props.currentFileName}
              height="12px"
              width="12px"
            />
          )}
          {/* Filename display - truncated if too long */}
          <span className="max-w-32 truncate text-xs text-gray-500">
            {props.currentFileName}
          </span>
        </Button>
      )}

      {/* Tooltip for remove auto-context button */}
      {showAutoContext && (
        <ToolTip id="remove-auto-context-tooltip" place="top">
          Remove auto-context
        </ToolTip>
      )}
    </div>
  );
}
