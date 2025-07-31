'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Database,
  Table,
  HardDrive,
  Activity,
  FileText,
  Users,
  Sword,
  MapPin,
  ScrollText,
  Shield,
  Zap,
  Package,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'
import { dbManager } from '@/lib/indexedDB'
import type { CampaignDB, BackupRecord } from '@/lib/indexedDB'

interface DatabaseStats {
  totalSize: string
  campaignCount: number
  backupCount: number
  lastUpdate: Date | null
  status: 'healthy' | 'warning' | 'error'
}

interface TableInfo {
  name: string
  count: number
  size: string
  icon: any
  color: string
}

export default function DatabaseDebugPage() {
  const [stats, setStats] = useState<DatabaseStats>({
    totalSize: '0 KB',
    campaignCount: 0,
    backupCount: 0,
    lastUpdate: null,
    status: 'healthy',
  })

  const [campaigns, setCampaigns] = useState<CampaignDB[]>([])
  const [backups, setBackups] = useState<BackupRecord[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignDB | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [selectedDataType, setSelectedDataType] = useState<string>('characters')
  const [mounted, setMounted] = useState(false)

  const sessionState = useSessionStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const dataTypeOptions = [
    {
      value: 'characters',
      label: 'Characters',
      data: sessionState.characters,
      icon: Users,
    },
    { value: 'spells', label: 'Spells', data: sessionState.spells, icon: Zap },
    { value: 'items', label: 'Items', data: sessionState.items, icon: Package },
    {
      value: 'locations',
      label: 'Locations',
      data: sessionState.locations,
      icon: MapPin,
    },
    { value: 'npcs', label: 'NPCs', data: sessionState.npcs, icon: Users },
    {
      value: 'quests',
      label: 'Quests',
      data: sessionState.quests,
      icon: ScrollText,
    },
    {
      value: 'factions',
      label: 'Factions',
      data: sessionState.factions,
      icon: Shield,
    },
    { value: 'lore', label: 'Lore', data: sessionState.lore, icon: FileText },
    {
      value: 'diceHistory',
      label: 'Dice History',
      data: sessionState.diceHistory,
      icon: Activity,
    },
    {
      value: 'initiatives',
      label: 'Initiatives',
      data: sessionState.initiatives,
      icon: Sword,
    },
  ]

  const selectedData =
    dataTypeOptions.find(option => option.value === selectedDataType)?.data ||
    []

  const renderTableHeaders = (data: any[]) => {
    if (data.length === 0) return []
    const firstItem = data[0]
    return Object.keys(firstItem).filter(
      key =>
        !['createdAt', 'updatedAt'].includes(key) ||
        selectedDataType === 'diceHistory'
    )
  }

  const renderCellValue = (value: any, key: string): string => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') {
      if (value instanceof Date) return value.toLocaleDateString()
      if (Array.isArray(value)) return `Array(${value.length})`
      return `Object(${Object.keys(value).length} keys)`
    }
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 47) + '...'
    }
    return String(value)
  }

  const tableInfos: TableInfo[] = [
    {
      name: 'Characters',
      count: sessionState.characters.length,
      size: getArraySize(sessionState.characters),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      name: 'Spells',
      count: sessionState.spells.length,
      size: getArraySize(sessionState.spells),
      icon: Zap,
      color: 'text-purple-600',
    },
    {
      name: 'Items',
      count: sessionState.items.length,
      size: getArraySize(sessionState.items),
      icon: Package,
      color: 'text-green-600',
    },
    {
      name: 'Locations',
      count: sessionState.locations.length,
      size: getArraySize(sessionState.locations),
      icon: MapPin,
      color: 'text-red-600',
    },
    {
      name: 'NPCs',
      count: sessionState.npcs.length,
      size: getArraySize(sessionState.npcs),
      icon: Users,
      color: 'text-yellow-600',
    },
    {
      name: 'Quests',
      count: sessionState.quests.length,
      size: getArraySize(sessionState.quests),
      icon: ScrollText,
      color: 'text-indigo-600',
    },
    {
      name: 'Factions',
      count: sessionState.factions.length,
      size: getArraySize(sessionState.factions),
      icon: Shield,
      color: 'text-orange-600',
    },
    {
      name: 'Lore',
      count: sessionState.lore.length,
      size: getArraySize(sessionState.lore),
      icon: FileText,
      color: 'text-pink-600',
    },
    {
      name: 'Dice History',
      count: sessionState.diceHistory.length,
      size: getArraySize(sessionState.diceHistory),
      icon: Activity,
      color: 'text-teal-600',
    },
  ]

  function getArraySize(array: any[]): string {
    const size = new Blob([JSON.stringify(array)]).size
    if (size < 1024) return `${size} B`
    if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1048576).toFixed(1)} MB`
  }

  const loadDatabaseInfo = async () => {
    try {
      setLoading(true)

      // Load campaigns
      const campaignList = await dbManager.getAllCampaigns()
      setCampaigns(campaignList)

      // Load backups
      const backupList = await dbManager.getAllBackups()
      setBackups(backupList)

      // Calculate stats
      let totalSize = 0
      campaignList.forEach(campaign => {
        totalSize += new Blob([JSON.stringify(campaign.data)]).size
      })
      backupList.forEach(backup => {
        totalSize += backup.size
      })

      const lastUpdate =
        campaignList.length > 0
          ? campaignList.sort(
              (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
            )[0]?.updatedAt || null
          : null

      // Determine status
      let status: 'healthy' | 'warning' | 'error' = 'healthy'
      if (campaignList.length === 0) status = 'warning'
      if (totalSize > 50 * 1024 * 1024) status = 'warning' // > 50MB

      setStats({
        totalSize:
          totalSize < 1024
            ? `${totalSize} B`
            : totalSize < 1048576
              ? `${(totalSize / 1024).toFixed(1)} KB`
              : `${(totalSize / 1048576).toFixed(1)} MB`,
        campaignCount: campaignList.length,
        backupCount: backupList.length,
        lastUpdate,
        status,
      })

      // Select most recent campaign by default
      if (campaignList.length > 0 && !selectedCampaign) {
        setSelectedCampaign(campaignList[0] || null)
      }
    } catch (error) {
      console.error('Failed to load database info:', error)
      setStats(prev => ({ ...prev, status: 'error' }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDatabaseInfo()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              Database Debug
            </h1>
            <p className="text-muted-foreground">
              Comprehensive database status, structure analysis, and data
              inspection tools.
            </p>
          </div>
          <Button onClick={loadDatabaseInfo} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Database Status
              {getStatusIcon(stats.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <HardDrive className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.totalSize}</div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{stats.campaignCount}</div>
                <div className="text-sm text-muted-foreground">Campaigns</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{stats.backupCount}</div>
                <div className="text-sm text-muted-foreground">Backups</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-xs font-bold">
                  {stats.lastUpdate ? formatDate(stats.lastUpdate) : 'Never'}
                </div>
                <div className="text-sm text-muted-foreground">Last Update</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tables" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tables">Table Analysis</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="data">Data Inspection</TabsTrigger>
          </TabsList>

          {/* Table Analysis Tab */}
          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Current Session Data Tables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tableInfos.map(table => {
                    const Icon = table.icon
                    return (
                      <Card key={table.name} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className={`h-6 w-6 ${table.color}`} />
                            <div>
                              <div className="font-medium">{table.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {table.size}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-lg">
                            {table.count}
                          </Badge>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Stored Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {campaigns.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No campaigns found in IndexedDB
                      </div>
                    ) : (
                      campaigns.map(campaign => (
                        <Card key={campaign.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{campaign.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {campaign.id}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Created: {formatDate(campaign.createdAt)} •
                                Updated: {formatDate(campaign.updatedAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">
                                v{campaign.version}
                              </Badge>
                              <div className="text-sm text-muted-foreground mt-1">
                                {getArraySize([campaign.data])}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backups Tab */}
          <TabsContent value="backups">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Backup Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {backups.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No backups found
                      </div>
                    ) : (
                      backups.map(backup => (
                        <Card key={backup.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{backup.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {backup.id}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Created: {formatDate(backup.createdAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  backup.type === 'auto'
                                    ? 'secondary'
                                    : 'default'
                                }
                              >
                                {backup.type}
                              </Badge>
                              <div className="text-sm text-muted-foreground mt-1">
                                {backup.size < 1024
                                  ? `${backup.size} B`
                                  : backup.size < 1048576
                                    ? `${(backup.size / 1024).toFixed(1)} KB`
                                    : `${(backup.size / 1048576).toFixed(1)} MB`}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Inspection Tab */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Data Table Inspection
                </CardTitle>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Data Type:</label>
                    <Select
                      value={selectedDataType}
                      onValueChange={setSelectedDataType}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dataTypeOptions.map(option => {
                          const Icon = option.icon
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {option.label} ({option.data.length})
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <Badge variant="outline">{selectedData.length} records</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {selectedData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No data available for{' '}
                      {
                        dataTypeOptions.find(
                          opt => opt.value === selectedDataType
                        )?.label
                      }
                    </div>
                  ) : (
                    <div className="relative">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-background border-b">
                          <tr>
                            {renderTableHeaders(selectedData).map(header => (
                              <th
                                key={header}
                                className="text-left p-2 font-medium"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedData
                            .slice(0, 50)
                            .map((item: any, index: number) => (
                              <tr
                                key={item.id || index}
                                className="border-b hover:bg-muted/50"
                              >
                                {renderTableHeaders(selectedData).map(
                                  header => (
                                    <td key={header} className="p-2 max-w-xs">
                                      <div
                                        className="truncate"
                                        title={String(item[header])}
                                      >
                                        {renderCellValue(item[header], header)}
                                      </div>
                                    </td>
                                  )
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {selectedData.length > 50 && (
                        <div className="text-center py-4 text-sm text-muted-foreground border-t">
                          Showing first 50 of {selectedData.length} records
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Raw JSON View */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Raw JSON Data (First Record)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {selectedData.length > 0 ? (
                    <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-auto">
                      {JSON.stringify(selectedData[0], null, 2)}
                    </pre>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No data to display
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Technical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Technical Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="font-medium">Storage Engine:</div>
                <div className="text-sm text-muted-foreground">
                  IndexedDB with Zustand persistence
                </div>
                <div className="font-medium">Database Name:</div>
                <div className="text-sm text-muted-foreground">RolAppDB</div>
                <div className="font-medium">Stores:</div>
                <div className="text-sm text-muted-foreground">
                  campaigns, backups, settings
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Hydration Status:</div>
                <div className="text-sm text-muted-foreground">
                  {sessionState.hasHydrated ? 'Hydrated' : 'Not Hydrated'}
                </div>
                <div className="font-medium">Browser Support:</div>
                <div className="text-sm text-muted-foreground">
                  {mounted
                    ? typeof window !== 'undefined' && 'indexedDB' in window
                      ? 'Supported'
                      : 'Not Supported'
                    : 'Checking...'}
                </div>
                <div className="font-medium">Auto-Backup:</div>
                <div className="text-sm text-muted-foreground">
                  Every 30 minutes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
