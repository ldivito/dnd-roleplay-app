'use client'

import RestManagement from '@/components/RestManagement'

export default function SessionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Sesión</h1>
        <p className="text-muted-foreground">
          Administra descansos, recursos y el estado del grupo durante tu sesión
          de D&D.
        </p>
      </div>

      <RestManagement />
    </div>
  )
}
