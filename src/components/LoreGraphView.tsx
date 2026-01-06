'use client'

import React, { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type Connection,
  type NodeMouseHandler,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useSessionStore } from '@/stores/sessionStore'
import type { Lore, LoreConnection } from '@/types/lore'
import { getRelationshipTypeInfo } from '@/types/lore'
import type { LoreNodeData, LoreNodePosition } from '@/types/loreGraph'
import LoreGraphNode from './LoreGraphNode'
import LoreGraphToolbar from './LoreGraphToolbar'

// Register custom node types
const nodeTypes = {
  loreNode: LoreGraphNode,
}

// Default edge style
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: { stroke: '#94a3b8', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#94a3b8',
  },
}

interface LoreGraphViewInnerProps {
  onEditLore: (lore: Lore) => void
  onAddLore: () => void
  onDeleteLore: (lore: Lore) => void
}

function LoreGraphViewInner({
  onEditLore,
  onAddLore,
  onDeleteLore,
}: LoreGraphViewInnerProps) {
  const {
    lore,
    loreGraphLayout,
    setLoreNodePosition,
    setLoreNodePositions,
    setLoreGraphViewport,
    resetLoreGraphLayout,
    updateLore,
  } = useSessionStore()

  const { fitView, zoomIn, zoomOut, getViewport } = useReactFlow()

  // Convert lore entries to React Flow nodes
  const initialNodes = useMemo(() => {
    return lore.map((loreItem, index) => {
      // Get saved position or calculate default grid position
      const savedPosition = loreGraphLayout.nodes[loreItem.id]
      const defaultPosition = {
        x: (index % 5) * 320 + 50,
        y: Math.floor(index / 5) * 200 + 50,
      }
      const position = savedPosition || defaultPosition

      const nodeData: LoreNodeData = {
        loreId: loreItem.id,
        title: loreItem.title,
        type: loreItem.type,
        importance: loreItem.importance,
        isPublic: loreItem.isPublic,
        connectionCount: loreItem.connections.length,
        tags: loreItem.tags,
        ...(loreItem.year !== undefined && { year: loreItem.year }),
        ...(loreItem.era !== undefined && { era: loreItem.era }),
      }

      return {
        id: loreItem.id,
        type: 'loreNode',
        position,
        data: nodeData,
      } as Node<LoreNodeData>
    })
  }, [lore, loreGraphLayout.nodes])

  // Derive edges from lore connections where type === 'lore'
  const initialEdges = useMemo(() => {
    const edges: Edge[] = []

    lore.forEach(loreItem => {
      loreItem.connections
        .filter(conn => conn.type === 'lore')
        .forEach(conn => {
          // Only add edge if target lore exists
          const targetExists = lore.some(l => l.id === conn.entityId)
          if (targetExists) {
            const relationshipInfo = getRelationshipTypeInfo(conn.relationshipType)
            edges.push({
              id: `${loreItem.id}-${conn.entityId}`,
              source: loreItem.id,
              target: conn.entityId,
              label: relationshipInfo?.label || conn.relationshipType,
              labelStyle: { fontSize: 10, fill: '#64748b' },
              labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
              labelBgPadding: [4, 2] as [number, number],
              ...defaultEdgeOptions,
            })
          }
        })
    })

    return edges
  }, [lore])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes when lore changes
  React.useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  // Update edges when lore connections change
  React.useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  // Handle node drag end - persist position
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setLoreNodePosition(node.id, { x: node.position.x, y: node.position.y })
    },
    [setLoreNodePosition]
  )

  // Handle viewport changes - persist on move end
  const onMoveEnd = useCallback(() => {
    const viewport = getViewport()
    setLoreGraphViewport(viewport)
  }, [getViewport, setLoreGraphViewport])

  // Handle new connection - create LoreConnection
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return

      // Find source and target lore
      const sourceLore = lore.find(l => l.id === connection.source)
      const targetLore = lore.find(l => l.id === connection.target)

      if (!sourceLore || !targetLore) return

      // Check if connection already exists
      const existingConnection = sourceLore.connections.find(
        conn => conn.type === 'lore' && conn.entityId === connection.target
      )

      if (existingConnection) return // Connection already exists

      // Create new connection
      const newConnection: LoreConnection = {
        id: crypto.randomUUID(),
        type: 'lore',
        entityId: targetLore.id,
        entityName: targetLore.title,
        relationshipType: 'related_to',
      }

      // Update source lore with new connection
      updateLore(sourceLore.id, {
        connections: [...sourceLore.connections, newConnection],
      })

      // Add edge visually
      setEdges(eds =>
        addEdge(
          {
            ...connection,
            id: `${connection.source}-${connection.target}`,
            label: 'Relacionado con',
            labelStyle: { fontSize: 10, fill: '#64748b' },
            labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
            labelBgPadding: [4, 2] as [number, number],
            ...defaultEdgeOptions,
          },
          eds
        )
      )
    },
    [lore, updateLore, setEdges]
  )

  // Handle node double-click - open editor
  const onNodeDoubleClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const loreItem = lore.find(l => l.id === node.id)
      if (loreItem) {
        onEditLore(loreItem)
      }
    },
    [lore, onEditLore]
  )

  // Toolbar actions
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2 })
  }, [fitView])

  const handleZoomIn = useCallback(() => {
    zoomIn()
  }, [zoomIn])

  const handleZoomOut = useCallback(() => {
    zoomOut()
  }, [zoomOut])

  const handleAutoLayout = useCallback(() => {
    // Simple grid-based auto layout
    const newPositions: Record<string, LoreNodePosition> = {}
    const sortedLore = [...lore].sort((a, b) => {
      // Sort by year first, then by importance
      if (a.year !== undefined && b.year !== undefined) {
        return a.year - b.year
      }
      if (a.year !== undefined) return -1
      if (b.year !== undefined) return 1
      // Sort by importance
      const importanceOrder: Record<string, number> = { main: 0, secondary: 1, minor: 2 }
      return (
        (importanceOrder[a.importance] ?? 2) -
        (importanceOrder[b.importance] ?? 2)
      )
    })

    sortedLore.forEach((loreItem, index) => {
      newPositions[loreItem.id] = {
        x: (index % 5) * 320 + 50,
        y: Math.floor(index / 5) * 200 + 50,
      }
    })

    setLoreNodePositions(newPositions)

    // Update local nodes
    setNodes(nds =>
      nds.map(node => ({
        ...node,
        position: newPositions[node.id] || node.position,
      }))
    )

    // Fit view after layout
    setTimeout(() => {
      fitView({ padding: 0.2 })
    }, 50)
  }, [lore, setLoreNodePositions, setNodes, fitView])

  const handleResetLayout = useCallback(() => {
    resetLoreGraphLayout()
    handleAutoLayout()
  }, [resetLoreGraphLayout, handleAutoLayout])

  // Handle add node at center of viewport
  const handleAddNode = useCallback(() => {
    onAddLore()
  }, [onAddLore])

  // MiniMap node color based on type
  const nodeColor = useCallback((node: Node) => {
    const typeColors: Record<string, string> = {
      event: '#3b82f6',
      legend: '#8b5cf6',
      history: '#f59e0b',
      prophecy: '#6366f1',
      secret: '#ef4444',
      rumor: '#6b7280',
      chronicle: '#10b981',
      tale: '#f43f5e',
    }
    return typeColors[(node.data as LoreNodeData)?.type] || '#6b7280'
  }, [])

  return (
    <div className="w-full h-[600px] bg-slate-50 rounded-lg border relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onMoveEnd={onMoveEnd}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultViewport={loreGraphLayout.viewport}
        fitView={lore.length > 0 && Object.keys(loreGraphLayout.nodes).length === 0}
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        snapToGrid
        snapGrid={[20, 20]}
        connectionLineStyle={{ stroke: '#94a3b8', strokeWidth: 2 }}
        attributionPosition="bottom-right"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
        <Controls
          position="bottom-right"
          showZoom={false}
          showFitView={false}
          showInteractive={false}
        />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={2}
          zoomable
          pannable
          position="bottom-left"
          className="!bg-white/80 !border !border-slate-200 !rounded-lg !shadow-sm"
        />
      </ReactFlow>

      <LoreGraphToolbar
        onAddNode={handleAddNode}
        onResetLayout={handleResetLayout}
        onFitView={handleFitView}
        onAutoLayout={handleAutoLayout}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* Empty state */}
      {lore.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 pointer-events-none">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              No hay entradas de Lore todavía
            </p>
            <p className="text-sm text-muted-foreground">
              Crea tu primera entrada usando el botón + en la esquina superior izquierda
            </p>
          </div>
        </div>
      )}

      {/* Instructions hint */}
      {lore.length > 0 && (
        <div className="absolute bottom-4 right-24 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">
          Doble clic para editar · Arrastra desde un nodo a otro para conectar
        </div>
      )}
    </div>
  )
}

// Wrapper component that provides ReactFlowProvider
interface LoreGraphViewProps {
  onEditLore: (lore: Lore) => void
  onAddLore: () => void
  onDeleteLore: (lore: Lore) => void
}

export default function LoreGraphView(props: LoreGraphViewProps) {
  return (
    <ReactFlowProvider>
      <LoreGraphViewInner {...props} />
    </ReactFlowProvider>
  )
}
