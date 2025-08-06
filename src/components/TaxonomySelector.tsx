import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import type { TaxonomyOption } from '@/types/npc'

interface TaxonomySelectorProps {
  label: string
  placeholder: string
  options: TaxonomyOption[]
  value?: string
  onChange: (value: string) => void
  onAddNew: (option: any) => void
  showColor?: boolean
  defaultColor?: string
}

export default function TaxonomySelector({
  label,
  placeholder,
  options,
  value,
  onChange,
  onAddNew,
  showColor = false,
  defaultColor = 'bg-gray-100 text-gray-800',
}: TaxonomySelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(defaultColor)

  const handleAddNew = () => {
    if (newName.trim()) {
      const newOption: any = {
        id: crypto.randomUUID(),
        name: newName.trim(),
        isCustom: true,
        createdAt: new Date(),
        ...(showColor && { color: newColor }),
      }
      onAddNew(newOption)
      onChange(newOption.name)
      setNewName('')
      setNewColor(defaultColor)
      setIsDialogOpen(false)
    }
  }

  const colorOptions = [
    { value: 'bg-red-100 text-red-800', label: 'Rojo', preview: 'bg-red-100' },
    {
      value: 'bg-blue-100 text-blue-800',
      label: 'Azul',
      preview: 'bg-blue-100',
    },
    {
      value: 'bg-green-100 text-green-800',
      label: 'Verde',
      preview: 'bg-green-100',
    },
    {
      value: 'bg-yellow-100 text-yellow-800',
      label: 'Amarillo',
      preview: 'bg-yellow-100',
    },
    {
      value: 'bg-purple-100 text-purple-800',
      label: 'Morado',
      preview: 'bg-purple-100',
    },
    {
      value: 'bg-orange-100 text-orange-800',
      label: 'Naranja',
      preview: 'bg-orange-100',
    },
    {
      value: 'bg-gray-100 text-gray-800',
      label: 'Gris',
      preview: 'bg-gray-100',
    },
  ]

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.id} value={option.name}>
                <span className="flex items-center gap-2">
                  {option.name}
                  {option.isCustom && (
                    <span className="text-xs text-muted-foreground">
                      (Personalizado)
                    </span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" type="button">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar nuevo {label.toLowerCase()}</DialogTitle>
              <DialogDescription>
                Crear una nueva opción de {label.toLowerCase()} personalizada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="col-span-3"
                  placeholder={`Nombre del ${label.toLowerCase()}`}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleAddNew()
                    }
                  }}
                />
              </div>
              {showColor && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Color
                  </Label>
                  <Select value={newColor} onValueChange={setNewColor}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded ${color.preview} border`}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddNew}>
                Agregar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
