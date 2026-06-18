import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { getEventos, criarEvento, atualizarEvento, deletarEvento } from '../../services/api'
import styles from './AdminEventos.module.css'

const ESPORTES = ['Futebol', 'Basquete', 'Tênis', 'Vôlei', 'Fórmula 1', 'MMA']

const eventoInicial = {
  timeA: '',
  timeB: '',
  esporte: 'Futebol',
  data: '',
  status: 'aberto',
  resultado: '',
  oddA: 2.0,
  oddB: 2.0,
  oddEmpate: 3.0,
}

export default function AdminEventos() {
  const [eventos, setEventos] = useState([])
  const [form, setForm] = useState(eventoInicial)
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    carregarEventos()
  }, [])

  async function carregarEventos() {
    try {
      const res = await getEventos()
      setEventos(res.data)
    } catch {
      setMensagem('Erro ao carregar eventos.')
    } finally {
      setCarregando(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.timeA || !form.timeB || !form.data) {
      setMensagem('Preencha todos os campos obrigatórios.')
      return
    }

    try {
      if (editandoId) {
        await atualizarEvento(editandoId, form)
        setMensagem('Evento atualizado com sucesso!')
      } else {
        await criarEvento({ ...form, status: 'aberto', resultado: '' })
        setMensagem('Evento criado com sucesso!')
      }
      setForm(eventoInicial)
      setEditandoId(null)
      setMostrarForm(false)
      carregarEventos()
    } catch {
      setMensagem('Erro ao salvar evento.')
    }

    setTimeout(() => setMensagem(''), 3000)
  }

  function handleEditar(evento) {
    setForm({
      timeA: evento.timeA,
      timeB: evento.timeB,
      esporte: evento.esporte,
      data: evento.data,
      status: evento.status,
      resultado: evento.resultado,
      oddA: evento.oddA,
      oddB: evento.oddB,
      oddEmpate: evento.oddEmpate ?? 3.0,
    })
    setEditandoId(evento.id)
    setMostrarForm(true)
  }

  async function handleDeletar(id) {
    if (!confirm('Tem certeza que quer deletar esse evento?')) return
    try {
      await deletarEvento(id)
      setMensagem('Evento removido.')
      carregarEventos()
    } catch {
      setMensagem('Erro ao deletar.')
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  async function handleEncerrar(evento) {
    if (!confirm(`Encerrar o evento "${evento.timeA} x ${evento.timeB}"?`)) return
    try {
      await atualizarEvento(evento.id, { status: 'encerrado' })
      setMensagem('Evento encerrado. Agora registre o resultado.')
      carregarEventos()
    } catch {
      setMensagem('Erro ao encerrar.')
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  function cancelarForm() {
    setForm(eventoInicial)
    setEditandoId(null)
    setMostrarForm(false)
  }

  return (
    <>
      <Navbar tipo="admin" />
      <main className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.titulo}>Gerenciar Eventos</h1>
            <p className={styles.subtitulo}>{eventos.length} evento(s) cadastrado(s)</p>
          </div>
          <button className={styles.btnNovo} onClick={() => setMostrarForm(!mostrarForm)}>
            {mostrarForm ? '✕ Fechar' : '+ Novo Evento'}
          </button>
        </div>

        {mensagem && <div className={styles.mensagem}>{mensagem}</div>}

        {mostrarForm && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formTitulo}>{editandoId ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.campo}>
                <label>Time A / Competidor A *</label>
                <input name="timeA" value={form.timeA} onChange={handleChange} placeholder="Ex: Brasil" className={styles.input} />
              </div>
              <div className={styles.campo}>
                <label>Time B / Competidor B *</label>
                <input name="timeB" value={form.timeB} onChange={handleChange} placeholder="Ex: Argentina" className={styles.input} />
              </div>
              <div className={styles.campo}>
                <label>Esporte</label>
                <select name="esporte" value={form.esporte} onChange={handleChange} className={styles.input}>
                  {ESPORTES.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className={styles.campo}>
                <label>Data do Evento *</label>
                <input type="date" name="data" value={form.data} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.campo}>
                <label>Odd {form.timeA || 'Time A'}</label>
                <input type="number" step="0.1" min="1.1" name="oddA" value={form.oddA} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.campo}>
                <label>Odd {form.timeB || 'Time B'}</label>
                <input type="number" step="0.1" min="1.1" name="oddB" value={form.oddB} onChange={handleChange} className={styles.input} />
              </div>
              {form.esporte === 'Futebol' || form.esporte === 'Vôlei' ? (
                <div className={styles.campo}>
                  <label>Odd Empate</label>
                  <input type="number" step="0.1" min="1.1" name="oddEmpate" value={form.oddEmpate} onChange={handleChange} className={styles.input} />
                </div>
              ) : null}
            </div>
            <div className={styles.formBotoes}>
              <button type="submit" className={styles.btnSalvar}>
                {editandoId ? 'Salvar Alterações' : 'Criar Evento'}
              </button>
              <button type="button" className={styles.btnCancelar} onClick={cancelarForm}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {carregando ? (
          <p className={styles.carregando}>Carregando eventos...</p>
        ) : (
          <div className={styles.lista}>
            {eventos.length === 0 ? (
              <p className={styles.vazio}>Nenhum evento cadastrado ainda.</p>
            ) : (
              eventos.map((evento) => (
                <div key={evento.id} className={styles.eventoCard}>
                  <div className={styles.eventoInfo}>
                    <div className={styles.eventoTimes}>
                      <span className={styles.esporteBadge}>{evento.esporte}</span>
                      <span className={styles.nomes}>{evento.timeA} <span className={styles.vs}>vs</span> {evento.timeB}</span>
                    </div>
                    <div className={styles.eventoMeta}>
                      <span>📅 {new Date(evento.data + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                      <span className={`${styles.status} ${styles[evento.status]}`}>
                        {evento.status === 'aberto' ? '🟢 Aberto' : '🔒 Encerrado'}
                      </span>
                      {evento.resultado && <span className={styles.resultado}>🏆 {evento.resultado}</span>}
                    </div>
                    <div className={styles.odds}>
                      <span>Odd A: <strong>{evento.oddA}</strong></span>
                      <span>Odd B: <strong>{evento.oddB}</strong></span>
                      {evento.oddEmpate && <span>Empate: <strong>{evento.oddEmpate}</strong></span>}
                    </div>
                  </div>
                  <div className={styles.eventoBotoes}>
                    <button className={styles.btnEditar} onClick={() => handleEditar(evento)}>Editar</button>
                    {evento.status === 'aberto' && (
                      <button className={styles.btnEncerrar} onClick={() => handleEncerrar(evento)}>Encerrar</button>
                    )}
                    <button className={styles.btnDeletar} onClick={() => handleDeletar(evento.id)}>Deletar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  )
}
