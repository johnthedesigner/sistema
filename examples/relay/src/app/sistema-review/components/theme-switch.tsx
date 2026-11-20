"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { focusRing } from "@/components/ui"

type Theme = "light" | "dark" | "system"

/** Review-only theme switch: sets data-theme on <html> (system = no attribute). */
export function ThemeSwitch() {
  const [theme, setTheme] = React.useState<Theme>("system")

  React.useEffect(() => {
    const root = document.documentElement
    if (theme === "system") root.removeAttribute("data-theme")
    else root.setAttribute("data-theme", theme)
  }, [theme])

  React.useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("theme")
    if (t === "light" || t === "dark" || t === "system") setTheme(t)
  }, [])

  return (
    <div role="group" aria-label="Theme" className="flex items-center gap-1">
      <span className="mr-1 text-label text-on-surface-muted">Theme</span>
      {(["light", "dark", "system"] as const).map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          onClick={() => setTheme(t)}
          className={cn(
            "h-6 cursor-pointer rounded-md border border-border-strong bg-surface-raised px-2 text-label text-on-surface capitalize hover:bg-surface-hover aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-on-primary",
            focusRing
          )}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
