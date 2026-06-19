import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import {
  getEventos,
  getApostasByEvento,
  atualizarEvento,
  atualizarAposta,
  atualizarUsuario,
  getUsuarioById,
  criarMovimentacao,
} from '../../services/api'
import styles from './AdminResultados.module.css'

export default function AdminResultados() {
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const [processando, setProcessando] = useState(null)

  useEffect(() => {
    carregarEventos()
  }, [])

  async function carregarEventos() {
    try {
      const res = await getEventos()
      // só mostra eventos encerrados sem resultado ainda
      setEventos(res.data.filter((e) => e.status === 'encerrado' && !e.resultado))
    } catch {
      setMensagem('Erro ao carregar eventos.')
    } finally {
      setCarregando(false)
    }
  }

  async function registrarResultado(evento, resultado) {
    if (!confirm(`Confirmar resultado: "${resultado}" para ${evento.timeA} x ${evento.timeB}? Isso vai atualizar todas as apostas.`)) return

    setProcessando(evento.id)
    try {
      // 1. Atualizar o evento com o resultado
      await atualizarEvento(evento.id, { resultado })

      // 2. Buscar todas as apostas desse evento
      const resApostas = await getApostasByEvento(evento.id)
      const apostas = resApostas.data

      // 3. Para cada aposta, calcular resultado e atualizar usuário
      for (const aposta of apostas) {
        const acertou = aposta.palpite === resultado
        let odd = 1
        if (aposta.palpite === evento.timeA) odd = Number(evento.oddA)
        else if (aposta.palpite === evento.timeB) odd = Number(evento.oddB)
        else odd = Number(evento.oddEmpate) || 1

        const retorno = acertou ? Math.round(aposta.valor * odd) : 0
        const novoStatus = acertou ? 'ganhou' : 'perdeu'

        // Atualizar a aposta
        await atualizarAposta(aposta.id, { status: novoStatus, retorno })

        // Atualizar saldo e pontos do usuário
        if (acertou) {
          const resUsuario = await getUsuarioById(aposta.usuarioId)
          const usuario = resUsuario.data
          const novoSaldo = usuario.saldo + retorno
          const novosPontos = (usuario.pontos || 0) + Math.floor(retorno / 10)
          await atualizarUsuario(aposta.usuarioId, { saldo: novoSaldo, pontos: novosPontos })

          // Registrar movimentação de prêmio
          await criarMovimentacao({
            usuarioId: aposta.usuarioId,
            tipo: 'premio',
            descricao: `Prêmio - ${resultado} venceu em ${evento.timeA} x ${evento.timeB}`,
            valor: retorno,
            data: new Date().toISOString().split('T')[0],
          })
        }
      }

      setMensagem(`Resultado registrado! ${apostas.length} aposta(s) atualizada(s).`)
      carregarEventos()
    } catch (err) {
      console.error(err)
      setMensagem('Erro ao registrar resultado.')
    } finally {
      setProcessando(null)
      setTimeout(() => setMensagem(''), 4000)
    }
  }

  return (
    <>
      <Navbar tipo="admin" />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Registrar Resultados</h1>
          <p className={styles.subtitulo}>Eventos encerrados aguardando resultado</p>
        </div>

        {mensagem && <div className={styles.mensagem}>{mensagem}</div>}

        {carregando ? (
          <p className={styles.carregando}>Carregando...</p>
        ) : eventos.length === 0 ? (
          <div className={styles.vazio}>
            <p>✅ Nenhum evento pendente de resultado.</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
              Para registrar um resultado, primeiro encerre o evento na página de Eventos.
            </p>
          </div>
        ) : (
          <div className={styles.lista}>
            {eventos.map((evento) => (
              <div key={evento.id} className={styles.card}>
                <div className={styles.cardInfo}>
                  <span className={styles.esporte}>{evento.esporte}</span>
                  <h2 className={styles.partida}>{evento.timeA} vs {evento.timeB}</h2>
                  <p className={styles.data}>📅 {new Date(evento.data + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                </div>

                <div className={styles.opcoes}>
                  <p className={styles.opcoesTitulo}>Selecione o resultado:</p>
                  <div className={styles.botoesResultado}>
                    <button
                      className={styles.btnResultado}
                      onClick={() => registrarResultado(evento, evento.timeA)}
                      disabled={processando === evento.id}
                    >
                      🏆 {evento.timeA}
                    </button>
                    <button
                      className={styles.btnResultado}
                      onClick={() => registrarResultado(evento, evento.timeB)}
                      disabled={processando === evento.id}
                    >
                      🏆 {evento.timeB}
                    </button>
                    {(evento.esporte === 'Futebol' || evento.esporte === 'Vôlei') && (
                      <button
                        className={`${styles.btnResultado} ${styles.btnEmpate}`}
                        onClick={() => registrarResultado(evento, 'Empate')}
                        disabled={processando === evento.id}
                      >
                        🤝 Empate
                      </button>
                    )}
                  </div>
                  {processando === evento.id && (
                    <p className={styles.processando}>Processando apostas...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
