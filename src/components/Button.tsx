import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  children: ReactNode
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-gradient-to-br from-primary-light to-primary text-white shadow-button-primary hover:shadow-lg hover:opacity-95',
  secondary: 'bg-bg-elevated hover:bg-slate-200 text-text-primary border border-border',
  ghost: 'bg-transparent hover:bg-primary-subtle text-primary',
  danger: 'bg-danger hover:opacity-90 text-white shadow-sm',
}

export default function Button({ variant = 'primary', children, fullWidth, className = '', ...props }: Props) {
  return (
    <button
      className={`h-[54px] px-5 rounded-btn font-semibold text-[15px] transition-all active:scale-[0.97] disabled:opacity-40 ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
