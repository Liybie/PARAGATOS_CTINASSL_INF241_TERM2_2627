export default function Input({ label, id, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="eyebrow block mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full border border-line bg-white px-4 py-3 text-sm text-espresso outline-none transition placeholder:text-muted/70 focus:border-coffee ${className}`}
        {...props}
      />
    </div>
  );
}