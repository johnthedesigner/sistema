#!/usr/bin/env node
// Starts ngrok, waits for the public URL, then starts `next dev` with
// NEXT_PUBLIC_SITE_URL set so copied play prompts use the tunnel URL.
//
// Usage: npm run dev:tunnel
// Requires ngrok to be installed and authed (https://dashboard.ngrok.com/get-started/setup)

import { spawn } from 'child_process'

async function getNgrokUrl(retries = 20, delayMs = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://127.0.0.1:4040/api/tunnels')
      const { tunnels } = await res.json()
      const https = tunnels?.find(t => t.proto === 'https')
      if (https?.public_url) return https.public_url
    } catch {}
    await new Promise(r => setTimeout(r, delayMs))
  }
  throw new Error('Timed out waiting for ngrok tunnel (is ngrok installed and authed?)')
}

const ngrok = spawn('ngrok', ['http', '3000'], { stdio: 'ignore' })

ngrok.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.error('ngrok not found — install it from https://ngrok.com/download')
  } else {
    console.error('Failed to start ngrok:', err.message)
  }
  process.exit(1)
})

console.log('Waiting for ngrok tunnel...')
let url
try {
  url = await getNgrokUrl()
} catch (err) {
  console.error(err.message)
  ngrok.kill()
  process.exit(1)
}

console.log(`\nTunnel ready: ${url}`)
console.log(`NEXT_PUBLIC_SITE_URL=${url}\n`)

const next = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: url },
})

next.on('exit', (code) => {
  ngrok.kill()
  process.exit(code ?? 0)
})

process.on('SIGINT', () => {
  ngrok.kill()
  next.kill()
})
