import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function CharactersPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personajes</h1>
          <p className="text-muted-foreground">
            Gestiona los personajes de los jugadores y NPCs en tu campaña.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Personajes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Las funciones de gestión de personajes estarán disponibles
              pronto...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
