import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * Inline message: errors and notices that stay on screen until resolved.
 * Built from shadcn's Alert. Changed: a neutral inset (surface-subtle) in every
 * tone, with the status color only in the icon and the title (status as
 * detail, D30); body text stays on-surface; radius-lg, no outline or side
 * stripe (DESIGN.md Don'ts). Errors use role="alert"; others are
 * role="status".
 */
const inlineMessageVariants = cva(
  "grid w-full grid-cols-[auto_1fr] items-start gap-x-2 gap-y-0-5 rounded-lg bg-surface-subtle px-3 py-2 text-body text-on-surface [&>svg]:mt-0-5 [&>svg]:size-4 [&>svg]:row-span-2",
  {
    variants: {
      tone: {
        error: "[&>svg]:text-error [&>[data-slot=title]]:text-error",
        warning: "[&>svg]:text-warning [&>[data-slot=title]]:text-warning",
        success: "[&>svg]:text-success [&>[data-slot=title]]:text-success",
        info: "[&>svg]:text-info [&>[data-slot=title]]:text-info",
      },
    },
    defaultVariants: { tone: "info" },
  }
)

const ICONS = {
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  success: CheckCircle2Icon,
  info: InfoIcon,
} as const

function InlineMessage({
  className,
  tone = "info",
  title,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof inlineMessageVariants> & {
    /** The bold lead, for example "Couldn't assign the job." */
    title: React.ReactNode
  }) {
  const t = tone ?? "info"
  const Icon = ICONS[t]
  return (
    <div
      data-slot="inline-message"
      role={t === "error" ? "alert" : "status"}
      className={cn(inlineMessageVariants({ tone: t }), className)}
      {...props}
    >
      <Icon aria-hidden />
      <p data-slot="title" className="text-body-strong">{title}</p>
      {children && <div className="col-start-2">{children}</div>}
    </div>
  )
}

export { InlineMessage }
