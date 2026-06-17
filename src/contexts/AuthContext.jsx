import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario_logado')
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo))
    }
    setCarregando(false)
  }, [])

  function login(dadosUsuario) {
    setUsuario(dadosUsuario)
    localStorage.setItem('usuario_logado', JSON.stringify(dadosUsuario))
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem('usuario_logado')
  }

  function atualizarUsuario(novosDados) {
    const atualizado = { ...usuario, ...novosDados }
    setUsuario(atualizado)
    localStorage.setItem('usuario_logado', JSON.stringify(atualizado))
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, atualizarUsuario, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
