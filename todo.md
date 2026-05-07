# Controle Financeiro — TODO

## Schema & Backend
- [x] Schema Drizzle: tabelas salaries, expenses, incomes, debts, cards
- [x] Migration SQL aplicada via webdev_execute_sql
- [x] db.ts: helpers de query para todos os módulos
- [x] routers.ts: procedures tRPC para salários
- [x] routers.ts: procedures tRPC para despesas
- [x] routers.ts: procedures tRPC para receitas
- [x] routers.ts: procedures tRPC para dívidas
- [x] routers.ts: procedures tRPC para cartão de crédito

## Frontend — Login
- [x] Tela de login com identidade visual geometria sagrada / proporção áurea
- [x] Fundo creme quente com line art dourada (espiral áurea + círculos)
- [x] Botão de login via Google (Manus OAuth)
- [x] Layout mobile-first

## Frontend — App Principal
- [x] index.css: tokens de design (creme, dourado, azul-marinho)
- [x] Fonte tipográfica elegante via Google Fonts
- [x] Header com salário total e botão de adicionar salário
- [x] Lista de salários com exclusão
- [x] Cards de resumo: Renda Total, Gastos Totais, Saldo (cor dinâmica)
- [x] Navegação por abas mobile (Despesas, Receitas, Dívidas, Cartão, Calendário)
- [x] Módulo Despesas: categorias coloridas, formulário, lista com exclusão
- [x] Módulo Receitas: formulário com data, lista com exclusão
- [x] Módulo Dívidas: tipos, vencimento, marcar pago, exclusão
- [x] Módulo Cartão: bandeiras, parcelamento, barra de limite, exclusão
- [x] Calendário financeiro: navegação mensal, dots coloridos por dia, detalhamento

## Qualidade
- [x] Vitest: testes dos routers financeiros
- [x] Checkpoint final

## Metas (NOVO)
- [x] Schema Drizzle: tabela goals com categorias
- [x] Migration SQL aplicada via webdev_execute_sql
- [x] db.ts: helpers de query para Metas (CRUD + depósito)
- [x] routers.ts: procedures tRPC para Metas
- [x] Página Metas.tsx com formulário, listagem e depósito
- [x] Botão Metas na navegação entre Cartão e Calendário
- [x] Sistema de notificações ao atingir meta (toast)
- [x] Barra de progresso visual por meta
- [x] Marcar meta como concluída
