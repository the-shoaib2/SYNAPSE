import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui";
import { ToolTip } from "../ui/Tooltip";

interface InputContextToolbarProps {
  onAddContextItem?: () => void;
  hideAddContext?: boolean;
  isVisible?: boolean; // Control visibility - hide when prompt sent, show when typing
}

export default function InputContextToolbar(props: InputContextToolbarProps) {
  if (props.hideAddContext || !props.isVisible) {
    return null;
  }

  return (
    <div className="mb-1 flex justify-start">
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
    </div>
  );
}
