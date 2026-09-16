import { useEffect, useRef, useState } from 'react'

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-meltemi-turnstile]')
    const script = existing || document.createElement('script')
    const handleLoad = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile unavailable'))
    const handleError = () => {
      script.remove()
      scriptPromise = undefined
      reject(new Error('Turnstile failed to load'))
    }

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })

    if (!existing) {
      script.src = SCRIPT_URL
      script.async = true
      script.defer = true
      script.dataset.meltemiTurnstile = 'true'
      document.head.append(script)
    }
  })

  return scriptPromise
}

export default function TurnstileWidget({ error, language, onToken, resetRef, siteKey, t }) {
  const containerRef = useRef(null)
  const onTokenRef = useRef(onToken)
  const widgetIdRef = useRef(null)
  const [phase, setPhase] = useState(siteKey ? 'waiting' : 'config')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    if (!siteKey) return undefined

    let cancelled = false
    let observer

    const renderWidget = async () => {
      setPhase('loading')
      try {
        const turnstile = await loadTurnstile()
        if (cancelled || !containerRef.current) return

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          language,
          theme: 'light',
          size: 'flexible',
          appearance: 'interaction-only',
          action: 'booking_request',
          'response-field': false,
          callback: (token) => {
            onTokenRef.current(token)
            setPhase('verified')
          },
          'expired-callback': () => {
            onTokenRef.current('')
            setPhase('loading')
            if (widgetIdRef.current !== null) turnstile.reset(widgetIdRef.current)
          },
          'error-callback': () => {
            onTokenRef.current('')
            setPhase('error')
            return true
          },
        })

        resetRef.current = () => {
          onTokenRef.current('')
          setPhase('loading')
          if (widgetIdRef.current !== null) turnstile.reset(widgetIdRef.current)
        }
      } catch {
        if (!cancelled) setPhase('error')
      }
    }

    if ('IntersectionObserver' in window) {
      observer = new window.IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          renderWidget()
        }
      }, { rootMargin: '700px 0px' })
      observer.observe(containerRef.current)
    } else {
      renderWidget()
    }

    return () => {
      cancelled = true
      observer?.disconnect()
      onTokenRef.current('')
      resetRef.current = null
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [attempt, language, resetRef, siteKey])

  const retry = () => {
    onTokenRef.current('')
    setAttempt((value) => value + 1)
  }

  const message = phase === 'verified'
    ? t.verified
    : phase === 'error'
      ? t.error
      : phase === 'config'
        ? t.config
        : t.checking
  const showVisibleStatus = phase === 'error' || phase === 'config'

  return (
    <div className="sm:col-span-2" role="group" aria-describedby={`turnstile-status${error ? ' turnstile-field-error' : ''}`} aria-invalid={Boolean(error)}>
      <div ref={containerRef} />
      <div className={showVisibleStatus ? 'mt-2 flex min-h-6 items-start justify-between gap-3 text-xs' : ''}>
        <p id="turnstile-status" className={showVisibleStatus ? 'text-amber-800' : 'sr-only'} aria-live="polite" tabIndex="-1">
          {message}
        </p>
        {phase === 'error' && <button className="shrink-0 font-bold text-aegean underline underline-offset-2" type="button" onClick={retry}>{t.retry}</button>}
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-red-700" id="turnstile-field-error"><span aria-hidden="true">! </span>{error}</p>}
    </div>
  )
}
