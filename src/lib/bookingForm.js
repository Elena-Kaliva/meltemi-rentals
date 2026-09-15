const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function localIsoDate(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

export function nextDay(value) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  date.setDate(date.getDate() + 1)
  return localIsoDate(date)
}

export function validateBooking(values, today = localIsoDate()) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'nameRequired'
  if (!values.email.trim()) errors.email = 'emailRequired'
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'emailInvalid'
  if (!values.pickupDate) errors.pickupDate = 'pickupRequired'
  else if (values.pickupDate < today) errors.pickupDate = 'pickupPast'
  if (!values.returnDate) errors.returnDate = 'returnRequired'
  else if (values.pickupDate && values.returnDate <= values.pickupDate) errors.returnDate = 'returnAfter'
  if (!values.category) errors.category = 'categoryRequired'
  if (!values.turnstileToken) errors.turnstile = 'turnstileRequired'

  return errors
}

export function createBookingPayload(values, metadata) {
  const payload = new FormData()
  payload.set('name', values.name.trim())
  payload.set('email', values.email.trim())
  payload.set('phone', values.phone.trim())
  payload.set('pickup_date', values.pickupDate)
  payload.set('return_date', values.returnDate)
  payload.set('car_category', metadata.categoryLabel)
  payload.set('language', metadata.language)
  payload.set('page_url', metadata.pageUrl)
  payload.set('submitted_at', metadata.submittedAt)
  payload.set('cf-turnstile-response', values.turnstileToken)
  payload.set('_gotcha', values.gotcha || '')
  return payload
}

export async function submitBookingRequest(endpoint, payload, request = fetch) {
  try {
    const response = await request(endpoint, {
      method: 'POST',
      body: payload,
      headers: { Accept: 'application/json' },
    })

    if (response.ok) return 'success'
    if (response.status === 429) return 'rateLimit'
    if (response.status === 400 || response.status === 422) return 'verificationFailed'
    return 'serverError'
  } catch {
    return 'networkError'
  }
}
