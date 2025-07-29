import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export default function CompendiumPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hechizos y Objetos
          </h1>
          <p className="text-muted-foreground">
            Explora y gestiona hechizos, objetos mágicos y equipamiento.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Compendio Mágico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Las funciones del compendio estarán disponibles pronto...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
