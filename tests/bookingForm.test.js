import assert from 'node:assert/strict'
import test from 'node:test'
import { createBookingPayload, nextDay, submitBookingRequest, validateBooking } from '../src/lib/bookingForm.js'

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
