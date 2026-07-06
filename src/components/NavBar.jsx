import { navLinks } from '../data/content'

export default function NavBar() {
  return (
    <nav>
      <div className="wrap">
        {navLinks.map(({ href, label }) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}
