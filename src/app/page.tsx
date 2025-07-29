import DMDashboard from '@/components/DMDashboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            D&D Roleplay Session
          </h1>
          <p className="text-gray-300 text-lg">
            Dungeon Master Interface
          </p>
        </header>
        <DMDashboard />
      </div>
    </main>
  )
}