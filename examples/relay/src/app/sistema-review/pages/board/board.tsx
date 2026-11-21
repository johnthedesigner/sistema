"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon, SearchIcon, UserPlusIcon } from "lucide-react"
import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  InlineMessage,
  Input,
  Label,
  Panel,
  PanelHeader,
  PanelTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusChip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHead,
  TooltipProvider,
  type SortDirection,
} from "@/components/ui"
import { JOBS, JobMenu, TechPicker, type Job } from "../_shared/parts"

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "unassigned", label: "Unassigned" },
  { value: "running-late", label: "Running late" },
  { value: "parts-hold", label: "Parts hold" },
  { value: "en-route", label: "En route" },
  { value: "on-site", label: "On site" },
]

/* Gap (featured surface): no core component for the one item a screen leads
 * with. Composed from role tokens as DESIGN.md describes it:
 * surface-featured, shadow-featured, radius-xl, panel-padding. */
function NeedsTech({ job }: { job: Job }) {
  return (
    <section
      aria-labelledby="needs-tech"
      className="flex flex-col gap-stack-gap rounded-xl bg-surface-featured p-panel-padding shadow-featured"
    >
      <div className="flex flex-wrap items-start justify-between gap-component-gap">
        <div className="flex flex-col gap-0-5">
          <p className="text-overline text-on-surface-muted">Needs a tech now</p>
          <h2 id="needs-tech" className="text-heading">
            {job.type}, {job.customer}
          </h2>
          <p className="text-data text-on-surface-muted">
            {job.id} · {job.address} · Window {job.window} · Called in 8:52 am
          </p>
        </div>
        <StatusChip status={job.status} />
      </div>
      <p className="text-body">
        No heat in a two-storey house with a newborn. K. Byrne finishes nearby at 10:20 am and has the igniter on the van.
      </p>
      <div className="flex flex-wrap items-center gap-component-gap">
        <Dialog>
          <DialogTrigger render={<Button />}>
            <UserPlusIcon aria-hidden /> Assign tech
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign {job.id}</DialogTitle>
              <DialogDescription>
                {job.customer} · {job.type} · {job.window}
              </DialogDescription>
            </DialogHeader>
            <TechPicker defaultValue="K. Byrne" />
            <DialogFooter>
              <DialogClose render={<Button variant="secondary" />}>Keep unassigned</DialogClose>
              <DialogClose render={<Button />}>Assign tech</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="secondary" render={<Link href="/sistema-review/pages/job" />} nativeButton={false}>
          Open job
        </Button>
      </div>
    </section>
  )
}

/* Gap (metric strip): no core component for a row of key numbers. Composed
 * from a Panel and the metric type role. */
function TodayNumbers() {
  const items = [
    { label: "Unassigned", value: "2" },
    { label: "Running late", value: "1" },
    { label: "On site now", value: "1" },
    { label: "Requests waiting", value: "3", note: "oldest 18 min" },
  ]
  return (
    <Panel aria-label="Today's numbers">
      <dl className="grid grid-cols-2 gap-stack-gap sm:grid-cols-4">
        {items.map((i) => (
          <div key={i.label} className="flex flex-col gap-0-5">
            <dt className="text-label text-on-surface-muted">{i.label}</dt>
            <dd className="text-metric">{i.value}</dd>
            {i.note && <dd className="text-data text-on-surface-muted">{i.note}</dd>}
          </div>
        ))}
      </dl>
    </Panel>
  )
}

function JobsTable() {
  const [sort, setSort] = React.useState<{ key: "id" | "window"; dir: SortDirection }>({ key: "window", dir: "ascending" })
  const [status, setStatus] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [checked, setChecked] = React.useState<string[]>([])
  const [open, setOpen] = React.useState("JOB-20417")
  const q = query.trim().toLowerCase()
  const rows = JOBS.filter((j) => status === "all" || j.status === status)
    .filter((j) => !q || [j.id, j.customer, j.tech ?? "", j.address].some((v) => v.toLowerCase().includes(q)))
    .sort((a, b) => {
      const r = a[sort.key].localeCompare(b[sort.key])
      return sort.dir === "descending" ? -r : r
    })
  const toggleSort = (key: "id" | "window") =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "ascending" ? "descending" : "ascending" }))
  const allChecked = rows.length > 0 && rows.every((r) => checked.includes(r.id))
  const searchId = React.useId()
  const statusId = React.useId()
  return (
    <Panel aria-labelledby="jobs-today">
      <PanelHeader className="flex-wrap items-end">
        <PanelTitle id="jobs-today">All jobs today</PanelTitle>
        <div className="flex flex-wrap items-end gap-component-gap">
          <div className="flex flex-col gap-field-gap">
            <Label htmlFor={searchId} className="sr-only">Search jobs</Label>
            <div className="relative">
              <SearchIcon aria-hidden className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-on-surface-muted" />
              <Input id={searchId} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jobs, customers, techs" className="w-64 pl-7" />
            </div>
          </div>
          <div className="flex flex-col gap-field-gap">
            <Label id={statusId} className="sr-only">Status</Label>
            <Select items={STATUS_FILTERS} value={status} onValueChange={(v) => setStatus(String(v))}>
              <SelectTrigger aria-labelledby={statusId} className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PanelHeader>
      <div className="overflow-x-auto">
        <Table aria-label="Jobs today">
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">
                <Checkbox
                  aria-label="Select all jobs shown"
                  checked={allChecked}
                  indeterminate={checked.length > 0 && !allChecked}
                  onCheckedChange={(v) => setChecked(v ? rows.map((j) => j.id) : [])}
                />
              </TableHead>
              <TableSortHead direction={sort.key === "id" ? sort.dir : "none"} onSort={() => toggleSort("id")}>Job</TableSortHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Tech</TableHead>
              <TableSortHead direction={sort.key === "window" ? sort.dir : "none"} onSort={() => toggleSort("window")}>Window</TableSortHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((job) => (
              <TableRow key={job.id} selected={open === job.id} aria-current={open === job.id || undefined}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${job.id}`}
                    checked={checked.includes(job.id)}
                    onCheckedChange={(v) => setChecked((c) => (v ? [...c, job.id] : c.filter((x) => x !== job.id)))}
                  />
                </TableCell>
                <TableCell mono>
                  <button
                    type="button"
                    onClick={() => setOpen(job.id)}
                    className="cursor-pointer text-link underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-border-focus"
                  >
                    {job.id}
                  </button>
                </TableCell>
                <TableCell>{job.customer}</TableCell>
                <TableCell className="text-on-surface-muted">{job.type}</TableCell>
                <TableCell className={job.tech ? undefined : "text-on-surface-muted"}>{job.tech ?? "Not assigned"}</TableCell>
                <TableCell mono>{job.window}</TableCell>
                <TableCell><StatusChip status={job.status} detail={job.detail} /></TableCell>
                <TableCell><JobMenu job={job} onOpen={() => setOpen(job.id)} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <p className="px-cell-padding-x py-section-gap text-body text-on-surface-muted">
            No jobs match. Clear the search or pick another status.
          </p>
        )}
      </div>
    </Panel>
  )
}

export function Board() {
  return (
    <TooltipProvider>
      <header className="flex flex-wrap items-end justify-between gap-component-gap">
        <div>
          <p className="text-data text-on-surface-muted">Friday, November 20</p>
          <h1 className="text-title">Today&rsquo;s board</h1>
        </div>
        <div className="flex flex-wrap gap-component-gap">
          <Button variant="secondary">Export</Button>
          <Button><PlusIcon aria-hidden /> New job</Button>
        </div>
      </header>
      <NeedsTech job={JOBS[0]} />
      <InlineMessage tone="warning" title="D. Okafor is 25 min behind on JOB-20417.">
        Pine St. Laundry expects a tech by 10 am. Reassign the job or notify the customer.
      </InlineMessage>
      <TodayNumbers />
      <JobsTable />
    </TooltipProvider>
  )
}
