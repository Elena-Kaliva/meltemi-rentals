export default function TripTotal({ t, tripDetails }) {
  const tt = t.booking.tripTotal
  return (
    <div className="sm:col-span-2 rounded-2xl border border-aegean/15 bg-aegean-soft/60 p-5 sm:p-6">
      <div aria-live="polite">
        <p className="text-xs font-extrabold uppercase tracking-[.09em] text-aegean">{tripDetails.carName}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <p className="text-sm font-semibold text-stone-600">{tripDetails.days} {tt.days} × €{tripDetails.dailyRate}{t.fleet.day}</p>
          <p className="text-right leading-tight">
            <span className="block text-[10px] font-extrabold uppercase tracking-[.09em] text-stone-500">{tt.title}</span>
            <span className="text-3xl font-black tracking-tight text-ink">€{tripDetails.total}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 border-t border-aegean/10 pt-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[.09em] text-stone-500">{tt.includedTitle}</p>
        <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm text-stone-700 sm:grid-cols-2">
          {tt.inclusions.map((item) => (
            <li className="flex items-center gap-2" key={item}>
              <span className="text-aegean" aria-hidden="true">✓</span>{item}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs leading-5 text-stone-500">{tt.note}</p>
    </div>
  )
}
