import { NavLink } from 'react-router-dom'
import { Home, ListChecks, Clock, User } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: '홈' },
  { to: '/routines', icon: ListChecks, label: '루틴' },
  { to: '/history', icon: Clock, label: '히스토리' },
  { to: '/profile', icon: User, label: '프로필' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-bg-surface border-t border-border pb-safe shadow-modal">
      <div className="flex h-16">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors relative ${
                isActive ? 'text-primary' : 'text-text-secondary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} />
                <span>{label}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
