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
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, X } from 'lucide-react'
import type { TaxonomyOption } from '@/types/npc'

interface MultiTaxonomySelectorProps {
  label: string
  placeholder: string
  options: TaxonomyOption[]
  values: string[]
  onChange: (values: string[]) => void
  onAddNew: (option: TaxonomyOption) => void
}

export default function MultiTaxonomySelector({
  label,
  placeholder,
  options,
  values,
  onChange,
  onAddNew,
}: MultiTaxonomySelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedValue, setSelectedValue] = useState('')

  const handleAddNew = () => {
    if (newName.trim()) {
      const newOption: TaxonomyOption = {
        id: crypto.randomUUID(),
        name: newName.trim(),
        isCustom: true,
        createdAt: new Date(),
      }
      onAddNew(newOption)
      handleSelect(newOption.name)
      setNewName('')
      setIsDialogOpen(false)
    }
  }

  const handleSelect = (value: string) => {
    if (value && !values.includes(value)) {
      onChange([...values, value])
    }
    setSelectedValue('')
  }

  const handleRemove = (valueToRemove: string) => {
    onChange(values.filter(v => v !== valueToRemove))
  }

  const availableOptions = options.filter(
    option => !values.includes(option.name)
  )

  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Select value={selectedValue || ''} onValueChange={handleSelect}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {availableOptions.map(option => (
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

        {values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.map((value, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {value}
                <button
                  type="button"
                  onClick={() => handleRemove(value)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
