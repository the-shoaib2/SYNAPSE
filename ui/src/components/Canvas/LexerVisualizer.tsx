import React, { useEffect, useState } from "react";
import "./LexerVisualizer.css";

interface Token {
  id: string;
  type: string;
  value: string;
  line: number;
  column: number;
  regex: string;
  description: string;
}

interface LexerData {
  tokens: Token[];
  sourceCode: string;
  language: string;
  totalTokens: number;
  tokenTypes: string[];
  analysis: {
    keywords: number;
    identifiers: number;
    literals: number;
    operators: number;
    delimiters: number;
  };
}

interface LexerVisualizerProps {
  data?: LexerData;
}

export const LexerVisualizer: React.FC<LexerVisualizerProps> = ({ data }) => {
  const [currentToken, setCurrentToken] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);

  // Default lexer data for demonstration
  const defaultData: LexerData = {
    sourceCode: `int x = 42 + 10;
float y = 3.14;
if (x > y) {
  printf("x is greater");
}`,
    language: "C",
    totalTokens: 25,
    tokenTypes: ["keyword", "identifier", "operator", "literal", "delimiter"],
    analysis: {
      keywords: 3,
      identifiers: 6,
      literals: 4,
      operators: 8,
      delimiters: 4,
    },
    tokens: [
      {
        id: "t1",
        type: "keyword",
        value: "int",
        line: 1,
        column: 1,
        regex: "\\bint\\b",
        description: "Integer type declaration keyword",
      },
      {
        id: "t2",
        type: "identifier",
        value: "x",
        line: 1,
        column: 5,
        regex: "[a-zA-Z_][a-zA-Z0-9_]*",
        description: "Variable identifier",
      },
      {
        id: "t3",
        type: "operator",
        value: "=",
        line: 1,
        column: 7,
        regex: "=",
        description: "Assignment operator",
      },
      {
        id: "t4",
        type: "literal",
        value: "42",
        line: 1,
        column: 9,
        regex: "\\b\\d+\\b",
        description: "Integer literal",
      },
      {
        id: "t5",
        type: "operator",
        value: "+",
        line: 1,
        column: 12,
        regex: "\\+",
        description: "Addition operator",
      },
      {
        id: "t6",
        type: "literal",
        value: "10",
        line: 1,
        column: 14,
        regex: "\\b\\d+\\b",
        description: "Integer literal",
      },
      {
        id: "t7",
        type: "delimiter",
        value: ";",
        line: 1,
        column: 16,
        regex: ";",
        description: "Statement terminator",
      },
      {
        id: "t8",
        type: "keyword",
        value: "float",
        line: 2,
        column: 1,
        regex: "\\bfloat\\b",
        description: "Float type declaration keyword",
      },
      {
        id: "t9",
        type: "identifier",
        value: "y",
        line: 2,
        column: 6,
        regex: "[a-zA-Z_][a-zA-Z0-9_]*",
        description: "Variable identifier",
      },
      {
        id: "t10",
        type: "operator",
        value: "=",
        line: 2,
        column: 8,
        regex: "=",
        description: "Assignment operator",
      },
      {
        id: "t11",
        type: "literal",
        value: "3.14",
        line: 2,
        column: 10,
        regex: "\\b\\d+\\.\\d+\\b",
        description: "Float literal",
      },
      {
        id: "t12",
        type: "delimiter",
        value: ";",
        line: 2,
        column: 14,
        regex: ";",
        description: "Statement terminator",
      },
      {
        id: "t13",
        type: "keyword",
        value: "if",
        line: 3,
        column: 1,
        regex: "\\bif\\b",
        description: "Conditional statement keyword",
      },
      {
        id: "t14",
        type: "delimiter",
        value: "(",
        line: 3,
        column: 4,
        regex: "\\(",
        description: "Opening parenthesis",
      },
      {
        id: "t15",
        type: "identifier",
        value: "x",
        line: 3,
        column: 5,
        regex: "[a-zA-Z_][a-zA-Z0-9_]*",
        description: "Variable identifier",
      },
      {
        id: "t16",
        type: "operator",
        value: ">",
        line: 3,
        column: 7,
        regex: ">",
        description: "Greater than operator",
      },
      {
        id: "t17",
        type: "identifier",
        value: "y",
        line: 3,
        column: 9,
        regex: "[a-zA-Z_][a-zA-Z0-9_]*",
        description: "Variable identifier",
      },
      {
        id: "t18",
        type: "delimiter",
        value: ")",
        line: 3,
        column: 10,
        regex: "\\)",
        description: "Closing parenthesis",
      },
      {
        id: "t19",
        type: "delimiter",
        value: "{",
        line: 3,
        column: 12,
        regex: "\\{",
        description: "Opening brace",
      },
      {
        id: "t20",
        type: "identifier",
        value: "printf",
        line: 4,
        column: 3,
        regex: "[a-zA-Z_][a-zA-Z0-9_]*",
        description: "Function identifier",
      },
      {
        id: "t21",
        type: "delimiter",
        value: "(",
        line: 4,
        column: 9,
        regex: "\\(",
        description: "Opening parenthesis",
      },
      {
        id: "t22",
        type: "literal",
        value: '"x is greater"',
        line: 4,
        column: 10,
        regex: '"[^"]*"',
        description: "String literal",
      },
      {
        id: "t23",
        type: "delimiter",
        value: ")",
        line: 4,
        column: 24,
        regex: "\\)",
        description: "Closing parenthesis",
      },
      {
        id: "t24",
        type: "delimiter",
        value: ";",
        line: 4,
        column: 25,
        regex: ";",
        description: "Statement terminator",
      },
      {
        id: "t25",
        type: "delimiter",
        value: "}",
        line: 5,
        column: 1,
        regex: "\\}",
        description: "Closing brace",
      },
    ],
  };

  const lexerData = data || defaultData;

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentToken < lexerData.tokens.length - 1) {
          setCurrentToken((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentToken, lexerData.tokens.length, playbackSpeed]);

  useEffect(() => {
    if (lexerData.tokens[currentToken]) {
      setHighlightedLine(lexerData.tokens[currentToken].line);
    }
  }, [currentToken, lexerData.tokens]);

  const playAnimation = () => {
    setIsPlaying(true);
    setCurrentToken(0);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentToken(0);
  };

  const nextToken = () => {
    if (currentToken < lexerData.tokens.length - 1) {
      setCurrentToken((prev) => prev + 1);
    }
  };

  const prevToken = () => {
    if (currentToken > 0) {
      setCurrentToken((prev) => prev - 1);
    }
  };

  const getTokenTypeColor = (type: string) => {
    switch (type) {
      case "keyword":
        return "var(--vscode-textPreformat-foreground)";
      case "identifier":
        return "var(--vscode-editor-foreground)";
      case "operator":
        return "var(--vscode-symbolIcon-operatorForeground)";
      case "literal":
        return "var(--vscode-textPreformat-foreground)";
      case "delimiter":
        return "var(--vscode-symbolIcon-variableForeground)";
      default:
        return "var(--vscode-editor-foreground)";
    }
  };

  const getTokenTypeIcon = (type: string) => {
    switch (type) {
      case "keyword":
        return "🔑";
      case "identifier":
        return "🏷️";
      case "operator":
        return "⚡";
      case "literal":
        return "📝";
      case "delimiter":
        return "📍";
      default:
        return "❓";
    }
  };

  const highlightSourceCode = () => {
    const lines = lexerData.sourceCode.split("\n");
    return lines.map((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      const isHighlighted = lineNumber === highlightedLine;

      return (
        <div
          key={lineIndex}
          className={`code-line ${isHighlighted ? "highlighted" : ""}`}
        >
          <span className="line-number">{lineNumber}</span>
          <span className="line-content">{line}</span>
        </div>
      );
    });
  };

  return (
    <div className="lexer-visualizer">
      <div className="lexer-header">
        <h3>🔍 Lexical Analysis Visualization</h3>
        <div className="lexer-info">
          <span>
            <strong>Language:</strong> {lexerData.language}
          </span>
          <span>
            <strong>Total Tokens:</strong> {lexerData.totalTokens}
          </span>
          <span>
            <strong>Token Types:</strong> {lexerData.tokenTypes.length}
          </span>
        </div>
      </div>

      <div className="lexer-controls">
        <button onClick={resetAnimation} className="control-btn">
          ⏮️ Reset
        </button>
        <button
          onClick={prevToken}
          disabled={currentToken === 0}
          className="control-btn"
        >
          ⏪ Previous
        </button>
        {isPlaying ? (
          <button onClick={pauseAnimation} className="control-btn">
            ⏸️ Pause
          </button>
        ) : (
          <button onClick={playAnimation} className="control-btn">
            ▶️ Play
          </button>
        )}
        <button
          onClick={nextToken}
          disabled={currentToken === lexerData.tokens.length - 1}
          className="control-btn"
        >
          ⏩ Next
        </button>
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          className="speed-select"
          aria-label="Playback Speed"
        >
          <option value={1500}>Slow</option>
          <option value={1000}>Normal</option>
          <option value={500}>Fast</option>
        </select>
      </div>

      <div className="lexer-content">
        <div className="source-code-section">
          <h4>📝 Source Code with Token Highlighting</h4>
          <div className="code-container">
            <div className="source-code">{highlightSourceCode()}</div>
          </div>
        </div>

        <div className="token-analysis">
          <div className="current-token">
            <h4>🎯 Current Token</h4>
            {lexerData.tokens[currentToken] && (
              <div className="token-details">
                <div className="token-header">
                  <span className="token-icon">
                    {getTokenTypeIcon(lexerData.tokens[currentToken].type)}
                  </span>
                  <span className="token-type">
                    {lexerData.tokens[currentToken].type}
                  </span>
                  <span className="token-value">
                    {lexerData.tokens[currentToken].value}
                  </span>
                </div>
                <div className="token-info">
                  <div className="info-row">
                    <strong>Line:</strong> {lexerData.tokens[currentToken].line}
                  </div>
                  <div className="info-row">
                    <strong>Column:</strong>{" "}
                    {lexerData.tokens[currentToken].column}
                  </div>
                  <div className="info-row">
                    <strong>Regex:</strong>{" "}
                    <code>{lexerData.tokens[currentToken].regex}</code>
                  </div>
                  <div className="info-row">
                    <strong>Description:</strong>{" "}
                    {lexerData.tokens[currentToken].description}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="token-statistics">
            <h4>📊 Token Statistics</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <strong>Keywords:</strong>
                <span>{lexerData.analysis.keywords}</span>
              </div>
              <div className="stat-item">
                <strong>Identifiers:</strong>
                <span>{lexerData.analysis.identifiers}</span>
              </div>
              <div className="stat-item">
                <strong>Literals:</strong>
                <span>{lexerData.analysis.literals}</span>
              </div>
              <div className="stat-item">
                <strong>Operators:</strong>
                <span>{lexerData.analysis.operators}</span>
              </div>
              <div className="stat-item">
                <strong>Delimiters:</strong>
                <span>{lexerData.analysis.delimiters}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="token-list">
        <h4>📋 All Tokens</h4>
        <div className="tokens-container">
          {lexerData.tokens.map((token, index) => (
            <div
              key={token.id}
              className={`token-item ${index === currentToken ? "active" : ""} ${index < currentToken ? "processed" : ""}`}
              onClick={() => setCurrentToken(index)}
            >
              <div className="token-basic">
                <span className="token-number">#{index + 1}</span>
                <span className="token-icon-small">
                  {getTokenTypeIcon(token.type)}
                </span>
                <span className="token-type-small">{token.type}</span>
                <span className="token-value-small">{token.value}</span>
              </div>
              <div className="token-position">
                L{token.line}:C{token.column}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="progress-section">
        <h4>📈 Analysis Progress</h4>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentToken + 1) / lexerData.tokens.length) * 100}%`,
            }}
          />
        </div>
        <div className="progress-text">
          Token {currentToken + 1} of {lexerData.tokens.length} (
          {Math.round(((currentToken + 1) / lexerData.tokens.length) * 100)}%)
        </div>
      </div>
    </div>
  );
};
