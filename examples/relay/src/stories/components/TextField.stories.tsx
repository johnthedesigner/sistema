import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Input, Textarea, TextField } from "@/components/ui"

const meta = {
  title: "Components/Text field",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`TextField` wires a label, an optional hint or error, and an `Input` or `Textarea`. **When to use:** any typed value (customer name, phone, notes). **When not to:** choosing from a fixed list (use Select) or searching a long list (use Combobox). An error gives the field the error edge and a message; never color alone.",
      },
    },
  },
  args: { label: "Customer name", children: <Input placeholder="Search or add" /> },
} satisfies Meta<typeof TextField>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithHint: Story = { args: { label: "Phone", hint: "We text arrival updates here.", children: <Input defaultValue="(555) 014-2290" className="tabular-nums" /> } }
export const Invalid: Story = { args: { label: "Address", error: "Add a street number.", children: <Input defaultValue="Elm Court" /> } }
export const Disabled: Story = { args: { label: "Gate code", children: <Input defaultValue="4471" disabled /> } }
export const Multiline: Story = { args: { label: "Notes for the tech", hint: "Shown on the tech's phone.", children: <Textarea defaultValue="Side door. Dog in the yard, friendly." /> } }
