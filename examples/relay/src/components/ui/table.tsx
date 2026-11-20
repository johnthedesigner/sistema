"use client"

import * as React from "react"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { focusRing } from "./styles"

/*
 * The job board and other dense lists. Built from shadcn's Table. Changed:
 * data role text, row-height rows, cell-padding-x, `border` between rows,
 * sticky header in `label` on surface-raised, surface-hover on hover,
 * surface-selected (a neutral step stronger than hover) with a `primary` left
 * edge for the selected row; the accent stays a detail (D30, quiet states); no
 * muted/50 tints; a sortable header button with aria-sort; and a `mono` cell
 * option (tabular figures; no mono face) for IDs, times, and phone numbers.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-auto">
      <table
        data-slot="table"
        className={cn("w-full border-collapse text-data text-on-surface", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("sticky top-0 z-10 bg-surface-raised [&_tr]:border-b [&_tr]:border-border-strong", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />
}

function TableRow({
  className,
  selected = false,
  ...props
}: React.ComponentProps<"tr"> & {
  /** The row open in the detail pane. Pair with a checked row checkbox or
   * aria-current so the state isn't only visual. */
  selected?: boolean
}) {
  return (
    <tr
      data-slot="table-row"
      data-state={selected ? "selected" : undefined}
      className={cn(
        "h-row-height border-b border-border transition-colors motion-reduce:transition-none hover:bg-surface-hover data-[state=selected]:bg-surface-selected data-[state=selected]:hover:bg-surface-selected data-[state=selected]:[&>td:first-child]:shadow-[inset_var(--space-0-5)_0_0_var(--color-primary)]",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      scope="col"
      className={cn(
        "h-row-height px-cell-padding-x text-left align-middle text-label whitespace-nowrap text-on-surface-muted",
        className
      )}
      {...props}
    />
  )
}

type SortDirection = "ascending" | "descending" | "none"

/** A column header that sorts. Exposes aria-sort on the th. */
function TableSortHead({
  className,
  direction = "none",
  onSort,
  children,
  ...props
}: Omit<React.ComponentProps<"th">, "onClick"> & {
  direction?: SortDirection
  onSort?: () => void
}) {
  const Icon =
    direction === "ascending" ? ArrowUpIcon : direction === "descending" ? ArrowDownIcon : ChevronsUpDownIcon
  return (
    <TableHead aria-sort={direction} className={cn("px-1", className)} {...props}>
      <button
        type="button"
        onClick={onSort}
        className={cn(
          "inline-flex h-6 cursor-pointer items-center gap-1 rounded-sm px-1 text-label text-on-surface-muted hover:bg-surface-hover hover:text-on-surface",
          direction !== "none" && "text-on-surface",
          focusRing
        )}
      >
        {children}
        <Icon aria-hidden className="size-3" />
      </button>
    </TableHead>
  )
}

function TableCell({
  className,
  mono = false,
  ...props
}: React.ComponentProps<"td"> & {
  /** IDs, times, phone numbers, numeric columns (data role, tabular figures). */
  mono?: boolean
}) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-cell-padding-x align-middle whitespace-nowrap",
        mono && "tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption data-slot="table-caption" className={cn("mt-2 text-data text-on-surface-muted", className)} {...props} />
  )
}

export { Table, TableHeader, TableBody, TableHead, TableSortHead, TableRow, TableCell, TableCaption, type SortDirection }
