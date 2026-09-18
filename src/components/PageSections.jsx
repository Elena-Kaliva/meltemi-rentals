import { useEffect, useRef, useState } from 'react'
import heroSmall from '../assets/hero-wow-840.webp'
import heroLarge from '../assets/hero-wow-1440.webp'
import { localIsoDate, nextDay } from '../lib/bookingForm'
import BookingForm from './BookingForm'
import DateInput from './DateInput'

function SectionMarker({ number, label, inverse = false, centered = false }) {
  return (
    <div className={`flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[.12em] ${centered ? 'justify-center' : ''} ${inverse ? 'text-white/65' : 'text-stone-500'}`}>
      <span className={`grid h-7 min-w-7 place-items-center rounded-full border px-2 tabular-nums ${inverse ? 'border-white/20 bg-white/[.06] text-white' : 'border-aegean/15 bg-aegean/[.06] text-aegean'}`}>{number}</span>
      <span className={`h-px w-6 shrink-0 sm:w-10 ${inverse ? 'bg-white/25' : 'bg-stone-300'}`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export function Hero({ t, cars, selection, onSelectionChange, onCheckAvailability }) {
  const today = localIsoDate()
  const returnMin = selection.pickupDate ? nextDay(selection.pickupDate) : today

  const submitAvailability = (event) => {
    event.preventDefault()
    onCheckAvailability()
  }

  return (
    <section className="pb-44 sm:pb-36 lg:pb-24" id="top">
      <div className="w-full">
        <div className="relative min-h-[43rem] overflow-visible bg-stone-700 shadow-[0_28px_80px_rgba(23,24,23,.16)]">
          <picture className="absolute inset-0 overflow-hidden">
            <source media="(max-width: 840px)" srcSet={heroSmall} />
            <img className="hero-image h-full w-full scale-[1.01] object-cover object-[60%_center] sm:object-center" src={heroLarge} alt={t.hero.alt} width="1440" height="810" fetchPriority="high" decoding="async" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/55" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent sm:from-black/35 sm:via-black/10" aria-hidden="true" />

          <div className="hero-eyebrow-row absolute left-1/2 top-6 z-10 flex w-[calc(100%-3rem)] max-w-[73.75rem] -translate-x-1/2 items-start justify-between gap-4 sm:top-12 sm:w-[calc(100%-5rem)]">
            <p className="text-[11px] font-extrabold uppercase tracking-[.07em] text-white sm:text-xs">{t.hero.eyebrow}</p>
            <div className="shrink-0 rounded-full border border-white/60 bg-white/90 px-4 py-2.5 text-right text-ink shadow-[0_12px_32px_rgba(0,0,0,.12)] backdrop-blur-xl">
              <small className="block text-[9px] font-extrabold uppercase tracking-[.06em] text-stone-500">{t.sticky.label}</small>
              <strong className="text-lg font-black tracking-[-.04em] sm:text-[1.35rem]">€35/day</strong>
            </div>
          </div>

          <div className="hero-copy absolute left-1/2 top-40 z-10 w-[calc(100%-3rem)] max-w-[73.75rem] -translate-x-1/2 text-white sm:bottom-36 sm:top-auto sm:w-[calc(100%-5rem)]">
            <h1 className="text-[clamp(2.35rem,7vw,5.75rem)] font-extrabold leading-[.93] tracking-[-.067em] [text-wrap:balance] sm:text-[clamp(2.65rem,5.2vw,4.35rem)] 2xl:text-[clamp(4.35rem,4.7vw,5.5rem)]">
              <span className="block">{t.hero.title1}</span>
              <span className="block">{t.hero.title2}</span>
              <span className="block">{t.hero.title3}</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/90 sm:mt-6 sm:text-lg sm:leading-8">
              <span className="sm:hidden">{t.hero.mobileBody}</span>
              <span className="hidden sm:inline">{t.hero.body}</span>
            </p>
            <div className="mt-6 flex flex-col gap-2 min-[420px]:flex-row sm:mt-7">
              <a className="button-primary flex-1 min-[420px]:flex-none" href="#request">{t.nav.cta}<span aria-hidden="true">→</span></a>
              <a className="button-secondary hidden flex-1 border-transparent bg-white/95 sm:inline-flex min-[420px]:flex-none" href="#included">{t.hero.secondary}</a>
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-semibold text-white/85 sm:mt-5">
              {t.hero.checks.map((check) => (
                <li className="flex items-center gap-1.5" key={check}><span aria-hidden="true">✓</span>{check}</li>
              ))}
            </ul>
          </div>

          <form className="hero-availability absolute -bottom-[9.5rem] left-1/2 z-20 grid w-[calc(100%-1.5rem)] max-w-[73.75rem] -translate-x-1/2 grid-cols-2 overflow-hidden rounded-2xl border border-white/70 bg-white/95 text-ink shadow-[0_24px_70px_rgba(23,24,23,.2)] backdrop-blur-xl sm:-bottom-[5.5rem] sm:w-[calc(100%-2.5rem)] lg:-bottom-9 lg:grid-cols-[1.15fr_1fr_1fr_1fr_auto]" id="hero-availability" onSubmit={submitAvailability} aria-label={t.hero.availability.label}>
            <div className="col-span-2 border-b border-stone-200 px-4 py-3 transition-colors hover:bg-stone-50 sm:col-span-1 sm:border-r lg:border-b-0 lg:px-5 lg:py-4">
              <span className="hero-search-label">{t.hero.availability.location}</span>
              <strong className="block text-sm">{t.hero.availability.locationValue}</strong>
            </div>
            <label className="min-w-0 border-b border-r border-stone-200 px-4 py-3 transition-colors hover:bg-stone-50 focus-within:bg-stone-50 lg:border-b-0 lg:px-5 lg:py-4" htmlFor="hero-pickup-date">
              <span className="hero-search-label">{t.hero.availability.pickup}</span>
              <DateInput className="hero-search-input" id="hero-pickup-date" min={today} value={selection.pickupDate} onChange={(event) => onSelectionChange('pickupDate', event.target.value)} />
            </label>
            <label className="min-w-0 border-b border-stone-200 px-4 py-3 transition-colors hover:bg-stone-50 focus-within:bg-stone-50 sm:border-r lg:border-b-0 lg:px-5 lg:py-4" htmlFor="hero-return-date">
              <span className="hero-search-label">{t.hero.availability.return}</span>
              <DateInput className="hero-search-input" id="hero-return-date" min={returnMin} value={selection.returnDate} onChange={(event) => onSelectionChange('returnDate', event.target.value)} />
            </label>
            <label className="col-span-2 min-w-0 border-b border-stone-200 px-4 py-3 transition-colors hover:bg-stone-50 focus-within:bg-stone-50 sm:col-span-1 sm:border-r lg:border-b-0 lg:px-5 lg:py-4" htmlFor="hero-category">
              <span className="hero-search-label">{t.hero.availability.car}</span>
              <select className="hero-search-input cursor-pointer" id="hero-category" value={selection.category} onChange={(event) => onSelectionChange('category', event.target.value)}>
                <option value="">{t.hero.availability.anyCategory}</option>
                {cars.map((car) => <option value={car.id} key={car.id}>{car.name}</option>)}
              </select>
            </label>
            <button className="group col-span-2 min-h-14 bg-aegean px-6 text-sm font-extrabold text-white transition-colors hover:bg-aegean-dark lg:col-span-1 lg:min-h-full" type="submit">{t.hero.availability.submit}<span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></button>
          </form>
        </div>
      </div>
    </section>
  )
}

function CostRow({ children, included = false, total = false, featuredTotal = false }) {
  return (
    <div className={`flex min-h-[3.75rem] items-center justify-between gap-4 text-sm ${featuredTotal ? 'mt-2 rounded-xl bg-aegean px-3.5 py-2.5 text-white' : total ? 'mt-2 rounded-xl bg-white/[.12] px-3.5 py-2.5' : included ? 'border-t border-stone-200 py-3' : 'border-t border-white/10 py-3'}`}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-black ${featuredTotal ? 'bg-white text-aegean' : included ? 'bg-aegean text-white' : total ? 'bg-white text-ink' : 'bg-white/10 text-stone-300'}`} aria-hidden="true">
          {included ? '✓' : total || featuredTotal ? '=' : '+'}
        </span>
        {children[0]}
      </div>
      {children[1]}
    </div>
  )
}

export function Pricing({ t }) {
  const p = t.pricing
  return (
    <section className="scroll-mt-24 pt-12 sm:pt-0" id="included">
      <div className="page-wrap mb-9 sm:mb-12">
        <SectionMarker number="01" label={p.eyebrow} />
        <div className="mt-6 max-w-5xl">
          <h2 className="text-[clamp(2.75rem,5.4vw,4.75rem)] font-extrabold leading-[.93] tracking-[-.067em] text-ink [text-wrap:balance]">{p.title}</h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-stone-600 lg:text-lg lg:leading-8">{p.intro}</p>
        </div>
      </div>

      <div className="relative overflow-hidden bg-[#101827] py-6 text-white shadow-[0_32px_90px_rgba(20,31,49,.16)] sm:py-12">
        <span className="pointer-events-none absolute -right-32 -top-44 h-[32rem] w-[32rem] rounded-full bg-aegean/25 blur-[110px]" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-52 -left-40 h-[30rem] w-[30rem] rounded-full bg-slate-400/10 blur-[100px]" aria-hidden="true" />

        <div className="page-wrap relative grid gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-5">
          <article className="group flex min-h-[25rem] flex-col rounded-[1.65rem] border border-white/10 bg-white/[.055] p-4 backdrop-blur-md transition-[border-color,transform] duration-300 hover:border-white/20 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-white/[.07] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.07em] text-slate-300">{p.example}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-[.07em] text-slate-400">{p.starts}</span>
            </div>
            <div className="my-6 flex items-end gap-2 pb-6">
              <p className="text-6xl font-extrabold leading-none tracking-[-.075em] text-white/85 sm:text-7xl">€8</p>
              <span className="mb-1.5 text-sm font-bold text-slate-400">/day</span>
            </div>
            <div className="mt-auto">
              <CostRow><span>{p.insurance}</span><strong className="shrink-0 text-rose-200">+ €15/day</strong></CostRow>
              <CostRow><span>{p.airport}</span><strong className="shrink-0 text-rose-200">+ €25</strong></CostRow>
              <CostRow><span>{p.secondDriver}</span><strong className="shrink-0 text-rose-200">+</strong></CostRow>
              <CostRow><span>{p.fuel}</span><strong className="shrink-0 text-rose-200">+</strong></CostRow>
              <CostRow><span>{p.held}</span><strong className="shrink-0 text-rose-200">€1,200</strong></CostRow>
              <CostRow total><strong>{p.approximate}</strong><strong className="shrink-0 text-base">≈ €48/day</strong></CostRow>
            </div>
            <p className="mt-4 text-[11px] leading-5 text-slate-400">{p.exampleNote}</p>
          </article>

          <article className="comparison-featured relative flex min-h-[25rem] flex-col overflow-hidden rounded-[1.65rem] bg-[#f7f7f4] p-4 text-ink shadow-[0_26px_65px_rgba(0,0,0,.28)] sm:p-6">
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-300 via-aegean to-blue-300" aria-hidden="true" />
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-aegean px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.07em] text-white">Meltemi Rentals</span>
              <span className="text-right text-[10px] font-extrabold uppercase tracking-[.07em] text-aegean">{p.clear}</span>
            </div>
            <div className="my-6 flex items-end gap-2 pb-6">
              <p className="text-6xl font-extrabold leading-none tracking-[-.075em] text-aegean sm:text-7xl">€35</p>
              <span className="mb-1.5 text-sm font-bold text-stone-500">/day</span>
            </div>
            <div className="mt-auto">
              <CostRow included><span>{p.zeroInsurance}</span><strong className="shrink-0 text-aegean">{p.included}</strong></CostRow>
              <CostRow included><span>{p.airportIncluded}</span><strong className="shrink-0 text-aegean">{p.included}</strong></CostRow>
              <CostRow included><span>{p.secondDriver}</span><strong className="shrink-0 text-aegean">{p.included}</strong></CostRow>
              <CostRow included><span>{p.fullFuel}</span><strong className="shrink-0 text-aegean">{p.included}</strong></CostRow>
              <CostRow included><span>{p.held}</span><strong className="shrink-0 text-aegean">€0</strong></CostRow>
              <CostRow featuredTotal><strong>{p.finalDaily}</strong><strong className="shrink-0 text-base">€35/day</strong></CostRow>
            </div>
            <p className="mt-4 text-[11px] leading-5 text-stone-600">{p.meltemiNote}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function FleetSpecIcon({ type, value }) {
  const common = { className: 'h-5 w-5', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (type === 'seats') return <svg {...common} aria-hidden="true"><circle cx="12" cy="7.2" r="3.2" /><path d="M5.3 20c0-3.7 3-6.7 6.7-6.7s6.7 3 6.7 6.7" /></svg>
  if (type === 'bags') return <svg {...common} aria-hidden="true"><rect x="5" y="8.5" width="14" height="11.5" rx="2.2" /><path d="M9 8.5v-2a3 3 0 0 1 6 0v2" /></svg>
  if (value === 'manual') return <svg {...common} aria-hidden="true"><circle cx="12" cy="5" r="1.6" /><path d="M12 6.6V14" /><path d="M6 20h12M8 20v-3.5a4 4 0 0 1 4-4 4 4 0 0 1 4 4V20" /></svg>
  return <svg {...common} aria-hidden="true"><path d="M12 3v18M4.6 6.5l14.8 11M19.4 6.5 4.6 17.5" /></svg>
}

export function Fleet({ t, cars, onRequest }) {
  return (
    <section className="section-pad scroll-mt-24 border-y border-stone-300/50 bg-white/30" id="fleet">
      <div className="page-wrap">
        <SectionMarker number="02" label={t.fleet.eyebrow} />
        <div className="mt-6 max-w-4xl">
          <h2 className="text-[clamp(2.65rem,5vw,4.35rem)] font-extrabold leading-[.94] tracking-[-.063em] [text-wrap:balance]">{t.fleet.title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 lg:text-lg lg:leading-8">{t.fleet.intro}</p>
          <p className="mt-3 text-sm text-stone-500">{t.fleet.ageNote}</p>
        </div>
        <div className="fleet-scroll mt-10">
          {cars.map((car) => (
            <article className="fleet-card group relative flex min-w-[84%] snap-start flex-col overflow-hidden rounded-[1.5rem] border border-stone-200/90 bg-white shadow-[0_8px_28px_rgba(23,24,23,.05)] transition-[box-shadow,border-color] duration-500 hover:border-transparent hover:shadow-[0_16px_42px_rgba(23,24,23,.09)] sm:min-w-0" key={car.id}>
              <p className="px-5 pt-5 text-sm text-stone-500">{t.fleet.from} <strong className="text-lg font-black text-ink">€{car.price}</strong> {t.fleet.day}</p>
              <div className="relative aspect-[4/3] overflow-hidden">
                <span className="absolute inset-x-[18%] bottom-[12%] h-[10%] rounded-full bg-slate-900/10 blur-xl" aria-hidden="true" />
                <img className="fleet-car-image relative h-full w-full object-contain p-2 sm:p-3" src={car.image} alt={t.fleet.alt(car.name)} width="720" height="480" loading="lazy" decoding="async" />
              </div>
              <div className="flex flex-1 flex-col p-5 pt-0">
                <h3 className="text-xl font-extrabold tracking-tight">{car.name}</h3>
                <p className="mt-1 text-xs text-stone-500">{car.example} {t.fleet.similar}</p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-stone-100 text-stone-600" aria-hidden="true"><FleetSpecIcon type="seats" /></span>
                    <span className="text-[11px] text-stone-600">{car.seats} {t.fleet.seats}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-stone-100 text-stone-600" aria-hidden="true"><FleetSpecIcon type="bags" /></span>
                    <span className="text-[11px] text-stone-600">{car.bags} {car.bags === 1 ? t.fleet.bag : t.fleet.bags}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-stone-100 text-stone-600" aria-hidden="true"><FleetSpecIcon type="transmission" value={car.transmission} /></span>
                    <span className="text-[11px] text-stone-600">{t.fleet[car.transmission]}</span>
                  </div>
                </div>
                <button className="mt-5 flex w-full items-center justify-between border-t border-stone-200 pt-4 text-left text-sm font-extrabold transition-colors hover:text-aegean" type="button" onClick={() => onRequest(car.id)}><span>{t.fleet.request} {car.name}</span><span className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-lg transition-[transform,background-color] group-hover:translate-x-1 group-hover:bg-aegean group-hover:text-white" aria-hidden="true">→</span></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// Each mobile.facts entry is paired by position with a kind here, so the icon
// tracks the concept (not the raw index) as the list grows.
const MOBILE_FACT_KINDS = ['insurance', 'cardHold', 'airport', 'driver', 'fuel', 'support']

function MobileFactIcon({ kind }) {
  const commonProps = { className: 'h-5 w-5 sm:h-6 sm:w-6', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

  if (kind === 'insurance') {
    return <svg {...commonProps} aria-hidden="true"><path d="M12 3 5.5 5.7v5.5c0 4.2 2.7 7.8 6.5 9.3 3.8-1.5 6.5-5.1 6.5-9.3V5.7L12 3Z" /><path d="m8.7 11.8 2.1 2.1 4.6-4.8" /></svg>
  }
  if (kind === 'cardHold') {
    return <svg {...commonProps} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 9h18M7 15h3M15.2 14.8l1.4 1.4 2.7-3" /></svg>
  }
  if (kind === 'airport') {
    return <svg {...commonProps} aria-hidden="true"><path d="M12 21s7-6.7 7-12.2A7 7 0 0 0 5 8.8C5 14.3 12 21 12 21Z" /><circle cx="12" cy="8.7" r="2.4" /></svg>
  }
  if (kind === 'driver') {
    return <svg {...commonProps} aria-hidden="true"><circle cx="8.3" cy="7.8" r="2.6" /><circle cx="16.2" cy="9" r="2.1" /><path d="M3.3 19c0-2.9 2.2-5.1 5-5.1s5 2.2 5 5.1" /><path d="M14.3 14.2c2.3.3 4 2.2 4 4.9" /></svg>
  }
  if (kind === 'fuel') {
    return <svg {...commonProps} aria-hidden="true"><rect x="5.5" y="6" width="7.5" height="14" rx="1" /><path d="M7.5 9.5h3.5" /><path d="M13 9.5h1.8L17.5 12v4.7a1.3 1.3 0 0 1-2.6 0v-2.9a1 1 0 0 0-1-1H13" /><path d="M4 20h11" /></svg>
  }
  return <svg {...commonProps} aria-hidden="true"><path d="M4.5 13v-1a7.5 7.5 0 0 1 15 0v1" /><path d="M4.5 12.5h1.2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1.5 1.5 0 0 1-1.5-1.5v-3.5A1 1 0 0 1 4.5 12.5ZM19.5 12.5h-1.2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h.7a1.5 1.5 0 0 0 1.5-1.5v-3.5a1 1 0 0 0-1-1Z" /><path d="M16.3 18.5c-.7 1.3-2.1 2-4.3 2" /></svg>
}

export function MobileShowcase({ t }) {
  const factPositions = [
    '-left-1 top-4 sm:top-[5%] lg:left-[2%] lg:top-[12%]',
    '-right-1 top-4 sm:top-[5%] lg:right-[2%] lg:top-[12%]',
    'left-0 top-[10.25rem] sm:top-[43%] lg:left-[9%] lg:top-[45%]',
    'right-0 top-[10.25rem] sm:top-[43%] lg:right-[9%] lg:top-[45%]',
    'left-0 top-[20.5rem] sm:top-[81%] lg:left-[2%] lg:top-[78%]',
    'right-0 top-[20.5rem] sm:top-[81%] lg:right-[2%] lg:top-[78%]',
  ]
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!sectionRef.current || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }

    const observer = new window.IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsVisible(true)
      observer.disconnect()
    }, { threshold: 0.2 })

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="scroll-mt-24" id="mobile-experience" ref={sectionRef}>
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2f69b9] via-aegean to-[#204a84] py-12 text-white sm:py-16">
        <span className="pointer-events-none absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-white/[.06] blur-[100px]" aria-hidden="true" />
        <span className="pointer-events-none absolute -right-44 -top-48 h-[32rem] w-[32rem] rounded-full bg-blue-300/15 blur-[110px]" aria-hidden="true" />
        <div className="page-wrap relative">
          <div className="mx-auto max-w-4xl text-center">
          <SectionMarker number="03" label={t.mobile.factsLabel} inverse centered />
          <h2 className="mt-6 text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold leading-[.94] tracking-[-.064em]">{t.mobile.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/80">{t.mobile.body}</p>
          </div>
          <div className="relative left-1/2 mx-auto mt-8 min-h-[29rem] w-screen max-w-6xl -translate-x-1/2 px-2 sm:left-auto sm:min-h-[44rem] sm:w-auto sm:translate-x-0 sm:px-0">
          <span className="pointer-events-none absolute left-1/2 top-[48%] hidden text-[11rem] font-black leading-none tracking-[-.09em] text-white/[.045] lg:block lg:-translate-x-1/2 lg:-translate-y-1/2" aria-hidden="true">KOS</span>
          <span className="pointer-events-none absolute left-1/2 top-[48%] hidden h-[39rem] w-[39rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 lg:block" aria-hidden="true" />
          <span className="pointer-events-none absolute left-1/2 top-[48%] hidden h-[29rem] w-[29rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.07] lg:block" aria-hidden="true" />
          <div className="relative z-20 mx-auto h-[23rem] w-[10.75rem] rounded-[1.7rem] bg-[#101110] p-1.5 shadow-[0_34px_80px_rgba(0,0,0,.3)] sm:h-[40.5rem] sm:w-[20.625rem] sm:rounded-[2.875rem] sm:p-2.5">
            <span className="absolute left-1/2 top-2.5 z-20 h-4 w-[4.5rem] -translate-x-1/2 rounded-full bg-[#101110] sm:top-3.5 sm:h-6 sm:w-28" aria-hidden="true" />
            <div className="h-full overflow-hidden rounded-[1.4rem] bg-paper text-ink sm:rounded-[2.375rem]">
              <div className="flex h-9 items-center justify-between px-2.5 text-[7px] font-extrabold sm:h-14 sm:px-4 sm:text-xs"><span><b>meltemi</b> rentals</span><span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-white sm:h-7 sm:w-7" aria-hidden="true">≡</span></div>
              <div className="relative h-[8.75rem] overflow-hidden sm:h-[17.75rem]">
                <img className="h-full w-full object-cover object-[60%_center]" src={heroSmall} alt="" width="840" height="473" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute inset-x-3 bottom-3 z-10 text-white sm:inset-x-4 sm:bottom-4"><small className="text-[6px] font-bold uppercase tracking-wide sm:text-[9px]">{t.mobile.previewContext}</small><strong className="mt-1 block text-base font-black leading-[.96] tracking-[-.045em] sm:text-[1.8rem] sm:tracking-[-.055em]">{t.mobile.previewHeadline}</strong></div>
              </div>
              <div className="mx-2.5 mt-2 flex items-center justify-between rounded-lg bg-white p-2 text-[7px] shadow-sm sm:mx-3.5 sm:mt-3 sm:rounded-xl sm:p-3 sm:text-[10px]"><span>{t.sticky.label}</span><b className="text-sm text-aegean sm:text-lg">€35/day</b></div>
              <div className="grid grid-cols-2 gap-1 px-2.5 py-1.5 sm:gap-2 sm:px-3.5 sm:py-2.5">
                {t.mobile.previewItems.map(([label, value]) => <div className="rounded-md bg-white p-1.5 text-[6px] sm:rounded-xl sm:p-2.5 sm:text-[9px]" key={label}><span>{label}</span><b className="mt-0.5 block text-[8px] sm:text-[11px]">{value}</b></div>)}
              </div>
              <div className="mx-2.5 grid h-7 place-items-center rounded-full bg-aegean text-[8px] font-extrabold text-white sm:mx-3.5 sm:h-10 sm:text-[11px]">{t.mobile.previewCta} →</div>
            </div>
          </div>
          <div className="absolute inset-0 z-10" aria-label={t.mobile.factsLabel}>
            {t.mobile.facts.map(([label, value], index) => (
              <div
                className={`mobile-fact absolute flex w-32 items-center gap-1.5 overflow-hidden rounded-[1rem] border border-white/20 bg-[#143d75]/90 p-1.5 text-white shadow-[0_22px_55px_rgba(5,25,56,.32)] backdrop-blur-xl sm:w-[14rem] sm:gap-3 sm:rounded-full sm:p-3 sm:pr-4 lg:w-[17rem] lg:gap-4 ${index % 2 === 1 ? 'flex-row-reverse text-right sm:flex-row sm:text-left' : ''} ${isVisible ? 'mobile-fact-visible' : ''} ${factPositions[index]}`}
                key={label}
                style={{ '--fact-delay': `${250 + index * 700}ms`, '--fact-x': index % 2 === 0 ? '-90px' : '90px', '--border-delay': `${index * -1.15}s` }}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-aegean shadow-[0_8px_20px_rgba(0,0,0,.16)] sm:h-12 sm:w-12 lg:h-16 lg:w-16" aria-hidden="true"><MobileFactIcon kind={MOBILE_FACT_KINDS[index]} /></span>
                <span className="min-w-0">
                  <small className="hidden text-[7px] font-extrabold uppercase tracking-[.06em] text-white/60 min-[380px]:block sm:text-[9px] sm:tracking-[.09em]">{label}</small>
                  <strong className="block text-[10px] font-black leading-tight tracking-[-.025em] min-[380px]:mt-0.5 sm:text-lg sm:tracking-[-.04em] lg:text-[1.45rem]">{value}</strong>
                </span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Booking({ t, cars, selection, onSelectionChange, onResetSelection, language }) {
  return (
    <section className="section-pad scroll-mt-20" id="request">
      <div className="page-wrap relative">
        <div className="relative grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:gap-14">
          <div>
            <SectionMarker number="04" label={t.booking.eyebrow} />
            <h2 className="mt-6 text-[clamp(2.6rem,4.5vw,4rem)] font-extrabold leading-[.94] tracking-[-.064em]" id="booking-form-title">{t.booking.title}</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-stone-600">{t.booking.body}</p>
            <div className="mt-8 border-t border-slate-400/30 pt-6">
              <p className="field-label">{t.booking.howItWorks.title}</p>
              <div className="mt-3">
                {t.booking.howItWorks.steps.map(([title, body], index) => (
                  <div className="flex gap-3 border-b border-slate-400/30 py-3.5 last:border-b-0" key={title}>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[11px] font-black text-aegean shadow-sm" aria-hidden="true">{index + 1}</span>
                    <div className="text-sm">
                      <p className="font-extrabold text-ink">{title}</p>
                      <p className="mt-0.5 leading-6 text-stone-600">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="min-w-0">
          <BookingForm selection={selection} onSelectionChange={onSelectionChange} onResetSelection={onResetSelection} cars={cars} t={t} language={language} />
          </div>
        </div>
      </div>
    </section>
  )
}
