import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

/**
 * Label + control + hint or error message. Wires ids so the control is named by
 * the label and described by the hint/error, and marks it invalid when there
 * is an error. The control must accept id, aria-describedby, aria-invalid.
 */
function TextField({
  label,
  hint,
  error,
  id: idProp,
  className,
  children,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  id?: string
  className?: string
  children: React.ReactElement<{
    id?: string
    "aria-describedby"?: string
    "aria-invalid"?: boolean
  }>
}) {
  const generated = React.useId()
  const id = idProp ?? generated
  const messageId = `${id}-message`
  const message = error ?? hint
  return (
    <div data-slot="field" className={cn("flex flex-col gap-field-gap", className)}>
      <Label htmlFor={id}>{label}</Label>
      {React.cloneElement(children, {
        id,
        "aria-describedby": message ? messageId : undefined,
        "aria-invalid": error ? true : undefined,
      })}
      {message && (
        <p
          id={messageId}
          className={cn("text-data", error ? "text-error" : "text-on-surface-muted")}
        >
          {message}
        </p>
      )}
    </div>
  )
}

export { TextField }
