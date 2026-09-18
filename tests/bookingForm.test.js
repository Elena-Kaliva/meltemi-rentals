import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateTripDetails, createBookingPayload, firstIncompleteBookingField, nextDay, submitBookingRequest, updateBookingSelection, validateBooking } from '../src/lib/bookingForm.js'

const testCars = [
  { id: 'mini', name: 'Mini', price: 35 },
  { id: 'economy', name: 'Economy', price: 40 },
  { id: 'compact', name: 'Compact', price: 45 },
  { id: 'suv', name: 'SUV', price: 55 },
]

const validBooking = {
  name: 'Anna Smith',
  email: 'anna@example.com',
  phone: '+30 690 000 0000',
  pickupDate: '2027-07-10',
  returnDate: '2027-07-17',
  category: 'mini',
  turnstileToken: 'verified-token',
  gotcha: '',
}

test('validates every required booking field', () => {
  const errors = validateBooking({
    name: '', email: '', phone: '', pickupDate: '', returnDate: '', category: '', turnstileToken: '', gotcha: '',
  }, '2027-01-01')

  assert.deepEqual(errors, {
    name: 'nameRequired',
    email: 'emailRequired',
    pickupDate: 'pickupRequired',
    returnDate: 'returnRequired',
    category: 'categoryRequired',
    turnstile: 'turnstileRequired',
  })
})

test('rejects invalid email, past pickup, and a return before pickup', () => {
  const errors = validateBooking({
    ...validBooking,
    email: 'not-an-email',
    pickupDate: '2026-12-31',
    returnDate: '2026-12-30',
  }, '2027-01-01')

  assert.equal(errors.email, 'emailInvalid')
  assert.equal(errors.pickupDate, 'pickupPast')
  assert.equal(errors.returnDate, 'returnAfter')
})

test('accepts a complete valid booking and computes the next return date', () => {
  assert.deepEqual(validateBooking(validBooking, '2027-01-01'), {})
  assert.equal(nextDay('2027-07-10'), '2027-07-11')
})

test('keeps shared availability fields consistent when pickup changes', () => {
  const selection = { pickupDate: '2027-07-10', returnDate: '2027-07-17', category: 'mini' }
  assert.deepEqual(updateBookingSelection(selection, 'pickupDate', '2027-07-18'), {
    pickupDate: '2027-07-18', returnDate: '', category: 'mini',
  })
  assert.deepEqual(updateBookingSelection(selection, 'pickupDate', '2027-07-11'), {
    pickupDate: '2027-07-11', returnDate: '2027-07-17', category: 'mini',
  })
})

test('creates the complete Formspree payload without extra personal data', () => {
  const payload = createBookingPayload(validBooking, {
    categoryLabel: 'Mini',
    language: 'en',
    pageUrl: 'https://example.com/meltemi-rentals/',
    submittedAt: '2027-01-01T12:00:00.000Z',
  })

  assert.deepEqual([...payload.keys()], [
    'name', 'email', 'phone', 'pickup_date', 'return_date', 'car_category', 'language', 'page_url', 'submitted_at', 'cf-turnstile-response', '_gotcha',
  ])
  assert.equal(payload.get('car_category'), 'Mini')
  assert.equal(payload.get('language'), 'en')
  assert.equal(payload.get('cf-turnstile-response'), 'verified-token')
})

test('calculates trip total from the full calendar-day difference and the car\'s daily rate', () => {
  const details = calculateTripDetails({ pickupDate: '2027-07-10', returnDate: '2027-07-15', category: 'mini' }, testCars)
  assert.deepEqual(details, { days: 5, dailyRate: 35, total: 175, carId: 'mini', carName: 'Mini' })

  assert.equal(calculateTripDetails({ pickupDate: '2027-07-10', returnDate: '2027-07-11', category: 'suv' }, testCars).total, 55)
})

test('never returns a trip total for missing, incomplete or invalid dates', () => {
  assert.equal(calculateTripDetails({ pickupDate: '', returnDate: '2027-07-15', category: 'mini' }, testCars), null)
  assert.equal(calculateTripDetails({ pickupDate: '2027-07-10', returnDate: '', category: 'mini' }, testCars), null)
  assert.equal(calculateTripDetails({ pickupDate: '2027-07-10', returnDate: '2027-07-15', category: '' }, testCars), null)
  assert.equal(calculateTripDetails({ pickupDate: '2027-07-10', returnDate: '2027-07-10', category: 'mini' }, testCars), null)
  assert.equal(calculateTripDetails({ pickupDate: '2027-07-15', returnDate: '2027-07-10', category: 'mini' }, testCars), null)
  assert.equal(calculateTripDetails({ pickupDate: '2027-07-10', returnDate: '2027-07-15', category: 'unknown' }, testCars), null)
})

test('finds the first incomplete required booking field, defaulting to the name field', () => {
  assert.equal(firstIncompleteBookingField({ pickupDate: '', returnDate: '', category: '' }), 'pickupDate')
  assert.equal(firstIncompleteBookingField({ pickupDate: '2027-07-10', returnDate: '', category: '' }), 'returnDate')
  assert.equal(firstIncompleteBookingField({ pickupDate: '2027-07-10', returnDate: '2027-07-15', category: '' }), 'category')
  assert.equal(firstIncompleteBookingField({ pickupDate: '2027-07-10', returnDate: '2027-07-15', category: 'mini' }), 'name')
})

test('reports success only for a successful Formspree response', async () => {
  const request = async () => ({ ok: true, status: 200 })
  assert.equal(await submitBookingRequest('https://formspree.io/f/example', new FormData(), request), 'success')
})

test('distinguishes rate limits, verification failures, server failures, and network errors', async () => {
  const response = (status) => async () => ({ ok: false, status })
  assert.equal(await submitBookingRequest('endpoint', new FormData(), response(429)), 'rateLimit')
  assert.equal(await submitBookingRequest('endpoint', new FormData(), response(422)), 'verificationFailed')
  assert.equal(await submitBookingRequest('endpoint', new FormData(), response(503)), 'serverError')
  assert.equal(await submitBookingRequest('endpoint', new FormData(), async () => { throw new Error('offline') }), 'networkError')
})
