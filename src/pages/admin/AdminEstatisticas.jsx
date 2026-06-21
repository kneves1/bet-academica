import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { getEventos, getApostas, getUsuarios } from '../../services/api'
import styles from './AdminEstatisticas.module.css'

export default function AdminEstatisticas() {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const [resEventos, resApostas, resUsuarios] = await Promise.all([
          getEventos(),
          getApostas(),
          getUsuarios(),
        ])

        const eventos = resEventos.data
        const apostas = resApostas.data
        const usuarios = resUsuarios.data.filter((u) => u.perfil === 'usuario')

        // Total apostado fictício
        const totalApostado = apostas.reduce((acc, a) => acc + Number(a.valor), 0)
        const totalPago = apostas.filter((a) => a.status === 'ganhou').reduce((acc, a) => acc + Number(a.retorno), 0)

        // Esporte mais apostado
        const esportesCount = {}
        apostas.forEach((aposta) => {
          const evento = eventos.find((e) => e.id === aposta.eventoId)
          if (evento) {
            esportesCount[evento.esporte] = (esportesCount[evento.esporte] || 0) + 1
          }
        })
        const esporteMaisApostado = Object.entries(esportesCount).sort((a, b) => b[1] - a[1])[0]

        // Usuário que mais apostou
        const apostasCount = {}
        apostas.forEach((a) => {
          apostasCount[a.usuarioId] = (apostasCount[a.usuarioId] || 0) + 1
        })
        const maisAtivo = Object.entries(apostasCount).sort((a, b) => b[1] - a[1])[0]
        const usuarioMaisAtivo = maisAtivo ? usuarios.find((u) => u.id === Number(maisAtivo[0])) : null

        // Taxa de acerto geral
        const finalizadas = apostas.filter((a) => a.status !== 'pendente')
        const acertos = finalizadas.filter((a) => a.status === 'ganhou')
        const taxaAcerto = finalizadas.length > 0 ? Math.round((acertos.length / finalizadas.length) * 100) : 0

        // Distribuição por status
        const porStatus = {
          ganhou: apostas.filter((a) => a.status === 'ganhou').length,
          perdeu: apostas.filter((a) => a.status === 'perdeu').length,
          pendente: apostas.filter((a) => a.status === 'pendente').length,
        }

        setDados({
          totalApostado,
          totalPago,
          esporteMaisApostado,
          usuarioMaisAtivo,
          taxaAcerto,
          porStatus,
          totalApostas: apostas.length,
          totalJogadores: usuarios.length,
          esportesCount,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  if (carregando) {
    return (
      <>
        <Navbar tipo="admin" />
        <div className={styles.carregando}>Carregando estatísticas...</div>
      </>
    )
  }

  return (
    <>
      <Navbar tipo="admin" />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>📈 Painel Estatístico</h1>
          <p className={styles.subtitulo}>Visão analítica da plataforma</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Total Apostado (fictício)</p>
            <p className={styles.cardValor}>R$ {dados.totalApostado.toLocaleString('pt-BR')}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Total Pago em Prêmios</p>
            <p className={`${styles.cardValor} ${styles.verde}`}>R$ {dados.totalPago.toLocaleString('pt-BR')}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Taxa de Acerto Geral</p>
            <p className={`${styles.cardValor} ${styles.amarelo}`}>{dados.taxaAcerto}%</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Total de Apostas</p>
            <p className={styles.cardValor}>{dados.totalApostas}</p>
          </div>
        </div>

        <div className={styles.linha}>
          <div className={styles.bloco}>
            <h2 className={styles.blocoTitulo}>Status das Apostas</h2>
            <div className={styles.barras}>
              {[
                { label: 'Ganhou', valor: dados.porStatus.ganhou, cor: '#16a34a' },
                { label: 'Perdeu', valor: dados.porStatus.perdeu, cor: '#ef4444' },
                { label: 'Pendente', valor: dados.porStatus.pendente, cor: '#f59e0b' },
              ].map((item) => {
                const pct = dados.totalApostas > 0 ? Math.round((item.valor / dados.totalApostas) * 100) : 0
                return (
                  <div key={item.label} className={styles.barraItem}>
                    <div className={styles.barraLabel}>
                      <span>{item.label}</span>
                      <span>{item.valor} ({pct}%)</span>
                    </div>
                    <div className={styles.barraFundo}>
                      <div className={styles.barraPreench} style={{ width: `${pct}%`, background: item.cor }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.bloco}>
            <h2 className={styles.blocoTitulo}>Apostas por Esporte</h2>
            <div className={styles.barras}>
              {Object.entries(dados.esportesCount).map(([esporte, count]) => {
                const pct = dados.totalApostas > 0 ? Math.round((count / dados.totalApostas) * 100) : 0
                return (
                  <div key={esporte} className={styles.barraItem}>
                    <div className={styles.barraLabel}>
                      <span>{esporte}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <div className={styles.barraFundo}>
                      <div className={styles.barraPreench} style={{ width: `${pct}%`, background: '#3b82f6' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={styles.destaques}>
          {dados.esporteMaisApostado && (
            <div className={styles.destaque}>
              <p className={styles.destaqueLabel}>⚽ Esporte mais apostado</p>
              <p className={styles.destaqueValor}>{dados.esporteMaisApostado[0]}</p>
              <p className={styles.destaqueDesc}>{dados.esporteMaisApostado[1]} apostas</p>
            </div>
          )}
          {dados.usuarioMaisAtivo && (
            <div className={styles.destaque}>
              <p className={styles.destaqueLabel}>👑 Jogador mais ativo</p>
              <p className={styles.destaqueValor}>{dados.usuarioMaisAtivo.nome}</p>
              <p className={styles.destaqueDesc}>{dados.usuarioMaisAtivo.pontos} pontos</p>
            </div>
          )}
          <div className={styles.destaque}>
            <p className={styles.destaqueLabel}>👥 Total de jogadores</p>
            <p className={styles.destaqueValor}>{dados.totalJogadores}</p>
            <p className={styles.destaqueDesc}>usuários cadastrados</p>
          </div>
        </div>
      </main>
    </>
  )
}
