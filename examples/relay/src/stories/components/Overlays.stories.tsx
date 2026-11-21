import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { MoreHorizontalIcon, RefreshCwIcon, UserPlusIcon } from "lucide-react"
import {
  Button,
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui"

function RowMenu({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Actions for JOB-20417" />}>
        <MoreHorizontalIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>JOB-20417</DropdownMenuLabel>
          <DropdownMenuItem>Open job <DropdownMenuShortcut>O</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem>Reassign <DropdownMenuShortcut>R</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem>Call customer</DropdownMenuItem>
          <DropdownMenuItem disabled>Mark done</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Cancel job</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AssignDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger render={<Button />}><UserPlusIcon aria-hidden /> Assign job</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign JOB-20420</DialogTitle>
          <DialogDescription>T. Osei · Leak · 1:00–3:00 pm</DialogDescription>
        </DialogHeader>
        <p className="text-body">K. Byrne is free nearby from 12:40 pm.</p>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Keep unassigned</DialogClose>
          <DialogClose render={<Button />}>Assign K. Byrne</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function IconWithTooltip({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Refresh board" />}><RefreshCwIcon aria-hidden /></TooltipTrigger>
        <TooltipContent>Refresh board</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const meta = {
  title: "Components/Menu, dialog, tooltip",
  component: RowMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Floating layers: they lift on the overlay shadow, with no outline and no divider lines. **Menu:** row actions and short action lists; destructive items last, and a highlighted destructive item takes the error container (a recorded exception). Not for navigation. **Dialog:** confirming a consequential action (assign, reassign, cancel); focus is trapped and returns to the trigger. Not for information people need while working on the page. **Tooltip:** naming icon-only buttons. Never the only place information lives.",
      },
    },
  },
} satisfies Meta<typeof RowMenu>
export default meta
type Story = StoryObj<typeof meta>

export const Menu: Story = {}
export const MenuOpen: Story = { args: { defaultOpen: true }, tags: ["!autodocs"] }
export const DialogClosed: Story = { name: "Dialog", render: () => <AssignDialog /> }
export const DialogOpen: Story = { render: () => <AssignDialog defaultOpen />, tags: ["!autodocs"] }
export const TooltipStory: Story = { name: "Tooltip", render: () => <IconWithTooltip /> }
export const TooltipOpen: Story = { render: () => <IconWithTooltip defaultOpen />, tags: ["!autodocs"], parameters: { layout: "centered" } }
