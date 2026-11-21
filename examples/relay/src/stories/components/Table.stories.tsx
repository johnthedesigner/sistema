import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Checkbox, StatusChip, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableSortHead, type JobStatus, type SortDirection } from "@/components/ui"

type Job = { id: string; customer: string; tech: string | null; window: string; status: JobStatus; detail?: string }
const JOBS: Job[] = [
  { id: "JOB-20405", customer: "Bayview Café", tech: "L. Park", window: "7–9 am", status: "done" },
  { id: "JOB-20411", customer: "Harbor Dental", tech: "R. Alvarez", window: "8–10 am", status: "on-site" },
  { id: "JOB-20417", customer: "Pine St. Laundry", tech: "D. Okafor", window: "8–10 am", status: "running-late", detail: "25 min" },
  { id: "JOB-20420", customer: "T. Osei", tech: null, window: "1–3 pm", status: "unassigned" },
  { id: "JOB-20422", customer: "R. Novak", tech: "K. Byrne", window: "2–4 pm", status: "parts-hold" },
]

function JobsTable({ selected = "JOB-20417", empty = false }: { selected?: string | null; empty?: boolean }) {
  const [dir, setDir] = React.useState<SortDirection>("ascending")
  const rows = empty ? [] : [...JOBS].sort((a, b) => (dir === "ascending" ? 1 : -1) * a.id.localeCompare(b.id))
  return (
    <div className="rounded-lg bg-surface-raised p-panel-padding shadow-raised">
      <Table aria-label="Jobs today">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"><Checkbox aria-label="Select all jobs" /></TableHead>
            <TableSortHead direction={dir} onSort={() => setDir(dir === "ascending" ? "descending" : "ascending")}>Job</TableSortHead>
            <TableHead>Customer</TableHead>
            <TableHead>Tech</TableHead>
            <TableHead>Window</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((j) => (
            <TableRow key={j.id} selected={selected === j.id} aria-current={selected === j.id || undefined}>
              <TableCell><Checkbox aria-label={`Select ${j.id}`} defaultChecked={selected === j.id} /></TableCell>
              <TableCell mono>{j.id}</TableCell>
              <TableCell>{j.customer}</TableCell>
              <TableCell className={j.tech ? undefined : "text-on-surface-muted"}>{j.tech ?? "Not assigned"}</TableCell>
              <TableCell mono>{j.window}</TableCell>
              <TableCell><StatusChip status={j.status} detail={j.detail} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {empty && <p className="px-cell-padding-x py-section-gap text-body text-on-surface-muted">No unassigned jobs. New requests will show up here as customers call in.</p>}
    </div>
  )
}

const meta = {
  title: "Components/Data table",
  component: JobsTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**When to use:** the job board and other dense lists people scan and act on. Hairlines between rows help the eye follow a wide row; hover is a gray step; the selected row is one gray step stronger, with the accent only on its checkbox and left edge. IDs, times, and numbers use tabular figures. **When not to:** a handful of label/value pairs (use a description list in a panel). Below 768px the table scrolls inside its panel (a responsive pattern is a known gap).",
      },
    },
  },
} satisfies Meta<typeof JobsTable>
export default meta
type Story = StoryObj<typeof meta>

export const WithSelectedRow: Story = {}
export const NoSelection: Story = { args: { selected: null } }
export const Empty: Story = { args: { empty: true } }
