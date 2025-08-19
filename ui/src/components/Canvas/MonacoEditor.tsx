import { useEffect, useRef } from "react";

interface MonacoEditorProps {
  value: string;
  language?: string;
  theme?: "vs-dark" | "vs-light" | "hc-black";
  readOnly?: boolean;
  onChange?: (value: string) => void;
  height?: string;
  width?: string;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language = "typescript",
  theme = "vs-dark",
  readOnly = false,
  onChange,
  height = "400px",
  width = "100%",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<{
    editor: unknown;
    editorInstance: unknown;
  } | null>(null);

  useEffect(() => {
    // Dynamic import of Monaco Editor
    const loadMonaco = async () => {
      try {
        const monaco = await import("monaco-editor");
        monacoRef.current = {
          editor: monaco.default,
          editorInstance: null,
        };

        if (editorRef.current) {
          const editor = monaco.editor.create(editorRef.current, {
            value,
            language,
            theme,
            readOnly,
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            selectOnLineNumbers: true,
            cursorStyle: "line",
            wordWrap: "on",
            folding: true,
            foldingStrategy: "indentation",
            showFoldingControls: "always",
            renderLineHighlight: "all",
            renderWhitespace: "selection",
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            trimAutoWhitespace: true,
            largeFileOptimizations: true,
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showClasses: true,
              showFunctions: true,
              showVariables: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showColors: true,
              showFiles: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showWords: true,
              showUsers: true,
              showIssues: true,
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            parameterHints: {
              enabled: true,
            },
            autoIndent: "full",
            formatOnPaste: true,
            formatOnType: true,
            dragAndDrop: true,
            links: true,
            colorDecorators: true,
            lightbulb: {
              enabled: true,
            },
          });

          // Handle value changes
          if (onChange) {
            editor.onDidChangeModelContent(() => {
              const newValue = editor.getValue();
              onChange(newValue);
            });
          }

          // Store editor instance
          if (monacoRef.current) {
            monacoRef.current.editorInstance = editor;
          }
        }
      } catch (error) {
        console.error("Failed to load Monaco Editor:", error);

        // Fallback to textarea
        if (editorRef.current) {
          editorRef.current.innerHTML = `
            <div style="padding: 20px; background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); border: 1px solid var(--vscode-panel-border); border-radius: 4px;">
              <p>Monaco Editor failed to load. Using fallback editor.</p>
              <textarea 
                style="width: 100%; height: 300px; background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); border: 1px solid var(--vscode-panel-border); padding: 10px; font-family: monospace;"
                value="${value}"
                ${readOnly ? "readonly" : ""}
                onInput="${onChange ? `(${onChange.toString()})(this.value)` : ""}"
              >${value}</textarea>
            </div>
          `;
        }
      }
    };

    loadMonaco();

    return () => {
      // Cleanup Monaco editor
      if (monacoRef.current?.editorInstance) {
        (monacoRef.current.editorInstance as { dispose: () => void }).dispose();
      }
    };
  }, []);

  // Update editor value when prop changes
  useEffect(() => {
    if (monacoRef.current?.editorInstance) {
      const currentValue = (
        monacoRef.current.editorInstance as { getValue: () => string }
      ).getValue();
      if (currentValue !== value) {
        (
          monacoRef.current.editorInstance as {
            setValue: (value: string) => void;
          }
        ).setValue(value);
      }
    }
  }, [value]);

  // Update language when prop changes
  useEffect(() => {
    if (monacoRef.current?.editorInstance && monacoRef.current.editor) {
      const editorInstance = monacoRef.current.editorInstance as any;
      const monaco = monacoRef.current.editor as any;
      if (editorInstance && monaco.editor) {
        monaco.editor.setModelLanguage(editorInstance.getModel(), language);
      }
    }
  }, [language]);

  // Update theme when prop changes
  useEffect(() => {
    if (monacoRef.current?.editorInstance && monacoRef.current.editor) {
      const monaco = monacoRef.current.editor as any;
      if (monaco.editor) {
        monaco.editor.setTheme(theme);
      }
    }
  }, [theme]);

  return (
    <div
      ref={editorRef}
      style={{
        height,
        width,
        border: "1px solid var(--vscode-panel-border)",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    />
  );
};
