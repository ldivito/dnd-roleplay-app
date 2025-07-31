import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dice1 } from 'lucide-react'

export default function DicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tirador de Dados</h1>
        <p className="text-muted-foreground">
          Tira dados para varias mecánicas de juego y rastrea los resultados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dice1 className="h-5 w-5" />
            Herramientas de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Las funciones de tirada de dados estarán disponibles pronto...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
