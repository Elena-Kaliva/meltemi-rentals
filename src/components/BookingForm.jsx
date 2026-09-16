import { useEffect, useMemo, useRef, useState } from 'react'
import { createBookingPayload, localIsoDate, nextDay, submitBookingRequest, validateBooking } from '../lib/bookingForm'
import TurnstileWidget from './TurnstileWidget'

const initialValues = {
  name: '', email: '', phone: '', pickupDate: '', returnDate: '', gotcha: '',
}

const fieldIds = {
  name: 'full-name', email: 'email', pickupDate: 'pickup-date', returnDate: 'return-date', category: 'category', turnstile: 'turnstile-status',
}

function FieldError({ error, id }) {
  if (!error) return null
  return <p className="mt-1.5 text-xs font-semibold text-red-700" id={id}><span aria-hidden="true">! </span>{error}</p>
}

function openDatePicker(event) {
  if (typeof event.currentTarget.showPicker !== 'function') return
  event.preventDefault()
  try {
    event.currentTarget.showPicker()
  } catch {
    // Browsers without a programmatic picker keep their native date-input behavior.
  }
}

function preventDateSegmentSelection(event) {
  if (typeof event.currentTarget.showPicker === 'function') event.preventDefault()
}

export default function BookingForm({ category, setCategory, cars, t, language }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [statusCode, setStatusCode] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const today = useMemo(() => localIsoDate(), [])
  const returnMin = values.pickupDate ? nextDay(values.pickupDate) : today
  const resetTurnstileRef = useRef(null)
  const submittingRef = useRef(false)
  const statusRef = useRef(null)
  const successRef = useRef(null)
  const formId = import.meta.env.VITE_FORMSPREE_FORM_ID?.trim()
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim()
  const endpoint = formId ? `https://formspree.io/f/${formId}` : ''

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const clearFieldError = (field) => {
    if (!errors[field]) return
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      return next
    })
    if (status === 'error') {
      setStatus('idle')
      setStatusCode('')
    }
  }

  const updateValue = (field) => (event) => {
    const value = event.target.value
    setValues((current) => ({ ...current, [field]: value }))
    clearFieldError(field)
  }

  const handlePickup = (event) => {
    const pickupDate = event.target.value
    setValues((current) => ({
      ...current,
      pickupDate,
      returnDate: current.returnDate && current.returnDate <= pickupDate ? '' : current.returnDate,
    }))
    clearFieldError('pickupDate')
    if (values.returnDate && values.returnDate <= pickupDate) clearFieldError('returnDate')
  }

  const handleToken = (token) => {
    setTurnstileToken(token)
    if (token) clearFieldError('turnstile')
  }

  const focusFirstError = (fieldErrors) => {
    const firstField = Object.keys(fieldIds).find((field) => fieldErrors[field])
    if (!firstField) return
    window.requestAnimationFrame(() => document.getElementById(fieldIds[firstField])?.focus())
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submittingRef.current) return

    setStatus('validating')
    setStatusCode('')

    if (!formId || !turnstileSiteKey) {
      setStatus('error')
      setStatusCode('notConfigured')
      window.requestAnimationFrame(() => statusRef.current?.focus())
      return
    }

    const submissionValues = { ...values, category, turnstileToken }
    const fieldErrors = validateBooking(submissionValues, today)
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors)
      setStatus('error')
      setStatusCode('validationSummary')
      focusFirstError(fieldErrors)
      return
    }

    const selectedCar = cars.find((car) => car.id === category)
    const payload = createBookingPayload(submissionValues, {
      categoryLabel: selectedCar?.name || category,
      language,
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString(),
    })

    submittingRef.current = true
    setStatus('submitting')
    const result = await submitBookingRequest(endpoint, payload)
    submittingRef.current = false

    if (result === 'success') {
      setValues(initialValues)
      setCategory('')
      setErrors({})
      setTurnstileToken('')
      setStatus('success')
      setStatusCode('')
      return
    }

    resetTurnstileRef.current?.()
    setStatus('error')
    setStatusCode(result)
    window.requestAnimationFrame(() => statusRef.current?.focus())
  }

  const startAnotherRequest = () => {
    setStatus('idle')
    setStatusCode('')
  }

  const fieldClass = (field) => `mt-2 min-h-12 w-full rounded-xl border bg-white px-3.5 text-base text-ink outline-none transition focus:border-aegean focus:ring-4 focus:ring-aegean/10 ${errors[field] ? 'border-red-500' : 'border-slate-300'}`
  const errorText = (field) => errors[field] ? t.booking.errors[errors[field]] : ''

  if (status === 'success') {
    return (
      <div className="flex min-h-[430px] flex-col items-start justify-center rounded-2xl bg-white p-6 text-ink shadow-sm sm:p-10" role="status" aria-live="polite" tabIndex="-1" ref={successRef}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-2xl font-black text-emerald-700" aria-hidden="true">✓</span>
        <h3 className="mt-5 text-2xl font-black tracking-tight">{t.booking.successTitle}</h3>
        <p className="mt-3 max-w-lg leading-7 text-slate-600">{t.booking.successBody}</p>
        <p className="mt-3 text-sm font-semibold text-aegean">{t.booking.successNote}</p>
        <button className="button-secondary mt-7" type="button" onClick={startAnotherRequest}>{t.booking.anotherRequest}</button>
      </div>
    )
  }

  return (
    <form className="relative grid gap-4 rounded-2xl bg-white p-5 text-ink shadow-sm sm:grid-cols-2 sm:p-6" onSubmit={handleSubmit} noValidate aria-labelledby="booking-form-title" aria-busy={status === 'submitting'} action={endpoint} method="POST">
      <div>
        <label className="field-label" htmlFor="full-name">{t.booking.labels.name}</label>
        <input className={fieldClass('name')} id="full-name" name="name" type="text" autoComplete="name" placeholder={t.booking.placeholders.name} value={values.name} onChange={updateValue('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} required />
        <FieldError id="name-error" error={errorText('name')} />
      </div>
      <div>
        <label className="field-label" htmlFor="email">{t.booking.labels.email}</label>
        <input className={fieldClass('email')} id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder={t.booking.placeholders.email} value={values.email} onChange={updateValue('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} required />
        <FieldError id="email-error" error={errorText('email')} />
      </div>
      <div>
        <label className="field-label" htmlFor="pickup-date">{t.booking.labels.pickup}</label>
        <input className={`${fieldClass('pickupDate')} cursor-pointer`} id="pickup-date" name="pickup_date" type="date" min={today} value={values.pickupDate} onPointerDown={openDatePicker} onClick={preventDateSegmentSelection} onChange={handlePickup} aria-invalid={Boolean(errors.pickupDate)} aria-describedby={errors.pickupDate ? 'pickup-error' : undefined} required />
        <FieldError id="pickup-error" error={errorText('pickupDate')} />
      </div>
      <div>
        <label className="field-label" htmlFor="return-date">{t.booking.labels.return}</label>
        <input className={`${fieldClass('returnDate')} cursor-pointer`} id="return-date" name="return_date" type="date" min={returnMin} value={values.returnDate} onPointerDown={openDatePicker} onClick={preventDateSegmentSelection} onChange={updateValue('returnDate')} aria-invalid={Boolean(errors.returnDate)} aria-describedby={errors.returnDate ? 'return-error' : undefined} required />
        <FieldError id="return-error" error={errorText('returnDate')} />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="category">{t.booking.labels.category}</label>
        <select className={fieldClass('category')} id="category" name="car_category" value={category} onChange={(event) => { setCategory(event.target.value); clearFieldError('category') }} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? 'category-error' : undefined} required>
          <option value="" disabled>{t.booking.categoryPlaceholder}</option>
          {cars.map((car) => <option value={car.id} key={car.id}>{car.name} — €{car.price}{t.fleet.day}</option>)}
        </select>
        <FieldError id="category-error" error={errorText('category')} />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="phone">{t.booking.labels.phone} <span className="font-normal text-slate-500">{t.booking.labels.optional}</span></label>
        <input className={fieldClass('phone')} id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={t.booking.placeholders.phone} value={values.phone} onChange={updateValue('phone')} />
      </div>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company-website">Leave this field empty</label>
        <input id="company-website" name="_gotcha" type="text" tabIndex="-1" autoComplete="off" value={values.gotcha} onChange={updateValue('gotcha')} />
      </div>
      <TurnstileWidget error={errorText('turnstile')} language={language} onToken={handleToken} resetRef={resetTurnstileRef} siteKey={turnstileSiteKey} t={t.booking.turnstile} />
      <button className="button-primary mt-1 w-full sm:col-span-2" type="submit" disabled={status === 'submitting' || status === 'validating' || !turnstileToken}>
        {(status === 'submitting' || status === 'validating') && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" />}
        {status === 'submitting' ? t.booking.sending : status === 'validating' ? t.booking.validating : t.booking.submit}<span aria-hidden="true">{status === 'idle' || status === 'error' ? '→' : ''}</span>
      </button>
      <div className="min-h-12 sm:col-span-2" aria-live="assertive">
        {statusCode && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900" role="alert" tabIndex="-1" ref={statusRef}><span aria-hidden="true">! </span>{t.booking.errors[statusCode]}</p>}
      </div>
    </form>
  )
}
