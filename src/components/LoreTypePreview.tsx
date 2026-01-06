'use client'

import React from 'react'
import {
  Calendar,
  Sparkles,
  BookOpen,
  Eye,
  Ghost,
  MessageCircle,
  BookMarked,
  FileText,
  Scroll,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LoreType, LoreImportance } from '@/types/lore'

// Color mapping for lore types - matches LoreGraphNode
const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  event: {
    bg: 'bg-blue-950/80',
    border: 'border-blue-500/60',
    text: 'text-blue-400',
  },
  legend: {
    bg: 'bg-purple-950/80',
    border: 'border-purple-500/60',
    text: 'text-purple-400',
  },
  history: {
    bg: 'bg-amber-950/80',
    border: 'border-amber-500/60',
    text: 'text-amber-400',
  },
  prophecy: {
    bg: 'bg-indigo-950/80',
    border: 'border-indigo-500/60',
    text: 'text-indigo-400',
  },
  secret: {
    bg: 'bg-red-950/80',
    border: 'border-red-500/60',
    text: 'text-red-400',
  },
  rumor: {
    bg: 'bg-slate-800/80',
    border: 'border-slate-500/60',
    text: 'text-slate-400',
  },
  chronicle: {
    bg: 'bg-emerald-950/80',
    border: 'border-emerald-500/60',
    text: 'text-emerald-400',
  },
  tale: {
    bg: 'bg-rose-950/80',
    border: 'border-rose-500/60',
    text: 'text-rose-400',
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

// Type labels in Spanish
const TYPE_LABELS: Record<string, string> = {
  event: 'Evento',
  legend: 'Leyenda',
  history: 'Historia',
  prophecy: 'Profecía',
  secret: 'Secreto',
  rumor: 'Rumor',
  chronicle: 'Crónica',
  tale: 'Relato',
}

// Importance badge styles
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

interface LoreTypePreviewProps {
  type: LoreType
  importance?: LoreImportance
  title?: string
  className?: string
}

export default function LoreTypePreview({
  type,
  importance = 'secondary',
  title = 'Vista previa',
  className,
}: LoreTypePreviewProps) {
  const colors = TYPE_COLORS[type] || TYPE_COLORS.event
  const Icon = TYPE_ICONS[type] || Scroll
  const typeLabel = TYPE_LABELS[type] || 'Evento'
  const importanceStyle = IMPORTANCE_STYLES[importance] || IMPORTANCE_STYLES.minor
  const importanceLabel = IMPORTANCE_LABELS[importance] || 'Menor'

  // Ensure we have valid colors
  const bgColor = colors?.bg || 'bg-blue-950/80'
  const borderColor = colors?.border || 'border-blue-500/60'
  const textColor = colors?.text || 'text-blue-400'

  return (
    <div
      className={cn(
        'rounded-lg border-2 shadow-lg p-3 backdrop-blur-sm transition-all duration-300',
        bgColor,
        borderColor,
        className
      )}
    >
      {/* Header with icon and type */}
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('h-4 w-4', textColor)} />
        <span className={cn('text-sm font-medium', textColor)}>{typeLabel}</span>
      </div>

      {/* Title preview */}
      <h4 className="text-sm font-semibold text-foreground line-clamp-1 mb-2">
        {title || 'Título del lore'}
      </h4>

      {/* Importance badge */}
      <span
        className={cn(
          'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border',
          importanceStyle
        )}
      >
        {importanceLabel}
      </span>

      {/* Color indicator */}
      <div className="mt-3 pt-2 border-t border-slate-700/50">
        <p className="text-[10px] text-muted-foreground">
          Este es el color que tendrá el nodo en el Mapa de Relaciones
        </p>
      </div>
    </div>
  )
}

// Export colors for use in SelectItem styling
export { TYPE_COLORS, TYPE_ICONS, TYPE_LABELS }
