import { useEffect, useRef, useState } from 'react'
import { CONTACT_TURNSTILE_SITE_KEY } from '../lib/submitEnquiry.js'

let scriptReady
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!scriptReady) {
    scriptReady = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      const timeout = setTimeout(() => fail(), 15000)
      function fail() {
        clearTimeout(timeout)
        script.remove()
        scriptReady = undefined
        reject(new Error('Security check could not load.'))
      }
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onerror = fail
      script.onload = () => {
        clearTimeout(timeout)
        if (window.turnstile) resolve(window.turnstile)
        else fail()
      }
      document.head.appendChild(script)
    })
  }
  return scriptReady
}

export default function ContactVerification({ onToken, resetKey }) {
  const host = useRef(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false
    let widget
    onToken('')
    setError('')
    loadTurnstile().then((api) => {
      if (cancelled) return
      const invalidate = (message) => {
        if (cancelled) return
        onToken('')
        setError(message)
      }
      widget = api.render(host.current, {
        sitekey: CONTACT_TURNSTILE_SITE_KEY,
        action: 'submission',
        size: 'flexible',
        theme: 'light',
        callback: (token) => {
          if (cancelled) return
          setError('')
          onToken(token)
        },
        'expired-callback': () => invalidate('Security check expired. Please retry the check.'),
        'error-callback': () => {
          invalidate('Security check failed. Please retry or use WhatsApp or email.')
          return true
        },
        'timeout-callback': () => invalidate('Security check timed out. Please retry the check.'),
      })
    }).catch(() => {
      if (!cancelled) setError('Security check could not load. Please retry or use WhatsApp or email.')
    })
    return () => {
      cancelled = true
      if (widget !== undefined) window.turnstile?.remove(widget)
    }
  }, [onToken, resetKey, retry])

  return (
    <div className="min-w-0">
      <div ref={host} aria-label="Security verification" />
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}{' '}
        <button type="button" onClick={() => setRetry((value) => value + 1)} className="underline">Retry security check</button>
      </p>}
    </div>
  )
}
