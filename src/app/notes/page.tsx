import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notas de Campaña</h1>
        <p className="text-muted-foreground">
          Mantén un registro de notas de historia, detalles de NPCs y lore de la
          campaña.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Notas de Historia y Lore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Las funciones de toma de notas estarán disponibles pronto...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
