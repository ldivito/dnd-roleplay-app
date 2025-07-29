import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown } from 'lucide-react'

export default function SessionPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Session Management
          </h1>
          <p className="text-muted-foreground">
            Control your current D&D session and track progress.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Session Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Session management features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
