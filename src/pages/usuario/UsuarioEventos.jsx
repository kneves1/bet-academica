import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getEventos, getApostasByUsuario } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import styles from './UsuarioEventos.module.css'

const ESPORTES = ['Todos', 'Futebol', 'Basquete', 'Tênis', 'Vôlei', 'Fórmula 1', 'MMA']

export default function UsuarioEventos() {
  const { usuario } = useAuth()
  const [eventos, setEventos] = useState([])
  const [apostasFeitas, setApostasFeitas] = useState([])
  const [filtroEsporte, setFiltroEsporte] = useState('Todos')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const [resEventos, resApostas] = await Promise.all([
          getEventos(),
          getApostasByUsuario(usuario.id),
        ])
        setEventos(resEventos.data.filter((e) => e.status === 'aberto'))
        setApostasFeitas(resApostas.data.map((a) => a.eventoId))
      } catch {
        console.error('Erro ao carregar eventos')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const eventosFiltrados = filtroEsporte === 'Todos'
    ? eventos
    : eventos.filter((e) => e.esporte === filtroEsporte)

  return (
    <>
      <Navbar tipo="usuario" />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Eventos Disponíveis</h1>
          <p className={styles.subtitulo}>{eventos.length} evento(s) aberto(s)</p>
        </div>

        {/* Filtro por esporte */}
        <div className={styles.filtros}>
          {ESPORTES.map((e) => (
            <button
              key={e}
              className={`${styles.filtroBtn} ${filtroEsporte === e ? styles.filtroAtivo : ''}`}
              onClick={() => setFiltroEsporte(e)}
            >
              {e}
            </button>
          ))}
        </div>

        {carregando ? (
          <p className={styles.carregando}>Carregando eventos...</p>
        ) : eventosFiltrados.length === 0 ? (
          <p className={styles.vazio}>Nenhum evento disponível para esse filtro.</p>
        ) : (
          <div className={styles.grid}>
            {eventosFiltrados.map((evento) => {
              const jaApostou = apostasFeitas.includes(evento.id)
              return (
                <div key={evento.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.esporte}>{evento.esporte}</span>
                    <span className={styles.data}>
                      📅 {new Date(evento.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h2 className={styles.partida}>{evento.timeA}</h2>
                  <span className={styles.vs}>vs</span>
                  <h2 className={styles.partida}>{evento.timeB}</h2>

                  <div className={styles.odds}>
                    <div className={styles.oddItem}>
                      <span className={styles.oddTime}>{evento.timeA}</span>
                      <span className={styles.oddValor}>{evento.oddA}</span>
                    </div>
                    {evento.oddEmpate && (
                      <div className={styles.oddItem}>
                        <span className={styles.oddTime}>Empate</span>
                        <span className={styles.oddValor}>{evento.oddEmpate}</span>
                      </div>
                    )}
                    <div className={styles.oddItem}>
                      <span className={styles.oddTime}>{evento.timeB}</span>
                      <span className={styles.oddValor}>{evento.oddB}</span>
                    </div>
                  </div>

                  {jaApostou ? (
                    <div className={styles.jaApostou}>✅ Você já apostou neste evento</div>
                  ) : (
                    <Link to={`/usuario/apostar/${evento.id}`} className={styles.btnApostar}>
                      Apostar agora
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
