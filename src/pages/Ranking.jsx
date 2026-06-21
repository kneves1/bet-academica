import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { getUsuarios } from '../services/api'
import styles from './Ranking.module.css'

function getMedal(pos) {
  if (pos === 1) return { icone: '🥇', cor: '#f59e0b' }
  if (pos === 2) return { icone: '🥈', cor: '#94a3b8' }
  if (pos === 3) return { icone: '🥉', cor: '#b45309' }
  return { icone: `${pos}º`, cor: '#475569' }
}

function getNivel(pontos) {
  if (pontos >= 300) return { nivel: 'Ouro', cor: '#f59e0b' }
  if (pontos >= 100) return { nivel: 'Prata', cor: '#94a3b8' }
  return { nivel: 'Bronze', cor: '#b45309' }
}

export default function Ranking() {
  const { usuario } = useAuth()
  const [jogadores, setJogadores] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const res = await getUsuarios()
        const lista = res.data
          .filter((u) => u.perfil === 'usuario')
          .sort((a, b) => (b.pontos || 0) - (a.pontos || 0))
        setJogadores(lista)
      } catch {
        console.error('Erro ao carregar ranking')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const minhaPosicao = jogadores.findIndex((j) => j.id === usuario.id) + 1

  return (
    <>
      <Navbar tipo="usuario" />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Ranking de Jogadores</h1>
          <p className={styles.subtitulo}>Pontuação fictícia baseada em apostas ganhas</p>
        </div>

        {minhaPosicao > 0 && (
          <div className={styles.minhaPos}>
            Sua posição atual: <strong>#{minhaPosicao}</strong> com <strong>{usuario.pontos || 0} pontos</strong>
          </div>
        )}

        <div className={styles.legenda}>
          <span className={styles.legendaItem} style={{ color: '#b45309' }}>🥉 Bronze: 0–99 pts</span>
          <span className={styles.legendaItem} style={{ color: '#94a3b8' }}>🥈 Prata: 100–299 pts</span>
          <span className={styles.legendaItem} style={{ color: '#f59e0b' }}>🥇 Ouro: 300+ pts</span>
        </div>

        {carregando ? (
          <p className={styles.carregando}>Carregando ranking...</p>
        ) : (
          <div className={styles.lista}>
            {jogadores.map((jogador, index) => {
              const pos = index + 1
              const medal = getMedal(pos)
              const nivel = getNivel(jogador.pontos || 0)
              const euSou = jogador.id === usuario.id

              return (
                <div key={jogador.id} className={`${styles.item} ${euSou ? styles.euSou : ''} ${pos <= 3 ? styles.top3 : ''}`}>
                  <div className={styles.posicao} style={{ color: medal.cor }}>
                    {medal.icone}
                  </div>
                  <div className={styles.jogadorInfo}>
                    <p className={styles.nome}>
                      {jogador.nome}
                      {euSou && <span className={styles.voce}> (você)</span>}
                    </p>
                    <p className={styles.nivelTag} style={{ color: nivel.cor }}>
                      {nivel.nivel}
                    </p>
                  </div>
                  <div className={styles.pontos}>
                    <span className={styles.pontosNum}>{jogador.pontos || 0}</span>
                    <span className={styles.pontosLabel}>pontos</span>
                  </div>
                  <div className={styles.saldoInfo}>
                    <span className={styles.saldoNum}>R$ {(jogador.saldo || 0).toLocaleString('pt-BR')}</span>
                    <span className={styles.saldoLabel}>saldo fictício</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className={styles.obs}>
          * Os pontos são acumulados ao ganhar apostas. Cada R$ 10 de prêmio = 1 ponto.
        </p>
      </main>
    </>
  )
}
