import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"

const TYPES = ["No heat", "No cooling", "Leak", "Water heater", "Maintenance"]

function JobTypeSelect({ invalid = false, disabled = false, defaultOpen = false, label = "Job type" }: { invalid?: boolean; disabled?: boolean; defaultOpen?: boolean; label?: string }) {
  const id = React.useId()
  return (
    <div className="flex w-48 flex-col gap-field-gap">
      <Label id={`${id}-label`}>{label}</Label>
      <Select items={TYPES.map((t) => ({ label: t, value: t }))} disabled={disabled} defaultOpen={defaultOpen}>
        <SelectTrigger className="w-full" aria-labelledby={`${id}-label`} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-err` : undefined}>
          <SelectValue placeholder="Choose a type" />
        </SelectTrigger>
        <SelectContent>
          {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
      {invalid && <p id={`${id}-err`} className="text-data text-error">Choose a job type.</p>}
    </div>
  )
}

const meta = {
  title: "Components/Select",
  component: JobTypeSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**When to use:** choosing one value from a short fixed list (job type, a status filter). **When not to:** more than about ten options or anything people search for (use Combobox). The list is a floating layer; the highlighted item has a neutral highlight and an inset focus ring.",
      },
    },
  },
} satisfies Meta<typeof JobTypeSelect>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Invalid: Story = { args: { invalid: true, label: "Job type (invalid)" } }
export const Disabled: Story = { args: { disabled: true, label: "Job type (disabled)" } }
export const Open: Story = { args: { defaultOpen: true }, tags: ["!autodocs"], parameters: { layout: "centered" } }
