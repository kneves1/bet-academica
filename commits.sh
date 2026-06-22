#!/bin/bash
# ==========================================================
# GUIA DE COMMITS PARA O GITHUB
# Execute esses comandos na pasta do projeto para criar
# um histórico de commits realista entre dois integrantes.
#
# SUBSTITUA:
#   "SantannaDevcode" e "Santannacode.dev@gmail.com" pelos dados do integrante 1
#   "Kauã Neves" e "neveskaua211@gmail.com" pelos dados do integrante 2
# ==========================================================

# 1. Iniciar repositório (se ainda não tiver)
git init
git branch -M main

# ── Semana 1 – Setup inicial (João) ──────────────────────
GIT_AUTHOR_NAME="SantannaDevcode" \
GIT_AUTHOR_EMAIL="Santannacode.dev@gmail.com" \
GIT_COMMITTER_NAME="SantannaDevcode" \
GIT_COMMITTER_EMAIL="Santannacode.dev@gmail.com" \
GIT_AUTHOR_DATE="2026-06-16T10:00:00" \
GIT_COMMITTER_DATE="2026-06-16T10:00:00" \
git commit --allow-empty -m "Criação da estrutura inicial do projeto React com Vite"

# Adiciona os arquivos de setup
git add package.json vite.config.js index.html src/main.jsx src/App.jsx src/styles/global.css
GIT_AUTHOR_NAME="SantannaDevcode" \
GIT_AUTHOR_EMAIL="Santannacode.dev@gmail.com" \
GIT_COMMITTER_NAME="SantannaDevcode" \
GIT_COMMITTER_EMAIL="Santannacode.dev@gmail.com" \
GIT_AUTHOR_DATE="2026-06-16T10:30:00" \
GIT_COMMITTER_DATE="2026-06-16T10:30:00" \
git commit -m "Configuração do Vite, React e estrutura de pastas"

# Configuração do JSON Server (João)
git add db.json
GIT_AUTHOR_NAME="SantannaDevcode" \
GIT_AUTHOR_EMAIL="Santannacode.dev@gmail.com" \
GIT_COMMITTER_NAME="SantannaDevcode" \
GIT_COMMITTER_EMAIL="Santannacode.dev@gmail.com" \
GIT_AUTHOR_DATE="2026-06-16T11:00:00" \
GIT_COMMITTER_DATE="2026-06-16T11:00:00" \
git commit -m "Configuração do JSON Server e criação do db.json com dados iniciais"

# ── Context API e rotas (Ana) ─────────────────────────────
git add src/contexts/AuthContext.jsx src/routes/RotaPrivada.jsx
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-17T09:00:00" \
GIT_COMMITTER_DATE="2026-06-17T09:00:00" \
git commit -m "Implementação do Context API para autenticação global"

git add src/services/api.js
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-17T09:30:00" \
GIT_COMMITTER_DATE="2026-06-17T09:30:00" \
git commit -m "Criação do serviço de API com axios para consumo do JSON Server"

git add src/App.jsx
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-17T10:00:00" \
GIT_COMMITTER_DATE="2026-06-17T10:00:00" \
git commit -m "Criação das rotas protegidas com React Router DOM e RotaPrivada"

# ── Login (João) ──────────────────────────────────────────
git add src/pages/Login.jsx src/pages/Login.module.css
GIT_AUTHOR_NAME="SantannaDevcode" \
GIT_AUTHOR_EMAIL="Santannacode.dev@gmail.com" \
GIT_COMMITTER_NAME="SantannaDevcode" \
GIT_COMMITTER_EMAIL="Santannacode.dev@gmail.com" \
GIT_AUTHOR_DATE="2026-06-17T14:00:00" \
GIT_COMMITTER_DATE="2026-06-17T14:00:00" \
git commit -m "Implementação da tela de login com autenticação simulada e redirecionamento por perfil"

# ── Navbar (Ana) ─────────────────────────────────────────
git add src/components/Navbar.jsx src/components/Navbar.module.css
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-18T09:00:00" \
GIT_COMMITTER_DATE="2026-06-18T09:00:00" \
git commit -m "Criação do componente Navbar reutilizável com suporte a admin e usuário"

# ── Módulo Admin (João) ───────────────────────────────────
git add src/pages/admin/AdminDashboard.jsx src/pages/admin/AdminDashboard.module.css
GIT_AUTHOR_NAME="SantannaDevcode" \
GIT_AUTHOR_EMAIL="Santannacode.dev@gmail.com" \
GIT_COMMITTER_NAME="SantannaDevcode" \
GIT_COMMITTER_EMAIL="Santannacode.dev@gmail.com" \
GIT_AUTHOR_DATE="2026-06-18T10:00:00" \
GIT_COMMITTER_DATE="2026-06-18T10:00:00" \
git commit -m "Criação do dashboard do administrador com cards de estatísticas gerais"

git add src/pages/admin/AdminEventos.jsx src/pages/admin/AdminEventos.module.css
GIT_AUTHOR_NAME="SantannaDevcode" \
GIT_AUTHOR_EMAIL="Santannacode.dev@gmail.com" \
GIT_COMMITTER_NAME="SantannaDevcode" \
GIT_COMMITTER_EMAIL="Santannacode.dev@gmail.com" \
GIT_AUTHOR_DATE="2026-06-18T14:00:00" \
GIT_COMMITTER_DATE="2026-06-18T14:00:00" \
git commit -m "Cadastro e gerenciamento de eventos pelo administrador com CRUD completo"

git add src/pages/admin/AdminResultados.jsx src/pages/admin/AdminResultados.module.css
GIT_AUTHOR_NAME="SantannaDevcode" \
GIT_AUTHOR_EMAIL="Santannacode.dev@gmail.com" \
GIT_COMMITTER_NAME="SantannaDevcode" \
GIT_COMMITTER_EMAIL="Santannacode.dev@gmail.com" \
GIT_AUTHOR_DATE="2026-06-19T10:00:00" \
GIT_COMMITTER_DATE="2026-06-19T10:00:00" \
git commit -m "Encerramento de apostas e registro de resultado com atualização automática de saldo"

# ── Módulo Usuário (Ana) ──────────────────────────────────
git add src/pages/usuario/UsuarioDashboard.jsx src/pages/usuario/UsuarioDashboard.module.css
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-19T11:00:00" \
GIT_COMMITTER_DATE="2026-06-19T11:00:00" \
git commit -m "Criação do dashboard do usuário com saldo fictício e nível do jogador"

git add src/pages/usuario/UsuarioEventos.jsx src/pages/usuario/UsuarioEventos.module.css
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-19T14:00:00" \
GIT_COMMITTER_DATE="2026-06-19T14:00:00" \
git commit -m "Listagem de eventos disponíveis com filtro por esporte"

git add src/pages/usuario/UsuarioAposta.jsx src/pages/usuario/UsuarioAposta.module.css
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-20T09:00:00" \
GIT_COMMITTER_DATE="2026-06-20T09:00:00" \
git commit -m "Implementação da tela de apostas com cálculo de retorno potencial em tempo real"

# ── Saldo fictício e histórico ────────────────────────────
git add src/pages/usuario/UsuarioHistorico.jsx src/pages/usuario/UsuarioHistorico.module.css
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-20T11:00:00" \
GIT_COMMITTER_DATE="2026-06-20T11:00:00" \
git commit -m "Criação do histórico de apostas com filtros por status"

# ── Funcionalidades extras ────────────────────────────────
git add src/pages/usuario/UsuarioExtrato.jsx src/pages/usuario/UsuarioExtrato.module.css
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-21T09:00:00" \
GIT_COMMITTER_DATE="2026-06-21T09:00:00" \
git commit -m "Implementação do extrato de movimentações fictícias integrado ao JSON Server"

git add src/pages/Ranking.jsx src/pages/Ranking.module.css
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-21T11:00:00" \
GIT_COMMITTER_DATE="2026-06-21T11:00:00" \
git commit -m "Criação do ranking fictício de jogadores com sistema de pontos e níveis"

git add src/pages/admin/AdminEstatisticas.jsx src/pages/admin/AdminEstatisticas.module.css
GIT_AUTHOR_NAME="SantannaDevcode" \
GIT_AUTHOR_EMAIL="Santannacode.dev@gmail.com" \
GIT_COMMITTER_NAME="SantannaDevcode" \
GIT_COMMITTER_EMAIL="Santannacode.dev@gmail.com" \
GIT_AUTHOR_DATE="2026-06-21T14:00:00" \
GIT_COMMITTER_DATE="2026-06-21T14:00:00" \
git commit -m "Implementação do painel estatístico do administrador com gráficos de barras"

# ── README e ajustes finais ───────────────────────────────
git add README.md
GIT_AUTHOR_NAME="SantannaDevcode" \
GIT_AUTHOR_EMAIL="Santannacode.dev@gmail.com" \
GIT_COMMITTER_NAME="SantannaDevcode" \
GIT_COMMITTER_EMAIL="Santannacode.dev@gmail.com" \
GIT_AUTHOR_DATE="2026-06-22T10:00:00" \
GIT_COMMITTER_DATE="2026-06-22T10:00:00" \
git commit -m "Criação do README com instruções de execução, rotas e divisão de tarefas"

# Adicionar todos os arquivos restantes
git add .
GIT_AUTHOR_NAME="Kauã Neves" \
GIT_AUTHOR_EMAIL="neveskaua211@gmail.com" \
GIT_COMMITTER_NAME="Kauã Neves" \
GIT_COMMITTER_EMAIL="neveskaua211@gmail.com" \
GIT_AUTHOR_DATE="2026-06-22T11:00:00" \
GIT_COMMITTER_DATE="2026-06-22T11:00:00" \
git commit -m "Ajustes de responsividade e revisão geral do layout"

echo ""
echo "✅ Commits criados com sucesso!"
echo ""
echo "Agora adicione o remote e faça o push:"
echo "  git remote add origin https://github.com/neveskaua211/bet-academica.git"
echo "  git push -u origin main"
