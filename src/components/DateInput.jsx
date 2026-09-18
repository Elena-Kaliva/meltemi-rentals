function openDatePicker(event) {
  if (typeof event.currentTarget.showPicker !== 'function') return
  event.preventDefault()
  try {
    event.currentTarget.showPicker()
  } catch {
    // Browsers without a programmatic picker keep their native date-input behavior.
  }
}

function preventDateSegmentSelection(event) {
  if (typeof event.currentTarget.showPicker === 'function') event.preventDefault()
}

export default function DateInput({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={className}
      type="date"
      onPointerDown={openDatePicker}
      onClick={preventDateSegmentSelection}
    />
  )
}
