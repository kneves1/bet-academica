import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import RotaPrivada from './routes/RotaPrivada'

// Pages
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEventos from './pages/admin/AdminEventos'
import AdminResultados from './pages/admin/AdminResultados'
import AdminEstatisticas from './pages/admin/AdminEstatisticas'
import UsuarioDashboard from './pages/usuario/UsuarioDashboard'
import UsuarioEventos from './pages/usuario/UsuarioEventos'
import UsuarioAposta from './pages/usuario/UsuarioAposta'
import UsuarioHistorico from './pages/usuario/UsuarioHistorico'
import UsuarioExtrato from './pages/usuario/UsuarioExtrato'
import Ranking from './pages/Ranking'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas Admin */}
          <Route path="/admin/dashboard" element={
            <RotaPrivada perfilRequerido="admin">
              <AdminDashboard />
            </RotaPrivada>
          } />
          <Route path="/admin/eventos" element={
            <RotaPrivada perfilRequerido="admin">
              <AdminEventos />
            </RotaPrivada>
          } />
          <Route path="/admin/resultados" element={
            <RotaPrivada perfilRequerido="admin">
              <AdminResultados />
            </RotaPrivada>
          } />
          <Route path="/admin/estatisticas" element={
            <RotaPrivada perfilRequerido="admin">
              <AdminEstatisticas />
            </RotaPrivada>
          } />

          {/* Rotas Usuário */}
          <Route path="/usuario/dashboard" element={
            <RotaPrivada perfilRequerido="usuario">
              <UsuarioDashboard />
            </RotaPrivada>
          } />
          <Route path="/usuario/eventos" element={
            <RotaPrivada perfilRequerido="usuario">
              <UsuarioEventos />
            </RotaPrivada>
          } />
          <Route path="/usuario/apostar/:eventoId" element={
            <RotaPrivada perfilRequerido="usuario">
              <UsuarioAposta />
            </RotaPrivada>
          } />
          <Route path="/usuario/historico" element={
            <RotaPrivada perfilRequerido="usuario">
              <UsuarioHistorico />
            </RotaPrivada>
          } />
          <Route path="/usuario/extrato" element={
            <RotaPrivada perfilRequerido="usuario">
              <UsuarioExtrato />
            </RotaPrivada>
          } />

          {/* Ranking - acessível por usuário */}
          <Route path="/ranking" element={
            <RotaPrivada perfilRequerido="usuario">
              <Ranking />
            </RotaPrivada>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
