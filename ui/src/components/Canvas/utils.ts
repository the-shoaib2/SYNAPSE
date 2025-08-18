import { GraphData, NodeData, PipelineStage, VisualType } from "./types";

/**
 * Utility functions for the Canvas system
 */

/**
 * Calculate optimal grid layout for panels
 */
export function calculateGridLayout(
  panels: PipelineStage[],
  containerWidth: number,
  containerHeight: number,
  maxColumns: number = 3,
): Record<string, { x: number; y: number; width: number; height: number }> {
  const layout: Record<
    string,
    { x: number; y: number; width: number; height: number }
  > = {};

  if (panels.length === 0) return layout;

  const columns = Math.min(maxColumns, panels.length);
  const rows = Math.ceil(panels.length / columns);

  const panelWidth = containerWidth / columns;
  const panelHeight = containerHeight / rows;

  panels.forEach((panel, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    layout[panel.id] = {
      x: col * panelWidth,
      y: row * panelHeight,
      width: panelWidth,
      height: panelHeight,
    };
  });

  return layout;
}

/**
 * Transform AST data to tree structure
 */
export function transformASTToTree(astData: any): NodeData[] {
  const nodes: NodeData[] = [];
  const nodeMap = new Map<string, NodeData>();

  function processNode(node: any, parentId?: string): string {
    const id = node.id || `node-${Math.random().toString(36).substr(2, 9)}`;

    if (nodeMap.has(id)) return id;

    const nodeData: NodeData = {
      id,
      label: node.name || node.type || "Unknown",
      type: node.type || "node",
      data: node,
      position: { x: 0, y: 0 },
      children: [],
      parent: parentId,
    };

    nodeMap.set(id, nodeData);
    nodes.push(nodeData);

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any) => {
        const childId = processNode(child, id);
        if (childId && nodeData.children) {
          nodeData.children.push(childId);
        }
      });
    }

    return id;
  }

  if (Array.isArray(astData)) {
    astData.forEach((node) => processNode(node));
  } else if (astData) {
    processNode(astData);
  }

  return nodes;
}

/**
 * Transform timeline data to steps
 */
export function transformTimelineData(timelineData: any): any[] {
  if (Array.isArray(timelineData)) {
    return timelineData.map((item, index) => ({
      id: item.id || `step-${index}`,
      label: item.label || item.name || `Step ${index + 1}`,
      description: item.description || item.desc || "",
      timestamp: item.timestamp || index * 1000,
      duration: item.duration || 500,
      status: item.status || "pending",
      data: item.data || item,
      metadata: item.metadata || {},
    }));
  } else if (timelineData?.steps) {
    return timelineData.steps.map((step: any, index: number) => ({
      id: step.id || `step-${index}`,
      label: step.label || step.name || `Step ${index + 1}`,
      description: step.description || step.desc || "",
      timestamp: step.timestamp || index * 1000,
      duration: step.duration || 500,
      status: step.status || "pending",
      data: step.data || step,
      metadata: step.metadata || {},
    }));
  }

  return [];
}

/**
 * Transform graph data to nodes and edges
 */
export function transformGraphData(graphData: any): GraphData | null {
  if (!graphData) return null;

  try {
    if (graphData.nodes && graphData.edges) {
      return {
        nodes: graphData.nodes.map((node: any) => ({
          id: node.id || `node-${Math.random().toString(36).substr(2, 9)}`,
          label: node.label || node.name || "Unknown",
          type: node.type || "node",
          x: node.x || node.position?.x || 0,
          y: node.y || node.position?.y || 0,
          data: node.data || node,
          metadata: node.metadata || {},
        })),
        edges: graphData.edges.map((edge: any) => ({
          id: edge.id || `edge-${Math.random().toString(36).substr(2, 9)}`,
          source: edge.source || edge.from || edge.start,
          target: edge.target || edge.to || edge.end,
          label: edge.label || "",
          type: edge.type || "default",
          data: edge.data || edge,
        })),
        layout: graphData.layout || "force",
        metadata: graphData.metadata || {},
      };
    } else if (graphData.graph) {
      return {
        nodes: graphData.graph.nodes || [],
        edges: graphData.graph.edges || [],
        layout: graphData.graph.layout || "force",
        metadata: graphData.graph.metadata || {},
      };
    }
  } catch (error) {
    console.error("Failed to transform graph data:", error);
  }

  return null;
}

/**
 * Detect content type from data
 */
export function detectContentType(content: any): VisualType {
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return detectContentType(parsed);
    } catch {
      // Not JSON, check for code patterns
      if (
        content.includes("function") ||
        content.includes("class") ||
        content.includes("const")
      ) {
        return "code-editor";
      }
      return "explanation";
    }
  }

  if (Array.isArray(content)) {
    if (content.length === 0) return "explanation";

    const firstItem = content[0];
    if (firstItem.children || firstItem.type) {
      return "ast-tree";
    } else if (firstItem.timestamp || firstItem.duration) {
      return "timeline";
    } else if (firstItem.source || firstItem.target) {
      return "graph";
    }
  }

  if (content && typeof content === "object") {
    if (content.nodes && content.edges) {
      return "graph";
    } else if (content.steps || content.timeline) {
      return "timeline";
    } else if (content.children || content.type) {
      return "ast-tree";
    } else if (content.explanation || content.sections) {
      return "explanation";
    }
  }

  return "explanation";
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Validate pipeline stage data
 */
export function validatePipelineStage(stage: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!stage.id) errors.push("Missing stage ID");
  if (!stage.stage) errors.push("Missing stage name");
  if (!stage.type) errors.push("Missing stage type");
  if (!stage.engine) errors.push("Missing engine");
  if (!stage.payload) errors.push("Missing payload");

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate execution dependencies
 */
export function calculateDependencies(
  stages: PipelineStage[],
): Record<string, string[]> {
  const dependencies: Record<string, string[]> = {};

  stages.forEach((stage) => {
    dependencies[stage.id] = stage.dependencies || [];
  });

  return dependencies;
}

/**
 * Check for circular dependencies
 */
export function hasCircularDependencies(stages: PipelineStage[]): boolean {
  const dependencies = calculateDependencies(stages);
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const nodeDeps = dependencies[nodeId] || [];
    for (const depId of nodeDeps) {
      if (hasCycle(depId)) return true;
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const stage of stages) {
    if (hasCycle(stage.id)) return true;
  }

  return false;
}

/**
 * Sort stages by dependencies (topological sort)
 */
export function sortStagesByDependencies(
  stages: PipelineStage[],
): PipelineStage[] {
  const dependencies = calculateDependencies(stages);
  const visited = new Set<string>();
  const sorted: PipelineStage[] = [];

  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;

    const nodeDeps = dependencies[nodeId] || [];
    for (const depId of nodeDeps) {
      visit(depId);
    }

    visited.add(nodeId);
    const stage = stages.find((s) => s.id === nodeId);
    if (stage) sorted.push(stage);
  }

  stages.forEach((stage) => visit(stage.id));

  return sorted;
}
