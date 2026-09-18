function Brand() {
  return (
    <span className="inline-flex items-baseline text-[1.4rem] tracking-[-0.055em]">
      <strong className="font-black">meltemi</strong><span className="font-medium"> rentals</span><span className="ml-1.5 h-1.5 w-1.5 self-center rounded-full bg-aegean" aria-hidden="true" />
    </span>
  )
}

export default function Header({ language, setLanguage, t }) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-300/70 bg-paper/85 shadow-[0_1px_0_rgba(255,255,255,.7)] backdrop-blur-xl">
      <nav className="page-wrap flex h-[4.125rem] items-center justify-between gap-4 lg:h-[4.75rem]" aria-label="Main navigation">
        <a className="rounded" href="#top" aria-label="Meltemi Rentals home"><Brand /></a>
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="hidden items-center gap-6 text-[13px] text-stone-600 md:flex">
            <a className="nav-link" href="#fleet">{t.nav.cars}</a>
            <a className="nav-link" href="#included">{t.nav.included}</a>
            <a className="nav-link" href="#faq">{t.nav.faq}</a>
          </div>
          <div className="flex rounded-full border border-stone-300/80 bg-stone-200/60 p-0.5 shadow-inner" role="group" aria-label={t.nav.label}>
            {['en', 'el'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`min-h-8 min-w-10 rounded-full px-2 text-[11px] font-extrabold transition-colors ${language === code ? 'bg-white text-ink shadow-sm' : 'text-stone-500 hover:text-ink'}`}
                aria-pressed={language === code}
                lang={code}
              >
                {code === 'en' ? 'EN' : 'ΕΛ'}
              </button>
            ))}
          </div>
          <a className="button-primary hidden lg:inline-flex" href="#request">{t.nav.cta}</a>
        </div>
      </nav>
    </header>
  )
}

export { Brand }
