import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Configura las preferencias de la aplicación y ajustes de campaña.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración de Aplicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              La configuración de ajustes estará disponible pronto...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
