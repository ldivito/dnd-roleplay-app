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
            Estado de Sesión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estado:</span>
              <span className="font-medium">No Iniciada</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Jugadores:</span>
              <span className="font-medium">0/6</span>
            </div>
          </div>
          <Button className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Dice1 className="h-4 w-4 mr-2" />
            Tirar Iniciativa
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <UserPlus className="h-4 w-4 mr-2" />
            Agregar NPC
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Nota Rápida
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de Campaña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Campaña:</span>
            <span className="font-medium">Nueva Aventura</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sesión:</span>
            <span className="font-medium">#1</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ubicación:</span>
            <span className="font-medium">Taberna</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
