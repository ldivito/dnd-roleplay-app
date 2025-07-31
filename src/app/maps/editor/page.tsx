'use client'

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  Suspense,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Save,
  Undo,
  Redo,
  Grid3X3,
  Palette,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Download,
  Upload,
  ArrowLeft,
  Zap,
} from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'
import type {
  LocationMap,
  MapTile,
  TerrainType,
  FeatureType,
  TileFeature,
} from '@/types/map'
import {
  TERRAIN_DEFINITIONS,
  FEATURE_DEFINITIONS,
  MAP_SIZE_PRESETS,
  MAP_EDITOR_TOOLS,
} from '@/types/map'

const GRID_SIZE = 32 // Size of each tile in pixels

function MapEditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locationId = searchParams.get('location')
  const mapId = searchParams.get('map')

  const { locations, maps, addMap, updateMap, getMapById, getMapsByLocation } =
    useSessionStore()

  const [currentMap, setCurrentMap] = useState<LocationMap | null>(null)
  const [selectedTool, setSelectedTool] = useState('terrain_grass')
  const [brushSize, setBrushSize] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [showCoordinates, setShowCoordinates] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<LocationMap[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showSettings, setShowSettings] = useState(false)
  const [mousePosition, setMousePosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  const location = locationId
    ? locations.find(loc => loc.id === locationId)
    : null
  const selectedToolData = MAP_EDITOR_TOOLS.find(
    tool => tool.id === selectedTool
  )

  // Initialize or load map
  useEffect(() => {
    if (mapId) {
      const existingMap = getMapById(mapId)
      if (existingMap) {
        setCurrentMap(existingMap)
        setCanvasSize({
          width: existingMap.width * GRID_SIZE,
          height: existingMap.height * GRID_SIZE,
        })
      }
    } else if (locationId) {
      // Create new map for location
      const newMap: LocationMap = {
        id: crypto.randomUUID(),
        locationId,
        name: `Mapa de ${location?.name || 'Ubicación'}`,
        description: '',
        width: 15,
        height: 15,
        gridSize: GRID_SIZE,
        tiles: [],
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          tags: [],
        },
        settings: {
          showGrid: true,
          showCoordinates: false,
          showElevation: false,
          showLighting: false,
          defaultTerrain: 'grass',
          backgroundColor: '#4ade80',
        },
      }

      // Initialize all tiles with default terrain
      for (let x = 0; x < newMap.width; x++) {
        for (let y = 0; y < newMap.height; y++) {
          newMap.tiles.push({
            x,
            y,
            terrain: 'grass',
            elevation: 0,
            isBlocked: false,
            hasWater: false,
            hasCover: false,
            lightLevel: 'bright',
            features: [],
          })
        }
      }

      setCurrentMap(newMap)
      setCanvasSize({
        width: newMap.width * GRID_SIZE,
        height: newMap.height * GRID_SIZE,
      })
    }
  }, [mapId, locationId, location, getMapById])

  // Canvas drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !currentMap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw tiles
    currentMap.tiles.forEach(tile => {
      const x = tile.x * GRID_SIZE
      const y = tile.y * GRID_SIZE

      // Get terrain definition
      const terrainDef = TERRAIN_DEFINITIONS.find(t => t.type === tile.terrain)
      if (terrainDef) {
        ctx.fillStyle = terrainDef.color
        ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE)
      }

      // Draw features
      tile.features.forEach(feature => {
        const featureDef = FEATURE_DEFINITIONS.find(
          f => f.type === feature.type
        )
        if (featureDef) {
          ctx.fillStyle = featureDef.color
          ctx.fillRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4)

          // Draw feature icon (simplified)
          ctx.fillStyle = '#ffffff'
          ctx.font = '16px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(
            featureDef.icon,
            x + GRID_SIZE / 2,
            y + GRID_SIZE / 2 + 6
          )
        }
      })

      // Draw blocking indicator
      if (tile.isBlocked) {
        ctx.strokeStyle = '#dc2626'
        ctx.lineWidth = 2
        ctx.strokeRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2)
      }
    })

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3

      for (let x = 0; x <= currentMap.width; x++) {
        ctx.beginPath()
        ctx.moveTo(x * GRID_SIZE, 0)
        ctx.lineTo(x * GRID_SIZE, currentMap.height * GRID_SIZE)
        ctx.stroke()
      }

      for (let y = 0; y <= currentMap.height; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * GRID_SIZE)
        ctx.lineTo(currentMap.width * GRID_SIZE, y * GRID_SIZE)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
    }

    // Draw coordinates
    if (showCoordinates) {
      ctx.fillStyle = '#000000'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'

      for (let x = 0; x < currentMap.width; x++) {
        for (let y = 0; y < currentMap.height; y++) {
          ctx.fillText(
            `${x},${y}`,
            x * GRID_SIZE + GRID_SIZE / 2,
            y * GRID_SIZE + GRID_SIZE / 2
          )
        }
      }
    }

    // Draw brush preview
    if (mousePosition && !isDrawing) {
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.7

      for (let dx = 0; dx < brushSize; dx++) {
        for (let dy = 0; dy < brushSize; dy++) {
          const x = mousePosition.x + dx
          const y = mousePosition.y + dy

          if (x < currentMap.width && y < currentMap.height) {
            ctx.strokeRect(
              x * GRID_SIZE + 1,
              y * GRID_SIZE + 1,
              GRID_SIZE - 2,
              GRID_SIZE - 2
            )
          }
        }
      }

      ctx.globalAlpha = 1
    }
  }, [
    currentMap,
    showGrid,
    showCoordinates,
    mousePosition,
    brushSize,
    isDrawing,
  ])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const getTileAt = (x: number, y: number): MapTile | null => {
    if (!currentMap) return null
    return currentMap.tiles.find(tile => tile.x === x && tile.y === y) || null
  }

  const updateTile = (x: number, y: number, updates: Partial<MapTile>) => {
    if (!currentMap) return

    const updatedMap = {
      ...currentMap,
      tiles: currentMap.tiles.map(tile =>
        tile.x === x && tile.y === y ? { ...tile, ...updates } : tile
      ),
    }

    setCurrentMap(updatedMap)
  }

  const applyToolToTile = (tileX: number, tileY: number) => {
    if (!currentMap || !selectedToolData) return
    if (
      tileX < 0 ||
      tileX >= currentMap.width ||
      tileY < 0 ||
      tileY >= currentMap.height
    )
      return

    const tile = getTileAt(tileX, tileY)
    if (!tile) return

    // Apply brush size
    for (let dx = 0; dx < brushSize; dx++) {
      for (let dy = 0; dy < brushSize; dy++) {
        const x = tileX + dx
        const y = tileY + dy

        if (x >= currentMap.width || y >= currentMap.height) continue

        const targetTile = getTileAt(x, y)
        if (!targetTile) continue

        // Apply tool
        if (selectedToolData.type === 'terrain') {
          const terrainType = selectedToolData.data as TerrainType
          const terrainDef = TERRAIN_DEFINITIONS.find(
            t => t.type === terrainType
          )

          updateTile(x, y, {
            terrain: terrainType,
            isBlocked: terrainDef?.isBlocking || false,
            hasWater: terrainType === 'water',
          })
        } else if (selectedToolData.type === 'feature') {
          const featureType = selectedToolData.data as FeatureType
          const featureDef = FEATURE_DEFINITIONS.find(
            f => f.type === featureType
          )

          // Remove existing features of the same type
          const filteredFeatures = targetTile.features.filter(
            f => f.type !== featureType
          )

          const newFeature: TileFeature = {
            id: crypto.randomUUID(),
            type: featureType,
            name: featureDef?.name || 'Feature',
            ...(featureDef?.description && {
              description: featureDef.description,
            }),
            ...(featureDef?.icon && { icon: featureDef.icon }),
            ...(featureDef?.color && { color: featureDef.color }),
            ...(featureDef?.isBlocking !== undefined && {
              blocking: featureDef.isBlocking,
            }),
            interactive: featureType === 'door' || featureType === 'trap',
          }

          updateTile(x, y, {
            features: [...filteredFeatures, newFeature],
            isBlocked: targetTile.isBlocked || featureDef?.isBlocking || false,
          })
        } else if (selectedToolData.type === 'utility') {
          if (selectedTool === 'util_eraser') {
            updateTile(x, y, {
              terrain: 'grass',
              features: [],
              isBlocked: false,
              hasWater: false,
            })
          }
        }
      }
    }
  }

  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / GRID_SIZE)
    const y = Math.floor((event.clientY - rect.top) / GRID_SIZE)

    return { x, y }
  }

  const handleCanvasMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault()
    setIsDrawing(true)

    const coords = getCanvasCoordinates(event)
    if (coords) {
      applyToolToTile(coords.x, coords.y)
    }
  }

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const coords = getCanvasCoordinates(event)
    if (coords) {
      setMousePosition(coords)

      if (isDrawing) {
        applyToolToTile(coords.x, coords.y)
      }
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDrawing(false)
  }

  const handleCanvasMouseLeave = () => {
    setIsDrawing(false)
  }

  const handleSaveMap = () => {
    if (!currentMap) return

    if (mapId) {
      updateMap(mapId, currentMap)
    } else {
      addMap(currentMap)
    }

    router.back()
  }

  const handleNewMapSize = (width: number, height: number) => {
    if (!currentMap) return

    const newTiles: MapTile[] = []
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const existingTile = getTileAt(x, y)
        if (existingTile) {
          newTiles.push(existingTile)
        } else {
          newTiles.push({
            x,
            y,
            terrain: 'grass',
            elevation: 0,
            isBlocked: false,
            hasWater: false,
            hasCover: false,
            lightLevel: 'bright',
            features: [],
          })
        }
      }
    }

    const updatedMap = {
      ...currentMap,
      width,
      height,
      tiles: newTiles,
    }

    setCurrentMap(updatedMap)
    setCanvasSize({
      width: width * GRID_SIZE,
      height: height * GRID_SIZE,
    })
  }

  if (!currentMap) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Cargando Editor de Mapas...
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Editor de Mapas
            </h1>
            <p className="text-muted-foreground">
              {location?.name} - {currentMap.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <Button onClick={handleSaveMap}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Mapa
          </Button>
        </div>
      </div>

      {/* Map Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            {currentMap.name}
            <Badge variant="outline">
              {currentMap.width} × {currentMap.height}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {currentMap.description || 'Sin descripción'}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Herramientas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="terrain" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="terrain">Terreno</TabsTrigger>
                  <TabsTrigger value="features">Elementos</TabsTrigger>
                  <TabsTrigger value="utils">Utilidades</TabsTrigger>
                </TabsList>

                <TabsContent value="terrain" className="space-y-2">
                  <ScrollArea className="h-64">
                    <div className="grid grid-cols-2 gap-2">
                      {MAP_EDITOR_TOOLS.filter(
                        tool => tool.type === 'terrain'
                      ).map(tool => (
                        <Button
                          key={tool.id}
                          variant={
                            selectedTool === tool.id ? 'default' : 'outline'
                          }
                          size="sm"
                          className="h-12 flex flex-col gap-1"
                          onClick={() => setSelectedTool(tool.id)}
                          title={tool.description}
                        >
                          <span className="text-lg">{tool.icon}</span>
                          <span className="text-xs">{tool.name}</span>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="features" className="space-y-2">
                  <ScrollArea className="h-64">
                    <div className="grid grid-cols-2 gap-2">
                      {MAP_EDITOR_TOOLS.filter(
                        tool => tool.type === 'feature'
                      ).map(tool => (
                        <Button
                          key={tool.id}
                          variant={
                            selectedTool === tool.id ? 'default' : 'outline'
                          }
                          size="sm"
                          className="h-12 flex flex-col gap-1"
                          onClick={() => setSelectedTool(tool.id)}
                          title={tool.description}
                        >
                          <span className="text-lg">{tool.icon}</span>
                          <span className="text-xs">{tool.name}</span>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="utils" className="space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    {MAP_EDITOR_TOOLS.filter(
                      tool => tool.type === 'utility'
                    ).map(tool => (
                      <Button
                        key={tool.id}
                        variant={
                          selectedTool === tool.id ? 'default' : 'outline'
                        }
                        onClick={() => setSelectedTool(tool.id)}
                        title={tool.description}
                      >
                        {tool.icon} {tool.name}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Brush Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Pincel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tamaño del pincel</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant={brushSize === 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBrushSize(1)}
                  >
                    1x1
                  </Button>
                  <Button
                    variant={brushSize === 2 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBrushSize(2)}
                  >
                    2x2
                  </Button>
                  <Button
                    variant={brushSize === 3 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBrushSize(3)}
                  >
                    3x3
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Vista
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Mostrar cuadrícula</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  {showGrid ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label>Coordenadas</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCoordinates(!showCoordinates)}
                >
                  {showCoordinates ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Lienzo del Mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full h-[600px] border rounded-lg">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="cursor-crosshair"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseLeave}
                  style={{ imageRendering: 'pixelated' }}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configuración del Mapa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nombre del Mapa</Label>
              <Input
                value={currentMap.name}
                onChange={e =>
                  setCurrentMap({
                    ...currentMap,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={currentMap.description || ''}
                onChange={e =>
                  setCurrentMap({
                    ...currentMap,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <Separator />

            <div>
              <Label>Tamaño del Mapa</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {MAP_SIZE_PRESETS.slice(0, 6).map(preset => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleNewMapSize(preset.width, preset.height)
                    }
                  >
                    {preset.name}
                    <br />
                    <span className="text-xs">
                      {preset.width}×{preset.height}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Ancho</Label>
                <Input
                  type="number"
                  min="5"
                  max="50"
                  value={currentMap.width}
                  onChange={e =>
                    handleNewMapSize(
                      parseInt(e.target.value) || currentMap.width,
                      currentMap.height
                    )
                  }
                />
              </div>
              <div className="flex-1">
                <Label>Alto</Label>
                <Input
                  type="number"
                  min="5"
                  max="50"
                  value={currentMap.height}
                  onChange={e =>
                    handleNewMapSize(
                      currentMap.width,
                      parseInt(e.target.value) || currentMap.height
                    )
                  }
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function MapEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Cargando Editor de Mapas...
            </h2>
          </div>
        </div>
      }
    >
      <MapEditorContent />
    </Suspense>
  )
}
