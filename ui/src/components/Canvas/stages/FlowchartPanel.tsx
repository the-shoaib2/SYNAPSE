import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Connection, Edge, Node, NodeTypes } from "reactflow";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCanvas } from "../CanvasContext";
import type { PipelineStage } from "../types";

interface FlowchartPanelProps {
  stage: PipelineStage;
  onUpdate: (updates: Partial<PipelineStage>) => void;
  onSelect: () => void;
  isActive: boolean;
}

interface FlowchartNode {
  id: string;
  label: string;
  type: string;
  position: { x: number; y: number };
  data?: any;
  children?: FlowchartNode[];
}

interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

// Custom node types for different flowchart elements
const CustomNode = ({ data }: { data: any }) => (
  <div className="custom-flowchart-node">
    <div className="node-header">
      <span className="node-type">{data.type}</span>
    </div>
    <div className="node-content">
      <div className="node-label">{data.label}</div>
      {data.description && (
        <div className="node-description">{data.description}</div>
      )}
    </div>
    {data.status && (
      <div className={`node-status ${data.status}`}>{data.status}</div>
    )}
  </div>
);

const DecisionNode = ({ data }: { data: any }) => (
  <div className="custom-decision-node">
    <div className="decision-content">
      <div className="decision-label">{data.label}</div>
      {data.condition && (
        <div className="decision-condition">{data.condition}</div>
      )}
    </div>
  </div>
);

const ProcessNode = ({ data }: { data: any }) => (
  <div className="custom-process-node">
    <div className="process-content">
      <div className="process-label">{data.label}</div>
      {data.action && <div className="process-action">{data.action}</div>}
    </div>
  </div>
);

const StartEndNode = ({ data }: { data: any }) => (
  <div className="custom-startend-node">
    <div className="startend-content">
      <div className="startend-label">{data.label}</div>
    </div>
  </div>
);

const InputOutputNode = ({ data }: { data: any }) => (
  <div className="custom-inputoutput-node">
    <div className="inputoutput-content">
      <div className="inputoutput-label">{data.label}</div>
      {data.data && <div className="inputoutput-data">{data.data}</div>}
    </div>
  </div>
);

const nodeTypes: NodeTypes = {
  custom: CustomNode,
  decision: DecisionNode,
  process: ProcessNode,
  startend: StartEndNode,
  inputoutput: InputOutputNode,
};

export function FlowchartPanel({
  stage,
  onUpdate,
  onSelect,
  isActive,
}: FlowchartPanelProps) {
  const { state } = useCanvas();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fitView, setFitView] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Parse flowchart data from stage payload
  const flowchartData = useMemo(() => {
    try {
      if (stage.payload?.visual) {
        return typeof stage.payload.visual === "string"
          ? JSON.parse(stage.payload.visual)
          : stage.payload.visual;
      }
      return null;
    } catch (error) {
      console.error("Failed to parse flowchart data:", error);
      return null;
    }
  }, [stage.payload?.visual]);

  // Convert flowchart data to React Flow format
  const { nodes, edges } = useMemo(() => {
    if (!flowchartData) return { nodes: [], edges: [] };

    const convertToFlowchart = (data: any) => {
      const flowNodes: Node[] = [];
      const flowEdges: Edge[] = [];
      let nodeId = 0;

      const processNode = (node: any, parentId?: string, level: number = 0) => {
        const id = `node-${nodeId++}`;
        const position = {
          x: level * 250 + Math.random() * 50,
          y: level * 150 + Math.random() * 50,
        };

        // Determine node type based on data
        let nodeType = "custom";
        if (
          node.type?.toLowerCase().includes("decision") ||
          node.type?.toLowerCase().includes("if")
        ) {
          nodeType = "decision";
        } else if (
          node.type?.toLowerCase().includes("process") ||
          node.type?.toLowerCase().includes("action")
        ) {
          nodeType = "process";
        } else if (
          node.type?.toLowerCase().includes("start") ||
          node.type?.toLowerCase().includes("end")
        ) {
          nodeType = "startend";
        } else if (
          node.type?.toLowerCase().includes("input") ||
          node.type?.toLowerCase().includes("output")
        ) {
          nodeType = "inputoutput";
        }

        const flowNode: Node = {
          id,
          type: nodeType,
          position,
          data: {
            label: node.label || node.name || node.type || "Node",
            type: node.type || "custom",
            description: node.description,
            action: node.action,
            condition: node.condition,
            data: node.data,
            status: node.status,
            ...node,
          },
        };

        flowNodes.push(flowNode);

        // Create edges to children
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child: any) => {
            const childId = processNode(child, id, level + 1);
            if (childId) {
              flowEdges.push({
                id: `edge-${id}-${childId}`,
                source: id,
                target: childId,
                label: child.edgeLabel || "",
                type: "smoothstep",
                animated: child.animated || false,
                style: {
                  stroke: child.edgeColor || "#333",
                  strokeWidth: child.edgeWidth || 2,
                },
              });
            }
          });
        }

        // Create edge to parent if specified
        if (parentId) {
          flowEdges.push({
            id: `edge-${parentId}-${id}`,
            source: parentId,
            target: id,
            label: node.edgeLabel || "",
            type: "smoothstep",
            animated: node.animated || false,
            style: {
              stroke: node.edgeColor || "#333",
              strokeWidth: node.edgeWidth || 2,
            },
          });
        }

        return id;
      };

      // Process all root nodes
      if (Array.isArray(flowchartData)) {
        flowchartData.forEach((node) => processNode(node));
      } else {
        processNode(flowchartData);
      }

      return { nodes: flowNodes, edges: flowEdges };
    };

    return convertToFlowchart(flowchartData);
  }, [flowchartData]);

  const [reactFlowNodes, setReactFlowNodes, onNodesChange] =
    useNodesState(nodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] =
    useEdgesState(edges);

  // Update React Flow nodes when flowchart data changes
  useEffect(() => {
    setReactFlowNodes(nodes);
    setReactFlowEdges(edges);
  }, [nodes, edges, setReactFlowNodes, setReactFlowEdges]);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    setSelectedEdge(null);
  }, []);

  // Handle edge selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.id);
    setSelectedNode(null);
  }, []);

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Handle edge connections
  const onConnect = useCallback(
    (connection: Connection) => {
      setReactFlowEdges((eds) => addEdge(connection, eds));
    },
    [setReactFlowEdges],
  );

  // Fit view to show all nodes
  const handleFitView = useCallback(() => {
    setFitView(true);
  }, []);

  // Reset zoom
  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // Flowchart statistics
  const flowchartStats = useMemo(() => {
    if (!nodes.length) return null;

    const nodeTypes = nodes.reduce((acc: Record<string, number>, node) => {
      const type = node.type || "custom";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodeTypes,
      selectedNode: selectedNode ? 1 : 0,
      selectedEdge: selectedEdge ? 1 : 0,
    };
  }, [nodes, edges, selectedNode, selectedEdge]);

  if (!flowchartData) {
    return (
      <div className="flowchart-panel-empty">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Flowchart Data Available</h3>
          <p>This stage doesn't contain flowchart data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flowchart-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="header-title">
          <h3>📊 Flowchart Visualization</h3>
          <span className="stage-name">{stage.stage}</span>
        </div>

        {/* Controls */}
        <div className="panel-controls">
          <button
            className="control-button"
            onClick={handleFitView}
            title="Fit View"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM9 3H3v6l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3zM9 21h6v-6l-2.3 2.3-2.87-2.89-1.42 1.42L17.3 18.7 15 21zM3 15v6h6l-2.3-2.3-2.89 2.87-1.42-1.42L5.3 17.7 3 15z" />
            </svg>
          </button>
          <button
            className="control-button"
            onClick={handleResetZoom}
            title="Reset Zoom"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Statistics Bar */}
      {flowchartStats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Nodes:</span>
            <span className="stat-value">{flowchartStats.totalNodes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Edges:</span>
            <span className="stat-value">{flowchartStats.totalEdges}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Node Types:</span>
            <span className="stat-value">
              {Object.keys(flowchartStats.nodeTypes).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Selected:</span>
            <span className="stat-value">
              {flowchartStats.selectedNode + flowchartStats.selectedEdge}
            </span>
          </div>
        </div>
      )}

      {/* React Flow Container */}
      <div className="flowchart-container" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView={fitView}
          onMove={(event, viewport) => setZoom(viewport.zoom)}
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap />

          {/* Custom Panel for additional controls */}
          <Panel position="top-right" className="flowchart-panel-controls">
            <div className="panel-controls-group">
              <button
                className="control-button"
                onClick={() => setReactFlowNodes([])}
                title="Clear"
              >
                Clear
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Selection Details Panel */}
      {(selectedNode || selectedEdge) && (
        <div className="selection-details-panel">
          <div className="details-header">
            <h4>Selection Details</h4>
            <button
              className="close-button"
              onClick={() => {
                setSelectedNode(null);
                setSelectedEdge(null);
              }}
            >
              ×
            </button>
          </div>
          <div className="details-content">
            {selectedNode && (
              <div className="node-details">
                <div className="detail-item">
                  <span className="detail-label">Node ID:</span>
                  <span className="detail-value">{selectedNode}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">
                    {reactFlowNodes.find((n) => n.id === selectedNode)?.type}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Label:</span>
                  <span className="detail-value">
                    {
                      reactFlowNodes.find((n) => n.id === selectedNode)?.data
                        ?.label
                    }
                  </span>
                </div>
              </div>
            )}
            {selectedEdge && (
              <div className="edge-details">
                <div className="detail-item">
                  <span className="detail-label">Edge ID:</span>
                  <span className="detail-value">{selectedEdge}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Source:</span>
                  <span className="detail-value">
                    {reactFlowEdges.find((e) => e.id === selectedEdge)?.source}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Target:</span>
                  <span className="detail-value">
                    {reactFlowEdges.find((e) => e.id === selectedEdge)?.target}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Explanation */}
      {stage.payload?.explain && (
        <div className="ai-explanation">
          <div className="explanation-header">
            <span className="ai-icon">🤖</span>
            <span className="explanation-title">AI Analysis</span>
          </div>
          <div className="explanation-content">{stage.payload.explain}</div>
        </div>
      )}
    </div>
  );
}
