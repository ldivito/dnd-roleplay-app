import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sword } from 'lucide-react'

export default function CombatPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Rastreador de Combate
          </h1>
          <p className="text-muted-foreground">
            Gestiona el orden de iniciativa y encuentros de combate.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Iniciativa y Combate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Las funciones de rastreo de combate estarán disponibles pronto...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
