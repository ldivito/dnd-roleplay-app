import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export default function CompendiumPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spells & Items</h1>
          <p className="text-muted-foreground">
            Browse and manage spells, magic items, and equipment.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Magic Compendium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Compendium features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
