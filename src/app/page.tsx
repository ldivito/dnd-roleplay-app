import AppLayout from '@/components/AppLayout'
import DMDashboard from '@/components/DMDashboard'

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Dungeon Master! Manage your campaign from here.
          </p>
        </div>
        <DMDashboard />
      </div>
    </AppLayout>
  )
}
