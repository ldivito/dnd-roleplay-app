'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Edit3 } from 'lucide-react'
import {
  CalendarConfiguration,
  Season,
  PRESET_CALENDARS,
  SEASON_COLORS,
} from '@/types/calendar'

interface CalendarConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (config: CalendarConfiguration) => void
  existingConfig: CalendarConfiguration | null
}

export function CalendarConfigDialog({
  open,
  onOpenChange,
  onSave,
  existingConfig,
}: CalendarConfigDialogProps) {
  const [config, setConfig] = useState<Partial<CalendarConfiguration>>({
    name: '',
    daysPerYear: 365,
    hoursPerDay: 24,
    daysPerWeek: 7,
    monthsPerYear: 12,
    dayNames: [],
    monthNames: [],
    yearPrefix: 'Year',
    yearSuffix: '',
    currentYear: 1,
    currentMonth: 1,
    currentDay: 1,
    seasons: [],
  })

  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [editingSeason, setEditingSeason] = useState<Season | null>(null)

  useEffect(() => {
    if (existingConfig) {
      setConfig(existingConfig)
      setSelectedPreset('custom')
    } else {
      // Reset to defaults when opening for new calendar
      setConfig({
        name: '',
        daysPerYear: 365,
        hoursPerDay: 24,
        daysPerWeek: 7,
        monthsPerYear: 12,
        dayNames: [],
        monthNames: [],
        yearPrefix: 'Year',
        yearSuffix: '',
        currentYear: 1,
        currentMonth: 1,
        currentDay: 1,
        seasons: [],
      })
      setSelectedPreset('')
    }
  }, [existingConfig, open])

  const handlePresetSelect = (presetName: string) => {
    if (presetName === 'custom') {
      setSelectedPreset('custom')
      return
    }

    const preset = PRESET_CALENDARS.find(p => p.name === presetName)
    if (preset) {
      setConfig({
        ...preset,
        name: preset.name,
        id: existingConfig?.id || crypto.randomUUID(),
      })
      setSelectedPreset(presetName)
    }
  }

  const updateDayNames = (value: string) => {
    const names = value
      .split(',')
      .map(name => name.trim())
      .filter(Boolean)
    setConfig(prev => ({ ...prev, dayNames: names, daysPerWeek: names.length }))
  }

  const updateMonthNames = (value: string) => {
    const names = value
      .split(',')
      .map(name => name.trim())
      .filter(Boolean)
    setConfig(prev => ({
      ...prev,
      monthNames: names,
      monthsPerYear: names.length,
    }))
  }

  const addSeason = () => {
    const newSeason: Season = {
      id: crypto.randomUUID(),
      name: 'New Season',
      startMonth: 1,
      startDay: 1,
      endMonth: 3,
      endDay: 30,
      color:
        SEASON_COLORS[(config.seasons?.length || 0) % SEASON_COLORS.length] ||
        '#22c55e',
      description: '',
    }
    setConfig(prev => ({
      ...prev,
      seasons: [...(prev.seasons || []), newSeason],
    }))
    setEditingSeason(newSeason)
  }

  const updateSeason = (updatedSeason: Season) => {
    setConfig(prev => ({
      ...prev,
      seasons:
        prev.seasons?.map(s =>
          s.id === updatedSeason.id ? updatedSeason : s
        ) || [],
    }))
    setEditingSeason(null)
  }

  const deleteSeason = (seasonId: string) => {
    setConfig(prev => ({
      ...prev,
      seasons: prev.seasons?.filter(s => s.id !== seasonId) || [],
    }))
  }

  const handleSave = () => {
    if (
      !config.name ||
      !config.dayNames?.length ||
      !config.monthNames?.length
    ) {
      return
    }

    const fullConfig: CalendarConfiguration = {
      id: existingConfig?.id || crypto.randomUUID(),
      name: config.name,
      daysPerYear: config.daysPerYear || 365,
      hoursPerDay: config.hoursPerDay || 24,
      daysPerWeek: config.daysPerWeek || 7,
      monthsPerYear: config.monthsPerYear || 12,
      dayNames: config.dayNames || [],
      monthNames: config.monthNames || [],
      yearPrefix: config.yearPrefix || '',
      yearSuffix: config.yearSuffix || '',
      currentYear: config.currentYear || 1,
      currentMonth: config.currentMonth || 1,
      currentDay: config.currentDay || 1,
      seasons: config.seasons || [],
      createdAt: existingConfig?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    onSave(fullConfig)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingConfig
              ? 'Editar Configuración del Calendario'
              : 'Crear Sistema de Calendario'}
          </DialogTitle>
          <DialogDescription>
            Configura el sistema de calendario de tu mundo, incluyendo
            estructura de tiempo, nombres y estaciones.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Configuración Básica</TabsTrigger>
            <TabsTrigger value="time">Estructura de Tiempo</TabsTrigger>
            <TabsTrigger value="naming">Nombres y Etiquetas</TabsTrigger>
            <TabsTrigger value="seasons">Estaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="preset">
                  Comenzar con una Plantilla (Opcional)
                </Label>
                <Select
                  value={selectedPreset}
                  onValueChange={handlePresetSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Elige un calendario predefinido o crea uno personalizado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">
                      Calendario Personalizado
                    </SelectItem>
                    {PRESET_CALENDARS.map(preset => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Nombre del Calendario *</Label>
                <Input
                  id="name"
                  value={config.name || ''}
                  onChange={e =>
                    setConfig(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="ej., Calendario Harptos, Calendario del Mundo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentYear">Año Actual</Label>
                  <Input
                    id="currentYear"
                    type="number"
                    value={config.currentYear || 1}
                    onChange={e =>
                      setConfig(prev => ({
                        ...prev,
                        currentYear: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="currentMonth">Mes Actual</Label>
                  <Input
                    id="currentMonth"
                    type="number"
                    min="1"
                    max={config.monthsPerYear || 12}
                    value={config.currentMonth || 1}
                    onChange={e =>
                      setConfig(prev => ({
                        ...prev,
                        currentMonth: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currentDay">Día Actual</Label>
                <Input
                  id="currentDay"
                  type="number"
                  min="1"
                  value={config.currentDay || 1}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      currentDay: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daysPerYear">Días por Año</Label>
                <Input
                  id="daysPerYear"
                  type="number"
                  value={config.daysPerYear || 365}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      daysPerYear: parseInt(e.target.value) || 365,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="hoursPerDay">Horas por Día</Label>
                <Input
                  id="hoursPerDay"
                  type="number"
                  value={config.hoursPerDay || 24}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      hoursPerDay: parseInt(e.target.value) || 24,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daysPerWeek">Días por Semana</Label>
                <Input
                  id="daysPerWeek"
                  type="number"
                  value={config.daysPerWeek || 7}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      daysPerWeek: parseInt(e.target.value) || 7,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="monthsPerYear">Meses por Año</Label>
                <Input
                  id="monthsPerYear"
                  type="number"
                  value={config.monthsPerYear || 12}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      monthsPerYear: parseInt(e.target.value) || 12,
                    }))
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="naming" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yearPrefix">Prefijo de Año</Label>
                <Input
                  id="yearPrefix"
                  value={config.yearPrefix || ''}
                  onChange={e =>
                    setConfig(prev => ({ ...prev, yearPrefix: e.target.value }))
                  }
                  placeholder="ej., Año, DR, AC"
                />
              </div>
              <div>
                <Label htmlFor="yearSuffix">Sufijo de Año</Label>
                <Input
                  id="yearSuffix"
                  value={config.yearSuffix || ''}
                  onChange={e =>
                    setConfig(prev => ({ ...prev, yearSuffix: e.target.value }))
                  }
                  placeholder="ej., EC, dC"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dayNames">
                Nombres de Días (separados por comas) *
              </Label>
              <Textarea
                id="dayNames"
                value={config.dayNames?.join(', ') || ''}
                onChange={e => updateDayNames(e.target.value)}
                placeholder="ej., Domingo, Lunes, Martes, Miércoles, Jueves, Viernes, Sábado"
                rows={2}
              />
              <p className="text-sm text-muted-foreground mt-1">
                El número de días establecerá automáticamente los días por
                semana
              </p>
            </div>

            <div>
              <Label htmlFor="monthNames">
                Nombres de Meses (separados por comas) *
              </Label>
              <Textarea
                id="monthNames"
                value={config.monthNames?.join(', ') || ''}
                onChange={e => updateMonthNames(e.target.value)}
                placeholder="ej., Enero, Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre"
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                El número de meses establecerá automáticamente los meses por año
              </p>
            </div>
          </TabsContent>

          <TabsContent value="seasons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Estaciones</h3>
              <Button onClick={addSeason} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Estación
              </Button>
            </div>

            <div className="space-y-3">
              {config.seasons?.map(season => (
                <Card key={season.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: season.color }}
                      />
                      <div>
                        <h4 className="font-medium">{season.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Mes {season.startMonth}, Día {season.startDay} - Mes{' '}
                          {season.endMonth}, Día {season.endDay}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSeason(season)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSeason(season.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {editingSeason && (
              <Card className="p-4 border-primary">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-lg">Editar Estación</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <Label>Nombre de la Estación</Label>
                    <Input
                      value={editingSeason.name}
                      onChange={e =>
                        setEditingSeason(prev =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Mes de Inicio</Label>
                      <Input
                        type="number"
                        min="1"
                        max={config.monthsPerYear || 12}
                        value={editingSeason.startMonth}
                        onChange={e =>
                          setEditingSeason(prev =>
                            prev
                              ? {
                                  ...prev,
                                  startMonth: parseInt(e.target.value) || 1,
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Día de Inicio</Label>
                      <Input
                        type="number"
                        min="1"
                        value={editingSeason.startDay}
                        onChange={e =>
                          setEditingSeason(prev =>
                            prev
                              ? {
                                  ...prev,
                                  startDay: parseInt(e.target.value) || 1,
                                }
                              : null
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Mes de Fin</Label>
                      <Input
                        type="number"
                        min="1"
                        max={config.monthsPerYear || 12}
                        value={editingSeason.endMonth}
                        onChange={e =>
                          setEditingSeason(prev =>
                            prev
                              ? {
                                  ...prev,
                                  endMonth: parseInt(e.target.value) || 1,
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Día de Fin</Label>
                      <Input
                        type="number"
                        min="1"
                        value={editingSeason.endDay}
                        onChange={e =>
                          setEditingSeason(prev =>
                            prev
                              ? {
                                  ...prev,
                                  endDay: parseInt(e.target.value) || 1,
                                }
                              : null
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Color</Label>
                    <div className="flex gap-2 mt-2">
                      {SEASON_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`h-8 w-8 rounded-full border-2 ${
                            editingSeason.color === color
                              ? 'border-primary'
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            setEditingSeason(prev =>
                              prev ? { ...prev, color } : null
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={editingSeason.description || ''}
                      onChange={e =>
                        setEditingSeason(prev =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      placeholder="Descripción opcional de esta estación"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => updateSeason(editingSeason)}>
                      Guardar Estación
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingSeason(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !config.name ||
              !config.dayNames?.length ||
              !config.monthNames?.length
            }
          >
            {existingConfig ? 'Actualizar Calendario' : 'Crear Calendario'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
