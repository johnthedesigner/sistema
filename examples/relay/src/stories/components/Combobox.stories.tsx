import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, Label } from "@/components/ui"

const TECHS = ["Rosa Alvarez", "Dayo Okafor", "Kim Byrne", "Sam Whitfield", "Lena Park"]

function TechPicker({ invalid = false, disabled = false, defaultOpen = false, label = "Tech" }: { invalid?: boolean; disabled?: boolean; defaultOpen?: boolean; label?: string }) {
  const id = React.useId()
  return (
    <div className="flex w-64 flex-col gap-field-gap">
      <Label htmlFor={id}>{label}</Label>
      <Combobox items={TECHS} defaultOpen={defaultOpen}>
        <ComboboxInput id={id} placeholder="Search techs" showClear disabled={disabled} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-err` : undefined} />
        <ComboboxContent>
          <ComboboxEmpty>No tech by that name.</ComboboxEmpty>
          <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
        </ComboboxContent>
      </Combobox>
      {invalid && <p id={`${id}-err`} className="text-data text-error">Pick a tech before you assign.</p>}
    </div>
  )
}

const meta = {
  title: "Components/Combobox",
  component: TechPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**When to use:** searching a longer list and picking one, such as assigning a tech. **When not to:** a short fixed list (use Select) or free text (use a text field).",
      },
    },
  },
} satisfies Meta<typeof TechPicker>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Invalid: Story = { args: { invalid: true, label: "Tech (invalid)" } }
export const Disabled: Story = { args: { disabled: true, label: "Tech (disabled)" } }
export const Open: Story = { args: { defaultOpen: true }, tags: ["!autodocs"] }
