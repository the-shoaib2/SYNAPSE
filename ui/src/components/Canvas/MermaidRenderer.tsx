import mermaid from "mermaid";
import React, { useEffect, useRef, useState } from "react";

interface MermaidRendererProps {
  chartDefinition: string;
  chartId?: string;
  theme?: "default" | "dark" | "forest";
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({
  chartDefinition,
  chartId = "mermaid-chart",
  theme = "default",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Mermaid with theme
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
      },
      themeVariables: {
        primaryColor: "#1f2937",
        primaryTextColor: "#f9fafb",
        primaryBorderColor: "#374151",
        lineColor: "#6b7280",
        secondaryColor: "#374151",
        tertiaryColor: "#6b7280",
      },
    });
  }, [theme]);

  useEffect(() => {
    if (!containerRef.current || !chartDefinition) return;

    const renderChart = async () => {
      try {
        setError(null);
        console.log("MermaidRenderer: Starting to render chart", {
          chartId,
          chartDefinition,
        });

        // Clear previous content
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        // Render the chart
        console.log("MermaidRenderer: Calling mermaid.render...");
        const { svg } = await mermaid.render(chartId, chartDefinition);
        console.log("MermaidRenderer: Got SVG result", {
          svgLength: svg.length,
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setIsRendered(true);
          console.log("MermaidRenderer: Chart rendered successfully");
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(err instanceof Error ? err.message : "Failed to render chart");
        setIsRendered(false);
      }
    };

    renderChart();
  }, [chartDefinition, chartId]);

  if (error) {
    return (
      <div className="mermaid-error">
        <div className="error-content">
          <h5>Chart Rendering Error</h5>
          <p>Failed to render Mermaid chart:</p>
          <div className="error-details">
            <code>{error}</code>
          </div>
          <div className="chart-definition">
            <h6>Chart Definition:</h6>
            <pre>{chartDefinition}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mermaid-container">
      <div className="mermaid-header">
        <h5>Mermaid Flowchart</h5>
        <div className="mermaid-controls">
          <span className="status-indicator">
            {isRendered ? "✅ Rendered" : "⏳ Rendering..."}
          </span>
        </div>
      </div>
      <div className="mermaid-chart-wrapper">
        <div ref={containerRef} className="mermaid-chart" />
      </div>
      <div className="mermaid-info">
        <small>Built with Mermaid.js + Synapse Core</small>
      </div>
    </div>
  );
};

export default MermaidRenderer;
