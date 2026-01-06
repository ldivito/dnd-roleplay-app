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

// Color mapping for lore types
const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  event: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  legend: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  history: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  prophecy: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-700' },
  secret: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' },
  rumor: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700' },
  chronicle: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700' },
  tale: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700' },
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

// Importance badge styles
const IMPORTANCE_STYLES: Record<string, string> = {
  main: 'bg-red-100 text-red-800 border-red-200',
  secondary: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  minor: 'bg-gray-100 text-gray-600 border-gray-200',
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
  const bgColor = typeColors?.bg || 'bg-blue-50'
  const borderColor = typeColors?.border || 'border-blue-300'
  const textColor = typeColors?.text || 'text-blue-700'

  return (
    <div
      className={cn(
        'rounded-lg border-2 shadow-md transition-all duration-200 min-w-[200px] max-w-[280px]',
        bgColor,
        borderColor,
        selected && 'ring-2 ring-primary ring-offset-2 shadow-lg scale-105'
      )}
    >
      {/* Source handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
      />

      {/* Header */}
      <div className={cn('px-3 py-2 border-b', borderColor, 'border-opacity-50')}>
        <div className="flex items-start gap-2">
          <TypeIcon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', textColor)} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight text-gray-900 line-clamp-2">
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
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <EyeOff className="h-2.5 w-2.5" />
              DM
            </span>
          )}

          {/* Connection count */}
          {data.connectionCount > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
              <Link2 className="h-2.5 w-2.5" />
              {data.connectionCount}
            </span>
          )}
        </div>

        {/* Timeline info */}
        {(data.year || data.era) && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
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
                className="px-1 py-0.5 rounded text-[9px] bg-white/60 text-gray-600"
              >
                #{tag}
              </span>
            ))}
            {data.tags.length > 3 && (
              <span className="px-1 py-0.5 rounded text-[9px] bg-white/60 text-gray-500">
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
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  )
}

export default memo(LoreGraphNode)
