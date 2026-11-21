import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PhoneIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui"

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Assign job" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost", "destructive"] },
    size: { control: "inline-radio", options: ["default", "sm", "icon", "icon-sm"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "**When to use:** primary for the one main action on a screen or dialog (it carries the accent and a slight lift); secondary for other actions; ghost for low-emphasis and icon-only actions; destructive for cancel and remove. **When not to:** don't put two primary buttons side by side, and don't use a button to navigate to another page (use a link). Busy keeps focus and ignores repeat presses while an action runs.",
      },
    },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: "primary" } }
export const Secondary: Story = { args: { variant: "secondary", children: "Call customer" } }
export const Ghost: Story = { args: { variant: "ghost", children: "View history" } }
export const Destructive: Story = { args: { variant: "destructive", children: "Cancel job" } }
export const Small: Story = { args: { size: "sm", children: "Assign" } }
export const WithIcon: Story = { args: { variant: "secondary", children: <><PhoneIcon aria-hidden /> Call</> } }
export const IconOnly: Story = { args: { variant: "ghost", size: "icon", "aria-label": "Refresh board", children: <RefreshCwIcon aria-hidden /> } }
export const Disabled: Story = { args: { disabled: true } }
export const Busy: Story = { args: { busy: true, children: "Saving job" } }
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-component-gap">
      <Button>Assign job</Button>
      <Button variant="secondary">Call customer</Button>
      <Button variant="ghost">View history</Button>
      <Button variant="destructive">Cancel job</Button>
    </div>
  ),
}
