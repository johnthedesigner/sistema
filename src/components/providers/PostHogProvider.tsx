'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { analyticsEnabled, DEPLOY_ENV, getVisitId } from '@/lib/analytics/browser'
import { isInternalId } from '@/lib/analytics/ids'

function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!posthog.__loaded) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    posthog.capture('$pageview', { $current_url: window.origin + url })
  }, [pathname, searchParams])

  return null
}

let started = false

/**
 * Start PostHog once, before any child effect runs, so the first page view is
 * recorded by PageViewTracker like every later one.
 */
function start() {
  if (started || typeof window === 'undefined' || !analyticsEnabled()) return
  started = true
  const id = getVisitId()
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
    persistence: 'memory',
    person_profiles: 'never',
    bootstrap: { distinctID: id },
    autocapture: false,
    capture_pageview: false, // PageViewTracker sends these, for App Router navigation
    capture_pageleave: true,
    disable_session_recording: true,
    disable_surveys: true,
    advanced_disable_flags: true, // Sistema uses no feature flags
    debug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === '1',
  })
  posthog.register({ c: id, env: DEPLOY_ENV, internal: isInternalId(id), source: 'browser' })
}

/**
 * Usage analytics with nothing stored on the device (docs/v2/analytics.md):
 * memory-only persistence, no person profiles, and one visit ID that copied
 * prompts carry to the agent.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  start()
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  )
}
