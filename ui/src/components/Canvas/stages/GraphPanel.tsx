import { useCallback, useMemo, useRef, useState } from "react";
import { useCanvas } from "../CanvasContext";
import type { PipelineStage } from "../types";

interface GraphPanelProps {
  stage: PipelineStage;
  onUpdate: (updates: Partial<PipelineStage>) => void;
  onSelect: () => void;
  isActive: boolean;
}

interface GraphNode {
  id: string;
  label: string;
  type: string;
  x?: number;
  y?: number;
  data?: any;
  metadata?: Record<string, any>;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  data?: any;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  layout: "hierarchical" | "force" | "dagre" | "custom";
  metadata?: Record<string, any>;
}

export function GraphPanel({
  stage,
  onUpdate,
  onSelect,
  isActive,
}: GraphPanelProps) {
  const { explanations } = useCanvas();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Parse graph data from stage payload
  const graphData = useMemo(() => {
    try {
      if (stage.payload?.visual) {
        const data =
          typeof stage.payload.visual === "string"
            ? JSON.parse(stage.payload.visual)
            : stage.payload.visual;

        // Convert to graph structure
        if (data.nodes && data.edges) {
          return {
            nodes: data.nodes.map((node: any) => ({
              id: node.id || `node-${Math.random().toString(36).substr(2, 9)}`,
              label: node.label || node.name || "Unknown",
              type: node.type || "node",
              x: node.x || node.position?.x || 0,
              y: node.y || node.position?.y || 0,
              data: node.data || node,
              metadata: node.metadata || {},
            })),
            edges: data.edges.map((edge: any) => ({
              id: edge.id || `edge-${Math.random().toString(36).substr(2, 9)}`,
              source: edge.source || edge.from || edge.start,
              target: edge.target || edge.to || edge.end,
              label: edge.label || "",
              type: edge.type || "default",
              data: edge.data || edge,
            })),
            layout: data.layout || "force",
            metadata: data.metadata || {},
          };
        }
        // Alternative format
        return {
          nodes: data.graph.nodes || [],
          edges: data.graph.edges || [],
          layout: data.graph.layout || "force",
          metadata: data.graph.metadata || {},
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to parse graph data:", error);
      return null;
    }
  }, [stage.payload?.visual]);

  // Calculate graph statistics
  const graphStats = useMemo(() => {
    if (!graphData) return null;

    const nodeTypes = graphData.nodes.reduce(
      (acc: Record<string, number>, node: any) => {
        acc[node.type] = (acc[node.type] || 0) + 1;
        return acc;
      },
      {},
    );

    const edgeTypes = graphData.edges.reduce(
      (acc: Record<string, number>, edge: any) => {
        acc[edge.type] = (acc[edge.type] || 0) + 1;
        return acc;
      },
      {},
    );

    return {
      totalNodes: graphData.nodes.length,
      totalEdges: graphData.edges.length,
      nodeTypes,
      edgeTypes,
      density: graphData.edges.length / Math.max(graphData.nodes.length, 1),
    };
  }, [graphData]);

  // Handle canvas interactions
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        // Left click
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    },
    [pan],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)));
  }, []);

  // Handle node selection
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
      setSelectedEdge(null);
    },
    [selectedNode],
  );

  // Handle edge selection
  const handleEdgeClick = useCallback(
    (edgeId: string) => {
      setSelectedEdge(edgeId === selectedEdge ? null : edgeId);
      setSelectedNode(null);
    },
    [selectedEdge],
  );

  // Reset view
  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Fit to view
  const handleFitToView = useCallback(() => {
    if (!graphData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    // Calculate bounds
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    graphData.nodes.forEach((node: any) => {
      minX = Math.min(minX, node.x || 0);
      minY = Math.min(minY, node.y || 0);
      maxX = Math.max(maxX, node.x || 0);
      maxY = Math.max(maxY, node.y || 0);
    });

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;

    if (graphWidth === 0 || graphHeight === 0) return;

    // Calculate scale and offset
    const scaleX = (canvasWidth - 100) / graphWidth;
    const scaleY = (canvasHeight - 100) / graphHeight;
    const scale = Math.min(scaleX, scaleY, 2); // Cap at 2x zoom

    setZoom(scale);
    setPan({
      x: (canvasWidth - graphWidth * scale) / 2 - minX * scale,
      y: (canvasHeight - graphHeight * scale) / 2 - minY * scale,
    });
  }, [graphData]);

  // Render graph node
  const renderNode = useCallback(
    (node: GraphNode) => {
      const isSelected = selectedNode === node.id;
      const x = (node.x || 0) * zoom + pan.x;
      const y = (node.y || 0) * zoom + pan.y;

      return (
        <div
          key={node.id}
          className={`absolute h-20 w-20 cursor-pointer rounded-lg border-2 transition-all duration-200 ${
            isSelected
              ? "border-blue-500 bg-blue-100 shadow-lg"
              : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-md"
          } `}
          style={{
            left: x - 40,
            top: y - 40,
            transform: `scale(${zoom})`,
          }}
          onClick={() => handleNodeClick(node.id)}
          title={`${node.label} (${node.type})`}
        >
          <div className="flex h-full flex-col items-center justify-center p-2">
            <div
              className={`mb-1 h-3 w-3 rounded-full ${node.type === "function" ? "bg-blue-500" : ""} ${node.type === "variable" ? "bg-green-500" : ""} ${node.type === "class" ? "bg-purple-500" : ""} ${node.type === "statement" ? "bg-orange-500" : ""} ${node.type === "block" ? "bg-red-500" : ""} ${!["function", "variable", "class", "statement", "block"].includes(node.type) ? "bg-gray-500" : ""} `}
            />
            <div className="text-center text-xs font-medium leading-tight text-gray-900">
              {node.label.length > 8
                ? node.label.substring(0, 8) + "..."
                : node.label}
            </div>
            <div className="text-center text-xs text-gray-500">{node.type}</div>
          </div>
        </div>
      );
    },
    [zoom, pan, selectedNode, handleNodeClick],
  );

  // Render graph edge
  const renderEdge = useCallback(
    (edge: GraphEdge) => {
      const isSelected = selectedEdge === edge.id;
      const sourceNode = graphData?.nodes.find(
        (n: any) => n.id === edge.source,
      );
      const targetNode = graphData?.nodes.find(
        (n: any) => n.id === edge.target,
      );

      if (!sourceNode || !targetNode) return null;

      const sourceX = (sourceNode.x || 0) * zoom + pan.x;
      const sourceY = (sourceNode.y || 0) * zoom + pan.y;
      const targetX = (targetNode.x || 0) * zoom + pan.x;
      const targetY = (targetNode.y || 0) * zoom + pan.y;

      // Calculate edge path
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const angle = Math.atan2(dy, dx);
      const length = Math.sqrt(dx * dx + dy * dy);

      // Adjust start and end points to node boundaries
      const nodeRadius = 40;
      const startX = sourceX + Math.cos(angle) * nodeRadius;
      const startY = sourceY + Math.sin(angle) * nodeRadius;
      const endX = targetX - Math.cos(angle) * nodeRadius;
      const endY = targetY - Math.sin(angle) * nodeRadius;

      return (
        <svg
          key={edge.id}
          className="pointer-events-none absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <marker
              id={`arrowhead-${edge.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill={isSelected ? "#3B82F6" : "#6B7280"}
              />
            </marker>
          </defs>
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={isSelected ? "#3B82F6" : "#6B7280"}
            strokeWidth={isSelected ? 3 : 2}
            markerEnd={`url(#arrowhead-${edge.id})`}
            className="cursor-pointer"
            onClick={() => handleEdgeClick(edge.id)}
          />
          {edge.label && (
            <text
              x={(startX + endX) / 2}
              y={(startY + endY) / 2 - 10}
              textAnchor="middle"
              className="pointer-events-none fill-gray-600 text-xs"
            >
              {edge.label}
            </text>
          )}
        </svg>
      );
    },
    [zoom, pan, selectedEdge, graphData, handleEdgeClick],
  );

  // Render explanation if available
  const explanation = explanations[stage.id];

  if (!graphData) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="mb-2 text-lg">No graph data available</div>
          <div className="text-sm">
            This stage doesn't contain graph visualization data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="graph-panel flex h-full flex-col">
      {/* Panel Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Graph Visualization
        </h3>
        <div className="flex items-center space-x-2">
          {graphStats && (
            <span className="text-sm text-gray-600">
              {graphStats.totalNodes} nodes, {graphStats.totalEdges} edges
            </span>
          )}
        </div>
      </div>

      {/* Graph Statistics */}
      {graphStats && (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <div className="mb-2 text-sm font-medium text-gray-700">
            Graph Statistics
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-600">Total Nodes:</div>
            <div className="font-medium">{graphStats.totalNodes}</div>
            <div className="text-gray-600">Total Edges:</div>
            <div className="font-medium">{graphStats.totalEdges}</div>
            <div className="text-gray-600">Density:</div>
            <div className="font-medium">{graphStats.density.toFixed(3)}</div>
            <div className="text-gray-600">Layout:</div>
            <div className="font-medium capitalize">{graphData.layout}</div>
          </div>
        </div>
      )}

      {/* Graph Controls */}
      <div className="mb-4 rounded-md bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetView}
              className="rounded bg-gray-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-gray-600"
            >
              🔄 Reset View
            </button>

            <button
              onClick={handleFitToView}
              className="rounded bg-gray-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-gray-600"
            >
              📐 Fit to View
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-gray-600">Zoom:</label>
            <span className="text-xs font-medium">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="relative flex-1 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
        <div
          ref={canvasRef}
          className="relative h-full w-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Render edges first (behind nodes) */}
          {graphData.edges.map((edge: any) => renderEdge(edge))}

          {/* Render nodes on top */}
          {graphData.nodes.map((node: any) => renderNode(node))}

          {/* Instructions */}
          {graphData.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="mb-2 text-lg">Empty Graph</div>
                <div className="text-sm">No nodes to display</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selection Details */}
      {(selectedNode || selectedEdge) && (
        <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3">
          <div className="mb-2 text-sm font-medium text-blue-800">
            Selection Details
          </div>
          {selectedNode && (
            <div className="text-xs text-blue-700">
              <div>Type: Node</div>
              <div>ID: {selectedNode}</div>
              <div>
                Label:{" "}
                {graphData.nodes.find((n: any) => n.id === selectedNode)?.label}
              </div>
              <div>
                Node Type:{" "}
                {graphData.nodes.find((n: any) => n.id === selectedNode)?.type}
              </div>
            </div>
          )}
          {selectedEdge && (
            <div className="text-xs text-blue-700">
              <div>Type: Edge</div>
              <div>ID: {selectedEdge}</div>
              <div>
                Source:{" "}
                {
                  graphData.edges.find((e: any) => e.id === selectedEdge)
                    ?.source
                }
              </div>
              <div>
                Target:{" "}
                {
                  graphData.edges.find((e: any) => e.id === selectedEdge)
                    ?.target
                }
              </div>
              <div>
                Edge Type:{" "}
                {graphData.edges.find((e: any) => e.id === selectedEdge)?.type}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 text-sm font-medium text-gray-700">
            AI Explanation
          </div>
          <div className="text-sm text-gray-600">{explanation}</div>
        </div>
      )}

      {/* Export Controls */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() =>
            onUpdate({
              payload: {
                ...stage.payload,
                visual: JSON.stringify(graphData, null, 2),
              },
            })
          }
          className="text-xs text-blue-600 underline hover:text-blue-800"
        >
          Export Graph
        </button>
      </div>
    </div>
  );
}
