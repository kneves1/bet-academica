import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
})

// USUARIOS
export const getUsuarios = () => api.get('/usuarios')
export const getUsuarioById = (id) => api.get(`/usuarios/${id}`)
export const atualizarUsuario = (id, dados) => api.patch(`/usuarios/${id}`, dados)

// EVENTOS
export const getEventos = () => api.get('/eventos')
export const getEventoById = (id) => api.get(`/eventos/${id}`)
export const criarEvento = (dados) => api.post('/eventos', dados)
export const atualizarEvento = (id, dados) => api.patch(`/eventos/${id}`, dados)
export const deletarEvento = (id) => api.delete(`/eventos/${id}`)

// APOSTAS
export const getApostas = () => api.get('/apostas')
export const getApostasByUsuario = (usuarioId) => api.get(`/apostas?usuarioId=${usuarioId}`)
export const getApostasByEvento = (eventoId) => api.get(`/apostas?eventoId=${eventoId}`)
export const criarAposta = (dados) => api.post('/apostas', dados)
export const atualizarAposta = (id, dados) => api.patch(`/apostas/${id}`, dados)

// MOVIMENTACOES
export const getMovimentacoes = () => api.get('/movimentacoes')
export const getMovimentacoesByUsuario = (usuarioId) => api.get(`/movimentacoes?usuarioId=${usuarioId}`)
export const criarMovimentacao = (dados) => api.post('/movimentacoes', dados)

export default api
