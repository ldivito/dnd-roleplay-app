import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map } from 'lucide-react'

export default function MapsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mapas y Ubicaciones
          </h1>
          <p className="text-muted-foreground">
            Gestiona mapas del mundo, mapas de batalla y detalles de
            ubicaciones.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Gestión de Mapas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Las funciones de gestión de mapas estarán disponibles pronto...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
