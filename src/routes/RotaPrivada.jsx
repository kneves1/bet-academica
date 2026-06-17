import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RotaPrivada({ children, perfilRequerido }) {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
        <p style={{ color: '#16a34a', fontSize: '1.2rem' }}>Carregando...</p>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (perfilRequerido && usuario.perfil !== perfilRequerido) {
    if (usuario.perfil === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/usuario/dashboard" replace />
  }

  return children
}
