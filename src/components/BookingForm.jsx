import { useMemo, useState } from 'react'

function isoDate(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function nextDay(value) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  date.setDate(date.getDate() + 1)
  return isoDate(date)
}

export default function BookingForm({ category, setCategory, cars, t, language }) {
  const [pickup, setPickup] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const today = useMemo(() => isoDate(new Date()), [])
  const returnMin = pickup ? nextDay(pickup) : today

  const handlePickup = (event) => {
    const value = event.target.value
    setPickup(value)
    if (returnDate && returnDate <= value) setReturnDate('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    if (returnDate <= pickup) {
      setStatus({ type: 'error', message: t.booking.invalidDates })
      return
    }

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT
    if (!endpoint) {
      setStatus({ type: 'error', message: t.booking.notConfigured })
      return
    }

    setStatus({ type: 'sending', message: '' })
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error('Request failed')
      form.reset()
      setPickup('')
      setReturnDate('')
      setCategory('')
      setStatus({ type: 'success', message: t.booking.success })
    } catch {
      setStatus({ type: 'error', message: t.booking.deliveryError })
    }
  }

  const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-base text-ink outline-none transition focus:border-aegean focus:ring-4 focus:ring-aegean/10'

  return (
    <form className="grid gap-4 rounded-2xl bg-white p-5 text-ink shadow-sm sm:grid-cols-2 sm:p-6" onSubmit={handleSubmit} noValidate={false}>
      <input type="hidden" name="language" value={language} />
      <div>
        <label className="field-label" htmlFor="full-name">{t.booking.labels.name}</label>
        <input className={fieldClass} id="full-name" name="name" type="text" autoComplete="name" placeholder={t.booking.placeholders.name} required />
      </div>
      <div>
        <label className="field-label" htmlFor="email">{t.booking.labels.email}</label>
        <input className={fieldClass} id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder={t.booking.placeholders.email} required />
      </div>
      <div>
        <label className="field-label" htmlFor="pickup-date">{t.booking.labels.pickup}</label>
        <input className={fieldClass} id="pickup-date" name="pickup_date" type="date" min={today} value={pickup} onChange={handlePickup} required />
      </div>
      <div>
        <label className="field-label" htmlFor="return-date">{t.booking.labels.return}</label>
        <input className={fieldClass} id="return-date" name="return_date" type="date" min={returnMin} value={returnDate} onChange={(event) => setReturnDate(event.target.value)} required />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="category">{t.booking.labels.category}</label>
        <select className={fieldClass} id="category" name="car_category" value={category} onChange={(event) => setCategory(event.target.value)} required>
          <option value="" disabled>{t.booking.categoryPlaceholder}</option>
          {cars.map((car) => <option value={car.id} key={car.id}>{car.name} — €{car.price}{t.fleet.day}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="phone">
          {t.booking.labels.phone} <span className="font-normal text-slate-500">{t.booking.labels.optional}</span>
        </label>
        <input className={fieldClass} id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={t.booking.placeholders.phone} />
      </div>
      <button className="button-primary mt-1 w-full sm:col-span-2" type="submit" disabled={status.type === 'sending'}>
        {status.type === 'sending' ? t.booking.sending : t.booking.submit}<span aria-hidden="true">→</span>
      </button>
      {status.message && (
        <p className={`sm:col-span-2 rounded-xl px-4 py-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`} role={status.type === 'error' ? 'alert' : 'status'}>
          {status.message}
        </p>
      )}
    </form>
  )
}
