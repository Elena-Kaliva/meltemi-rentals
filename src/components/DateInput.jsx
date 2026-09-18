export default function DateInput({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={className}
      type="date"
    />
  )
}
