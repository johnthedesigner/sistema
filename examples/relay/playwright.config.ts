import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "tests",
  workers: 2,
  reporter: "list",
  use: { baseURL: "http://localhost:3100" },
  webServer: {
    command: "npx next start -p 3100",
    url: "http://localhost:3100/sistema-review/components",
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
