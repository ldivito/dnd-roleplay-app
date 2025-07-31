import DMDashboard from '@/components/DMDashboard'

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tablero</h1>
        <p className="text-muted-foreground">
          ¡Bienvenido de vuelta, Dungeon Master! Gestiona tu campaña desde aquí.
        </p>
      </div>
      <DMDashboard />
    </div>
  )
}
