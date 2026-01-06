'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Plus,
  RotateCcw,
  Maximize2,
  Grid3X3,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

interface LoreGraphToolbarProps {
  onAddNode: () => void
  onResetLayout: () => void
  onFitView: () => void
  onAutoLayout: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export default function LoreGraphToolbar({
  onAddNode,
  onResetLayout,
  onFitView,
  onAutoLayout,
  onZoomIn,
  onZoomOut,
}: LoreGraphToolbarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 bg-white rounded-lg shadow-lg border p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onAddNode}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Nuevo Lore</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-full h-px bg-border my-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Acercar</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Alejar</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onFitView}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Ajustar vista</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-full h-px bg-border my-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onAutoLayout}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Auto-organizar</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onResetLayout}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Resetear layout</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
