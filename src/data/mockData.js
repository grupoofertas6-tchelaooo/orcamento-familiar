const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const mesAtual = new Date().getMonth()

export const categorias = [
  { id: 1, nome: 'Moradia', icone: 'home', cor: '#4A90D9', limiteMensal: 1500, gasto: 1320 },
  { id: 2, nome: 'Alimentação', icone: 'fast-food', cor: '#FF9800', limiteMensal: 1200, gasto: 980 },
  { id: 3, nome: 'Transporte', icone: 'car', cor: '#9C27B0', limiteMensal: 500, gasto: 350 },
  { id: 4, nome: 'Educação', icone: 'school', cor: '#4CAF50', limiteMensal: 600, gasto: 520 },
  { id: 5, nome: 'Saúde', icone: 'medical', cor: '#E53935', limiteMensal: 400, gasto: 180 },
  { id: 6, nome: 'Lazer', icone: 'gamepad', cor: '#00BCD4', limiteMensal: 300, gasto: 240 },
  { id: 7, nome: 'Outros', icone: 'ellipsis-horizontal', cor: '#9E9E9E', limiteMensal: 200, gasto: 85 },
]

export const membros = [
  { id: 1, nome: 'Arthur', avatar: 'person', cor: '#4A90D9', totalGasto: 1250 },
  { id: 2, nome: 'Rayane', avatar: 'person', cor: '#E91E63', totalGasto: 980 },
  { id: 3, nome: 'Geral/Família', avatar: 'people', cor: '#6C63FF', totalGasto: 1545 },
]

export const transacoes = [
  { id: 1, descricao: 'Aluguel', valor: 1200, data: '2026-05-05', categoriaId: 1, usuarioId: 3, tipo: 'despesa' },
  { id: 2, descricao: 'Supermercado', valor: 450, data: '2026-05-06', categoriaId: 2, usuarioId: 3, tipo: 'despesa' },
  { id: 3, descricao: 'Salário Arthur', valor: 4500, data: '2026-05-01', categoriaId: 1, usuarioId: 1, tipo: 'receita' },
  { id: 4, descricao: 'Gasolina', valor: 180, data: '2026-05-07', categoriaId: 3, usuarioId: 1, tipo: 'despesa' },
  { id: 5, descricao: 'Salário Rayane', valor: 3800, data: '2026-05-02', categoriaId: 1, usuarioId: 2, tipo: 'receita' },
  { id: 6, descricao: 'Curso Online', valor: 350, data: '2026-05-08', categoriaId: 4, usuarioId: 2, tipo: 'despesa' },
  { id: 7, descricao: 'Farmácia', valor: 120, data: '2026-05-09', categoriaId: 5, usuarioId: 3, tipo: 'despesa' },
  { id: 8, descricao: 'Internet', valor: 120, data: '2026-05-03', categoriaId: 1, usuarioId: 3, tipo: 'despesa' },
  { id: 9, descricao: 'Cinema', valor: 60, data: '2026-05-10', categoriaId: 6, usuarioId: 1, tipo: 'despesa' },
  { id: 10, descricao: 'Uber', valor: 35, data: '2026-05-10', categoriaId: 3, usuarioId: 2, tipo: 'despesa' },
  { id: 11, descricao: 'Restaurante', valor: 120, data: '2026-05-11', categoriaId: 2, usuarioId: 1, tipo: 'despesa' },
  { id: 12, descricao: 'Academia', valor: 89, data: '2026-05-04', categoriaId: 5, usuarioId: 2, tipo: 'despesa' },
  { id: 13, descricao: 'Faculdade', valor: 170, data: '2026-05-05', categoriaId: 4, usuarioId: 1, tipo: 'despesa' },
  { id: 14, descricao: 'Feira', valor: 230, data: '2026-05-12', categoriaId: 2, usuarioId: 3, tipo: 'despesa' },
  { id: 15, descricao: 'Luz', valor: 95, data: '2026-05-06', categoriaId: 1, usuarioId: 3, tipo: 'despesa' },
]

export const metas = [
  {
    id: 1,
    titulo: 'Viagem para Gramado',
    valorObjetivo: 5000,
    valorAtual: 1850,
    dataLimite: '2026-06-15',
    icone: 'airplane',
    cor: '#6C63FF',
  },
  {
    id: 2,
    titulo: 'Fundo de Emergência',
    valorObjetivo: 10000,
    valorAtual: 4200,
    dataLimite: '2026-12-31',
    icone: 'shield-checkmark',
    cor: '#4CAF50',
  },
  {
    id: 3,
    titulo: 'Trocar de Celular',
    valorObjetivo: 3000,
    valorAtual: 1500,
    dataLimite: '2026-08-30',
    icone: 'phone-portrait',
    cor: '#FF9800',
  },
]

export const getTotalReceitas = () =>
  transacoes.filter((t) => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0)

export const getTotalDespesas = () =>
  transacoes.filter((t) => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0)

export const getSaldo = () => getTotalReceitas() - getTotalDespesas()

export const getTransacoesPorMes = (mes) =>
  transacoes.sort((a, b) => new Date(b.data) - new Date(a.data))

export const getGastoPorMembro = (membroId) =>
  transacoes
    .filter((t) => t.usuarioId === membroId && t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0)

export const getCategoriaPorId = (id) => categorias.find((c) => c.id === id)
export const getMembroPorId = (id) => membros.find((m) => m.id === id)

export { meses, mesAtual }
