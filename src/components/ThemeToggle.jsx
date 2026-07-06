import { useTheme, THEMES } from '../context/ThemeContext'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z"
      />
    </svg>
  )
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c-4.42 0-8 2.69-8 6.2 0 2.35 1.35 4.43 3.5 5.7.55.34.9.92.9 1.56v.34c0 .83.67 1.5 1.5 1.5h1.1c.55 0 1-.45 1-1v-.5c0-.83.67-1.5 1.5-1.5H14c3.04 0 5.5-2.46 5.5-5.5C19.5 6.14 16.14 3 12 3Z"
      />
      <circle cx="8.5" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const THEME_META = {
  day: { label: 'Modo día', short: 'Día', Icon: SunIcon },
  night: { label: 'Modo noche', short: 'Noche', Icon: MoonIcon },
  color: { label: 'Modo color', short: 'Color', Icon: PaletteIcon },
}

export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={`theme-switcher ${className}`} role="group" aria-label="Tema visual">
      {THEMES.map((key) => {
        const { label, short, Icon } = THEME_META[key]
        const active = theme === key
        return (
          <button
            key={key}
            type="button"
            className={`theme-switcher__btn ${active ? 'theme-switcher__btn--active' : ''}`}
            onClick={() => setTheme(key)}
            aria-pressed={active}
            aria-label={label}
            title={label}
          >
            <span className="theme-switcher__icon">
              <Icon />
            </span>
            <span className="theme-switcher__label">{short}</span>
          </button>
        )
      })}
    </div>
  )
}
