import { AtSymbolIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui";
import { ToolTip } from "../ui/Tooltip";
import { useContext } from "react";
import { IdeMessengerContext } from "../../context/IdeMessenger";

interface InputContextToolbarProps {
  onAddContextItem?: () => void;
  hideAddContext?: boolean;
  isVisible?: boolean; // Control visibility - hide when prompt sent, show when typing
}

export default function InputContextToolbar(props: InputContextToolbarProps) {
  const ideMessenger = useContext(IdeMessengerContext);

  // Always show the context toolbar at the top
  // if (props.hideAddContext || !props.isVisible) {
  //   return null;
  // }

  const addCurrentFileAsContext = () => {
    // Send message to VS Code to add current file as context
    ideMessenger.post("context/addCurrentFile", undefined);
  };

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

      {/* Auto-add current file button */}
      <Button
        variant="outline"
        size="sm"
        onClick={addCurrentFileAsContext}
        title="Add current file as context"
        className="flex h-5 w-5 items-center justify-center p-0"
      >
        <DocumentIcon className="h-3 w-3" />
      </Button>
      <ToolTip id="add-current-file-tooltip" place="top">
        Add current file as context
      </ToolTip>
    </div>
  );
}
