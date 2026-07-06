import { publication } from '../data/publication'

function AuthorLinks({ author }) {
  const { portfolio, cv, github } = author.links ?? {}
  if (!portfolio && !cv && !github) return null

  return (
    <span className="site-footer__author-links">
      {portfolio && (
        <a href={portfolio} target="_blank" rel="noopener noreferrer">
          Portfolio
        </a>
      )}
      {cv && (
        <a href={cv} target="_blank" rel="noopener noreferrer">
          CV
        </a>
      )}
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
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

        <div className="site-footer__meta">
          <h2 className="site-footer__heading">Enlaces</h2>
          <ul className="site-footer__link-list">
            <li>
              <a href={links.school} target="_blank" rel="noopener noreferrer">
                Escuela de Arquitectura
              </a>
            </li>
            <li>
              <a href={links.github} target="_blank" rel="noopener noreferrer">
                Repositorio en GitHub
              </a>
            </li>
            <li>
              <a href="https://ikerluna.netlify.app/" target="_blank" rel="noopener noreferrer">
                Portfolio · Iker Luna
              </a>
            </li>
            <li>
              <a href="https://ikercv.netlify.app/" target="_blank" rel="noopener noreferrer">
                CV · Iker Luna
              </a>
            </li>
            <li>
              <a href="https://github.com/iluna007" target="_blank" rel="noopener noreferrer">
                GitHub · iluna007
              </a>
            </li>
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
            <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.es" target="_blank" rel="noopener noreferrer">
              {license}
            </a>
          </p>
        </div>

        <p className="site-footer__disclaimer">{disclaimer}</p>
      </div>
    </footer>
  )
}
