import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import { getApostasByUsuario, getEventos } from '../../services/api'
import styles from './UsuarioHistorico.module.css'

export default function UsuarioHistorico() {
  const { usuario } = useAuth()
  const [apostas, setApostas] = useState([])
  const [eventos, setEventos] = useState([])
  const [filtro, setFiltro] = useState('todos')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const [resApostas, resEventos] = await Promise.all([
          getApostasByUsuario(usuario.id),
          getEventos(),
        ])
        setApostas(resApostas.data.sort((a, b) => new Date(b.data) - new Date(a.data)))
        setEventos(resEventos.data)
      } catch {
        console.error('Erro')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  function getEvento(eventoId) {
    return eventos.find((e) => e.id === eventoId)
  }

  const apostasFiltradas = filtro === 'todos'
    ? apostas
    : apostas.filter((a) => a.status === filtro)

  const totalGanho = apostas.filter((a) => a.status === 'ganhou').reduce((acc, a) => acc + a.retorno, 0)
  const totalApostado = apostas.reduce((acc, a) => acc + a.valor, 0)

  return (
    <>
      <Navbar tipo="usuario" />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Histórico de Apostas</h1>
          <p className={styles.subtitulo}>{apostas.length} aposta(s) registrada(s)</p>
        </div>

        <div className={styles.resumo}>
          <div className={styles.resumoItem}>
            <span className={styles.resumoLabel}>Total apostado</span>
            <span className={styles.resumoValor}>R$ {totalApostado.toLocaleString('pt-BR')}</span>
          </div>
          <div className={styles.resumoItem}>
            <span className={styles.resumoLabel}>Total recebido</span>
            <span className={`${styles.resumoValor} ${styles.verde}`}>R$ {totalGanho.toLocaleString('pt-BR')}</span>
          </div>
          <div className={styles.resumoItem}>
            <span className={styles.resumoLabel}>Resultado fictício</span>
            <span className={`${styles.resumoValor} ${totalGanho - totalApostado >= 0 ? styles.verde : styles.vermelho}`}>
              {totalGanho - totalApostado >= 0 ? '+' : ''}R$ {(totalGanho - totalApostado).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        <div className={styles.filtros}>
          {['todos', 'pendente', 'ganhou', 'perdeu'].map((f) => (
            <button
              key={f}
              className={`${styles.filtroBtn} ${filtro === f ? styles.filtroAtivo : ''}`}
              onClick={() => setFiltro(f)}
            >
              {f === 'todos' ? 'Todas' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {carregando ? (
          <p className={styles.carregando}>Carregando...</p>
        ) : apostasFiltradas.length === 0 ? (
          <p className={styles.vazio}>Nenhuma aposta encontrada.</p>
        ) : (
          <div className={styles.lista}>
            {apostasFiltradas.map((aposta) => {
              const evento = getEvento(aposta.eventoId)
              return (
                <div key={aposta.id} className={`${styles.card} ${styles[aposta.status]}`}>
                  <div className={styles.cardLeft}>
                    <div className={styles.statusBadge}>
                      {aposta.status === 'ganhou' && '✅ Ganhou'}
                      {aposta.status === 'perdeu' && '❌ Perdeu'}
                      {aposta.status === 'pendente' && '⏳ Pendente'}
                    </div>
                    {evento && (
                      <p className={styles.eventoNome}>
                        {evento.timeA} vs {evento.timeB}
                        <span className={styles.esporte}> • {evento.esporte}</span>
                      </p>
                    )}
                    <p className={styles.palpite}>Palpite: <strong>{aposta.palpite}</strong></p>
                    {aposta.data && (
                      <p className={styles.dataAposta}>
                        📅 {new Date(aposta.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <div className={styles.cardRight}>
                    <p className={styles.valorLabel}>Apostado</p>
                    <p className={styles.valorNum}>R$ {aposta.valor.toLocaleString('pt-BR')}</p>
                    {aposta.status === 'ganhou' && (
                      <>
                        <p className={styles.retornoLabel}>Recebido</p>
                        <p className={styles.retornoNum}>R$ {aposta.retorno.toLocaleString('pt-BR')}</p>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
