import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  Package,
  ArrowRight,
  BookOpen,
  Music,
  Sparkles,
} from 'lucide-react'

export default function CompendiumPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compendio Mágico</h1>
        <p className="text-muted-foreground">
          Biblioteca completa de hechizos, objetos mágicos y conocimiento arcano
          para tu campaña.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spells Section */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Biblioteca de Hechizos
              <Badge variant="secondary" className="ml-auto">
                <Music className="h-3 w-3 mr-1" />
                Sistema Musical
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Gestiona hechizos tradicionales y el innovador sistema de magia
              musical. Crea hechizos que se lanzan a través de interpretaciones
              musicales con diferentes instrumentos y géneros.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Hechizos tradicionales de D&D</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Music className="h-4 w-4 text-purple-500" />
                <span>Sistema de magia musical único</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-purple-500" />
                <span>Efectos basados en interpretación</span>
              </div>
            </div>

            <Button asChild className="w-full group-hover:bg-primary/90">
              <Link href="/compendium/spells">
                Explorar Hechizos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-600" />
              Objetos y Equipamiento
              <Badge variant="outline" className="ml-auto">
                Próximamente
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Catálogo completo de objetos mágicos, armas, armaduras y
              equipamiento para enriquecer tu campaña con tesoros únicos y
              recompensas memorables.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Objetos mágicos únicos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Armas y armaduras legendarias</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Tesoros y artefactos</span>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="/compendium/items">
                Explorar Objetos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Resumen del Compendio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                6
              </div>
              <div className="text-sm text-muted-foreground">
                Hechizos Musicales de Ejemplo
              </div>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                4
              </div>
              <div className="text-sm text-muted-foreground">
                Categorías de Instrumentos
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                12
              </div>
              <div className="text-sm text-muted-foreground">
                Escuelas de Magia
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                6
              </div>
              <div className="text-sm text-muted-foreground">
                Géneros Musicales
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Highlight */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Sistema de Magia Musical
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Experimenta un sistema de magia único donde los hechizos se lanzan a
            través de interpretaciones musicales. Cada instrumento y género
            musical ofrece diferentes efectos y modificadores, creando una
            experiencia de juego más rica y narrativa.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-white/50 dark:bg-gray-800/50"
            >
              Instrumentos de Viento
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/50 dark:bg-gray-800/50"
            >
              Instrumentos de Percusión
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/50 dark:bg-gray-800/50"
            >
              Instrumentos de Cuerda
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/50 dark:bg-gray-800/50"
            >
              Instrumentos de Tecla
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
