const PREMIUM_FEATURES = {
  CHARTS: 'charts',
  RECURRENT: 'recurrent',
  CATEGORY_BUDGET: 'category_budget',
  FAMILY_SHARE: 'family_share',
  DARK_MODE: 'dark_mode',
  INSTALLMENTS: 'installments',
  RECEIPT_PHOTO: 'receipt_photo',
  BALANCE_CHART: 'balance_chart',
}

const FEATURE_LABELS = {
  [PREMIUM_FEATURES.CHARTS]: 'Gráficos por categoria',
  [PREMIUM_FEATURES.RECURRENT]: 'Transações recorrentes',
  [PREMIUM_FEATURES.CATEGORY_BUDGET]: 'Orçamento por categoria',
  [PREMIUM_FEATURES.FAMILY_SHARE]: 'Compartilhar com família',
  [PREMIUM_FEATURES.DARK_MODE]: 'Modo escuro',
  [PREMIUM_FEATURES.INSTALLMENTS]: 'Parcelamento',
  [PREMIUM_FEATURES.RECEIPT_PHOTO]: 'Anexar foto do comprovante',
  [PREMIUM_FEATURES.BALANCE_CHART]: 'Evolução do saldo',
}

const FREE_FEATURES = [
  'Lançar receitas e despesas',
  'Categorias ilimitadas',
  'Metas de economia',
  'Controle de membros',
  'Exportar relatórios PDF/CSV',
  'Extrato mensal',
  'Rateio entre membros',
]

export { PREMIUM_FEATURES, FEATURE_LABELS, FREE_FEATURES }
