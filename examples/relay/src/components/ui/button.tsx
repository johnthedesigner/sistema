"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { focusRing } from "./styles"

/*
 * Changed from shadcn base-nova (DECISIONS.md, Scaffold the core components):
 * rounded-lg -> rounded-md (controls are radius-md); opacity hovers -> role
 * tokens (primary-hover, surface-hover, error-container); text-sm/font-medium
 * -> the label role; ring/50 focus -> shared focusRing; sizes trimmed to
 * control height (28px) and small (24px, the target-size minimum); busy state
 * keeps focus (aria-busy + aria-disabled) instead of disabling.
 */
const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1-5 rounded-md border border-transparent text-label whitespace-nowrap select-none transition-colors motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    focusRing
  ),
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary shadow-control hover:bg-primary-hover",
        secondary:
          "border-border-strong bg-surface-raised text-on-surface hover:bg-surface-hover aria-expanded:bg-surface-hover",
        ghost: "text-link hover:bg-surface-hover aria-expanded:bg-surface-hover",
        destructive:
          "border-error bg-surface-raised text-error hover:bg-error-container hover:text-on-error-container",
      },
      size: {
        default: "h-control-height px-3",
        sm: "h-6 px-2",
        icon: "size-control-height",
        "icon-sm": "size-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** The action is running: keeps focus, announces busy, ignores presses. */
    busy?: boolean
  }

function Button({
  className,
  variant = "primary",
  size = "default",
  busy = false,
  onClick,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      aria-busy={busy || undefined}
      aria-disabled={busy || undefined}
      onClick={(event) => {
        if (busy) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      {...props}
    >
      {busy && <Loader2Icon aria-hidden className="animate-spin motion-reduce:animate-none" />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants, type ButtonProps }
