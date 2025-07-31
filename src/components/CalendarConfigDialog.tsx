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
              ? 'Edit Calendar Configuration'
              : 'Create Calendar System'}
          </DialogTitle>
          <DialogDescription>
            Configure your world&apos;s calendar system, including time
            structure, naming, and seasons.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Setup</TabsTrigger>
            <TabsTrigger value="time">Time Structure</TabsTrigger>
            <TabsTrigger value="naming">Names & Labels</TabsTrigger>
            <TabsTrigger value="seasons">Seasons</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="preset">Start with a Preset (Optional)</Label>
                <Select
                  value={selectedPreset}
                  onValueChange={handlePresetSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a preset calendar or create custom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Calendar</SelectItem>
                    {PRESET_CALENDARS.map(preset => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Calendar Name *</Label>
                <Input
                  id="name"
                  value={config.name || ''}
                  onChange={e =>
                    setConfig(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Harptos Calendar, World Calendar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentYear">Current Year</Label>
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
                  <Label htmlFor="currentMonth">Current Month</Label>
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
                <Label htmlFor="currentDay">Current Day</Label>
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
                <Label htmlFor="daysPerYear">Days per Year</Label>
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
                <Label htmlFor="hoursPerDay">Hours per Day</Label>
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
                <Label htmlFor="daysPerWeek">Days per Week</Label>
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
                <Label htmlFor="monthsPerYear">Months per Year</Label>
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
                <Label htmlFor="yearPrefix">Year Prefix</Label>
                <Input
                  id="yearPrefix"
                  value={config.yearPrefix || ''}
                  onChange={e =>
                    setConfig(prev => ({ ...prev, yearPrefix: e.target.value }))
                  }
                  placeholder="e.g., Year, DR, AC"
                />
              </div>
              <div>
                <Label htmlFor="yearSuffix">Year Suffix</Label>
                <Input
                  id="yearSuffix"
                  value={config.yearSuffix || ''}
                  onChange={e =>
                    setConfig(prev => ({ ...prev, yearSuffix: e.target.value }))
                  }
                  placeholder="e.g., CE, AD"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dayNames">Day Names (comma-separated) *</Label>
              <Textarea
                id="dayNames"
                value={config.dayNames?.join(', ') || ''}
                onChange={e => updateDayNames(e.target.value)}
                placeholder="e.g., Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
                rows={2}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Number of days will automatically set days per week
              </p>
            </div>

            <div>
              <Label htmlFor="monthNames">
                Month Names (comma-separated) *
              </Label>
              <Textarea
                id="monthNames"
                value={config.monthNames?.join(', ') || ''}
                onChange={e => updateMonthNames(e.target.value)}
                placeholder="e.g., January, February, March, April, May, June, July, August, September, October, November, December"
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Number of months will automatically set months per year
              </p>
            </div>
          </TabsContent>

          <TabsContent value="seasons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Seasons</h3>
              <Button onClick={addSeason} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Season
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
                          Month {season.startMonth}, Day {season.startDay} -
                          Month {season.endMonth}, Day {season.endDay}
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
                  <CardTitle className="text-lg">Edit Season</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <Label>Season Name</Label>
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
                      <Label>Start Month</Label>
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
                      <Label>Start Day</Label>
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
                      <Label>End Month</Label>
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
                      <Label>End Day</Label>
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
                    <Label>Description</Label>
                    <Textarea
                      value={editingSeason.description || ''}
                      onChange={e =>
                        setEditingSeason(prev =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      placeholder="Optional description of this season"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => updateSeason(editingSeason)}>
                      Save Season
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingSeason(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !config.name ||
              !config.dayNames?.length ||
              !config.monthNames?.length
            }
          >
            {existingConfig ? 'Update Calendar' : 'Create Calendar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
