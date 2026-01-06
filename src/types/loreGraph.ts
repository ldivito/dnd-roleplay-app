import type { Viewport } from '@xyflow/react'

// Position for a single node in the graph
export interface LoreNodePosition {
  x: number
  y: number
}

// Layout configuration for the entire lore graph
export interface LoreGraphLayout {
  // Node positions keyed by lore ID
  nodes: Record<string, LoreNodePosition>
  // Viewport state (pan/zoom)
  viewport: Viewport
}

// Default viewport centered at origin with zoom level 1
export const DEFAULT_VIEWPORT: Viewport = {
  x: 0,
  y: 0,
  zoom: 1,
}

// Default empty layout
export const DEFAULT_LORE_GRAPH_LAYOUT: LoreGraphLayout = {
  nodes: {},
  viewport: DEFAULT_VIEWPORT,
}

// Node data passed to custom React Flow node
// Uses index signature to satisfy React Flow's Record<string, unknown> constraint
export interface LoreNodeData {
  [key: string]: unknown
  loreId: string
  title: string
  type: string
  importance: string
  isPublic: boolean
  year?: number
  era?: string
  connectionCount: number
  tags: string[]
}

// Props for the custom node component
export interface LoreGraphNodeProps {
  data: LoreNodeData
  selected: boolean
}
