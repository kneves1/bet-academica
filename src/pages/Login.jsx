import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getUsuarios } from '../services/api'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const response = await getUsuarios()
      const usuarios = response.data

      const encontrado = usuarios.find(
        (u) => u.email === email && u.senha === senha
      )

      if (encontrado) {
        login(encontrado)
        if (encontrado.perfil === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/usuario/dashboard')
        }
      } else {
        setErro('E-mail ou senha incorretos.')
      }
    } catch (err) {
      setErro('Erro ao conectar. Verifique se o JSON Server está rodando.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoBet}>Bet</span>
          <span className={styles.logoAcad}>Acadêmica</span>
        </div>
        <p className={styles.subtitulo}>Plataforma Fictícia de Apostas Esportivas</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.campo}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.btnEntrar} disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.dica}>
          <p>Contas de teste:</p>
          <p>admin@bet.com / 123 → Administrador</p>
          <p>joao@bet.com / 123 → Jogador</p>
        </div>
      </div>
    </div>
  )
}
