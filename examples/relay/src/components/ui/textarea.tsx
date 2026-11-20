import * as React from "react"
import { cn } from "@/lib/utils"
import { controlFrame, focusRing, invalidEdge } from "./styles"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        controlFrame,
        focusRing,
        invalidEdge,
        "flex field-sizing-content min-h-16 w-full px-2 py-1-5 placeholder:text-on-surface-muted",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
