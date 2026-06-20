import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import {
  getEventoById,
  criarAposta,
  atualizarUsuario,
  criarMovimentacao,
  getApostasByUsuario,
} from '../../services/api'
import styles from './UsuarioAposta.module.css'

export default function UsuarioAposta() {
  const { eventoId } = useParams()
  const { usuario, atualizarUsuario: atualizarCtx } = useAuth()
  const navigate = useNavigate()

  const [evento, setEvento] = useState(null)
  const [palpite, setPalpite] = useState('')
  const [valor, setValor] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [jaApostou, setJaApostou] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        const [resEvento, resApostas] = await Promise.all([
          getEventoById(eventoId),
          getApostasByUsuario(usuario.id),
        ])
        setEvento(resEvento.data)
        const apostouNesse = resApostas.data.some((a) => a.eventoId === Number(eventoId))
        setJaApostou(apostouNesse)
      } catch {
        setErro('Evento não encontrado.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [eventoId])

  function getOdd(palpiteEscolhido) {
    if (!evento) return 1
    if (palpiteEscolhido === evento.timeA) return Number(evento.oddA)
    if (palpiteEscolhido === evento.timeB) return Number(evento.oddB)
    if (palpiteEscolhido === 'Empate') return Number(evento.oddEmpate) || 1
    return 1
  }

  const odd = palpite ? getOdd(palpite) : null
  const retornoPotencial = odd && valor ? Math.round(Number(valor) * odd) : 0

  async function handleApostar(e) {
    e.preventDefault()
    setErro('')

    const valorNum = Number(valor)

    if (!palpite) return setErro('Escolha um palpite.')
    if (!valorNum || valorNum <= 0) return setErro('Digite um valor válido.')
    if (valorNum > usuario.saldo) return setErro('Saldo insuficiente.')
    if (valorNum < 10) return setErro('Valor mínimo de aposta é R$ 10.')

    setEnviando(true)
    try {
      // Debitar saldo
      const novoSaldo = usuario.saldo - valorNum
      await atualizarUsuario(usuario.id, { saldo: novoSaldo })
      atualizarCtx({ saldo: novoSaldo })

      // Criar aposta
      await criarAposta({
        usuarioId: usuario.id,
        eventoId: Number(eventoId),
        palpite,
        valor: valorNum,
        status: 'pendente',
        retorno: 0,
        data: new Date().toISOString().split('T')[0],
      })

      // Registrar movimentação
      await criarMovimentacao({
        usuarioId: usuario.id,
        tipo: 'aposta',
        descricao: `Aposta em ${evento.timeA} vs ${evento.timeB} - Palpite: ${palpite}`,
        valor: -valorNum,
        data: new Date().toISOString().split('T')[0],
      })

      navigate('/usuario/historico')
    } catch (err) {
      setErro('Erro ao registrar aposta. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <>
        <Navbar tipo="usuario" />
        <div className={styles.carregando}>Carregando evento...</div>
      </>
    )
  }

  if (!evento || evento.status !== 'aberto') {
    return (
      <>
        <Navbar tipo="usuario" />
        <div className={styles.erro}>Este evento não está disponível para apostas.</div>
      </>
    )
  }

  if (jaApostou) {
    return (
      <>
        <Navbar tipo="usuario" />
        <div className={styles.container}>
          <div className={styles.jaApostouBox}>
            <p>✅ Você já fez uma aposta neste evento.</p>
            <button className={styles.btnVoltar} onClick={() => navigate('/usuario/eventos')}>
              Ver outros eventos
            </button>
          </div>
        </div>
      </>
    )
  }

  const opcoesPalpite = [evento.timeA, evento.timeB]
  if (evento.esporte === 'Futebol' || evento.esporte === 'Vôlei') {
    opcoesPalpite.splice(1, 0, 'Empate')
  }

  return (
    <>
      <Navbar tipo="usuario" />
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.eventoInfo}>
            <span className={styles.esporte}>{evento.esporte}</span>
            <h1 className={styles.partida}>{evento.timeA} <span>vs</span> {evento.timeB}</h1>
            <p className={styles.data}>📅 {new Date(evento.data + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
          </div>

          <div className={styles.saldoAtual}>
            Saldo disponível: <strong>R$ {usuario.saldo.toLocaleString('pt-BR')}</strong>
          </div>

          <form onSubmit={handleApostar} className={styles.form}>
            <div className={styles.grupo}>
              <p className={styles.grupoLabel}>Escolha seu palpite:</p>
              <div className={styles.palpites}>
                {opcoesPalpite.map((op) => (
                  <button
                    key={op}
                    type="button"
                    className={`${styles.btnPalpite} ${palpite === op ? styles.palpiteAtivo : ''}`}
                    onClick={() => setPalpite(op)}
                  >
                    <span className={styles.palpiteNome}>{op}</span>
                    <span className={styles.palpiteOdd}>odd {getOdd(op)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.grupo}>
              <label className={styles.grupoLabel}>Valor da aposta (R$):</label>
              <input
                type="number"
                min="10"
                max={usuario.saldo}
                step="1"
                placeholder="Ex: 100"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className={styles.inputValor}
              />
              <div className={styles.valoresRapidos}>
                {[50, 100, 200, 500].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={styles.btnRapido}
                    onClick={() => setValor(String(Math.min(v, usuario.saldo)))}
                  >
                    R$ {v}
                  </button>
                ))}
              </div>
            </div>

            {palpite && valor && (
              <div className={styles.resumo}>
                <p>Palpite: <strong>{palpite}</strong></p>
                <p>Odd: <strong>{odd}</strong></p>
                <p>Valor apostado: <strong>R$ {Number(valor).toLocaleString('pt-BR')}</strong></p>
                <p className={styles.retorno}>Retorno potencial: <strong>R$ {retornoPotencial.toLocaleString('pt-BR')}</strong></p>
              </div>
            )}

            {erro && <p className={styles.erroMsg}>{erro}</p>}

            <button type="submit" className={styles.btnConfirmar} disabled={enviando}>
              {enviando ? 'Registrando...' : 'Confirmar Aposta'}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
