import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const URL = "/sistema-review/components"

async function scan(page: Page, what: string, disableRules: string[] = []) {
  // Let open/close animations finish, so axe reads final colors, not a mid-fade.
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"))
  const results = await new AxeBuilder({ page }).disableRules(disableRules).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze()
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.length} (${v.nodes.map((n) => n.target.join(" ") + " " + n.html.slice(0, 160) + " :: " + n.failureSummary?.replace(/\s+/g, " ").slice(0, 200)).slice(0, 3).join(" | ")})`)
  expect(summary, `axe violations, ${what}`).toEqual([])
}

const THEMES = [
  { name: "light", query: "light", scheme: "light" as const },
  { name: "dark", query: "dark", scheme: "dark" as const },
  { name: "system (dark preference)", query: "system", scheme: "dark" as const },
]

for (const theme of THEMES) {
  test.describe(`theme: ${theme.name}`, () => {
    test.use({ colorScheme: theme.scheme })

    test("page, then each overlay open, has no axe violations", async ({ page }) => {
      await page.goto(`${URL}?theme=${theme.query}`)
      await expect(page.getByRole("heading", { name: "Relay core components" })).toBeVisible()
      await page.waitForTimeout(200)
      await scan(page, "page")

      await page.getByRole("button", { name: "Actions for JOB-20417" }).first().click()
      await expect(page.getByRole("menu")).toBeVisible()
      await scan(page, "menu open")
      await page.keyboard.press("Escape")
      await expect(page.getByRole("menu")).toBeHidden()

      await page.getByRole("combobox", { name: "Job type", exact: true }).click()
      await expect(page.getByRole("listbox")).toBeVisible()
      await scan(page, "select open")
      await page.keyboard.press("Escape")
      await expect(page.getByRole("listbox")).toBeHidden()

      await page.getByRole("combobox", { name: "Tech", exact: true }).click()
      await page.keyboard.press("ArrowDown")
      await expect(page.getByRole("listbox")).toBeVisible()
      // Base UI hides the rest of the page from screen readers (aria-hidden) while
      // a combobox list is open, as the ARIA combobox pattern intends; the page
      // stays focusable, so axe reports aria-hidden-focus. Tabbing out closes the
      // list and removes aria-hidden (asserted below), so that one rule is
      // excluded for this state only. Everything else is still checked.
      await scan(page, "combobox open", ["aria-hidden-focus"])
      await page.keyboard.press("Tab")
      await expect(page.getByRole("listbox")).toBeHidden()
      await expect(page.locator("main [aria-hidden=true]:has(button)")).toHaveCount(0)
      await scan(page, "after tabbing out of the combobox")

      const dialogTrigger = page.getByRole("region", { name: "Menu and dialog" }).getByRole("button", { name: "Assign job" })
      await dialogTrigger.click()
      await expect(page.getByRole("dialog")).toBeVisible()
      await scan(page, "dialog open")
      await page.keyboard.press("Escape")
      await expect(page.getByRole("dialog")).toBeHidden()
      await expect(dialogTrigger).toBeFocused()

      await page.getByRole("button", { name: "Refresh board" }).hover()
      // Base UI tooltips are visual only (no role=tooltip); the trigger is named by aria-label.
      await expect(page.locator("[data-slot=tooltip-content]")).toBeVisible()
      await scan(page, "tooltip open")
    })
  })
}

test("keyboard: focus rings render (screenshots)", async ({ page }) => {
  for (const theme of ["light", "dark"] as const) {
    await page.goto(`${URL}?theme=${theme}`)
    await page.getByRole("button", { name: "Assign job" }).first().focus()
    await page.keyboard.press("Tab")
    await page.keyboard.press("Shift+Tab")
    const outline = await page.evaluate(() => {
      const s = getComputedStyle(document.activeElement as Element)
      return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`
    })
    expect(outline.startsWith("solid 2px")).toBe(true)
    await page.getByRole("region", { name: "Button" }).screenshot({ path: `sistema-review/screenshots/focus-button-${theme}.png` })

    await page.getByLabel("Customer name").focus()
    await page.keyboard.press("Shift+Tab")
    await page.keyboard.press("Tab")
    await page.getByRole("region", { name: "Text field" }).screenshot({ path: `sistema-review/screenshots/focus-field-${theme}.png` })

    await page.getByRole("button", { name: "Actions for JOB-20417" }).first().focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("ArrowDown")
    await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"))
    await page.screenshot({ path: `sistema-review/screenshots/focus-menu-${theme}.png` })
    await page.keyboard.press("Escape")
  }
})

test("busy button keeps focus and ignores repeat presses", async ({ page }) => {
  await page.goto(`${URL}?theme=light`)
  const save = page.getByRole("button", { name: "Save job" })
  await save.focus()
  await page.keyboard.press("Enter")
  const busy = page.getByRole("button", { name: "Saving" })
  await expect(busy).toHaveAttribute("aria-busy", "true")
  await expect(busy).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(busy).toBeFocused()
})

test("pointer targets are at least 24px", async ({ page }) => {
  await page.goto(`${URL}?theme=light`)
  const small = await page.evaluate(() => {
    const out: string[] = []
    document.querySelectorAll("button, [role=checkbox], [role=combobox], a, input:not([aria-hidden=true]):not([type=hidden]), textarea").forEach((el) => {
      if (el.closest("[aria-hidden=true]") || (el as HTMLElement).tabIndex < 0 && el.tagName === "INPUT") return
      const r = el.getBoundingClientRect()
      const after = getComputedStyle(el, "::after")
      const extra = after.position === "absolute" ? 8 : 0
      if (r.width + extra < 24 || r.height + extra < 24) {
        // inline text links inside table cells are exempt (inline in a sentence/row of text)
        if (el.tagName === "BUTTON" && el.closest("td") && el.textContent?.startsWith("JOB-")) return
        out.push(`${el.tagName} ${el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 20)} ${Math.round(r.width)}x${Math.round(r.height)}`)
      }
    })
    return out
  })
  expect(small).toEqual([])
})
