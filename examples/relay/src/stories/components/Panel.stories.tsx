import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PhoneIcon } from "lucide-react"
import { Button, Panel, PanelContent, PanelDescription, PanelFooter, PanelHeader, PanelOverline, PanelTitle, StatusChip } from "@/components/ui"

const meta = {
  title: "Components/Panel",
  component: Panel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A group on the page, lifted by the raised shadow (in dark, also one step lighter). **When to use:** the job detail pane, forms, filter groups, the jobs table. **When not to:** the one thing a screen leads with (that is the featured surface, a known gap) or a floating layer. No outline, no footer divider.",
      },
    },
  },
  render: () => (
    <Panel aria-labelledby="p-title" className="max-w-md">
      <PanelHeader>
        <div>
          <PanelOverline>Job detail</PanelOverline>
          <PanelTitle id="p-title">JOB-20417 · Pine St. Laundry</PanelTitle>
          <PanelDescription>Water heater, no hot water</PanelDescription>
        </div>
        <StatusChip status="running-late" detail="25 min" />
      </PanelHeader>
      <PanelContent>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt className="text-label text-on-surface-muted">Tech</dt><dd className="text-body-strong">Dayo Okafor</dd>
          <dt className="text-label text-on-surface-muted">Window</dt><dd className="text-data">8–10 am</dd>
          <dt className="text-label text-on-surface-muted">Phone</dt><dd className="text-data">(555) 014-7781</dd>
        </dl>
      </PanelContent>
      <PanelFooter>
        <Button variant="secondary"><PhoneIcon aria-hidden /> Call customer</Button>
        <Button>Reassign tech</Button>
      </PanelFooter>
    </Panel>
  ),
} satisfies Meta<typeof Panel>
export default meta
type Story = StoryObj<typeof meta>

export const JobDetail: Story = {}
