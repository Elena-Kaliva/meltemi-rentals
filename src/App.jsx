import { useEffect, useState } from 'react'
import Header, { Brand } from './components/Header'
import { Booking, FAQ, Fleet, Hero, MobileShowcase, Pricing } from './components/PageSections'
import { translations } from './content/translations'
import { cars } from './data/cars'
import { bookingFieldIds, firstIncompleteBookingField, updateBookingSelection } from './lib/bookingForm'

const initialBookingSelection = { pickupDate: '', returnDate: '', category: '' }

function savedLanguage() {
  try { return localStorage.getItem('meltemi-language') === 'el' ? 'el' : 'en' } catch { return 'en' }
}

export default function App() {
  const [language, setLanguage] = useState(savedLanguage)
  const [bookingSelection, setBookingSelection] = useState(initialBookingSelection)
  const [showMobileCta, setShowMobileCta] = useState(false)
  const t = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.meta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.meta.description)
    try { localStorage.setItem('meltemi-language', language) } catch { /* Storage may be unavailable. */ }
  }, [language, t])

  useEffect(() => {
    const visibility = { hero: true, booking: false }
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibility[entry.target.id === 'hero-availability' ? 'hero' : 'booking'] = entry.isIntersecting
      })
      setShowMobileCta(!visibility.hero && !visibility.booking)
    })

    const heroAvailability = document.getElementById('hero-availability')
    const booking = document.getElementById('request')
    if (heroAvailability) observer.observe(heroAvailability)
    if (booking) observer.observe(booking)
    return () => observer.disconnect()
  }, [])

  const setBookingField = (field, value) => {
    setBookingSelection((current) => updateBookingSelection(current, field, value))
  }

  // Shared by the hero "Check availability" submit, the fleet "Request" CTAs
  // and the mobile sticky CTA: scroll to the booking form and focus the
  // first required field that still needs a value, without auto-submitting.
  const goToBooking = (selectionForFocus = bookingSelection) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.querySelector('#request')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    const focusId = bookingFieldIds[firstIncompleteBookingField(selectionForFocus)]
    window.requestAnimationFrame(() => document.getElementById(focusId)?.focus({ preventScroll: true }))
  }

  const selectCar = (carId) => {
    const nextSelection = { ...bookingSelection, category: carId }
    setBookingField('category', carId)
    goToBooking(nextSelection)
  }

  return (
    <>
      <Header language={language} setLanguage={setLanguage} t={t} />
      <main>
        <Hero t={t} cars={cars} selection={bookingSelection} onSelectionChange={setBookingField} onCheckAvailability={() => goToBooking()} />
        <Pricing t={t} />
        <Fleet t={t} cars={cars} onRequest={selectCar} />
        <MobileShowcase t={t} />
        <Booking
          t={t}
          cars={cars}
          selection={bookingSelection}
          onSelectionChange={setBookingField}
          onResetSelection={() => setBookingSelection(initialBookingSelection)}
          language={language}
        />
        <FAQ t={t} />
      </main>
      <footer className="relative overflow-hidden bg-[#101827] pb-28 text-white sm:pb-0">
        <span className="pointer-events-none absolute -right-40 -top-56 h-[34rem] w-[34rem] rounded-full bg-aegean/25 blur-[120px]" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-64 -left-48 h-[32rem] w-[32rem] rounded-full bg-slate-400/10 blur-[110px]" aria-hidden="true" />

        <div className="page-wrap relative py-10 sm:py-14">
          <div className="grid gap-10 pb-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <a className="w-fit rounded text-white" href="#top" aria-label="Meltemi Rentals home"><Brand /></a>
              <h2 className="mt-6 max-w-sm text-[clamp(1.65rem,2.6vw,2.35rem)] font-black leading-[1.08] tracking-[-.04em] [text-wrap:balance]">{t.footer.tagline}</h2>
              <p className="mt-8 text-xs text-white/40">© {new Date().getFullYear()} {t.footer.rights}</p>
            </div>

            <div className="flex flex-col items-end gap-8 text-right">
              <a className="inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full bg-white px-5 text-sm font-extrabold text-ink transition-[background-color,color] duration-300 hover:bg-aegean hover:text-white" href="#request">{t.nav.cta}<span aria-hidden="true">↗</span></a>

              <div className="flex flex-col items-end gap-6">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-white/45">{t.footer.location}</p>
                  <a className="mt-2 inline-block text-lg font-bold transition-colors hover:text-blue-300" href="mailto:hello@meltemirentals.gr">hello@meltemirentals.gr</a>
                </div>
                <nav className="flex flex-col items-end gap-2 text-sm text-white/65" aria-label={t.footer.navigationLabel}>
                  <a className="py-1 transition-colors hover:text-white" href="#fleet">{t.nav.cars}</a>
                  <a className="py-1 transition-colors hover:text-white" href="#included">{t.nav.included}</a>
                  <a className="py-1 transition-colors hover:text-white" href="#faq">{t.nav.faq}</a>
                </nav>
                <a className="group flex w-fit items-center gap-3 text-sm font-bold text-white/65 transition-colors hover:text-white" href="#top">
                  {t.footer.backToTop}
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition-[background-color,color] group-hover:bg-white group-hover:text-ink" aria-hidden="true">↑</span>
                </a>
              </div>

              <p className="w-full border-t border-white/10 pt-6 text-xs text-white/40">{t.footer.descriptor}</p>
            </div>
          </div>
        </div>
      </footer>
      <a
        className={`fixed inset-x-2.5 bottom-2.5 z-50 min-h-16 items-center justify-between rounded-full border border-white/10 bg-aegean/95 px-5 text-white shadow-[0_18px_46px_rgba(20,40,80,.35)] backdrop-blur-xl sm:hidden ${showMobileCta ? 'flex' : 'hidden'}`}
        href="#request"
        onClick={(event) => { event.preventDefault(); goToBooking() }}
      >
        <span><small className="block text-xs text-blue-100">{t.sticky.label}</small><strong>€35/day</strong></span><strong>{t.sticky.cta} <span aria-hidden="true">→</span></strong>
      </a>
    </>
  )
}
