/**
 * Icons for topics and for the kinds of item the site lists (D45). One map, so
 * a topic or kind looks the same on every page. Lucide icons, sized by the caller.
 */
import {
  Accessibility, BadgeCheck, BookOpen, Bot, Braces, ClipboardList, Component, Contrast, Eye, FileText, Layers, LayoutTemplate, Library, Lightbulb,
  MessageSquareText, Moon, Palette, Play, Ruler, Scale, Shapes, ShieldCheck, Type, Waves, Workflow, Wrench, type LucideIcon,
} from 'lucide-react'
import type { ToolName, Topic } from '@/lib/content/schema'

export const TOPIC_ICONS: Record<Topic, LucideIcon> = {
  project: ClipboardList,
  'visual-language': Eye,
  content: MessageSquareText,
  color: Palette,
  typography: Type,
  shape: Shapes,
  depth: Layers,
  spacing: Ruler,
  motion: Waves,
  tokens: Braces,
  components: Component,
  accessibility: Accessibility,
  quality: BadgeCheck,
  ai: Bot,
}

export const KIND_ICONS = {
  play: Play,
  workflow: Workflow,
  guide: BookOpen,
  rule: Scale,
  opinion: Lightbulb,
  file: FileText,
  source: Library,
  tool: Wrench,
} satisfies Record<string, LucideIcon>

export type ItemKind = keyof typeof KIND_ICONS

export const TOOL_ICONS: Record<ToolName, LucideIcon> = {
  palette: Palette,
  contrast: Contrast,
  type_scale: Type,
  specimen: LayoutTemplate,
  validate: ShieldCheck,
  dark_mode: Moon,
}

/** An icon in a soft square, for group headings and counts. */
export function IconBadge({ icon: Icon, size = 'md' }: { icon: LucideIcon; size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
  return (
    <span aria-hidden="true" className={`inline-flex items-center justify-center shrink-0 rounded-radius-md bg-primary-container text-on-primary-container ${box}`}>
      <Icon size={size === 'sm' ? 14 : 17} strokeWidth={1.8} />
    </span>
  )
}

/** A count label with its kind's icon, replacing "N plays" eyebrows. */
export function CountLabel({ kind, count, label }: { kind: ItemKind; count: number; label: string }) {
  const Icon = KIND_ICONS[kind]
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
      {count} {label}
    </span>
  )
}

/** A kind label with its icon, for a single item ("File format"). */
export function KindLabel({ kind, label }: { kind: ItemKind; label: string }) {
  const Icon = KIND_ICONS[kind]
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
      {label}
    </span>
  )
}
