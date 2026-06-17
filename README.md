# 🎯 BetAcadêmica

Plataforma fictícia de apostas esportivas desenvolvida como trabalho acadêmico.

---

## 👥 Integrantes

- **Kauã Neves** — Responsável pelo módulo do administrador (eventos, resultados, estatísticas) e configuração do JSON Server.
- **Arthur Santanna** — Responsável pelo módulo do usuário (apostas, histórico, extrato, ranking) e configuração das rotas e Context API.

---

## 📋 Descrição do Sistema

O BetAcadêmica é uma aplicação web que simula uma plataforma de apostas esportivas para fins exclusivamente acadêmicos. Todos os saldos, apostas e prêmios são fictícios.

O sistema possui dois perfis de usuário:

- **Administrador:** Cria e gerencia eventos esportivos, encerra apostas e registra resultados. Ao registrar um resultado, o sistema atualiza automaticamente todas as apostas daquele evento, credita os prêmios fictícios nos saldos dos vencedores e acumula pontos.
- **Usuário/Jogador:** Visualiza eventos disponíveis, realiza apostas fictícias com odds configuradas pelo admin, acompanha seu histórico, extrato de movimentações e posição no ranking.

---

## ⭐ Funcionalidade Extra: Extrato de Movimentações e Painel Estatístico

Foram implementadas duas funcionalidades extras:

### 1. Extrato de Movimentações (Usuário)
- Tela própria em `/usuario/extrato`
- Registra todas as entradas (prêmios) e saídas (apostas) na collection `movimentacoes` do JSON Server
- Exibe o saldo atual, total apostado e total recebido

### 2. Painel Estatístico (Admin)
- Tela própria em `/admin/estatisticas`
- Consome dados das collections `eventos`, `apostas` e `usuarios`
- Exibe taxa de acerto geral, esporte mais apostado, jogador mais ativo, distribuição por status e por esporte com barras visuais

---

## 📏 Regras de Negócio

- O administrador não pode realizar apostas.
- O usuário não tem acesso às telas administrativas.
- Um usuário só pode apostar uma vez por evento.
- O valor mínimo de aposta é R$ 10 (fictício).
- O saldo do usuário não pode ficar negativo — o sistema bloqueia a aposta se o saldo for insuficiente.
- O retorno de uma aposta é calculado como: `valor apostado × odd do palpite escolhido`.
- Ao registrar um resultado, todas as apostas pendentes do evento são atualizadas automaticamente.
- Pontos são acumulados ao ganhar apostas: cada R$ 10 de prêmio = 1 ponto.
- O ranking é baseado nos pontos acumulados, com níveis Bronze (0–99), Prata (100–299) e Ouro (300+).
- Encerrar um evento impede novas apostas nele.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** com Vite
- **React Router DOM v6** — navegação e rotas protegidas
- **React Hooks** — useState, useEffect, useContext, useParams, useNavigate
- **Context API** — gerenciamento de autenticação global
- **Axios** — consumo da API
- **JSON Server** — API REST simulada
- **CSS Modules** — estilização escopada por componente
- **GitHub** — versionamento com commits individuais

---

## ▶️ Como Executar

### Pré-requisitos
- Node.js 18+ instalado

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o JSON Server (em um terminal separado)
```bash
npm run server
```
O JSON Server vai rodar em: `http://localhost:3001`

### 3. Iniciar o React (em outro terminal)
```bash
npm run dev
```
A aplicação vai abrir em: `http://localhost:5173`

> **Importante:** O JSON Server precisa estar rodando antes de usar a aplicação.

---

## 👤 Usuários de Teste

| Nome | E-mail | Senha | Perfil | Saldo |
|------|--------|-------|--------|-------|
| Administrador | admin@bet.com | 123 | Admin | — |
| João Jogador | joao@bet.com | 123 | Usuário | R$ 1.000 |
| Maria Silva | maria@bet.com | 123 | Usuário | R$ 750 |
| Pedro Costa | pedro@bet.com | 123 | Usuário | R$ 1.200 |

---

## 🗺️ Principais Rotas

| Rota | Perfil | Descrição |
|------|--------|-----------|
| `/login` | Público | Tela de login |
| `/admin/dashboard` | Admin | Painel geral do admin |
| `/admin/eventos` | Admin | Criar, editar, encerrar e deletar eventos |
| `/admin/resultados` | Admin | Registrar resultados de eventos encerrados |
| `/admin/estatisticas` | Admin | Painel estatístico da plataforma |
| `/usuario/dashboard` | Usuário | Painel do jogador com resumo |
| `/usuario/eventos` | Usuário | Listar eventos abertos com filtro por esporte |
| `/usuario/apostar/:id` | Usuário | Tela de aposta em um evento específico |
| `/usuario/historico` | Usuário | Histórico de todas as apostas |
| `/usuario/extrato` | Usuário | Extrato de movimentações fictícias |
| `/ranking` | Usuário | Ranking de jogadores por pontuação |

---

## 🗂️ Estrutura de Pastas

```
src/
├── components/       # Navbar reutilizável
├── contexts/         # AuthContext (Context API)
├── pages/
│   ├── admin/        # AdminDashboard, AdminEventos, AdminResultados, AdminEstatisticas
│   └── usuario/      # UsuarioDashboard, UsuarioEventos, UsuarioAposta, UsuarioHistorico, UsuarioExtrato
│   └── Login.jsx
│   └── Ranking.jsx
├── routes/           # RotaPrivada (proteção de rotas por perfil)
├── services/         # api.js (axios + todas as chamadas à API)
├── styles/           # global.css
├── App.jsx           # Definição de todas as rotas
└── main.jsx          # Ponto de entrada
```

---

## 🔄 Divisão de Tarefas

### Kauã Neves
- Configuração inicial do projeto Vite + React
- Configuração do JSON Server e db.json
- Página de Login com autenticação simulada
- Módulo Admin: Dashboard, Eventos (CRUD completo), Resultados
- Lógica de atualização automática das apostas ao registrar resultado
- Painel Estatístico do Admin

### Arthur Santanna
- Context API (AuthContext) e gerenciamento de sessão
- Rotas protegidas por perfil (RotaPrivada)
- Módulo Usuário: Dashboard, Eventos com filtro, Tela de Aposta
- Histórico de Apostas com filtros
- Extrato de Movimentações
- Página de Ranking com sistema de pontos e níveis
- Navbar responsiva reutilizável
- Estilização geral com CSS Modules

---

## 💻 Principais Telas

### Login
Tela central com campos de e-mail e senha. Valida as credenciais contra o JSON Server e redireciona conforme o perfil.

### Dashboard Admin
Cards com estatísticas gerais: total de eventos, eventos abertos/encerrados, total de apostas, jogadores cadastrados e apostas pendentes.

### Gerenciar Eventos (Admin)
Formulário para criar/editar eventos com nome dos times, esporte, data e odds. Permite encerrar eventos (impede novas apostas) e deletá-los.

### Registrar Resultados (Admin)
Lista eventos encerrados sem resultado. O admin seleciona o vencedor e o sistema processa automaticamente todas as apostas do evento, atualiza saldos e pontos.

### Dashboard Usuário
Exibe saldo fictício, resumo de apostas (ganhou/perdeu/pendente), nível do jogador e atalhos para as principais ações.

### Eventos Disponíveis (Usuário)
Lista eventos abertos com filtro por esporte, odds de cada palpite e indica se o usuário já apostou no evento.

### Tela de Aposta
Exibe o evento, permite escolher o palpite, digitar o valor (com atalhos de valor rápido), e mostra o retorno potencial calculado em tempo real.

### Histórico de Apostas
Lista todas as apostas do usuário com filtro por status. Exibe resumo de total apostado, recebido e resultado fictício.

### Extrato de Movimentações
Histórico financeiro fictício com todas as entradas e saídas, separadas por ícone e cor.

### Ranking
Lista de jogadores ordenados por pontos com indicação de posição, nível (Bronze/Prata/Ouro) e destaque para o próprio usuário.

---

## ⚠️ Dificuldades Encontradas

- Sincronizar o saldo do Context API com os dados do JSON Server após atualização.
- Gerenciar a lógica de processamento em loop das apostas ao registrar um resultado (garantir que todas sejam atualizadas mesmo com múltiplas requisições assíncronas).
- Evitar que o usuário apostasse duas vezes no mesmo evento — resolvido verificando as apostas existentes ao carregar a tela.
- CSS Modules com classes condicionais — tomou um tempo até entender bem a sintaxe de template string.

---

## 🚀 Melhorias Futuras

- Adicionar sistema de notificações quando um resultado for registrado
- Implementar paginação no histórico de apostas
- Criar tela de perfil do usuário para editar nome/senha
- Adicionar mais esportes e tipos de apostas (placar exato, handicap)
- Implementar animações de entrada nas telas
- Adicionar gráfico de evolução do saldo ao longo do tempo

---

> **Aviso:** Este projeto possui finalidade exclusivamente acadêmica. Todos os valores, saldos e apostas são completamente fictícios. Nenhum dado real, transação financeira, PIX, cartão ou integração com plataformas reais foi utilizado.
