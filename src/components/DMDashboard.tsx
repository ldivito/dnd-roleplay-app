'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Dice1, UserPlus, FileText } from 'lucide-react'

export default function DMDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Session Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">Not Started</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Players:</span>
              <span className="font-medium">0/6</span>
            </div>
          </div>
          <Button className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start Session
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Dice1 className="h-4 w-4 mr-2" />
            Roll Initiative
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <UserPlus className="h-4 w-4 mr-2" />
            Add NPC
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Quick Note
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Campaign:</span>
            <span className="font-medium">New Adventure</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Session:</span>
            <span className="font-medium">#1</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">Tavern</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
