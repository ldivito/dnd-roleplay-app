'use client'

import React, { memo } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import {
  Calendar,
  Eye,
  EyeOff,
  Scroll,
  BookOpen,
  Clock,
  Sparkles,
  Ghost,
  MessageCircle,
  BookMarked,
  FileText,
  Link2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LoreNodeData } from '@/types/loreGraph'

// Type for the full node (used by React Flow NodeProps)
type LoreNode = Node<LoreNodeData, 'loreNode'>

// Color mapping for lore types - Dark theme optimized
const TYPE_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  event: {
    bg: 'bg-blue-950/80',
    border: 'border-blue-500/60',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20'
  },
  legend: {
    bg: 'bg-purple-950/80',
    border: 'border-purple-500/60',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20'
  },
  history: {
    bg: 'bg-amber-950/80',
    border: 'border-amber-500/60',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20'
  },
  prophecy: {
    bg: 'bg-indigo-950/80',
    border: 'border-indigo-500/60',
    text: 'text-indigo-400',
    glow: 'shadow-indigo-500/20'
  },
  secret: {
    bg: 'bg-red-950/80',
    border: 'border-red-500/60',
    text: 'text-red-400',
    glow: 'shadow-red-500/20'
  },
  rumor: {
    bg: 'bg-slate-800/80',
    border: 'border-slate-500/60',
    text: 'text-slate-400',
    glow: 'shadow-slate-500/20'
  },
  chronicle: {
    bg: 'bg-emerald-950/80',
    border: 'border-emerald-500/60',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20'
  },
  tale: {
    bg: 'bg-rose-950/80',
    border: 'border-rose-500/60',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/20'
  },
}

// Icon mapping for lore types
const TYPE_ICONS: Record<string, React.ElementType> = {
  event: Calendar,
  legend: Sparkles,
  history: BookOpen,
  prophecy: Eye,
  secret: Ghost,
  rumor: MessageCircle,
  chronicle: BookMarked,
  tale: FileText,
}

// Importance badge styles - Dark theme
const IMPORTANCE_STYLES: Record<string, string> = {
  main: 'bg-red-500/20 text-red-300 border-red-500/40',
  secondary: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  minor: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
}

const IMPORTANCE_LABELS: Record<string, string> = {
  main: 'Principal',
  secondary: 'Secundario',
  minor: 'Menor',
}

function LoreGraphNode({ data, selected }: NodeProps<LoreNode>) {
  const loreType = data.type as string
  const loreImportance = data.importance as string

  const typeColors = TYPE_COLORS[loreType] || TYPE_COLORS.event
  const TypeIcon = TYPE_ICONS[loreType] || Scroll
  const importanceStyle = IMPORTANCE_STYLES[loreImportance] || IMPORTANCE_STYLES.minor
  const importanceLabel = IMPORTANCE_LABELS[loreImportance] || 'Menor'

  // Ensure we have valid colors (TypeScript guard)
  const bgColor = typeColors?.bg || 'bg-blue-950/80'
  const borderColor = typeColors?.border || 'border-blue-500/60'
  const textColor = typeColors?.text || 'text-blue-400'
  const glowColor = typeColors?.glow || 'shadow-blue-500/20'

  return (
    <div
      className={cn(
        'rounded-lg border-2 shadow-lg transition-all duration-200 min-w-[200px] max-w-[280px] backdrop-blur-sm',
        bgColor,
        borderColor,
        glowColor,
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl scale-105'
      )}
    >
      {/* Source handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-slate-700 hover:!bg-primary transition-colors"
      />

      {/* Header */}
      <div className={cn('px-3 py-2 border-b', borderColor)}>
        <div className="flex items-start gap-2">
          <TypeIcon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', textColor)} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
              {data.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-2 space-y-2">
        {/* Badges row */}
        <div className="flex flex-wrap gap-1">
          {/* Importance badge */}
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border',
              importanceStyle
            )}
          >
            {importanceLabel}
          </span>

          {/* Visibility badge */}
          {!data.isPublic && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
              <EyeOff className="h-2.5 w-2.5" />
              DM
            </span>
          )}

          {/* Connection count */}
          {data.connectionCount > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/40">
              <Link2 className="h-2.5 w-2.5" />
              {data.connectionCount}
            </span>
          )}
        </div>

        {/* Timeline info */}
        {(data.year || data.era) && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {data.year && <span>Año {data.year}</span>}
            {data.year && data.era && <span>·</span>}
            {data.era && <span>{data.era}</span>}
          </div>
        )}

        {/* Tags */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-1 py-0.5 rounded text-[9px] bg-slate-700/40 text-slate-300"
              >
                #{tag}
              </span>
            ))}
            {data.tags.length > 3 && (
              <span className="px-1 py-0.5 rounded text-[9px] bg-slate-700/40 text-slate-400">
                +{data.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Target handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-slate-700 hover:!bg-primary transition-colors"
      />
    </div>
  )
}

export default memo(LoreGraphNode)
