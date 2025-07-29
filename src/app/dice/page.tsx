import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dice1 } from 'lucide-react'

export default function DicePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dice Roller</h1>
          <p className="text-muted-foreground">
            Roll dice for various game mechanics and track results.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dice1 className="h-5 w-5" />
              Dice Rolling Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Dice rolling features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
