import { useEffect, useState } from 'react'
import Header, { Brand } from './components/Header'
import { Benefits, Booking, FAQ, Fleet, Hero, Pricing, ProofStrip } from './components/PageSections'
import { translations } from './content/translations'
import { cars } from './data/cars'

function savedLanguage() {
  try { return localStorage.getItem('meltemi-language') === 'el' ? 'el' : 'en' } catch { return 'en' }
}

export default function App() {
  const [language, setLanguage] = useState(savedLanguage)
  const [category, setCategory] = useState('')
  const t = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.meta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.meta.description)
    try { localStorage.setItem('meltemi-language', language) } catch { /* Storage may be unavailable. */ }
  }, [language, t])

  const selectCar = (carId) => {
    setCategory(carId)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.querySelector('#request')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    window.requestAnimationFrame(() => document.querySelector('#category')?.focus({ preventScroll: true }))
  }

  return (
    <>
      <Header language={language} setLanguage={setLanguage} t={t} />
      <main>
        <Hero t={t} language={language} /><ProofStrip t={t} /><Pricing t={t} /><Fleet t={t} cars={cars} onRequest={selectCar} /><Benefits t={t} />
        <Booking t={t} cars={cars} category={category} setCategory={setCategory} language={language} /><FAQ t={t} />
      </main>
      <footer className="border-t border-slate-200 bg-white py-9 pb-28 sm:pb-10">
        <div className="page-wrap flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Brand />
          <div className="text-sm leading-6 text-slate-500 sm:text-right"><p>{t.footer.location}</p><p><a className="hover:text-aegean" href="mailto:hello@meltemirentals.gr">hello@meltemirentals.gr</a></p><p className="text-xs">© {new Date().getFullYear()} {t.footer.rights}</p></div>
        </div>
      </footer>
      <a className="fixed inset-x-2.5 bottom-2.5 z-50 flex min-h-16 items-center justify-between rounded-2xl bg-aegean px-4 text-white shadow-2xl sm:hidden" href="#request">
        <span><small className="block text-xs text-blue-100">{t.sticky.label}</small><strong>€35/day</strong></span><strong>{t.sticky.cta} <span aria-hidden="true">→</span></strong>
      </a>
    </>
  )
}
