import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isNight = theme === 'night'

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-pressed={isNight}
      aria-label={isNight ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isNight ? '☀️' : '🌙'}
      </span>
      <span className="theme-toggle__label">{isNight ? 'Modo día' : 'Modo noche'}</span>
    </button>
  )
}
