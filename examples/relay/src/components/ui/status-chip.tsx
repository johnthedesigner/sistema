import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Job status: a dot plus a word in a tinted chip, never color alone. No
 * outline: the tint alone marks the chip (scaled radius-xs, not a pill).
 * Unassigned has no fill in either theme: nothing is assigned yet.
 * Status list from the approved style preview (person confirmed 2026-11-19).
 */
const JOB_STATUSES = {
  unassigned: {
    label: "Unassigned",
    chip: "bg-transparent text-on-surface-muted",
    dot: "bg-on-surface-muted",
  },
  assigned: {
    label: "Assigned",
    chip: "bg-secondary-container text-on-secondary-container",
    dot: "bg-on-secondary-container",
  },
  "en-route": {
    label: "En route",
    chip: "bg-info-container text-on-info-container",
    dot: "bg-info",
  },
  "on-site": {
    label: "On site",
    chip: "bg-success-container text-on-success-container",
    dot: "bg-success",
  },
  "parts-hold": {
    label: "Parts hold",
    chip: "bg-error-container text-on-error-container",
    dot: "bg-error",
  },
  "running-late": {
    label: "Running late",
    chip: "bg-warning-container text-on-warning-container",
    dot: "bg-warning",
  },
  done: {
    label: "Done",
    chip: "bg-success-container text-on-success-container",
    dot: "bg-success",
  },
} as const

type JobStatus = keyof typeof JOB_STATUSES

function StatusChip({
  status,
  detail,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  status: JobStatus
  /** Extra words after the status, for example "25 min". */
  detail?: React.ReactNode
}) {
  const s = JOB_STATUSES[status]
  return (
    <span
      data-slot="status-chip"
      data-status={status}
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center gap-1-5 rounded-xs px-1-5 text-label whitespace-nowrap",
        s.chip,
        className
      )}
      {...props}
    >
      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", s.dot)} />
      {s.label}
      {detail && <span> · {detail}</span>}
    </span>
  )
}

export { StatusChip, JOB_STATUSES, type JobStatus }
