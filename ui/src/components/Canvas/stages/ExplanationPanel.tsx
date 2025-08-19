import { useCallback, useEffect, useMemo, useState } from "react";
import { useCanvas } from "../CanvasContext";
import type { PipelineStage } from "../types";

interface ExplanationPanelProps {
  stage: PipelineStage;
  onUpdate: (updates: Partial<PipelineStage>) => void;
  onSelect: () => void;
  isActive: boolean;
}

interface ExplanationSection {
  id: string;
  title: string;
  content: string;
  type: "text" | "code" | "list" | "table" | "diagram";
  metadata?: Record<string, unknown>;
}

interface ParsedExplanationData {
  id: string;
  title: string;
  content: string;
  type: string;
  metadata: Record<string, unknown>;
}

export function ExplanationPanel({
  stage,
  onUpdate,
  onSelect,
  isActive,
}: ExplanationPanelProps) {
  const { state } = useCanvas();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  // Helper function to safely access object properties
  const safeGet = (obj: unknown, key: string): unknown => {
    return obj && typeof obj === "object" && key in obj
      ? (obj as Record<string, unknown>)[key]
      : undefined;
  };

  // Parse explanation data from stage payload
  const explanationData: ParsedExplanationData[] = useMemo(() => {
    try {
      if (stage.payload?.visual) {
        const data =
          typeof stage.payload.visual === "string"
            ? JSON.parse(stage.payload.visual)
            : stage.payload.visual;

        // Convert to explanation sections
        if (Array.isArray(data)) {
          return data.map((item: unknown, index: number) => ({
            id: (safeGet(item, "id") as string) || `section-${index}`,
            title:
              (safeGet(item, "title") as string) ||
              (safeGet(item, "name") as string) ||
              `Section ${index + 1}`,
            content:
              (safeGet(item, "content") as string) ||
              (safeGet(item, "text") as string) ||
              (safeGet(item, "description") as string) ||
              "",
            type:
              (safeGet(item, "type") as
                | "text"
                | "code"
                | "list"
                | "table"
                | "diagram") || "text",
            metadata:
              (safeGet(item, "metadata") as Record<string, unknown>) || {},
          }));
        }
        if (safeGet(data, "sections")) {
          const sections = safeGet(data, "sections") as unknown[];
          return sections.map((section: unknown, index: number) => ({
            id: (safeGet(section, "id") as string) || `section-${index}`,
            title:
              (safeGet(section, "title") as string) ||
              (safeGet(section, "name") as string) ||
              `Section ${index + 1}`,
            content:
              (safeGet(section, "content") as string) ||
              (safeGet(section, "text") as string) ||
              (safeGet(section, "description") as string) ||
              "",
            type:
              (safeGet(section, "type") as
                | "text"
                | "code"
                | "list"
                | "table"
                | "diagram") || "text",
            metadata:
              (safeGet(section, "metadata") as Record<string, unknown>) || {},
          }));
        }
        if (safeGet(data, "explanation")) {
          // Single explanation format
          return [
            {
              id: "main-explanation",
              title: "Explanation",
              content: (safeGet(data, "explanation") as string) || "",
              type: "text" as const,
              metadata:
                (safeGet(data, "metadata") as Record<string, unknown>) || {},
            },
          ];
        }
      }
      return [];
    } catch (error) {
      console.error("Failed to parse explanation data:", error);
      return [];
    }
  }, [stage.payload?.visual]);

  // Get AI explanation if available (from stage payload)
  const aiExplanation = stage.payload?.explain;

  // Initialize expanded sections
  useEffect(() => {
    if (explanationData.length > 0 && expandedSections.size === 0) {
      const initialExpanded = new Set<string>(
        explanationData.map((section: ParsedExplanationData) => section.id),
      );
      setExpandedSections(initialExpanded);
    }
  }, [explanationData, expandedSections.size]);

  // Handle section expansion toggle
  const handleSectionToggle = useCallback(
    (sectionId: string) => {
      const newExpanded = new Set(expandedSections);
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        newExpanded.add(sectionId);
      }
      setExpandedSections(newExpanded);
    },
    [expandedSections],
  );

  // Handle expand/collapse all
  const handleExpandAll = useCallback(() => {
    const allSectionIds = new Set<string>(
      explanationData.map((section: ParsedExplanationData) => section.id),
    );
    setExpandedSections(allSectionIds);
  }, [explanationData]);

  const handleCollapseAll = useCallback(() => {
    setExpandedSections(new Set());
  }, []);

  // Generate new explanation
  const handleGenerateExplanation = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Simulate explanation generation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Generated explanation for stage:", stage.id);
    } catch (error) {
      console.error("Failed to generate explanation:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [stage.id]);

  // Render explanation section
  const renderSection = useCallback(
    (section: ParsedExplanationData) => {
      const isExpanded = expandedSections.has(section.id);

      return (
        <div
          key={section.id}
          className="mb-4 overflow-hidden rounded-lg border border-gray-200"
        >
          {/* Section Header */}
          <div
            className="flex cursor-pointer items-center justify-between bg-gray-50 p-3 transition-colors hover:bg-gray-100"
            onClick={() => handleSectionToggle(section.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSectionToggle(section.id);
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${section.type === "text" ? "bg-blue-500" : ""} ${section.type === "code" ? "bg-green-500" : ""} ${section.type === "list" ? "bg-purple-500" : ""} ${section.type === "table" ? "bg-orange-500" : ""} ${section.type === "diagram" ? "bg-red-500" : ""} `}
              />
              <h4 className="font-medium text-gray-900">{section.title}</h4>
              <span className="rounded-full bg-gray-200 px-2 py-1 text-xs capitalize text-gray-600">
                {section.type}
              </span>
            </div>
            <div className="text-gray-500">{isExpanded ? "▼" : "▶"}</div>
          </div>

          {/* Section Content */}
          {isExpanded && (
            <div className="bg-white p-4">{renderSectionContent(section)}</div>
          )}
        </div>
      );
    },
    [expandedSections, handleSectionToggle],
  );

  // Render section content based on type
  const renderSectionContent = useCallback((section: ParsedExplanationData) => {
    switch (section.type) {
      case "code":
        return (
          <pre className="overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-green-400">
            <code>{section.content}</code>
          </pre>
        );

      case "list":
        try {
          const listItems = JSON.parse(section.content);
          if (Array.isArray(listItems)) {
            return (
              <ul className="list-inside list-disc space-y-2">
                {listItems.map((item: unknown, index: number) => (
                  <li key={`list-item-${index}`} className="text-gray-700">
                    {String(item)}
                  </li>
                ))}
              </ul>
            );
          }
        } catch {
          // Fallback to text if not valid JSON
        }
        return (
          <div className="whitespace-pre-wrap text-gray-700">
            {section.content}
          </div>
        );

      case "table":
        try {
          const tableData = JSON.parse(section.content);
          if (Array.isArray(tableData) && tableData.length > 0) {
            const headers = Object.keys(tableData[0]);
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      {headers.map((header: string) => (
                        <th
                          key={header}
                          className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row: unknown, index: number) => (
                      <tr
                        key={`table-row-${index}`}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        {headers.map((header: string) => (
                          <td
                            key={header}
                            className="border border-gray-300 px-3 py-2 text-sm text-gray-700"
                          >
                            {String(safeGet(row, header))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        } catch {
          // Fallback to text if not valid JSON
        }
        return (
          <div className="whitespace-pre-wrap text-gray-700">
            {section.content}
          </div>
        );

      case "diagram":
        return (
          <div className="rounded-md bg-gray-50 p-4 text-center">
            <div className="mb-2 text-gray-500">📊 Diagram Visualization</div>
            <div className="text-sm text-gray-600">{section.content}</div>
          </div>
        );

      default:
        return (
          <div className="whitespace-pre-wrap text-gray-700">
            {section.content}
          </div>
        );
    }
  }, []);

  // Calculate explanation statistics
  const explanationStats = useMemo(() => {
    if (explanationData.length === 0) return null;

    const typeCounts = explanationData.reduce(
      (acc: Record<string, number>, section: ParsedExplanationData) => {
        acc[section.type] = (acc[section.type] || 0) + 1;
        return acc;
      },
      {},
    );

    const totalContentLength = explanationData.reduce(
      (sum: number, section: ParsedExplanationData) =>
        sum + section.content.length,
      0,
    );

    return {
      totalSections: explanationData.length,
      typeCounts,
      averageContentLength: Math.round(
        totalContentLength / explanationData.length,
      ),
      totalContentLength,
    };
  }, [explanationData]);

  if (explanationData.length === 0 && !aiExplanation) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="mb-2 text-lg">No explanation data available</div>
          <div className="text-sm">
            This stage doesn't contain explanation data
          </div>
          <button
            type="button"
            onClick={handleGenerateExplanation}
            disabled={isGenerating}
            className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isGenerating ? "Generating..." : "Generate AI Explanation"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="explanation-panel flex h-full flex-col">
      {/* Panel Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">AI Explanation</h3>
        <div className="flex items-center space-x-2">
          {explanationStats && (
            <span className="text-sm text-gray-600">
              {explanationStats.totalSections} sections
            </span>
          )}
        </div>
      </div>

      {/* Explanation Statistics */}
      {explanationStats && (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <div className="mb-2 text-sm font-medium text-gray-700">
            Explanation Statistics
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-600">Total Sections:</div>
            <div className="font-medium">{explanationStats.totalSections}</div>
            <div className="text-gray-600">Total Content:</div>
            <div className="font-medium">
              {explanationStats.totalContentLength} chars
            </div>
            <div className="text-gray-600">Avg Content:</div>
            <div className="font-medium">
              {explanationStats.averageContentLength} chars
            </div>
          </div>
          <div className="mt-2 text-xs">
            <div className="mb-1 text-gray-600">Section Types:</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(explanationStats.typeCounts).map(
                ([type, count]) => (
                  <span
                    key={type}
                    className="rounded bg-gray-200 px-2 py-1 text-gray-700"
                  >
                    {type}: {count as number}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* Explanation Controls */}
      <div className="mb-4 rounded-md bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExpandAll}
              className="rounded bg-gray-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-gray-600"
            >
              📖 Expand All
            </button>

            <button
              type="button"
              onClick={handleCollapseAll}
              className="rounded bg-gray-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-gray-600"
            >
              📕 Collapse All
            </button>

            <button
              type="button"
              onClick={handleGenerateExplanation}
              disabled={isGenerating}
              className="rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-blue-400"
            >
              {isGenerating ? "🤖 Generating..." : "🤖 Generate AI Explanation"}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showRawData}
                onChange={(e) => setShowRawData(e.target.checked)}
                className="text-blue-600"
              />
              <span className="text-xs text-gray-600">Show Raw Data</span>
            </label>
          </div>
        </div>
      </div>

      {/* AI Explanation (if available) */}
      {aiExplanation && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium text-blue-800">
              AI-Generated Explanation
            </h4>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
              AI Generated
            </span>
          </div>
          <div className="whitespace-pre-wrap text-sm text-blue-700">
            {aiExplanation}
          </div>
        </div>
      )}

      {/* Explanation Sections */}
      <div className="flex-1 overflow-auto">
        {explanationData.map((section: ParsedExplanationData) =>
          renderSection(section),
        )}
      </div>

      {/* Raw Data Display */}
      {showRawData && (
        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 text-sm font-medium text-gray-700">Raw Data</div>
          <pre className="overflow-x-auto rounded border bg-white p-2 text-xs text-gray-600">
            {JSON.stringify(stage.payload?.visual, null, 2)}
          </pre>
        </div>
      )}

      {/* Export Controls */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() =>
            onUpdate({
              payload: {
                ...stage.payload,
                visual: JSON.stringify(explanationData, null, 2),
              },
            })
          }
          className="text-xs text-blue-600 underline hover:text-blue-800"
        >
          Export Explanation
        </button>
      </div>
    </div>
  );
}
