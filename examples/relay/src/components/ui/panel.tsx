import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * Panels on the canvas: the job detail pane, filter groups, forms. Built from
 * shadcn's Card. Changed: radius-lg, no outline (lifted off the page by
 * shadow-raised, as the direction chose), surface-raised,
 * panel-padding, heading/overline roles, no footer tint or divider.
 */
function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "flex flex-col gap-stack-gap rounded-lg bg-surface-raised shadow-raised p-panel-padding text-body text-on-surface",
        className
      )}
      {...props}
    />
  )
}

function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn("flex items-start justify-between gap-component-gap", className)}
      {...props}
    />
  )
}

function PanelOverline({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="panel-overline"
      className={cn("text-overline uppercase text-on-surface-muted", className)}
      {...props}
    />
  )
}

function PanelTitle({
  className,
  level = 2,
  ...props
}: React.ComponentProps<"h2"> & { level?: 2 | 3 | 4 }) {
  const Heading = `h${level}` as "h2"
  return (
    <Heading data-slot="panel-title" className={cn("text-heading text-on-surface", className)} {...props} />
  )
}

function PanelDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="panel-description" className={cn("text-body text-on-surface-muted", className)} {...props} />
  )
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-content" className={cn("flex flex-col gap-stack-gap", className)} {...props} />
}

function PanelFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-footer"
      className={cn("flex items-center justify-end gap-component-gap pt-1", className)}
      {...props}
    />
  )
}

export { Panel, PanelHeader, PanelOverline, PanelTitle, PanelDescription, PanelContent, PanelFooter }
