import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const play = req.nextUrl.searchParams.get('play')
  const sid = req.nextUrl.searchParams.get('sid')

  if (play && sid) {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'
    const ua = req.headers.get('user-agent') ?? 'unknown'

    if (key) {
      await fetch(`${host}/capture/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: key,
          event: 'prompt_run',
          distinct_id: sid,
          properties: { play, sid, ua, $current_url: req.url },
        }),
      }).catch(() => {})
    }
  }

  return new NextResponse(null, { status: 204 })
}
