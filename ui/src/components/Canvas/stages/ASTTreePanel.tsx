import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { PipelineStage } from '../types';
import { useCanvas } from '../CanvasContext';

interface ASTTreePanelProps {
  stage: PipelineStage;
  onUpdate: (updates: Partial<PipelineStage>) => void;
  onSelect: () => void;
  isActive: boolean;
}

interface ASTNode {
  id: string;
  label: string;
  type: string;
  children?: ASTNode[];
  position?: { x: number; y: number };
  data?: any;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
}

export function ASTTreePanel({ stage, onUpdate, onSelect, isActive }: ASTTreePanelProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse AST data from stage payload
  const astData = useMemo(() => {
    try {
      if (stage.payload?.visual) {
        return typeof stage.payload.visual === 'string' 
          ? JSON.parse(stage.payload.visual) 
          : stage.payload.visual;
      }
      return null;
    } catch (error) {
      console.error('Failed to parse AST data:', error);
      return null;
    }
  }, [stage.payload?.visual]);

  // Convert AST data to tree structure
  const treeNodes: ASTNode[] = useMemo(() => {
    if (!astData) return [];

    const convertToTree = (node: any, parentId?: string, depth: number = 0): ASTNode => {
      const id = `${parentId || 'root'}-${node.type || 'node'}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id,
        label: node.name || node.type || 'Unknown',
        type: node.type || 'node',
        children: node.children ? node.children.map((child: any) => convertToTree(child, id, depth + 1)) : undefined,
        data: node,
        depth,
        isExpanded: true,
        isSelected: false,
      };
    };

    // Handle both single node and array of nodes
    if (Array.isArray(astData)) {
      return astData.map(node => convertToTree(node));
    } else {
      return [convertToTree(astData)];
    }
  }, [astData]);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  }, [selectedNode]);

  // Handle node expansion
  const handleNodeToggle = useCallback((nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  }, [expandedNodes]);

  // Zoom controls
  const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev * 1.2, 3)), []);
  const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev / 1.2, 0.3)), []);
  const handleResetZoom = useCallback(() => setZoom(1), []);

  // Pan controls
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  }, [panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Auto-expand all nodes initially
  useEffect(() => {
    if (treeNodes.length > 0) {
      const allNodeIds = new Set<string>();
      const collectIds = (nodes: ASTNode[]) => {
        nodes.forEach(node => {
          allNodeIds.add(node.id);
          if (node.children) collectIds(node.children);
        });
      };
      collectIds(treeNodes);
      setExpandedNodes(allNodeIds);
    }
  }, [treeNodes]);

  // Render tree node with beautiful styling
  const renderTreeNode = useCallback((node: ASTNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;
    const indent = level * 32;

    return (
      <div key={node.id} className="ast-node-container">
        <div 
          className={`ast-node ${isSelected ? 'selected' : ''} ${node.type.toLowerCase()}`}
          style={{ marginLeft: `${indent}px` }}
          onClick={() => handleNodeSelect(node.id)}
        >
          {/* Node Icon */}
          <div className="node-icon">
            {hasChildren ? (
              <button
                className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeToggle(node.id);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  {isExpanded ? (
                    <path d="M7 10l5 5 5-5z"/>
                  ) : (
                    <path d="M10 6L4 12l6 6 1.41-1.41L6.83 13H20v-2H6.83l4.58-4.59z"/>
                  )}
                </svg>
              </button>
            ) : (
              <div className="leaf-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Node Content */}
          <div className="node-content">
            <div className="node-label">{node.label}</div>
            <div className="node-type">{node.type}</div>
          </div>

          {/* Node Actions */}
          <div className="node-actions">
            <button 
              className="action-button info"
              onClick={(e) => {
                e.stopPropagation();
                // Show node details
              }}
              title="Node Details"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="node-children">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  }, [expandedNodes, selectedNode, handleNodeSelect, handleNodeToggle]);

  // Tree statistics
  const treeStats = useMemo(() => {
    if (!treeNodes.length) return null;

    const countNodes = (nodes: ASTNode[]) => {
      let total = nodes.length;
      let types = new Map<string, number>();
      
      nodes.forEach(node => {
        const count = types.get(node.type) || 0;
        types.set(node.type, count + 1);
        if (node.children) {
          const childStats = countNodes(node.children);
          total += childStats.total;
          childStats.types.forEach((count, type) => {
            types.set(type, (types.get(type) || 0) + count);
          });
        }
      });

      return { total, types };
    };

    const stats = countNodes(treeNodes);
    return stats;
  }, [treeNodes]);

  if (!astData) {
    return (
      <div className="ast-panel-empty">
        <div className="empty-state">
          <div className="empty-icon">🌳</div>
          <h3>No AST Data Available</h3>
          <p>This stage doesn't contain Abstract Syntax Tree data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ast-tree-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="header-title">
          <h3>🌳 Abstract Syntax Tree</h3>
          <span className="stage-name">{stage.stage}</span>
        </div>
        
        {/* Controls */}
        <div className="panel-controls">
          <div className="zoom-controls">
            <button className="control-button" onClick={handleZoomOut} title="Zoom Out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button className="control-button" onClick={handleZoomIn} title="Zoom In">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
            <button className="control-button" onClick={handleResetZoom} title="Reset Zoom">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
            </button>
          </div>
          
          <div className="view-controls">
            <button 
              className="control-button"
              onClick={() => {
                const allNodeIds = new Set<string>();
                const collectIds = (nodes: ASTNode[]) => {
                  nodes.forEach(node => {
                    allNodeIds.add(node.id);
                    if (node.children) collectIds(node.children);
                  });
                };
                collectIds(treeNodes);
                setExpandedNodes(allNodeIds);
              }}
              title="Expand All"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
            </button>
            <button 
              className="control-button"
              onClick={() => setExpandedNodes(new Set())}
              title="Collapse All"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      {treeStats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Nodes:</span>
            <span className="stat-value">{treeStats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Node Types:</span>
            <span className="stat-value">{treeStats.types.size}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Max Depth:</span>
            <span className="stat-value">{Math.max(...treeNodes.map(n => n.depth)) + 1}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Selected:</span>
            <span className="stat-value">{selectedNode ? '1' : '0'}</span>
          </div>
        </div>
      )}

      {/* Tree Container */}
      <div 
        className="tree-container"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className="tree-content"
          style={{
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'top left',
          }}
        >
          {treeNodes.map(node => renderTreeNode(node))}
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="node-details-panel">
          <div className="details-header">
            <h4>Node Details</h4>
            <button 
              className="close-button"
              onClick={() => setSelectedNode(null)}
            >
              ×
            </button>
          </div>
          <div className="details-content">
            <div className="detail-item">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{selectedNode}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{treeNodes.find(n => n.id === selectedNode)?.type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Label:</span>
              <span className="detail-value">{treeNodes.find(n => n.id === selectedNode)?.label}</span>
            </div>
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
          <div className="explanation-content">
            {stage.payload.explain}
          </div>
        </div>
      )}
    </div>
  );
}
