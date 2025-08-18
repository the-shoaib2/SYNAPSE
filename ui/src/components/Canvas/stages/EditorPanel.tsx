import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { PipelineStage } from '../types';
import { useCanvas } from '../CanvasContext';

interface EditorPanelProps {
  stage: PipelineStage;
  onUpdate: (updates: Partial<PipelineStage>) => void;
  onSelect: () => void;
  isActive: boolean;
}

interface EditorState {
  content: string;
  language: string;
  isDirty: boolean;
  cursorPosition: { line: number; column: number };
  selectedText: string;
}

export function EditorPanel({ stage, onUpdate, onSelect, isActive }: EditorPanelProps) {
  const { explanations } = useCanvas();
  const [editorState, setEditorState] = useState<EditorState>({
    content: '',
    language: 'text',
    isDirty: false,
    cursorPosition: { line: 1, column: 1 },
    selectedText: '',
  });
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse editor content from stage payload
  const editorContent = useMemo(() => {
    try {
      if (stage.payload?.visual) {
        const data = typeof stage.payload.visual === 'string' 
          ? stage.payload.visual 
          : JSON.stringify(stage.payload.visual, null, 2);
        
        // Detect language based on content or stage type
        let language = 'text';
        if (stage.type === 'code' || stage.type === 'ir' || stage.type === 'assembly') {
          language = stage.type;
        } else if (data.includes('function') || data.includes('class') || data.includes('const')) {
          language = 'javascript';
        } else if (data.includes('def ') || data.includes('import ')) {
          language = 'python';
        } else if (data.includes('public class') || data.includes('public static')) {
          language = 'java';
        } else if (data.includes('int main') || data.includes('#include')) {
          language = 'cpp';
        }

        return {
          content: data,
          language,
        };
      }
      return { content: '', language: 'text' };
    } catch (error) {
      console.error('Failed to parse editor content:', error);
      return { content: '', language: 'text' };
    }
  }, [stage.payload?.visual, stage.type]);

  // Initialize editor state
  useEffect(() => {
    if (editorContent.content !== editorState.content) {
      setEditorState(prev => ({
        ...prev,
        content: editorContent.content,
        language: editorContent.language,
        isDirty: false,
      }));
    }
  }, [editorContent, editorState.content]);

  // Handle content changes
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorState(prev => ({
      ...prev,
      content: newContent,
      isDirty: true,
    }));
  }, []);

  // Handle cursor position changes
  const handleCursorChange = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPosition = getCursorPosition(textarea);
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    
    setEditorState(prev => ({
      ...prev,
      cursorPosition,
      selectedText,
    }));
  }, []);

  // Get cursor position
  const getCursorPosition = useCallback((textarea: HTMLTextAreaElement) => {
    const value = textarea.value;
    const selectionStart = textarea.selectionStart;
    
    let line = 1;
    let column = 1;
    
    for (let i = 0; i < selectionStart; i++) {
      if (value[i] === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
    }
    
    return { line, column };
  }, []);

  // Save changes
  const handleSave = useCallback(() => {
    onUpdate({
      payload: {
        ...stage.payload,
        visual: editorState.content,
      },
    });
    setEditorState(prev => ({ ...prev, isDirty: false }));
  }, [editorState.content, onUpdate, stage.payload]);

  // Revert changes
  const handleRevert = useCallback(() => {
    setEditorState(prev => ({
      ...prev,
      content: editorContent.content,
      isDirty: false,
    }));
  }, [editorContent.content]);

  // Format content
  const handleFormat = useCallback(() => {
    try {
      let formattedContent = editorState.content;
      
      if (editorState.language === 'json') {
        formattedContent = JSON.stringify(JSON.parse(editorState.content), null, 2);
      } else if (editorState.language === 'xml') {
        // Basic XML formatting
        formattedContent = editorState.content
          .replace(/></g, '>\n<')
          .replace(/(<[^>]+>)/g, (match) => {
            return match.replace(/\s+/g, ' ').trim();
          });
      }
      
      setEditorState(prev => ({
        ...prev,
        content: formattedContent,
        isDirty: true,
      }));
    } catch (error) {
      console.error('Failed to format content:', error);
    }
  }, [editorState.content, editorState.language]);

  // Calculate editor statistics
  const editorStats = useMemo(() => {
    const content = editorState.content;
    const lines = content.split('\n');
    const characters = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const nonEmptyLines = lines.filter(line => line.trim().length > 0).length;
    
    return {
      lines: lines.length,
      characters,
      words,
      nonEmptyLines,
      emptyLines: lines.length - nonEmptyLines,
    };
  }, [editorState.content]);

  // Get syntax highlighting classes
  const getSyntaxHighlighting = useCallback((content: string) => {
    if (editorState.language === 'text') return content;
    
    // Basic syntax highlighting for common languages
    let highlighted = content;
    
    if (editorState.language === 'javascript' || editorState.language === 'typescript') {
      highlighted = highlighted
        .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export)\b/g, '<span class="text-blue-600 font-semibold">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-600">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-green-600">$1</span>')
        .replace(/"([^"]*)"/g, '<span class="text-orange-600">"$1"</span>')
        .replace(/\/\/(.*)$/gm, '<span class="text-gray-500">//$1</span>');
    } else if (editorState.language === 'python') {
      highlighted = highlighted
        .replace(/\b(def|class|if|else|elif|for|while|return|import|from|as)\b/g, '<span class="text-blue-600 font-semibold">$1</span>')
        .replace(/\b(True|False|None)\b/g, '<span class="text-purple-600">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-green-600">$1</span>')
        .replace(/"([^"]*)"/g, '<span class="text-orange-600">"$1"</span>')
        .replace(/#(.*)$/gm, '<span class="text-gray-500">#$1</span>');
    }
    
    return highlighted;
  }, [editorState.language]);

  // Render explanation if available
  const explanation = explanations[stage.id];

  return (
    <div className="editor-panel h-full flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 capitalize">{editorState.language}</span>
          {editorState.isDirty && (
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              Modified
            </span>
          )}
        </div>
      </div>

      {/* Editor Statistics */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="text-sm font-medium text-gray-700 mb-2">Editor Statistics</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-gray-600">Lines:</div>
          <div className="font-medium">{editorStats.lines}</div>
          <div className="text-gray-600">Characters:</div>
          <div className="font-medium">{editorStats.characters}</div>
          <div className="text-gray-600">Words:</div>
          <div className="font-medium">{editorStats.words}</div>
          <div className="text-gray-600">Non-empty:</div>
          <div className="font-medium">{editorStats.nonEmptyLines}</div>
          <div className="text-gray-600">Empty:</div>
          <div className="font-medium">{editorStats.emptyLines}</div>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={!editorState.isDirty}
              className="px-3 py-1 rounded text-sm font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white transition-colors"
            >
              💾 Save
            </button>
            
            <button
              onClick={handleRevert}
              disabled={!editorState.isDirty}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white transition-colors"
            >
              🔄 Revert
            </button>
            
            <button
              onClick={handleFormat}
              className="px-3 py-1 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              🎨 Format
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="text-blue-600"
              />
              <span className="text-xs text-gray-600">Line Numbers</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
                className="text-blue-600"
              />
              <span className="text-xs text-gray-600">Word Wrap</span>
            </label>
            
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="text-xs border border-gray-300 rounded px-2 py-1"
              aria-label="Font size"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
              <option value={20}>20px</option>
            </select>
            
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="text-xs border border-gray-300 rounded px-2 py-1"
              aria-label="Theme"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative border border-gray-200 rounded-md overflow-hidden">
        <div className={`
          w-full h-full flex
          ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
        `}>
          {/* Line Numbers */}
          {showLineNumbers && (
            <div className={`
              flex-shrink-0 w-16 p-2 text-xs font-mono border-r
              ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}
            `}>
              {Array.from({ length: Math.max(editorStats.lines, 1) }, (_, i) => (
                <div
                  key={i + 1}
                  className={`
                    text-right py-0.5
                    ${i + 1 === editorState.cursorPosition.line ? 'text-blue-600 font-semibold' : ''}
                  `}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          
          {/* Text Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={editorState.content}
              onChange={handleContentChange}
              onSelect={handleCursorChange}
              onKeyUp={handleCursorChange}
              onMouseUp={handleCursorChange}
              className={`
                w-full h-full p-4 font-mono resize-none outline-none
                ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
                ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}
              `}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.5',
              }}
              placeholder="Enter your code here..."
              spellCheck={false}
            />
            
            {/* Cursor Position Display */}
            <div className={`
              absolute bottom-2 right-2 text-xs px-2 py-1 rounded
              ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}
            `}>
              Ln {editorState.cursorPosition.line}, Col {editorState.cursorPosition.column}
            </div>
          </div>
        </div>
      </div>

      {/* Selection Info */}
      {editorState.selectedText && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-sm font-medium text-blue-800 mb-2">Selection</div>
          <div className="text-xs text-blue-700">
            <div>Selected: {editorState.selectedText.length} characters</div>
            <div>Text: "{editorState.selectedText.substring(0, 50)}{editorState.selectedText.length > 50 ? '...' : ''}"</div>
          </div>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-2">AI Explanation</div>
          <div className="text-sm text-gray-600">{explanation}</div>
        </div>
      )}

      {/* Export Controls */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onUpdate({ 
            payload: { 
              ...stage.payload, 
              visual: editorState.content 
            } 
          })}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Export Content
        </button>
      </div>
    </div>
  );
}
