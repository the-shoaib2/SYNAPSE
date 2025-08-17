import { useCallback, useContext, useEffect, useState } from "react";
import { IdeMessengerContext } from "../../context/IdeMessenger";

interface UseCurrentFileDetectionProps {
  isMainInput: boolean;
}

export function useCurrentFileDetection({
  isMainInput,
}: UseCurrentFileDetectionProps) {
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [showFileBadge, setShowFileBadge] = useState(false);
  const ideMessenger = useContext(IdeMessengerContext);

  // Function to safely add current file context when user needs it
  const addFileContextSafely = useCallback(
    (editor: any) => {
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
    },
    [currentFileName],
  );

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

    if (ideMessenger && isMainInput) {
      getCurrentFileName();
    }
  }, [ideMessenger, isMainInput]);

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
      if (ideMessenger && isMainInput) {
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
  }, [ideMessenger, isMainInput, currentFileName]); // Include dependencies for polling

  // Control file badge visibility based on streaming state
  const updateFileBadgeVisibility = useCallback(
    (isStreaming: boolean, hasText: boolean) => {
      if (isStreaming) {
        setShowFileBadge(false);
      } else if (hasText) {
        setShowFileBadge(false);
      } else {
        // Keep file badge visible when input is empty
      }
    },
    [],
  );

  return {
    currentFileName,
    showFileBadge,
    addFileContextSafely,
    updateFileBadgeVisibility,
  };
}
