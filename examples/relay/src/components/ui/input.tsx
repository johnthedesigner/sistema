import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"
import { controlFrame, focusRing, invalidEdge } from "./styles"

/* Changed from shadcn: radius-md, surface-raised fill, border-strong edge
 * (--input), body role, shared focus ring, thicker error edge, no opacity fills. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        controlFrame,
        focusRing,
        invalidEdge,
        "h-control-height w-full min-w-0 px-2 placeholder:text-on-surface-muted",
        className
      )}
      {...props}
    />
  )
}

export { Input }
