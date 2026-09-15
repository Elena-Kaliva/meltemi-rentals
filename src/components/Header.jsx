function Brand() {
  return (
    <span className="inline-flex items-center gap-2 text-xl tracking-[-0.04em]">
      <span className="brand-mark" aria-hidden="true" />
      <span><strong className="font-black">meltemi</strong> rentals</span>
    </span>
  )
}

export default function Header({ language, setLanguage, t }) {
  return (
    <>
      <div className="bg-aegean-dark text-[11px] text-blue-50 sm:text-xs">
        <div className="page-wrap flex min-h-9 items-center justify-center text-center sm:justify-between">
          <span>{t.topbar[0]}</span>
          <span className="hidden sm:inline">{t.topbar[1]}</span>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-paper/95 backdrop-blur-md">
        <nav className="page-wrap flex h-16 items-center justify-between gap-4 lg:h-[72px]" aria-label="Main navigation">
          <a href="#top" aria-label="Meltemi Rentals home"><Brand /></a>
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <a className="nav-link" href="#fleet">{t.nav.cars}</a>
              <a className="nav-link" href="#included">{t.nav.included}</a>
              <a className="nav-link" href="#faq">{t.nav.faq}</a>
            </div>
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1" role="group" aria-label={t.nav.label}>
              {['en', 'el'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`min-h-9 min-w-10 rounded-lg px-2 text-xs font-extrabold transition-colors ${language === code ? 'bg-white text-aegean shadow-sm' : 'text-slate-500 hover:text-ink'}`}
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
    </>
  )
}

export { Brand }
