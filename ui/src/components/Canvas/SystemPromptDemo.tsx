import React, { useState } from "react";
import { AutoPromptProcessor } from "./AutoPromptProcessor";
import "./Canvas.css";
import { EnhancedCanvas } from "./EnhancedCanvas";
import {
  CORE_SYSTEM_PROMPTS,
  LANGUAGE_SPECIFIC_PROMPTS,
} from "./SystemPrompts";

export const SystemPromptDemo: React.FC = () => {
  const [demoInput, setDemoInput] = useState<string>("");
  const [showEnhancedCanvas, setShowEnhancedCanvas] = useState(false);
  const [processedResult, setProcessedResult] = useState<any>(null);

  const demoInputs = [
    {
      name: "PHP Calculator Class",
      input:
        "class Calculator { private $result = 0.0; public function add($number) { $this->result += $number; return $this; } }",
      description: "PHP OOP code analysis",
    },
    {
      name: "JavaScript Function",
      input:
        "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }",
      description: "JavaScript algorithm analysis",
    },
    {
      name: "Python Data Processing",
      input:
        'import pandas as pd; df = pd.read_csv("data.csv"); result = df.groupby("category").sum()',
      description: "Python data analysis",
    },
    {
      name: "Performance Request",
      input: "How can I optimize this code for better performance?",
      description: "Performance optimization analysis",
    },
    {
      name: "Security Check",
      input: "Check this code for security vulnerabilities",
      description: "Security analysis",
    },
  ];

  const handleProcessed = (result: any) => {
    setProcessedResult(result);
    console.log("Processed result:", result);
  };

  const handleDemoInput = (input: string) => {
    setDemoInput(input);
    setShowEnhancedCanvas(true);
  };

  return (
    <div className="system-prompt-demo">
      <div className="demo-header">
        <h1>🚀 Canvas System Prompts Demo</h1>
        <p>
          Experience intelligent prompt optimization and system prompt
          integration
        </p>
      </div>

      <div className="demo-content">
        {/* System Prompts Overview */}
        <div className="prompts-overview">
          <h2>🎯 Available System Prompts</h2>

          <div className="core-prompts">
            <h3>Core Analysis Prompts</h3>
            <div className="prompts-grid">
              {CORE_SYSTEM_PROMPTS.map((prompt) => (
                <div key={prompt.id} className="prompt-card">
                  <div className="prompt-header">
                    <h4>{prompt.name}</h4>
                    <span className={`priority priority-${prompt.priority}`}>
                      {prompt.priority}
                    </span>
                  </div>
                  <p>{prompt.description}</p>
                  <div className="prompt-tags">
                    {prompt.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="prompt-category">
                    Category: <strong>{prompt.category}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="language-prompts">
            <h3>Language-Specific Prompts</h3>
            <div className="language-tabs">
              {Object.entries(LANGUAGE_SPECIFIC_PROMPTS).map(
                ([lang, prompts]) => (
                  <div key={lang} className="language-section">
                    <h4 className="language-name">{lang.toUpperCase()}</h4>
                    <div className="prompts-list">
                      {prompts.map((prompt) => (
                        <div key={prompt.id} className="lang-prompt-item">
                          <strong>{prompt.name}</strong>
                          <p>{prompt.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="interactive-demo">
          <h2>🧪 Interactive Demo</h2>

          <div className="demo-inputs">
            <h3>Try These Sample Inputs</h3>
            <div className="input-buttons">
              {demoInputs.map((demo, index) => (
                <button
                  key={index}
                  className="demo-input-btn"
                  onClick={() => handleDemoInput(demo.input)}
                >
                  <div className="btn-header">{demo.name}</div>
                  <div className="btn-description">{demo.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-input">
            <h3>Or Enter Your Own Input</h3>
            <textarea
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Enter your code, question, or request here..."
              className="custom-input-textarea"
              rows={4}
            />
            <button
              onClick={() => setShowEnhancedCanvas(true)}
              disabled={!demoInput.trim()}
              className="process-custom-btn"
            >
              🚀 Process with Enhanced Canvas
            </button>
          </div>
        </div>

        {/* Auto Prompt Processor Demo */}
        {demoInput && (
          <div className="processor-demo">
            <h3>🤖 Auto Prompt Processor</h3>
            <AutoPromptProcessor
              userInput={demoInput}
              onProcessed={handleProcessed}
              autoProcess={true}
            />
          </div>
        )}

        {/* Enhanced Canvas Demo */}
        {showEnhancedCanvas && (
          <div className="enhanced-canvas-demo">
            <h3>🎨 Enhanced Canvas with System Prompts</h3>
            <EnhancedCanvas
              autoProcessPrompts={true}
              showPromptProcessor={true}
            />
          </div>
        )}

        {/* Results Display */}
        {processedResult && (
          <div className="results-display">
            <h3>📊 Processing Results</h3>
            <div className="results-content">
              <div className="result-section">
                <h4>Selected System Prompt</h4>
                <div className="selected-prompt">
                  <strong>{processedResult.systemPrompt.name}</strong>
                  <p>{processedResult.systemPrompt.description}</p>
                </div>
              </div>

              <div className="result-section">
                <h4>Detected Categories</h4>
                <div className="categories-display">
                  {processedResult.categories.map((cat: string) => (
                    <span key={cat} className="category-badge">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="result-section">
                <h4>Suggested Actions</h4>
                <div className="actions-display">
                  {processedResult.suggestedActions.map(
                    (action: string, index: number) => (
                      <div key={index} className="action-item">
                        <span className="action-number">{index + 1}</span>
                        <span className="action-text">{action}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemPromptDemo;
