import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { JOB_STATUSES, StatusChip, type JobStatus } from "@/components/ui"

const meta = {
  title: "Components/Status chip",
  component: StatusChip,
  tags: ["autodocs"],
  args: { status: "running-late" },
  argTypes: { status: { control: "select", options: Object.keys(JOB_STATUSES) } },
  parameters: {
    docs: {
      description: {
        component:
          "Every job status, as a dot plus a word. **When to use:** wherever a job's status shows: table rows, the featured job, the job header. **When not to:** for anything that isn't a job status, or as a button. Chips are the one place status takes a tinted fill; Unassigned has none. On site and Done share a color and differ by word.",
      },
    },
  },
} satisfies Meta<typeof StatusChip>
export default meta
type Story = StoryObj<typeof meta>

export const RunningLate: Story = { args: { status: "running-late", detail: "25 min" } }
export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-component-gap">
      {(Object.keys(JOB_STATUSES) as JobStatus[]).map((s) => (
        <StatusChip key={s} status={s} />
      ))}
    </div>
  ),
}
