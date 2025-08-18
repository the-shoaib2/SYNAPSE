import React, { useEffect, useState } from "react";
import {
  categorizePrompt,
  generateFollowUpPrompts,
  optimizePrompt,
  selectSystemPrompt,
  type SystemPrompt,
} from "./SystemPrompts";

interface AutoPromptProcessorProps {
  userInput: string;
  onProcessed: (processed: {
    original: string;
    optimized: string;
    systemPrompt: SystemPrompt;
    categories: string[];
    followUps: string[];
    suggestedActions: string[];
  }) => void;
  autoProcess?: boolean;
}

export const AutoPromptProcessor: React.FC<AutoPromptProcessorProps> = ({
  userInput,
  onProcessed,
  autoProcess = true,
}) => {
  const [processed, setProcessed] = useState<{
    original: string;
    optimized: string;
    systemPrompt: SystemPrompt;
    categories: string[];
    followUps: string[];
    suggestedActions: string[];
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Auto-process input when it changes
  useEffect(() => {
    if (autoProcess && userInput.trim()) {
      processInput(userInput);
    }
  }, [userInput, autoProcess]);

  const processInput = (input: string) => {
    setIsProcessing(true);

    try {
      // Optimize the prompt
      const optimized = optimizePrompt(input);

      // Select appropriate system prompt
      const systemPrompt = selectSystemPrompt(input);

      // Categorize the input
      const categories = categorizePrompt(input);

      // Generate follow-up prompts
      const followUps = generateFollowUpPrompts(input);

      // Create processed result
      const result = {
        original: optimized.original,
        optimized: optimized.optimized,
        systemPrompt,
        categories,
        followUps,
        suggestedActions: optimized.suggestedActions,
      };

      setProcessed(result);

      // Notify parent component
      onProcessed(result);
    } catch (error) {
      console.error("Error processing prompt:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualProcess = () => {
    if (userInput.trim()) {
      processInput(userInput);
    }
  };

  if (!userInput.trim()) {
    return null;
  }

  return (
    <div className="auto-prompt-processor">
      <div className="processor-header">
        <h4>🤖 Auto Prompt Processor</h4>
        <div className="processor-controls">
          {!autoProcess && (
            <button
              onClick={handleManualProcess}
              disabled={isProcessing}
              className="process-btn"
            >
              {isProcessing ? "🔄 Processing..." : "🚀 Process Prompt"}
            </button>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="toggle-details-btn"
          >
            {showDetails ? "📝 Hide Details" : "📝 Show Details"}
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="processing-status">
          <div className="spinner">🔄</div>
          <p>Analyzing and optimizing your prompt...</p>
        </div>
      )}

      {processed && (
        <div className="processed-results">
          <div className="result-summary">
            <div className="summary-item">
              <strong>📊 Categories:</strong>
              <span className="categories">
                {processed.categories.map((cat) => (
                  <span key={cat} className="category-tag">
                    {cat}
                  </span>
                ))}
              </span>
            </div>

            <div className="summary-item">
              <strong>🎯 System Prompt:</strong>
              <span className="system-prompt-name">
                {processed.systemPrompt.name}
              </span>
            </div>

            <div className="summary-item">
              <strong>💡 Suggested Actions:</strong>
              <span className="suggested-actions">
                {processed.suggestedActions.map((action) => (
                  <span key={action} className="action-tag">
                    {action}
                  </span>
                ))}
              </span>
            </div>
          </div>

          {showDetails && (
            <div className="detailed-results">
              <div className="detail-section">
                <h5>🔄 Prompt Optimization</h5>
                <div className="optimization-details">
                  <div className="original-prompt">
                    <strong>Original:</strong>
                    <pre>{processed.original}</pre>
                  </div>
                  <div className="optimized-prompt">
                    <strong>Optimized:</strong>
                    <pre>{processed.optimized}</pre>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h5>🎯 System Prompt Details</h5>
                <div className="system-prompt-details">
                  <p>
                    <strong>Name:</strong> {processed.systemPrompt.name}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {processed.systemPrompt.description}
                  </p>
                  <p>
                    <strong>Category:</strong> {processed.systemPrompt.category}
                  </p>
                  <p>
                    <strong>Priority:</strong> {processed.systemPrompt.priority}
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {processed.systemPrompt.tags.join(", ")}
                  </p>
                </div>
              </div>

              <div className="detail-section">
                <h5>🔗 Follow-up Prompts</h5>
                <div className="follow-up-prompts">
                  {processed.followUps.map((prompt, index) => (
                    <div key={index} className="follow-up-prompt">
                      <span className="prompt-number">{index + 1}.</span>
                      <span className="prompt-text">{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h5>📋 Full System Prompt</h5>
                <div className="full-system-prompt">
                  <pre>{processed.systemPrompt.prompt}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!processed && !isProcessing && (
        <div className="no-results">
          <p>Click "Process Prompt" to analyze and optimize your input</p>
        </div>
      )}
    </div>
  );
};

export default AutoPromptProcessor;
