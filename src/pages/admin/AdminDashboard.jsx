import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { getEventos, getApostas, getUsuarios } from '../../services/api'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEventos: 0,
    eventosAbertos: 0,
    eventosEncerrados: 0,
    totalApostas: 0,
    totalJogadores: 0,
    apostasPendentes: 0,
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resEventos, resApostas, resUsuarios] = await Promise.all([
          getEventos(),
          getApostas(),
          getUsuarios(),
        ])

        const eventos = resEventos.data
        const apostas = resApostas.data
        const usuarios = resUsuarios.data

        setStats({
          totalEventos: eventos.length,
          eventosAbertos: eventos.filter((e) => e.status === 'aberto').length,
          eventosEncerrados: eventos.filter((e) => e.status === 'encerrado').length,
          totalApostas: apostas.length,
          totalJogadores: usuarios.filter((u) => u.perfil === 'usuario').length,
          apostasPendentes: apostas.filter((a) => a.status === 'pendente').length,
        })
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  if (carregando) {
    return (
      <>
        <Navbar tipo="admin" />
        <div className={styles.carregando}>Carregando dados...</div>
      </>
    )
  }

  return (
    <>
      <Navbar tipo="admin" />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Painel do Administrador</h1>
          <p className={styles.subtitulo}>Visão geral da plataforma BetAcadêmica</p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.verde}`}>
            <div className={styles.cardIcone}>📅</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValor}>{stats.totalEventos}</span>
              <span className={styles.cardLabel}>Total de Eventos</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.azul}`}>
            <div className={styles.cardIcone}>🟢</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValor}>{stats.eventosAbertos}</span>
              <span className={styles.cardLabel}>Eventos Abertos</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.cinza}`}>
            <div className={styles.cardIcone}>🔒</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValor}>{stats.eventosEncerrados}</span>
              <span className={styles.cardLabel}>Eventos Encerrados</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.amarelo}`}>
            <div className={styles.cardIcone}>🎯</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValor}>{stats.totalApostas}</span>
              <span className={styles.cardLabel}>Total de Apostas</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.roxo}`}>
            <div className={styles.cardIcone}>👥</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValor}>{stats.totalJogadores}</span>
              <span className={styles.cardLabel}>Jogadores Cadastrados</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.laranja}`}>
            <div className={styles.cardIcone}>⏳</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValor}>{stats.apostasPendentes}</span>
              <span className={styles.cardLabel}>Apostas Pendentes</span>
            </div>
          </div>
        </div>

        <div className={styles.avisos}>
          <h2 className={styles.avisosTitle}>🔔 Ações Rápidas</h2>
          <div className={styles.avisosGrid}>
            <a href="/admin/eventos" className={styles.acao}>
              <span>➕</span>
              <span>Criar novo evento</span>
            </a>
            <a href="/admin/resultados" className={styles.acao}>
              <span>🏆</span>
              <span>Registrar resultado</span>
            </a>
            <a href="/admin/estatisticas" className={styles.acao}>
              <span>📈</span>
              <span>Ver estatísticas</span>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
