import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar({ tipo }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linksAdmin = [
    { path: '/admin/dashboard', label: '📊 Dashboard' },
    { path: '/admin/eventos', label: '📅 Eventos' },
    { path: '/admin/resultados', label: '🏆 Resultados' },
    { path: '/admin/estatisticas', label: '📈 Estatísticas' },
  ]

  const linksUsuario = [
    { path: '/usuario/dashboard', label: '🏠 Início' },
    { path: '/usuario/eventos', label: '⚽ Eventos' },
    { path: '/usuario/historico', label: '📋 Histórico' },
    { path: '/usuario/extrato', label: '💰 Extrato' },
    { path: '/ranking', label: '🏅 Ranking' },
  ]

  const links = tipo === 'admin' ? linksAdmin : linksUsuario

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span className={styles.logoBet}>Bet</span>
        <span className={styles.logoAcad}>Acadêmica</span>
        {tipo === 'admin' && <span className={styles.badge}>ADMIN</span>}
      </div>

      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`${styles.link} ${location.pathname === link.path ? styles.ativo : ''}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.usuario}>
        <span className={styles.nomeUsuario}>👤 {usuario?.nome?.split(' ')[0]}</span>
        <button onClick={handleLogout} className={styles.btnLogout}>Sair</button>
      </div>
    </nav>
  )
}
