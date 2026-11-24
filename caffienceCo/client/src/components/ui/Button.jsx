const variants = {
  primary: 'bg-espresso text-cream hover:bg-coffee',
  secondary: 'border border-line bg-white text-espresso hover:border-coffee/40',
  ghost: 'text-coffee hover:text-espresso',
};

const sizes = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-3.5 text-xs',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold tracking-widest uppercase transition disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}