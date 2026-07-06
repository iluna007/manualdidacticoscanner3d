import { publication } from '../data/publication'
import { FooterIcon, FooterLink } from './FooterIcons'

function AuthorLinks({ author }) {
  const { portfolio, cv, github } = author.links ?? {}
  if (!portfolio && !cv && !github) return null

  return (
    <span className="site-footer__author-links">
      {portfolio && (
        <FooterLink href={portfolio} icon="portfolio" label={`Portfolio de ${author.name}`} />
      )}
      {cv && <FooterLink href={cv} icon="cv" label={`CV de ${author.name}`} />}
      {github && (
        <FooterLink href={github} icon="github" label={`GitHub de ${author.name}`} />
      )}
    </span>
  )
}

export default function Footer() {
  const { authors, links, logos, isbn, citation, disclaimer, institution, year, license, repository } =
    publication

  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__logos">
            <a href={links.ucr} target="_blank" rel="noopener noreferrer" aria-label="Universidad de Costa Rica">
              <img src={logos.ucr} alt="Universidad de Costa Rica" className="site-footer__logo site-footer__logo--ucr" />
            </a>
            <a href={links.school} target="_blank" rel="noopener noreferrer" aria-label="Escuela de Arquitectura UCR">
              <img src={logos.eaq} alt="Escuela de Arquitectura UCR" className="site-footer__logo site-footer__logo--eaq" />
            </a>
          </div>
          <p className="site-footer__institution">{institution}</p>
        </div>

        <div className="site-footer__authors">
          <h2 className="site-footer__heading">Autores</h2>
          <ul className="site-footer__author-list">
            {authors.map((author) => (
              <li key={author.name}>
                <span className="site-footer__author-name">{author.name}</span>
                {author.role && <span className="site-footer__author-role"> · {author.role}</span>}
                <AuthorLinks author={author} />
              </li>
            ))}
          </ul>
        </div>

        

        <div className="site-footer__cite">
          <h2 className="site-footer__heading">Cita académica</h2>
          <p className="site-footer__isbn mono" id="isbn">
            {isbn.isbn13 ? `ISBN ${isbn.isbn13}` : isbn.label}
          </p>
          <blockquote className="site-footer__citation" cite={repository}>
            <p>{citation.apa}</p>
          </blockquote>
          <p className="site-footer__license">
            © {year} · Licencia{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.es"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__link site-footer__link--icon-only"
              aria-label={`Licencia ${license}`}
              title={`Licencia ${license}`}
            >
              <FooterIcon name="cc" />
              <span className="visually-hidden">{license}</span>
            </a>
          </p>
        </div>

        <p className="site-footer__disclaimer">{disclaimer}</p>
      </div>
    </footer>
  )
}
