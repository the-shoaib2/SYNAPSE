import { Editor, EditorContent, JSONContent } from "@tiptap/react";
import { ContextProviderDescription, InputModifiers } from "core";
import { modelSupportsImages } from "core/llm/autodetect";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IdeMessengerContext } from "../../../context/IdeMessenger";
import useIsOSREnabled from "../../../hooks/useIsOSREnabled";
import useUpdatingRef from "../../../hooks/useUpdatingRef";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectSelectedChatModel } from "../../../redux/slices/configSlice";
import InputContextToolbar from "../InputContextToolbar";
import InputToolbar, { ToolbarOptions } from "../InputToolbar";
import { ComboBoxItem } from "../types";
import { DragOverlay } from "./components/DragOverlay";
import { InputBoxDiv } from "./components/StyledComponents";
import { useMainEditor } from "./MainEditorProvider";
import "./TipTapEditor.css";
import { createEditorConfig, getPlaceholderText } from "./utils/editorConfig";
import { handleImageFile } from "./utils/imageUtils";
import { useEditorEventHandlers } from "./utils/keyHandlers";

export interface TipTapEditorProps {
  availableContextProviders: ContextProviderDescription[];
  availableSlashCommands: ComboBoxItem[];
  isMainInput: boolean;
  onEnter: (
    editorState: JSONContent,
    modifiers: InputModifiers,
    editor: Editor,
  ) => void;
  onStopContinue?: () => void;
  editorState?: JSONContent;
  toolbarOptions?: ToolbarOptions;
  placeholder?: string;
  historyKey: string;

  // TODO: This isn't actually used anywhere in this component, but it appears
  // to be pulled into some of our TipTap extensions.
  inputId: string;
}

export const TIPPY_DIV_ID = "tippy-js-div";

export function TipTapEditor(props: TipTapEditorProps) {
  const dispatch = useAppDispatch();
  const mainEditorContext = useMainEditor();

  const ideMessenger = useContext(IdeMessengerContext);
  const isOSREnabled = useIsOSREnabled();

  const defaultModel = useAppSelector(selectSelectedChatModel);
  const isStreaming = useAppSelector((state) => state.session.isStreaming);
  const historyLength = useAppSelector((store) => store.session.history.length);
  const isInEdit = useAppSelector((store) => store.session.isInEdit);

  const { editor, onEnterRef } = createEditorConfig({
    props,
    ideMessenger,
    dispatch,
  });

  // Register the main editor with the provider
  useEffect(() => {
    if (props.isMainInput && editor) {
      mainEditorContext.setMainEditor(editor);
      mainEditorContext.setInputId(props.inputId);
      mainEditorContext.onEnterRef.current = onEnterRef.current;
    }
  }, [editor, props.isMainInput, props.inputId, mainEditorContext, onEnterRef]);

  const [shouldHideToolbar, setShouldHideToolbar] = useState(true);

  useEffect(() => {
    if (!editor) {
      return;
    }
    const placeholder = getPlaceholderText(props.placeholder, historyLength);

    editor.extensionManager.extensions.filter(
      (extension) => extension.name === "placeholder",
    )[0].options["placeholder"] = placeholder;

    editor.view.dispatch(editor.state.tr);
  }, [editor, props.placeholder, historyLength]);

  useEffect(() => {
    if (props.isMainInput) {
      editor?.commands.clearContent(true);
    }
  }, [props.isMainInput, editor]);

  // Show @ button again when input is cleared
  useEffect(() => {
    if (editor && editor.getText().trim() === "") {
      setShowContextButton(true);
    }
  }, [editor]);

  // Hide @ button when streaming starts (prompt sent)
  useEffect(() => {
    if (isStreaming) {
      setShowContextButton(false);
    }
  }, [isStreaming]);

  // Hide @ button when there's text in the input
  useEffect(() => {
    if (editor && editor.getText().trim() !== "") {
      setShowContextButton(false);
    }
  }, [editor]);

  useEffect(() => {
    if (isInEdit) {
      setShouldHideToolbar(false);
    }
  }, [isInEdit]);

  const editorFocusedRef = useUpdatingRef(editor?.isFocused, [editor]);

  useEffect(() => {
    if (props.isMainInput) {
      /**
       * I have a strong suspicion that many of the other focus
       * commands are redundant, especially the ones inside
       * useTimeout.
       */
      editor?.commands.focus();
    }
  }, [props.isMainInput, editor]);

  // Re-focus main input after done generating
  useEffect(() => {
    if (editor && !isStreaming && props.isMainInput && document.hasFocus()) {
      editor.commands.focus(undefined, { scrollIntoView: false });
    }
  }, [props.isMainInput, isStreaming, editor]);

  const [showDragOverMsg, setShowDragOverMsg] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [showContextButton, setShowContextButton] = useState(true);
  const [showFullLayout, setShowFullLayout] = useState(true);
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [showFileBadge, setShowFileBadge] = useState(false);

  // Get current file name when component mounts or editor changes
  useEffect(() => {
    const getCurrentFileName = async () => {
      try {
        const currentFile = await ideMessenger.request(
          "getCurrentFile",
          undefined,
        );
        if (currentFile.status === "success" && currentFile.content) {
          // Extract filename from path
          const fileName =
            currentFile.content.path.split("/").pop() ||
            currentFile.content.path.split("\\").pop() ||
            "untitled";
          setCurrentFileName(fileName);
          setShowFileBadge(true); // Show badge immediately
        } else {
          setCurrentFileName("");
          setShowFileBadge(false);
        }
      } catch (error) {
        console.log("Could not get current file name:", error);
        setCurrentFileName("");
        setShowFileBadge(false);
      }
    };

    if (ideMessenger && props.isMainInput) {
      getCurrentFileName();
    }
  }, [ideMessenger, props.isMainInput]);

  // Control layout visibility based on prompt state
  useEffect(() => {
    if (isStreaming) {
      // After prompt sent - hide everything
      setShowFullLayout(false);
      setShowContextButton(false);
      setShowFileBadge(false);
    } else if (editor && editor.getText().trim() !== "") {
      // Has text but not streaming - hide context button and file badge
      setShowContextButton(false);
      setShowFileBadge(false);
      setShowFullLayout(true);
    } else {
      // Default state - show everything
      setShowFullLayout(true);
      setShowContextButton(true);
      // Keep file badge visible when input is empty
    }
  }, [isStreaming, editor]);

  const insertCharacterWithWhitespace = useCallback(
    (char: string) => {
      if (!editor) {
        return;
      }
      const text = editor.getText();
      if (!text.endsWith(char)) {
        if (text.length > 0 && !text.endsWith(" ")) {
          editor.commands.insertContent(` ${char}`);
        } else {
          editor.commands.insertContent(char);
        }
      }
      // Hide the @ button after it's clicked, but only when not streaming
      if (char === "@" && !isStreaming) {
        setShowContextButton(false);
      }
    },
    [editor, isStreaming],
  );

  // Function to safely add current file context when user needs it
  const addFileContextSafely = useCallback(() => {
    if (
      editor &&
      currentFileName &&
      !editor.getText().includes(`@${currentFileName}`)
    ) {
      try {
        // Use a simple insert operation that's less likely to conflict
        const currentText = editor.getText();
        if (currentText.trim() === "") {
          editor.commands.insertContent(`@${currentFileName}`);
        } else {
          editor.commands.insertContent(` @${currentFileName}`);
        }
        setShowFileBadge(false); // Hide badge after adding
        console.log(`✅ Context added: @${currentFileName}`);
      } catch (error) {
        console.log("Could not add file context:", error);
      }
    }
  }, [editor, currentFileName]);

  const { handleKeyUp, handleKeyDown } = useEditorEventHandlers({
    editor,
    isOSREnabled: isOSREnabled,
    editorFocusedRef,
    setActiveKey,
  });

  const blurTimeout = useRef<NodeJS.Timeout | null>(null);
  const cancelBlurTimeout = useCallback(() => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
  }, [blurTimeout]);

  const handleFocus = useCallback(() => {
    cancelBlurTimeout();
    setShouldHideToolbar(false);
    // Show full layout when input is focused
    setShowFullLayout(true);
    // Only show @ button when input is focused and empty
    if (editor && editor.getText().trim() === "") {
      setShowContextButton(true);
    }
  }, [cancelBlurTimeout, editor]);

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      if (isInEdit) {
        return;
      }
      // Check if the new focus target is within our InputBoxDiv
      const currentTarget = e.currentTarget;
      const relatedTarget = e.relatedTarget as Node | null;

      if (relatedTarget && currentTarget?.contains(relatedTarget)) {
        return;
      }
      // Otherwise give e.g. listboxes a chance to cancel the hiding
      blurTimeout.current = setTimeout(() => {
        setShouldHideToolbar(true);
      }, 100);
    },
    [isInEdit, blurTimeout],
  );

  // Listen for active text editor changes - multiple event types for reliability
  useEffect(() => {
    const handleActiveEditorChange = (event: MessageEvent) => {
      // Listen to multiple event types for better reliability
      if (
        event.data &&
        (event.data.type === "didChangeActiveTextEditor" ||
          event.data.type === "onDidChangeActiveTextEditor" ||
          event.data.type === "onDidOpenTextDocument" ||
          event.data.type === "onDidChangeVisibleTextEditors") &&
        event.data.filepath
      ) {
        // Extract filename from the new filepath
        const filepath = event.data.filepath;
        const fileName =
          filepath.split("/").pop() || filepath.split("\\").pop() || "untitled";

        // Update filename and show badge immediately
        setCurrentFileName(fileName);
        setShowFileBadge(true);

        console.log(`Tab switched to: ${fileName}`);
      }
    };

    // Add the listener for multiple event types
    window.addEventListener("message", handleActiveEditorChange);

    // Also add active polling as fallback for immediate updates
    const pollInterval = setInterval(async () => {
      if (ideMessenger && props.isMainInput) {
        try {
          const currentFile = await ideMessenger.request(
            "getCurrentFile",
            undefined,
          );
          if (currentFile.status === "success" && currentFile.content) {
            const fileName =
              currentFile.content.path.split("/").pop() ||
              currentFile.content.path.split("\\").pop() ||
              "untitled";

            // Only update if filename actually changed
            if (fileName !== currentFileName) {
              setCurrentFileName(fileName);
              setShowFileBadge(true);
              console.log(`Polling detected: ${fileName}`);
            }
          }
        } catch (error) {
          // Silent error for polling
        }
      }
    }, 1000); // Poll every 1 second

    return () => {
      window.removeEventListener("message", handleActiveEditorChange);
      clearInterval(pollInterval);
    };
  }, [ideMessenger, props.isMainInput, currentFileName]); // Include dependencies for polling

  return (
    <InputBoxDiv
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={
        !props.isMainInput && shouldHideToolbar
          ? "cursor-pointer"
          : "cursor-text"
      }
      onClick={() => {
        editor?.commands.focus();
        // Show full layout when clicking in input
        setShowFullLayout(true);
        // Only show @ button when clicking in input if it's empty
        if (editor && editor.getText().trim() === "") {
          setShowContextButton(true);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setShowDragOverMsg(true);
      }}
      onDragLeave={(e) => {
        if (e.relatedTarget === null) {
          if (e.shiftKey) {
            setShowDragOverMsg(false);
          } else {
            setTimeout(() => setShowDragOverMsg(false), 2000);
          }
        }
      }}
      onDragEnter={() => {
        setShowDragOverMsg(true);
      }}
      onDrop={(event) => {
        if (
          !defaultModel ||
          !modelSupportsImages(
            defaultModel.provider,
            defaultModel.model,
            defaultModel.title,
            defaultModel.capabilities,
          )
        ) {
          return;
        }
        setShowDragOverMsg(false);
        let file = event.dataTransfer.files[0];
        void handleImageFile(ideMessenger, file).then((result) => {
          if (!editor) {
            return;
          }
          if (result) {
            const [_, dataUrl] = result;
            const { schema } = editor.state;
            const node = schema.nodes.image.create({ src: dataUrl });
            const tr = editor.state.tr.insert(0, node);
            editor.view.dispatch(tr);
          }
        });
        event.preventDefault();
      }}
    >
      <div className="px-2.5 pb-1 pt-2">
        <InputContextToolbar
          onAddContextItem={() => insertCharacterWithWhitespace("@")}
          hideAddContext={props.toolbarOptions?.hideAddContext}
          isVisible={!isStreaming && showContextButton}
          currentFileName={currentFileName}
        />
        <EditorContent
          className={`scroll-container overflow-y-scroll ${props.isMainInput ? "max-h-[70vh]" : ""}`}
          spellCheck={false}
          editor={editor}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
        <InputToolbar
          isMainInput={props.isMainInput}
          toolbarOptions={props.toolbarOptions}
          activeKey={activeKey}
          hidden={!showFullLayout || (shouldHideToolbar && !props.isMainInput)}
          onAddContextItem={() => insertCharacterWithWhitespace("@")}
          onEnter={onEnterRef.current}
          onStopContinue={props.onStopContinue}
          onImageFileSelected={(file) => {
            void handleImageFile(ideMessenger, file).then((result) => {
              if (!editor) {
                return;
              }
              if (result) {
                const [_, dataUrl] = result;
                const { schema } = editor.state;
                const node = schema.nodes.image.create({ src: dataUrl });
                editor.commands.command(({ tr }) => {
                  tr.insert(0, node);
                  return true;
                });
              }
            });
          }}
          disabled={isStreaming}
        />
      </div>

      {showDragOverMsg &&
        modelSupportsImages(
          defaultModel?.provider || "",
          defaultModel?.model || "",
          defaultModel?.title,
          defaultModel?.capabilities,
        ) && (
          <DragOverlay show={showDragOverMsg} setShow={setShowDragOverMsg} />
        )}
      <div id={TIPPY_DIV_ID} className="fixed z-50" />
    </InputBoxDiv>
  );
}
