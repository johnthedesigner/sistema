"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { focusRing, invalidEdge } from "./styles"

/*
 * Changed from shadcn: radius-sm (checkboxes), border-strong edge, shared focus
 * ring, no opacity fills. The 16px box keeps its 24px+ hit area through the
 * after: pseudo-element (target size).
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-input bg-surface-raised transition-colors motion-reduce:transition-none after:absolute after:-inset-1 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary data-checked:bg-primary data-checked:text-on-primary data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-on-primary",
        focusRing,
        invalidEdge,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current [&>svg]:size-3"
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            {state.indeterminate ? <MinusIcon /> : <CheckIcon />}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
