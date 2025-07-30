import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  MessageSquare,
  Sword,
  Heart,
  Zap,
  Skull,
  Settings,
  FileText,
  Trash2,
  Filter,
  Download,
} from 'lucide-react'
import type { CombatLog as CombatLogType } from '@/types/combat'
import { useCombatStore } from '@/stores/combatStore'

interface CombatLogProps {
  combatId: string
  showControls?: boolean
}

const LOG_TYPE_CONFIG = {
  action: {
    icon: Sword,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Acción',
  },
  damage: {
    icon: Sword,
    color: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Daño',
  },
  healing: {
    icon: Heart,
    color: 'text-green-600',
    bg: 'bg-green-50',
    label: 'Curación',
  },
  condition: {
    icon: Zap,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: 'Condición',
  },
  death: {
    icon: Skull,
    color: 'text-red-800',
    bg: 'bg-red-100',
    label: 'Muerte',
  },
  system: {
    icon: Settings,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    label: 'Sistema',
  },
  dm_note: {
    icon: FileText,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    label: 'Nota DM',
  },
}

export default function CombatLog({
  combatId,
  showControls = true,
}: CombatLogProps) {
  const { combatLogs, addLog, clearLogs, currentCombat } = useCombatStore()
  const [filterType, setFilterType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dmNote, setDmNote] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentCombatLogs = combatLogs
    .filter(log => log.combatId === combatId)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  const filteredLogs = currentCombatLogs.filter(log => {
    const matchesFilter = filterType === 'all' || log.type === filterType
    const matchesSearch =
      searchTerm === '' ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Auto scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [filteredLogs])

  const handleAddDMNote = () => {
    if (!dmNote.trim()) return

    addLog(dmNote, 'dm_note')
    setDmNote('')
  }

  const handleExportLog = () => {
    const logText = currentCombatLogs
      .map(log => {
        const timestamp = log.timestamp.toLocaleTimeString()
        const round = log.round > 0 ? `[R${log.round}]` : ''
        const type = LOG_TYPE_CONFIG[log.type].label
        return `${timestamp} ${round} [${type}] ${log.message}`
      })
      .join('\n')

    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `combat-log-${currentCombat?.name || 'unknown'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getEntityName = (entityId?: string) => {
    if (!entityId || !currentCombat) return ''
    const entity = currentCombat.entities.find(e => e.id === entityId)
    return entity?.name || 'Desconocido'
  }

  const formatLogMessage = (log: CombatLogType) => {
    let message = log.message

    // Replace entity IDs with names in the message
    if (log.entityId) {
      const entityName = getEntityName(log.entityId)
      message = message.replace(new RegExp(log.entityId, 'g'), entityName)
    }

    if (log.targetId) {
      const targetName = getEntityName(log.targetId)
      message = message.replace(new RegExp(log.targetId, 'g'), targetName)
    }

    return message
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Registro de Combate
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{filteredLogs.length} entradas</Badge>
            {showControls && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportLog}
                  disabled={currentCombatLogs.length === 0}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearLogs}
                  disabled={currentCombatLogs.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {showControls && (
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Buscar en el registro..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">Todos</option>
              {Object.entries(LOG_TYPE_CONFIG).map(([type, config]) => (
                <option key={type} value={type}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-2 py-2">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {currentCombatLogs.length === 0
                  ? 'No hay entradas en el registro'
                  : 'No se encontraron entradas que coincidan con los filtros'}
              </div>
            ) : (
              filteredLogs.map(log => {
                const config = LOG_TYPE_CONFIG[log.type]
                const Icon = config.icon

                return (
                  <div
                    key={log.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${config.bg} border border-transparent hover:border-gray-200 transition-colors`}
                  >
                    <div className={`flex-shrink-0 mt-0.5 ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {config.label}
                        </Badge>
                        {log.round > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            R{log.round}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed">
                        {formatLogMessage(log)}
                      </p>

                      {(log.entityId || log.targetId) && (
                        <div className="flex gap-2 mt-2">
                          {log.entityId && (
                            <Badge variant="outline" className="text-xs">
                              {getEntityName(log.entityId)}
                            </Badge>
                          )}
                          {log.targetId && log.targetId !== log.entityId && (
                            <Badge variant="secondary" className="text-xs">
                              → {getEntityName(log.targetId)}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        {showControls && (
          <>
            <Separator />
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Añadir nota del DM..."
                  value={dmNote}
                  onChange={e => setDmNote(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleAddDMNote()
                    }
                  }}
                />
                <Button onClick={handleAddDMNote} disabled={!dmNote.trim()}>
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
