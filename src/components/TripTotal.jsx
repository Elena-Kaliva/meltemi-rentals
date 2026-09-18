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
      <div className="mt-5 border-t border-aegean/10 pt-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[.09em] text-stone-500">{tt.includedTitle}</p>
        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {tt.inclusions.map((item) => (
            <li className="flex items-center gap-2.5 text-sm font-medium text-stone-700" key={item}>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-aegean text-[11px] font-black text-white" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs leading-5 text-stone-500">{tt.note}</p>
    </div>
  )
}
