import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import { getMovimentacoesByUsuario } from '../../services/api'
import styles from './UsuarioExtrato.module.css'

export default function UsuarioExtrato() {
  const { usuario } = useAuth()
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const res = await getMovimentacoesByUsuario(usuario.id)
        setMovimentacoes(res.data.sort((a, b) => new Date(b.data) - new Date(a.data)))
      } catch {
        console.error('Erro ao carregar extrato')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const totalEntradas = movimentacoes
    .filter((m) => m.valor > 0)
    .reduce((acc, m) => acc + m.valor, 0)

  const totalSaidas = movimentacoes
    .filter((m) => m.valor < 0)
    .reduce((acc, m) => acc + Math.abs(m.valor), 0)

  return (
    <>
      <Navbar tipo="usuario" />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Extrato de Movimentações</h1>
          <p className={styles.subtitulo}>Histórico fictício da sua carteira</p>
        </div>

        <div className={styles.resumoCarteira}>
          <div className={styles.saldoBox}>
            <p className={styles.saldoLabel}>Saldo atual</p>
            <p className={styles.saldo}>R$ {(usuario?.saldo || 0).toLocaleString('pt-BR')}</p>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total recebido</span>
              <span className={`${styles.statValor} ${styles.verde}`}>R$ {totalEntradas.toLocaleString('pt-BR')}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total apostado</span>
              <span className={`${styles.statValor} ${styles.vermelho}`}>R$ {totalSaidas.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        <div className={styles.aviso}>
          Todos os valores são fictícios e usados apenas para fins acadêmicos.
        </div>

        {carregando ? (
          <p className={styles.carregando}>Carregando extrato...</p>
        ) : movimentacoes.length === 0 ? (
          <p className={styles.vazio}>Nenhuma movimentação registrada ainda.</p>
        ) : (
          <div className={styles.lista}>
            {movimentacoes.map((mov) => (
              <div key={mov.id} className={`${styles.item} ${mov.valor > 0 ? styles.entrada : styles.saida}`}>
                <div className={styles.itemIcone}>
                  {mov.tipo === 'aposta' ? '🎯' : '🏆'}
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemDesc}>{mov.descricao}</p>
                  <p className={styles.itemData}>
                    {new Date(mov.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className={`${styles.itemValor} ${mov.valor > 0 ? styles.verde : styles.vermelho}`}>
                  {mov.valor > 0 ? '+' : ''}R$ {Math.abs(mov.valor).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
