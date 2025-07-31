import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown } from 'lucide-react'

export default function SessionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Sesión</h1>
        <p className="text-muted-foreground">
          Controla tu sesión actual de D&D y rastrea el progreso.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Controles de Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Las funciones de gestión de sesión estarán disponibles pronto...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
