'use client'

import {
  type LucideIcon,
  Sword,
  Shield,
  Zap,
  Flame,
  Sparkles,
  Star,
  Package,
  Coins,
  Heart,
  User,
  Wand2,
  Scroll,
  BookOpen,
  Gem,
  Crown,
  Axe,
  Swords,
  Hammer,
  Crosshair,
  Target,
  Shirt,
  Watch,
  Glasses,
  Feather,
  Beaker,
  Pickaxe,
  Shovel,
  Lock,
  Key,
  Anchor,
  Wind,
  Droplet,
  Snowflake,
  Skull,
  Bug,
  Leaf,
  Mountain,
  Trees,
  Fish,
  Bird,
  Rabbit,
  Dog,
  Cat,
  Moon,
  Sun,
  Cloud,
  Umbrella,
  Tent,
  Backpack,
  Map,
  Compass,
  Music,
  Bell,
  Gift,
  Trophy,
  Lightbulb,
  Footprints,
  Eye,
  EyeOff,
  Glasses as Goggles,
  Sparkle,
  Wand,
  CircleDot,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Diamond,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Grid,
  ShieldCheck,
} from 'lucide-react'

/**
 * Icon registry mapping icon names to their components
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Sword,
  Shield,
  Zap,
  Flame,
  Sparkles,
  Star,
  Package,
  Coins,
  Heart,
  User,
  Wand2,
  Scroll,
  BookOpen,
  Gem,
  Crown,
  Axe,
  Swords,
  Hammer,
  Crosshair,
  Target,
  Shirt,
  Watch,
  Glasses,
  Feather,
  Beaker,
  Pickaxe,
  Shovel,
  Lock,
  Key,
  Anchor,
  Wind,
  Droplet,
  Snowflake,
  Skull,
  Bug,
  Leaf,
  Mountain,
  Trees,
  Fish,
  Bird,
  Rabbit,
  Dog,
  Cat,
  Moon,
  Sun,
  Cloud,
  Umbrella,
  Tent,
  Backpack,
  Map,
  Compass,
  Music,
  Bell,
  Gift,
  Trophy,
  Lightbulb,
  Footprints,
  Eye,
  EyeOff,
  Goggles,
  Sparkle,
  Wand,
  CircleDot,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Diamond,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Grid,
  ShieldCheck,
}

/**
 * Dynamically resolves a Lucide icon by name
 * @param iconName - The name of the Lucide icon (e.g., "Sword", "Shield")
 * @returns The icon component or null if not found
 */
export function getLucideIcon(iconName: string): LucideIcon | null {
  if (!iconName) return null

  // Look up the icon in our registry
  const IconComponent = ICON_MAP[iconName]

  if (IconComponent) {
    return IconComponent
  }

  return null
}

/**
 * Component that renders either a Lucide icon or emoji/text
 */
export function DynamicIcon({
  icon,
  className = 'h-4 w-4',
}: {
  icon?: string
  className?: string
}) {
  if (!icon) return null

  // Check if it's a Lucide icon name
  const LucideIconComponent = getLucideIcon(icon)

  if (LucideIconComponent) {
    return <LucideIconComponent className={className} />
  }

  // Otherwise, render as emoji/text
  return <span className="text-base">{icon}</span>
}

/**
 * Helper to check if a string is a valid Lucide icon name
 */
export function isLucideIcon(iconName: string): boolean {
  return getLucideIcon(iconName) !== null
}
