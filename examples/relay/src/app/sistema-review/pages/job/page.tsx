import type { Metadata } from "next"
import { PageFrame } from "../_shared/frame"
import { JobDetail } from "./job"

export const metadata: Metadata = { title: "Relay — Job detail (page example)" }

export default function JobPage() {
  return (
    <PageFrame current="Job">
      <JobDetail />
    </PageFrame>
  )
}
