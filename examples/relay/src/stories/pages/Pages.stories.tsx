import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PageFrame } from "@/app/sistema-review/pages/_shared/frame"
import { Board } from "@/app/sistema-review/pages/board/board"
import { JobDetail } from "@/app/sistema-review/pages/job/job"

// The page examples render their own components here (they don't depend on the
// app's routing). The frame's own theme switch is off; the toolbar sets the theme.
const meta = {
  title: "Pages/Page examples",
  parameters: { layout: "fullscreen" },
  tags: ["!autodocs"],
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const TodaysBoard: Story = {
  name: "Today's board",
  render: () => <PageFrame current="Board" themeSwitch={false}><Board /></PageFrame>,
}
export const JobDetailPage: Story = {
  name: "Job detail",
  render: () => <PageFrame current="Job" themeSwitch={false}><JobDetail /></PageFrame>,
}
