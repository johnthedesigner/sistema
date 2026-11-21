"use client"

import * as React from "react"
import { MoreHorizontalIcon } from "lucide-react"
import {
  Button,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Label,
  type JobStatus,
} from "@/components/ui"

export const TECHS = ["R. Alvarez", "D. Okafor", "K. Byrne", "S. Whitfield", "L. Park", "M. Chen"]

export type Job = {
  id: string
  customer: string
  address: string
  type: string
  tech: string | null
  window: string
  status: JobStatus
  detail?: string
}

export const JOBS: Job[] = [
  { id: "JOB-20431", customer: "Hartley residence", address: "14 Alder Ln", type: "No heat", tech: null, window: "10 am–12 pm", status: "unassigned" },
  { id: "JOB-20417", customer: "Pine St. Laundry", address: "220 Pine St", type: "Water heater", tech: "D. Okafor", window: "8–10 am", status: "running-late", detail: "25 min" },
  { id: "JOB-20422", customer: "Brightwater Dental", address: "9 Harbor Rd", type: "AC service", tech: "K. Byrne", window: "9–11 am", status: "on-site" },
  { id: "JOB-20425", customer: "Lindqvist residence", address: "61 Ridge Ave", type: "Leak", tech: "M. Chen", window: "11 am–1 pm", status: "en-route" },
  { id: "JOB-20409", customer: "Cedar Court Apts", address: "300 Cedar Ct", type: "Boiler", tech: "S. Whitfield", window: "8–10 am", status: "parts-hold", detail: "valve" },
  { id: "JOB-20428", customer: "Hollis Bakery", address: "5 Mill St", type: "Drain", tech: "R. Alvarez", window: "1–3 pm", status: "assigned" },
  { id: "JOB-20436", customer: "T. Osei", address: "48 Birch Way", type: "Thermostat", tech: null, window: "2–4 pm", status: "unassigned" },
  { id: "JOB-20401", customer: "Ruiz residence", address: "12 Elm St", type: "Thermostat", tech: "K. Byrne", window: "7–9 am", status: "done" },
]

/** Row actions for a job (DropdownMenu). Destructive item last. */
export function JobMenu({ job, onOpen }: { job: Job; onOpen?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${job.id}`} />}>
        <MoreHorizontalIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{job.id}</DropdownMenuLabel>
          <DropdownMenuItem onClick={onOpen}>Open job</DropdownMenuItem>
          <DropdownMenuItem>{job.tech ? "Reassign tech" : "Assign tech"}</DropdownMenuItem>
          <DropdownMenuItem>Call customer</DropdownMenuItem>
          <DropdownMenuItem>Change window</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Cancel job</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Tech picker (Combobox with a label). */
export function TechPicker({ label = "Tech", defaultValue }: { label?: string; defaultValue?: string }) {
  const id = React.useId()
  return (
    <div className="flex w-full flex-col gap-field-gap">
      <Label htmlFor={id}>{label}</Label>
      <Combobox items={TECHS} defaultValue={defaultValue}>
        <ComboboxInput id={id} placeholder="Search techs" showClear />
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
    </div>
  )
}
