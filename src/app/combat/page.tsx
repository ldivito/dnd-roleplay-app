import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sword } from 'lucide-react'

export default function CombatPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Combat Tracker</h1>
          <p className="text-muted-foreground">
            Manage initiative order and combat encounters.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Initiative & Combat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Combat tracking features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
