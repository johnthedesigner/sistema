import type { Metadata } from "next"
import { PageFrame } from "../_shared/frame"
import { Board } from "./board"

export const metadata: Metadata = { title: "Relay — Today's board (page example)" }

export default function BoardPage() {
  return (
    <PageFrame current="Board">
      <Board />
    </PageFrame>
  )
}
