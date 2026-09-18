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

export function updateBookingSelection(current, field, value) {
  const next = { ...current, [field]: value }
  if (field === 'pickupDate' && next.returnDate && next.returnDate <= value) next.returnDate = ''
  return next
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

// Centralized so the hero, fleet cards and booking form all read the same
// prices from `cars` instead of hardcoding rates in multiple places.
export function calculateTripDetails(selection, cars) {
  const { pickupDate, returnDate, category } = selection
  if (!pickupDate || !returnDate || !category) return null
  if (returnDate <= pickupDate) return null

  const car = cars.find((item) => item.id === category)
  if (!car) return null

  const pickup = new Date(`${pickupDate}T12:00:00`)
  const ret = new Date(`${returnDate}T12:00:00`)
  const days = Math.round((ret.getTime() - pickup.getTime()) / MS_PER_DAY)
  if (!Number.isFinite(days) || days < 1) return null

  return { days, dailyRate: car.price, total: days * car.price, carId: car.id, carName: car.name }
}

export const bookingFieldIds = {
  name: 'full-name', email: 'email', pickupDate: 'pickup-date', returnDate: 'return-date', category: 'category', turnstile: 'turnstile-status',
}

const REQUIRED_SELECTION_ORDER = ['pickupDate', 'returnDate', 'category']

// Used after the hero / fleet CTAs move focus into the booking form so we
// land on the next field the visitor actually still needs to fill in.
export function firstIncompleteBookingField(selection) {
  return REQUIRED_SELECTION_ORDER.find((field) => !selection[field]) || 'name'
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
