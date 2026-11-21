"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeftIcon, MoreHorizontalIcon, PhoneIcon } from "lucide-react"
import {
  Button,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  InlineMessage,
  Label,
  Panel,
  PanelContent,
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
  Textarea,
  TextField,
  TooltipProvider,
} from "@/components/ui"
import { TechPicker } from "../_shared/parts"

const WINDOWS = ["8–10 am", "10 am–12 pm", "12–2 pm", "2–4 pm"]

function ReassignDialog() {
  const windowId = React.useId()
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Reassign tech</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign JOB-20417</DialogTitle>
          <DialogDescription>Pine St. Laundry · Water heater · now with D. Okafor</DialogDescription>
        </DialogHeader>
        <TechPicker label="New tech" defaultValue="K. Byrne" />
        <div className="flex flex-col gap-field-gap">
          <Label id={windowId}>Window</Label>
          <Select items={WINDOWS.map((w) => ({ label: w, value: w }))} defaultValue="8–10 am">
            <SelectTrigger aria-labelledby={windowId} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WINDOWS.map((w) => (
                <SelectItem key={w} value={w}>{w}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-data text-on-surface-muted">The customer gets a text with the new tech and arrival time.</p>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Keep D. Okafor</DialogClose>
          <DialogClose render={<Button />}>Reassign tech</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CancelDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel job JOB-20417</DialogTitle>
          <DialogDescription>
            The customer&rsquo;s 8–10 am visit will be removed from D. Okafor&rsquo;s route. This can&rsquo;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Keep job</DialogClose>
          <DialogClose render={<Button variant="destructive" />}>Cancel job</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ACTIVITY = [
  { time: "9:47 am", text: "D. Okafor reported 25 min behind: previous job ran long." },
  { time: "9:05 am", text: "Arrival text sent to customer: “Your tech arrives 8–10 am.”" },
  { time: "8:31 am", text: "Assigned to D. Okafor by Dana W." },
  { time: "8:12 am", text: "Job created from call: no hot water in the wash room." },
]

export function JobDetail() {
  const [cancelOpen, setCancelOpen] = React.useState(false)
  return (
    <TooltipProvider>
      <header className="flex flex-col gap-stack-gap">
        <Link
          href="/sistema-review/pages/board"
          className="flex w-fit items-center gap-1 text-label text-link underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-border-focus"
        >
          <ArrowLeftIcon aria-hidden className="size-4" /> Today&rsquo;s board
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-component-gap">
          <div className="flex flex-col gap-0-5">
            <p className="text-data text-on-surface-muted">JOB-20417 · Water heater</p>
            <h1 className="text-title">Pine St. Laundry</h1>
          </div>
          <div className="flex flex-wrap items-center gap-component-gap">
            <Button variant="secondary"><PhoneIcon aria-hidden /> Call customer</Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="secondary" size="icon" aria-label="More actions for JOB-20417" />}>
                <MoreHorizontalIcon aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Change window</DropdownMenuItem>
                  <DropdownMenuItem>Put on parts hold</DropdownMenuItem>
                  <DropdownMenuItem>Print work order</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setCancelOpen(true)}>Cancel job</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Gap (featured surface): composed from role tokens; see the board. */}
      <section aria-labelledby="status-now" className="flex flex-col gap-stack-gap rounded-xl bg-surface-featured p-panel-padding shadow-featured">
        <div className="flex flex-wrap items-start justify-between gap-component-gap">
          <div className="flex flex-col gap-0-5">
            <p className="text-overline text-on-surface-muted">Status and next step</p>
            <h2 id="status-now" className="text-heading">D. Okafor is 25 min behind</h2>
          </div>
          <StatusChip status="running-late" detail="25 min" />
        </div>
        <p className="text-body">
          New arrival about 10:25 am, after the 8–10 am window. K. Byrne is free nearby from 9:55 am. Reassign the job or notify the customer.
        </p>
        <div className="flex flex-wrap gap-component-gap">
          <ReassignDialog />
          <Button variant="secondary">Notify customer</Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-section-gap lg:grid-cols-[2fr_1fr]">
        <div className="flex min-w-0 flex-col gap-section-gap">
          <Panel aria-labelledby="visit">
            <PanelHeader>
              <div>
                <PanelOverline>Visit</PanelOverline>
                <PanelTitle id="visit">Water heater, no hot water</PanelTitle>
              </div>
            </PanelHeader>
            <PanelContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-label text-on-surface-muted">Tech</dt><dd className="text-body-strong">Dayo Okafor</dd>
                <dt className="text-label text-on-surface-muted">Window</dt><dd className="text-data">8–10 am, arriving about 10:25 am</dd>
                <dt className="text-label text-on-surface-muted">Equipment</dt><dd className="text-body">Rheem 75 gal gas, installed 2016</dd>
                <dt className="text-label text-on-surface-muted">Parts on van</dt><dd className="text-body">Thermocouple, gas valve</dd>
              </dl>
            </PanelContent>
          </Panel>

          <Panel aria-labelledby="notes">
            <PanelHeader>
              <PanelTitle id="notes">Notes for the tech</PanelTitle>
            </PanelHeader>
            <PanelContent>
              <TextField label="Shown on the tech's phone" hint="The tech sees changes when they next open the job.">
                <Textarea defaultValue="Use the back door on Alder Lane. Water heater is in the wash room behind machine 6. Ask for Priya." />
              </TextField>
            </PanelContent>
            <PanelFooter>
              <Button variant="secondary">Save notes</Button>
            </PanelFooter>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-section-gap">
          <Panel aria-labelledby="customer">
            <PanelHeader>
              <PanelTitle id="customer">Customer</PanelTitle>
            </PanelHeader>
            <PanelContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-label text-on-surface-muted">Name</dt><dd className="text-body">Pine St. Laundry (Priya Shah)</dd>
                <dt className="text-label text-on-surface-muted">Address</dt><dd className="text-body">220 Pine St</dd>
                <dt className="text-label text-on-surface-muted">Phone</dt><dd className="text-data">(555) 014-7781</dd>
                <dt className="text-label text-on-surface-muted">Jobs</dt><dd className="text-data">4 this year</dd>
              </dl>
            </PanelContent>
          </Panel>

          <InlineMessage tone="info" title="Customer prefers texts.">Calls go to the front desk until 9 am.</InlineMessage>

          {/* Activity history: a subtle zone (emphasis map), no shadow. */}
          <section aria-labelledby="activity" className="flex flex-col gap-stack-gap rounded-lg bg-surface-subtle p-panel-padding">
            <h2 id="activity" className="text-heading">Activity</h2>
            <ol className="flex flex-col gap-stack-gap">
              {ACTIVITY.map((a) => (
                <li key={a.time} className="grid grid-cols-[auto_1fr] gap-x-3">
                  <span className="text-data text-on-surface-muted">{a.time}</span>
                  <span className="text-body">{a.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
      <CancelDialog open={cancelOpen} onOpenChange={setCancelOpen} />
    </TooltipProvider>
  )
}
