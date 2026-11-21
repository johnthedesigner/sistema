import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Checkbox, Label } from "@/components/ui"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**When to use:** selecting rows and turning filters on or off; supports the partly-selected state for \"select all\". **When not to:** an immediate setting change (use a switch, not built yet) or one choice from several (use Select). Checked is the accent; the box keeps a 24px target.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="cb" {...args} />
      <Label htmlFor="cb">Running late only</Label>
    </div>
  ),
} satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const SomeSelected: Story = { args: { indeterminate: true } }
export const Disabled: Story = { args: { disabled: true } }
export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } }
