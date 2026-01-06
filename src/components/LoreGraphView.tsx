'use client'

import React, { useCallback, useMemo, useState } from 'react'
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
  type EdgeMouseHandler,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useSessionStore } from '@/stores/sessionStore'
import type { Lore, LoreConnection } from '@/types/lore'
import { getRelationshipTypeInfo, RELATIONSHIP_TYPES } from '@/types/lore'
import type { LoreNodeData, LoreNodePosition } from '@/types/loreGraph'
import LoreGraphNode from './LoreGraphNode'
import LoreGraphToolbar from './LoreGraphToolbar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'

// Register custom node types
const nodeTypes = {
  loreNode: LoreGraphNode,
}

// Default edge style - Dark theme optimized
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: { stroke: '#64748b', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#64748b',
  },
}

interface EdgeEditState {
  isOpen: boolean
  sourceId: string
  targetId: string
  connectionId: string
  relationshipType: string
  description: string
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

  // Edge editing state
  const [edgeEdit, setEdgeEdit] = useState<EdgeEditState>({
    isOpen: false,
    sourceId: '',
    targetId: '',
    connectionId: '',
    relationshipType: 'related_to',
    description: '',
  })

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
              labelStyle: { fontSize: 11, fill: '#94a3b8', fontWeight: 500 },
              labelBgStyle: { fill: '#1e293b', fillOpacity: 0.9 },
              labelBgPadding: [6, 4] as [number, number],
              labelBgBorderRadius: 4,
              data: { connectionId: conn.id },
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
            labelStyle: { fontSize: 11, fill: '#94a3b8', fontWeight: 500 },
            labelBgStyle: { fill: '#1e293b', fillOpacity: 0.9 },
            labelBgPadding: [6, 4] as [number, number],
            labelBgBorderRadius: 4,
            data: { connectionId: newConnection.id },
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

  // Handle edge click - open edge editor
  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      const sourceLore = lore.find(l => l.id === edge.source)
      if (!sourceLore) return

      const connection = sourceLore.connections.find(
        conn => conn.type === 'lore' && conn.entityId === edge.target
      )

      if (!connection) return

      setEdgeEdit({
        isOpen: true,
        sourceId: edge.source,
        targetId: edge.target,
        connectionId: connection.id,
        relationshipType: connection.relationshipType,
        description: connection.description || '',
      })
    },
    [lore]
  )

  // Save edge changes
  const handleSaveEdge = useCallback(() => {
    const sourceLore = lore.find(l => l.id === edgeEdit.sourceId)
    if (!sourceLore) return

    const updatedConnections = sourceLore.connections.map(conn => {
      if (conn.id === edgeEdit.connectionId) {
        const updatedConn: LoreConnection = {
          ...conn,
          relationshipType: edgeEdit.relationshipType as LoreConnection['relationshipType'],
        }
        // Only add description if it has content
        if (edgeEdit.description) {
          updatedConn.description = edgeEdit.description
        }
        return updatedConn
      }
      return conn
    })

    updateLore(sourceLore.id, { connections: updatedConnections })
    setEdgeEdit(prev => ({ ...prev, isOpen: false }))
  }, [edgeEdit, lore, updateLore])

  // Delete edge/connection
  const handleDeleteEdge = useCallback(() => {
    const sourceLore = lore.find(l => l.id === edgeEdit.sourceId)
    if (!sourceLore) return

    const updatedConnections = sourceLore.connections.filter(
      conn => conn.id !== edgeEdit.connectionId
    )

    updateLore(sourceLore.id, { connections: updatedConnections })
    setEdgeEdit(prev => ({ ...prev, isOpen: false }))
  }, [edgeEdit, lore, updateLore])

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

  // Get source and target names for edge dialog
  const sourceLoreName = lore.find(l => l.id === edgeEdit.sourceId)?.title || ''
  const targetLoreName = lore.find(l => l.id === edgeEdit.targetId)?.title || ''

  return (
    <div className="w-full h-[600px] bg-background rounded-lg border border-border relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onMoveEnd={onMoveEnd}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultViewport={loreGraphLayout.viewport}
        fitView={lore.length > 0 && Object.keys(loreGraphLayout.nodes).length === 0}
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        snapToGrid
        snapGrid={[20, 20]}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        attributionPosition="bottom-right"
        className="[&_.react-flow__attribution]:text-muted-foreground/50 [&_.react-flow__attribution]:text-[10px]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={2}
          color="#334155"
          className="!bg-slate-950"
        />
        <Controls
          position="bottom-right"
          showZoom={false}
          showFitView={false}
          showInteractive={false}
          className="[&_button]:!bg-slate-800 [&_button]:!border-slate-700 [&_button]:!text-slate-300 [&_button:hover]:!bg-slate-700"
        />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={2}
          zoomable
          pannable
          position="bottom-left"
          className="!bg-slate-900/90 !border !border-slate-700 !rounded-lg !shadow-lg"
          maskColor="rgba(15, 23, 42, 0.7)"
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
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 pointer-events-none">
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
        <div className="absolute bottom-4 right-24 text-xs text-muted-foreground bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-md">
          Doble clic para editar · Clic en línea para editar relación · Arrastra para conectar
        </div>
      )}

      {/* Edge Edit Dialog */}
      <Dialog open={edgeEdit.isOpen} onOpenChange={(open) => setEdgeEdit(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Conexión</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{sourceLoreName}</span>
              {' → '}
              <span className="font-medium text-foreground">{targetLoreName}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationshipType">Tipo de Relación</Label>
              <Select
                value={edgeEdit.relationshipType}
                onValueChange={(value) => setEdgeEdit(prev => ({ ...prev, relationshipType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                value={edgeEdit.description}
                onChange={(e) => setEdgeEdit(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalles adicionales de la relación..."
              />
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteEdge}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEdgeEdit(prev => ({ ...prev, isOpen: false }))}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdge}>
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
