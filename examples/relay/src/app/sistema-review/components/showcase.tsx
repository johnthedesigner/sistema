"use client"

import * as React from "react"
import { MoreHorizontalIcon, PhoneIcon, RefreshCwIcon, UserPlusIcon } from "lucide-react"
import {
  Button,
  Checkbox,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  InlineMessage,
  Input,
  Label,
  Panel,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelOverline,
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
  Textarea,
  TextField,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  JOB_STATUSES,
  type JobStatus,
  type SortDirection,
} from "@/components/ui"

const TECHS = ["Rosa Alvarez", "Dayo Okafor", "Kim Byrne", "Sam Whitfield", "Lena Park"]
const JOB_TYPES = ["No heat", "No cooling", "Leak", "Water heater", "Maintenance"]

type Job = { id: string; customer: string; tech: string | null; window: string; status: JobStatus; detail?: string }
const JOBS: Job[] = [
  { id: "JOB-20411", customer: "Harbor Dental", tech: "Rosa Alvarez", window: "8:00–10:00 am", status: "on-site" },
  { id: "JOB-20414", customer: "M. Chen", tech: "Dayo Okafor", window: "10:00 am–12:00 pm", status: "en-route" },
  { id: "JOB-20417", customer: "Pine St. Laundry", tech: "Dayo Okafor", window: "8:15–10:00 am", status: "running-late", detail: "25 min" },
  { id: "JOB-20420", customer: "T. Osei", tech: null, window: "1:00–3:00 pm", status: "unassigned" },
  { id: "JOB-20421", customer: "Elm Court HOA", tech: "Sam Whitfield", window: "1:00–3:00 pm", status: "assigned" },
  { id: "JOB-20422", customer: "R. Novak", tech: "Kim Byrne", window: "2:00–4:00 pm", status: "parts-hold" },
  { id: "JOB-20405", customer: "Bayview Café", tech: "Lena Park", window: "7:00–9:00 am", status: "done" },
]

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <Panel aria-labelledby={id}>
      <PanelHeader>
        <div>
          <PanelTitle id={id}>{title}</PanelTitle>
          {note && <PanelDescription>{note}</PanelDescription>}
        </div>
      </PanelHeader>
      <PanelContent>{children}</PanelContent>
    </Panel>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-overline uppercase text-on-surface-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-component-gap">{children}</div>
    </div>
  )
}

function RowMenu({ job }: { job: Job }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${job.id}`} />}
      >
        <MoreHorizontalIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{job.id}</DropdownMenuLabel>
          <DropdownMenuItem>
            Open job <DropdownMenuShortcut>O</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Reassign <DropdownMenuShortcut>R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Call customer</DropdownMenuItem>
          <DropdownMenuItem disabled>Mark done</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Cancel job</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function JobBoard() {
  const [sort, setSort] = React.useState<{ key: "id" | "window"; dir: SortDirection }>({ key: "id", dir: "ascending" })
  const [checked, setChecked] = React.useState<string[]>(["JOB-20417"])
  const [open, setOpen] = React.useState("JOB-20417")
  const rows = [...JOBS].sort((a, b) => {
    const r = a[sort.key].localeCompare(b[sort.key])
    return sort.dir === "descending" ? -r : r
  })
  const toggleSort = (key: "id" | "window") =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "ascending" ? "descending" : "ascending" }))
  const allChecked = checked.length === JOBS.length
  return (
    <div className="max-h-72 overflow-auto">
      <Table aria-label="Today's jobs (sample)">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                aria-label="Select all jobs"
                checked={allChecked}
                indeterminate={checked.length > 0 && !allChecked}
                onCheckedChange={(v) => setChecked(v ? JOBS.map((j) => j.id) : [])}
              />
            </TableHead>
            <TableSortHead direction={sort.key === "id" ? sort.dir : "none"} onSort={() => toggleSort("id")}>
              Job
            </TableSortHead>
            <TableHead>Customer</TableHead>
            <TableHead>Tech</TableHead>
            <TableSortHead direction={sort.key === "window" ? sort.dir : "none"} onSort={() => toggleSort("window")}>
              Window
            </TableSortHead>
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
                  onCheckedChange={(v) =>
                    setChecked((c) => (v ? [...c, job.id] : c.filter((x) => x !== job.id)))
                  }
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
              <TableCell className={job.tech ? undefined : "text-on-surface-muted"}>{job.tech ?? "Not assigned"}</TableCell>
              <TableCell mono>{job.window}</TableCell>
              <TableCell><StatusChip status={job.status} detail={job.detail} /></TableCell>
              <TableCell><RowMenu job={job} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function AssignDialog() {
  const [busy, setBusy] = React.useState(false)
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <UserPlusIcon aria-hidden /> Assign job
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign JOB-20420</DialogTitle>
          <DialogDescription>T. Osei · Leak · 1:00–3:00 pm</DialogDescription>
        </DialogHeader>
        <TechPicker label="Tech" />
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
          <Button
            busy={busy}
            onClick={() => {
              setBusy(true)
              window.setTimeout(() => setBusy(false), 1500)
            }}
          >
            {busy ? "Assigning" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TechPicker({ label, invalid = false, disabled = false }: { label: string; invalid?: boolean; disabled?: boolean }) {
  const id = React.useId()
  return (
    <div className="flex w-64 flex-col gap-field-gap">
      <Label htmlFor={id}>{label}</Label>
      <Combobox items={TECHS}>
        <ComboboxInput
          id={id}
          placeholder="Search techs"
          showClear
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-err` : undefined}
        />
        <ComboboxContent>
          <ComboboxEmpty>No tech by that name.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {invalid && (
        <p id={`${id}-err`} className="text-data text-error">
          Pick a tech before you assign.
        </p>
      )}
    </div>
  )
}

function JobTypeSelect({ invalid = false, disabled = false, label = "Job type" }: { invalid?: boolean; disabled?: boolean; label?: string }) {
  const id = React.useId()
  return (
    <div className="flex w-48 flex-col gap-field-gap">
      <Label id={`${id}-label`}>{label}</Label>
      <Select items={JOB_TYPES.map((t) => ({ label: t, value: t }))} disabled={disabled}>
        <SelectTrigger
          className="w-full"
          aria-labelledby={`${id}-label`}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-err` : undefined}
        >
          <SelectValue placeholder="Choose a type" />
        </SelectTrigger>
        <SelectContent>
          {JOB_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {invalid && (
        <p id={`${id}-err`} className="text-data text-error">
          Choose a job type.
        </p>
      )}
    </div>
  )
}

export function Showcase() {
  const [busy, setBusy] = React.useState(false)
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 gap-section-gap">
        <Section id="buttons" title="Button" note="Primary for the one main action; secondary for other actions; ghost for low-emphasis and icon actions; destructive for actions that remove or cancel.">
          <Row label="Variants">
            <Button>Assign job</Button>
            <Button variant="secondary">Call customer</Button>
            <Button variant="ghost">View history</Button>
            <Button variant="destructive">Cancel job</Button>
          </Row>
          <Row label="Small (24px)">
            <Button size="sm">Assign</Button>
            <Button size="sm" variant="secondary">Filter</Button>
            <Button size="sm" variant="ghost">Clear</Button>
            <Button size="sm" variant="destructive">Remove</Button>
          </Row>
          <Row label="With icon, icon only (named by tooltip and aria-label)">
            <Button variant="secondary"><PhoneIcon aria-hidden /> Call</Button>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Refresh board" />}>
                <RefreshCwIcon aria-hidden />
              </TooltipTrigger>
              <TooltipContent>Refresh board</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="secondary" size="icon-sm" aria-label="Call customer" />}>
                <PhoneIcon aria-hidden />
              </TooltipTrigger>
              <TooltipContent>Call customer</TooltipContent>
            </Tooltip>
          </Row>
          <Row label="Disabled, busy (keeps focus; press to try)">
            <Button disabled>Assign job</Button>
            <Button variant="secondary" disabled>Call customer</Button>
            <Button
              busy={busy}
              onClick={() => {
                setBusy(true)
                window.setTimeout(() => setBusy(false), 2000)
              }}
            >
              {busy ? "Saving" : "Save job"}
            </Button>
          </Row>
        </Section>

        <Section id="fields" title="Text field" note="Label above, hint or error below. Invalid fields get a thicker error edge and a message.">
          <div className="flex flex-wrap items-start gap-section-gap">
            <TextField label="Customer name" className="w-56"><Input placeholder="Search or add" /></TextField>
            <TextField label="Phone" hint="We text arrival updates here." className="w-56"><Input defaultValue="(555) 014-2290" className="tabular-nums" /></TextField>
            <TextField label="Address" error="Add a street number." className="w-56"><Input defaultValue="Elm Court" /></TextField>
            <TextField label="Gate code" className="w-56"><Input disabled defaultValue="4471" /></TextField>
          </div>
          <TextField label="Notes for the tech" hint="Shown on the tech's phone." className="max-w-xl">
            <Textarea defaultValue="Side door. Dog in the yard, friendly." />
          </TextField>
        </Section>

        <Section id="select" title="Select" note="Fixed lists such as job type.">
          <div className="flex flex-wrap items-start gap-section-gap">
            <JobTypeSelect />
            <JobTypeSelect invalid label="Job type (invalid)" />
            <JobTypeSelect disabled label="Job type (disabled)" />
          </div>
        </Section>

        <Section id="combobox" title="Combobox" note="Search and pick one; used to assign a tech.">
          <div className="flex flex-wrap items-start gap-section-gap">
            <TechPicker label="Tech" />
            <TechPicker label="Tech (invalid)" invalid />
            <TechPicker label="Tech (disabled)" disabled />
          </div>
        </Section>

        <Section id="checkbox" title="Checkbox" note="Row selection and filters.">
          <Row label="States">
            {[
              { l: "Unchecked", p: {} },
              { l: "Checked", p: { defaultChecked: true } },
              { l: "Some selected", p: { indeterminate: true } },
              { l: "Disabled", p: { disabled: true } },
              { l: "Disabled, checked", p: { disabled: true, defaultChecked: true } },
            ].map(({ l, p }) => (
              <Label key={l} className="mr-3 font-normal">
                <Checkbox {...p} /> {l}
              </Label>
            ))}
          </Row>
        </Section>

        <Section id="status" title="Status chip" note="Every job status is a dot plus a word. Chips are the one place status takes a tinted fill; Unassigned has none, because nothing is assigned yet.">
          <Row label="Job statuses">
            {(Object.keys(JOB_STATUSES) as JobStatus[]).map((s) => (
              <StatusChip key={s} status={s} />
            ))}
            <StatusChip status="running-late" detail="25 min" />
          </Row>
        </Section>

        <Section id="table" title="Data table" note="The job board: sticky header, sortable columns, a gray hover, and the open job on a gray step one shade stronger, with the accent only on its checkbox and left edge. Click a job number to open it.">
          <JobBoard />
        </Section>

        <div className="grid grid-cols-1 gap-section-gap lg:grid-cols-2">
          <Panel aria-labelledby="panel-demo">
            <PanelHeader>
              <div>
                <PanelOverline>Job detail · panel</PanelOverline>
                <PanelTitle id="panel-demo">JOB-20417 · Pine St. Laundry</PanelTitle>
              </div>
              <StatusChip status="running-late" detail="25 min" />
            </PanelHeader>
            <PanelContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-label text-on-surface-muted">Tech</dt><dd className="text-body-strong">Dayo Okafor</dd>
                <dt className="text-label text-on-surface-muted">Window</dt><dd className="text-data">8:15–10:00 am</dd>
                <dt className="text-label text-on-surface-muted">Phone</dt><dd className="text-data">(555) 014-7781</dd>
                <dt className="text-label text-on-surface-muted">Job type</dt><dd>No cooling</dd>
              </dl>
            </PanelContent>
            <PanelFooter>
              <Button variant="secondary"><PhoneIcon aria-hidden /> Call customer</Button>
              <Button>Reassign</Button>
            </PanelFooter>
          </Panel>

          <Section id="overlays" title="Menu and dialog" note="Floating layers lift on a shadow, with no outline or dividers. Open them to review: Esc closes, and focus returns to the button.">
            <Row label="Menu (row actions)">
              <RowMenu job={JOBS[2]} />
              <span className="text-data text-on-surface-muted">Actions for JOB-20417</span>
            </Row>
            <Row label="Dialog (assign)">
              <AssignDialog />
            </Row>
          </Section>
        </div>

        <Section id="messages" title="Inline message" note="Errors and notices that stay on screen until resolved, on a neutral well with the status color in the icon and title. Errors are announced at once.">
          <InlineMessage tone="error" title="Couldn't assign JOB-20420.">Dayo is already booked 1:00–3:00 pm. Pick another tech or change the window.</InlineMessage>
          <InlineMessage tone="warning" title="3 jobs are running late.">Customers get an updated arrival time by text.</InlineMessage>
          <InlineMessage tone="success" title="All morning jobs are done.">Nice work. 6 of 6 closed before noon.</InlineMessage>
          <InlineMessage tone="info" title="Board refreshed at 9:42 am." />
        </Section>
      </div>
    </TooltipProvider>
  )
}
