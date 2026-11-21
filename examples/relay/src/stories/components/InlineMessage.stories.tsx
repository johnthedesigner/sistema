import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { InlineMessage } from "@/components/ui"

const meta = {
  title: "Components/Inline message",
  component: InlineMessage,
  tags: ["autodocs"],
  args: { tone: "error", title: "Couldn't assign JOB-20420.", children: "Dayo is already booked 1:00–3:00 pm. Pick another tech or change the window." },
  argTypes: { tone: { control: "inline-radio", options: ["error", "warning", "success", "info"] } },
  parameters: {
    docs: {
      description: {
        component:
          "A neutral well with the status color in the icon and title only (status as detail). **When to use:** errors and notices that must stay on screen until resolved; errors are announced at once (role alert). **When not to:** confirmations that can time out (toast, not built yet), or field errors (the field's own message).",
      },
    },
  },
} satisfies Meta<typeof InlineMessage>
export default meta
type Story = StoryObj<typeof meta>

export const ErrorTone: Story = { name: "Error" }
export const WarningTone: Story = { name: "Warning", args: { tone: "warning", title: "3 jobs are running late.", children: "Customers get an updated arrival time by text." } }
export const SuccessTone: Story = { name: "Success", args: { tone: "success", title: "All morning jobs are done.", children: "Nice work. 6 of 6 closed before noon." } }
export const InfoTone: Story = { name: "Info", args: { tone: "info", title: "Board refreshed at 9:42 am.", children: undefined } }
