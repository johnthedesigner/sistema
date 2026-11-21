import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ColorRoles, Ramps, Shapes, Spacing, TypeRoles } from "./TokenReference"

const meta = {
  title: "Foundations/Token stories",
  parameters: { layout: "padded" },
  tags: ["!autodocs"],
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Colors: Story = { render: () => <ColorRoles /> }
export const ColorRamps: Story = { render: () => <Ramps /> }
export const Type: Story = { render: () => <TypeRoles /> }
export const RadiusAndShadow: Story = { render: () => <Shapes /> }
export const SpacingSteps: Story = { render: () => <Spacing /> }
