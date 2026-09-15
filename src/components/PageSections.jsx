import heroSmall from '../assets/hero-840.webp'
import heroLarge from '../assets/hero-1440.webp'
import harbour from '../assets/kos-harbour.webp'
import BookingForm from './BookingForm'

export function Hero({ t }) {
  return (
    <section className="py-8 sm:py-12" id="top">
      <div className="page-wrap grid items-center gap-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">
        <div className="py-2 lg:py-6">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.75rem,9vw,4.75rem)] font-black leading-[.98] tracking-[-0.06em]">
            {t.hero.title1}<br /><span className="text-aegean">{t.hero.title2}</span><br />{t.hero.title3}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{t.hero.body}</p>
          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
            <a className="button-primary flex-1 min-[420px]:flex-none" href="#request">{t.nav.cta}<span aria-hidden="true">→</span></a>
            <a className="button-secondary flex-1 min-[420px]:flex-none" href="#included">{t.hero.secondary}</a>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
            {t.hero.checks.map((check) => <span className="before:mr-1.5 before:font-black before:text-aegean before:content-['✓']" key={check}>{check}</span>)}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-200 shadow-soft sm:aspect-[5/4] lg:aspect-auto lg:h-[600px] lg:rounded-[1.875rem]">
          <picture className="block h-full w-full">
            <source media="(max-width: 840px)" srcSet={heroSmall} />
            <img className="h-full w-full object-cover" src={heroLarge} alt={t.hero.alt} width="1440" height="810" fetchPriority="high" decoding="async" />
          </picture>
          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 rounded-2xl border border-white/70 bg-white/95 p-4 sm:inset-x-5 sm:bottom-5 sm:p-5">
            <div><span className="block text-[11px] text-slate-500">{t.hero.priceLabel}</span><strong className="mt-1 block text-sm sm:text-lg">{t.hero.priceText}</strong></div>
            <div className="shrink-0 text-right"><strong className="text-3xl font-black tracking-tight text-aegean">€35</strong><span className="block text-[10px] text-slate-500">{t.hero.from}</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProofStrip({ t }) {
  return (
    <section className="pb-2" aria-label={t.nav.included}>
      <div className="page-wrap grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-4">
        {t.proof.map(([label, value], index) => (
          <div className={`p-4 sm:p-5 ${index % 2 === 0 ? 'border-r' : ''} ${index < 2 ? 'border-b lg:border-b-0' : ''} border-slate-200 lg:border-r lg:last:border-r-0`} key={label}>
            <span className="text-[10px] font-extrabold uppercase tracking-[.08em] text-slate-500">{label}</span>
            <strong className="mt-1.5 block text-sm sm:text-base">{value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function CostRow({ children, dark = false }) {
  return <div className={`flex justify-between gap-5 border-b py-3 text-sm last:border-0 ${dark ? 'border-white/15' : 'border-slate-200'}`}>{children}</div>
}

export function Pricing({ t }) {
  const p = t.pricing
  return (
    <section className="section-pad scroll-mt-24" id="included">
      <div className="page-wrap">
        <div className="section-heading">
          <div><p className="eyebrow">{p.eyebrow}</p><h2>{p.title}</h2></div>
          <p>{p.intro}</p>
        </div>
        <div className="rounded-[1.5rem] border border-[#ebe3d6] bg-sand p-4 sm:p-8">
          <div className="mb-6 grid gap-2 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-10">
            <h3 className="text-2xl font-extrabold tracking-tight">{p.compareTitle}</h3><p className="text-sm leading-6 text-slate-600">{p.compareBody}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.08fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <div className="flex justify-between gap-4 text-[11px] font-extrabold uppercase tracking-wide"><span>{p.example}</span><span>{p.starts}</span></div>
              <p className="my-4 text-4xl font-black tracking-tight">€8<span className="text-base">/day</span></p>
              <CostRow><span>{p.insurance}</span><strong>+ €15/day</strong></CostRow>
              <CostRow><span>{p.airport}</span><strong>+ €25</strong></CostRow>
              <CostRow><span>{p.held}</span><strong>€1,200</strong></CostRow>
              <CostRow><span>{p.fuel}</span><strong>+</strong></CostRow>
              <CostRow><strong>{p.approximate}</strong><strong>≈ €48/day</strong></CostRow>
              <p className="mt-4 text-[11px] leading-4 text-slate-500">{p.exampleNote}</p>
            </article>
            <article className="rounded-2xl bg-aegean-dark p-5 text-white sm:p-7">
              <div className="flex justify-between gap-4 text-[11px] font-extrabold uppercase tracking-wide"><span>Meltemi Rentals</span><span>{p.clear}</span></div>
              <p className="my-4 text-4xl font-black tracking-tight">€35<span className="text-base">/day</span></p>
              <CostRow dark><span>{p.zeroInsurance}</span><strong>{p.included}</strong></CostRow>
              <CostRow dark><span>{p.airportIncluded}</span><strong>{p.included}</strong></CostRow>
              <CostRow dark><span>{p.secondDriver}</span><strong>{p.included}</strong></CostRow>
              <CostRow dark><span>{p.fullFuel}</span><strong>{p.included}</strong></CostRow>
              <CostRow dark><span>{p.held}</span><strong>€0</strong></CostRow>
              <p className="mt-4 text-[11px] leading-4 text-blue-100">{p.meltemiNote}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Fleet({ t, cars, onRequest }) {
  return (
    <section className="section-pad scroll-mt-24 pt-4 sm:pt-8" id="fleet">
      <div className="page-wrap">
        <div className="section-heading">
          <div><p className="eyebrow">{t.fleet.eyebrow}</p><h2>{t.fleet.title}</h2></div><p>{t.fleet.intro}</p>
        </div>
        <div className="fleet-scroll">
          {cars.map((car) => (
            <article className="group min-w-[84%] snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white sm:min-w-0" key={car.id}>
              <div className="aspect-[4/3] overflow-hidden bg-slate-100"><img className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]" src={car.image} alt={t.fleet.alt(car.name)} width="720" height="540" loading="lazy" decoding="async" /></div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><h3 className="text-lg font-extrabold">{car.name}</h3><p className="mt-0.5 text-[11px] text-slate-500">{car.example} {t.fleet.similar}</p></div>
                  <p className="text-right text-xl font-black text-aegean">€{car.price}<span className="block text-[10px] font-medium text-slate-500">{t.fleet.day}</span></p>
                </div>
                <div className="my-4 flex flex-wrap gap-2 text-[11px] text-slate-600">
                  <span className="car-meta">{car.seats} {t.fleet.seats}</span><span className="car-meta">{car.bags} {car.bags === 1 ? t.fleet.bag : t.fleet.bags}</span><span className="car-meta">{t.fleet[car.transmission]}</span>
                </div>
                <button className="button-secondary w-full" type="button" onClick={() => onRequest(car.id)}>{t.fleet.request} {car.name}</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Benefits({ t }) {
  return (
    <section className="section-pad">
      <div className="page-wrap grid gap-6 lg:grid-cols-[.94fr_1.06fr]">
        <div className="min-h-[390px] overflow-hidden rounded-[1.5rem] bg-slate-200 lg:min-h-[560px]"><img className="h-full w-full object-cover" src={harbour} alt={t.benefits.alt} width="840" height="1050" loading="lazy" decoding="async" /></div>
        <div className="flex flex-col justify-center rounded-[1.5rem] border border-slate-200 bg-white p-6 sm:p-10">
          <p className="eyebrow">{t.benefits.eyebrow}</p><h2 className="mt-3 text-4xl font-black leading-[1.05] tracking-[-0.045em] sm:text-5xl">{t.benefits.title}</h2><p className="mt-5 leading-7 text-slate-600">{t.benefits.body}</p>
          <div className="mt-6">
            {t.benefits.items.map(([icon, title, body]) => (
              <div className="grid grid-cols-[42px_1fr] gap-3 border-t border-slate-200 py-4" key={title}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-aegean-soft font-black text-aegean" aria-hidden="true">{icon}</span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{body}</p></div>
              </div>
            ))}
          </div>
          <p className="mt-2 rounded-r-xl border-l-4 border-sun bg-orange-50 px-5 py-4 text-sm leading-6 text-slate-600"><strong className="text-ink">{t.benefits.promiseLabel}</strong> {t.benefits.promise}</p>
        </div>
      </div>
    </section>
  )
}

export function Booking({ t, cars, category, setCategory, language }) {
  return (
    <section className="scroll-mt-20 py-14 sm:py-20" id="request">
      <div className="page-wrap grid gap-8 rounded-[1.5rem] bg-aegean-dark p-6 text-white sm:p-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-12">
        <div className="self-center">
          <p className="eyebrow text-amber-200 before:bg-amber-300">{t.booking.eyebrow}</p><h2 className="mt-3 text-4xl font-black leading-[1.04] tracking-[-0.045em] sm:text-5xl">{t.booking.title}</h2><p className="mt-5 leading-7 text-blue-100">{t.booking.body}</p>
          <div className="mt-6 grid gap-2 text-sm text-blue-50">{t.booking.ticks.map((tick) => <span className="before:mr-2 before:font-black before:text-amber-300 before:content-['✓']" key={tick}>{tick}</span>)}</div>
        </div>
        <BookingForm category={category} setCategory={setCategory} cars={cars} t={t} language={language} />
      </div>
    </section>
  )
}

export function FAQ({ t }) {
  return (
    <section className="section-pad scroll-mt-24 pt-0" id="faq">
      <div className="page-wrap">
        <div className="section-heading"><div><p className="eyebrow">{t.faq.eyebrow}</p><h2>{t.faq.title}</h2></div></div>
        <div className="grid gap-3 md:grid-cols-2">
          {t.faq.items.map(([question, answer]) => <details className="group rounded-2xl border border-slate-200 bg-white p-5" key={question}><summary className="cursor-pointer list-none pr-8 font-bold marker:hidden">{question}<span className="float-right text-aegean transition group-open:rotate-45" aria-hidden="true">+</span></summary><p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p></details>)}
        </div>
      </div>
    </section>
  )
}
