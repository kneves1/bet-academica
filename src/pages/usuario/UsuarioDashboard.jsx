import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import { getApostasByUsuario, getEventos, getUsuarioById } from '../../services/api'
import styles from './UsuarioDashboard.module.css'

export default function UsuarioDashboard() {
  const { usuario, atualizarUsuario } = useAuth()
  const [apostas, setApostas] = useState([])
  const [eventos, setEventos] = useState([])
  const [eventosAbertos, setEventosAbertos] = useState(0)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resApostas, resEventos, resUsuario] = await Promise.all([
          getApostasByUsuario(usuario.id),
          getEventos(),
          getUsuarioById(usuario.id),
        ])
        setApostas(resApostas.data)
        setEventos(resEventos.data)
        setEventosAbertos(resEventos.data.filter((e) => e.status === 'aberto').length)
        // sincroniza saldo do servidor com o context
        atualizarUsuario({ saldo: resUsuario.data.saldo, pontos: resUsuario.data.pontos })
      } catch (err) {
        console.error(err)
      } finally {
        setCarregando(false)
      }
    }
    carregarDados()
  }, [])

  const ganhou = apostas.filter((a) => a.status === 'ganhou').length
  const perdeu = apostas.filter((a) => a.status === 'perdeu').length
  const pendentes = apostas.filter((a) => a.status === 'pendente').length

  // Bônus fictício por pontos
  function calcularNivel(pontos) {
    if (pontos >= 300) return { nivel: 'Ouro', cor: '#f59e0b', icone: '🥇' }
    if (pontos >= 100) return { nivel: 'Prata', cor: '#94a3b8', icone: '🥈' }
    return { nivel: 'Bronze', cor: '#b45309', icone: '🥉' }
  }

  const nivel = calcularNivel(usuario?.pontos || 0)

  return (
    <>
      <Navbar tipo="usuario" />
      <main className={styles.container}>
        <div className={styles.boasVindas}>
          <div>
            <h1 className={styles.titulo}>Olá, {usuario?.nome?.split(' ')[0]}! 👋</h1>
            <p className={styles.subtitulo}>Bem-vindo de volta à BetAcadêmica</p>
          </div>
          <div className={styles.nivelBadge} style={{ borderColor: nivel.cor }}>
            <span>{nivel.icone}</span>
            <div>
              <p style={{ color: nivel.cor, fontWeight: 700, fontSize: '0.9rem' }}>{nivel.nivel}</p>
              <p style={{ color: '#64748b', fontSize: '0.7rem' }}>{usuario?.pontos || 0} pontos</p>
            </div>
          </div>
        </div>

        <div className={styles.cards}>
          <div className={styles.cardSaldo}>
            <p className={styles.cardLabel}>💰 Saldo Fictício</p>
            <p className={styles.saldo}>R$ {(usuario?.saldo || 0).toLocaleString('pt-BR')}</p>
            <Link to="/usuario/extrato" className={styles.linkExtrato}>Ver extrato →</Link>
          </div>

          <div className={styles.card}>
            <p className={styles.cardLabel}>🎯 Total de Apostas</p>
            <p className={styles.cardValor}>{apostas.length}</p>
          </div>

          <div className={`${styles.card} ${styles.cardVerde}`}>
            <p className={styles.cardLabel}>✅ Apostas Ganhas</p>
            <p className={styles.cardValor}>{ganhou}</p>
          </div>

          <div className={`${styles.card} ${styles.cardVermelho}`}>
            <p className={styles.cardLabel}>❌ Apostas Perdidas</p>
            <p className={styles.cardValor}>{perdeu}</p>
          </div>

          <div className={`${styles.card} ${styles.cardAmarelo}`}>
            <p className={styles.cardLabel}>⏳ Pendentes</p>
            <p className={styles.cardValor}>{pendentes}</p>
          </div>

          <div className={styles.card}>
            <p className={styles.cardLabel}>🟢 Eventos Abertos</p>
            <p className={styles.cardValor}>{eventosAbertos}</p>
          </div>
        </div>

        <div className={styles.acoes}>
          <h2 className={styles.acoesTitle}>O que você quer fazer?</h2>
          <div className={styles.acoesGrid}>
            <Link to="/usuario/eventos" className={styles.acao}>
              <span className={styles.acaoIcone}>⚽</span>
              <div>
                <p className={styles.acaoLabel}>Apostar agora</p>
                <p className={styles.acaoDesc}>{eventosAbertos} evento(s) disponíveis</p>
              </div>
            </Link>
            <Link to="/usuario/historico" className={styles.acao}>
              <span className={styles.acaoIcone}>📋</span>
              <div>
                <p className={styles.acaoLabel}>Histórico de apostas</p>
                <p className={styles.acaoDesc}>Ver todas as suas apostas</p>
              </div>
            </Link>
            <Link to="/usuario/extrato" className={styles.acao}>
              <span className={styles.acaoIcone}>💳</span>
              <div>
                <p className={styles.acaoLabel}>Extrato fictício</p>
                <p className={styles.acaoDesc}>Suas movimentações</p>
              </div>
            </Link>
            <Link to="/ranking" className={styles.acao}>
              <span className={styles.acaoIcone}>🏅</span>
              <div>
                <p className={styles.acaoLabel}>Ranking</p>
                <p className={styles.acaoDesc}>Ver top jogadores</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
