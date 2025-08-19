import { ChatHistoryItem } from "core";
import { renderChatMessage, stripImages } from "core/util/messageContent";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { selectUIConfig } from "../../redux/slices/configSlice";
import { deleteMessage } from "../../redux/slices/sessionSlice";
import { BouncingDots, Dot } from "../mainInput/BouncingDots";
import StyledMarkdownPreview from "../StyledMarkdownPreview";
import ConversationSummary from "./ConversationSummary";
import Reasoning from "./Reasoning";
import ResponseActions from "./ResponseActions";
import ThinkingIndicator from "./ThinkingIndicator";

interface StepContainerProps {
  item: ChatHistoryItem;
  index: number;
  isLast: boolean;
  latestSummaryIndex?: number;
}

export default function StepContainer(props: StepContainerProps) {
  const dispatch = useDispatch();
  const isStreaming = useAppSelector((state) => state.session.isStreaming);
  const historyItemAfterThis = useAppSelector(
    (state) => state.session.history[props.index + 1],
  );
  const uiConfig = useAppSelector(selectUIConfig);

  // Calculate dimming and indicator state based on latest summary index
  const latestSummaryIndex = props.latestSummaryIndex ?? -1;
  const isBeforeLatestSummary =
    latestSummaryIndex !== -1 && props.index <= latestSummaryIndex;
  const isLatestSummary =
    latestSummaryIndex !== -1 && props.index === latestSummaryIndex;

  const isNextMsgAssistantOrThinking =
    historyItemAfterThis?.message.role === "assistant" ||
    historyItemAfterThis?.message.role === "thinking" ||
    historyItemAfterThis?.message.role === "tool";

  const shouldRenderResponseAction = () => {
    if (isNextMsgAssistantOrThinking) {
      return false;
    }

    if (!historyItemAfterThis) {
      return !props.item.toolCallStates;
    }

    return true;
  };

  function onDelete() {
    dispatch(deleteMessage(props.index));
  }

  function onContinueGeneration() {
    window.postMessage(
      {
        messageType: "userInput",
        data: {
          input: "Synapse your response exactly where you left off:",
        },
      },
      "*",
    );
  }

  return (
    <div>
      <div
        className={`bg-background p-1 px-1.5 ${isBeforeLatestSummary ? "opacity-35" : ""}`}
      >
        {uiConfig?.displayRawMarkdown ? (
          <pre className="text-2xs max-w-full overflow-x-auto whitespace-pre-wrap break-words p-4">
            {renderChatMessage(props.item.message)}
          </pre>
        ) : (
          <>
            <Reasoning {...props} />

            <StyledMarkdownPreview
              isRenderingInStepContainer
              source={stripImages(props.item.message.content)}
              itemIndex={props.index}
            />
          </>
        )}
        
        {/* Show bouncing dots when streaming - single instance, aligned from start */}
        {isStreaming && props.isLast && !props.item.message.content && (
          <div className="px-2 py-4">
            <BouncingDots loading={1}>
              <Dot delay={0} />
              <Dot delay={0.16} />
              <Dot delay={0.32} />
            </BouncingDots>
          </div>
        )}
        
        {props.isLast && <ThinkingIndicator historyItem={props.item} />}
      </div>

      {shouldRenderResponseAction() && !isStreaming && (
        <div
          className={`mt-2 h-7 transition-opacity duration-300 ease-in-out ${isBeforeLatestSummary ? "opacity-35" : ""}`}
        >
          <ResponseActions
            isTruncated={false} // isTruncated is no longer managed by useEffect
            onDelete={onDelete}
            onContinueGeneration={onContinueGeneration}
            index={props.index}
            item={props.item}
            isLast={props.isLast}
          />
        </div>
      )}

      {/* Show compaction indicator for the latest summary */}
      {isLatestSummary && (
        <div className="mx-1.5 my-5">
          <div className="flex items-center">
            <div className="border-border flex-1 border-t border-solid"></div>
            <span className="text-description mx-3 text-xs">
              Previous Conversation Compacted
            </span>
            <div className="border-border flex-1 border-t border-solid"></div>
          </div>
        </div>
      )}

      {/* ConversationSummary is outside the dimmed container so it's always at full opacity */}
      <ConversationSummary item={props.item} index={props.index} />
    </div>
  );
}
