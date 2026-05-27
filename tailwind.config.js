/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary (Blue)
        primary: '#2563EB',
        'primary-light': '#3B82F6',
        'primary-dark': '#1D4ED8',
        'primary-subtle': '#EFF6FF',
        'primary-text': '#1E40AF',
        // Semantic
        success: '#10B981',
        'success-subtle': '#ECFDF5',
        warning: '#F59E0B',
        danger: '#EF4444',
        // Backgrounds
        'bg-base': '#F8FAFC',
        'bg-surface': '#FFFFFF',
        'bg-elevated': '#F1F5F9',
        // Text
        'text-primary': '#0F172A',
        'text-secondary': '#64748B',
        'text-disabled': '#CBD5E1',
        // Border
        border: '#E2E8F0',
        'border-focus': '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(37,99,235,0.10), 0 1px 3px rgba(0,0,0,0.06)',
        modal: '0 -4px 32px rgba(0,0,0,0.10)',
        'button-primary': '0 4px 14px rgba(37,99,235,0.30)',
      },
      borderRadius: {
        card: '20px',
        btn: '14px',
        sheet: '28px',
      },
    },
  },
  plugins: [],
}
