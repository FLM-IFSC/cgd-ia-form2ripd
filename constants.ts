/**
 * @file constants.ts
 * @description Armazena constantes utilizadas em toda a aplicação, como opções para
 * campos de seleção e checkboxes. Centralizar esses dados facilita a manutenção e
 * garante consistência.
 */

/**
 * @const CATEGORIAS_DADOS_SENSIVEIS
 * @description Lista de categorias de dados pessoais sensíveis, conforme definido pela LGPD.
 * Usado no formulário para seleção múltipla.
 */
export const CATEGORIAS_DADOS_SENSIVEIS = [
  'Origem racial ou étnica',
  'Convicção religiosa',
  'Opinião política',
  'Filiação a sindicato',
  'Dado referente à saúde ou à vida sexual',
  'Dado genético ou biométrico'
];

/**
 * @const CATEGORIAS_TITULARES
 * @description Lista de categorias de titulares de dados comuns em uma instituição de ensino.
 * Usado no formulário para seleção múltipla.
 */
export const CATEGORIAS_TITULARES = [
  'Alunos',
  'Servidores (Docentes/TAEs)',
  'Funcionários Terceirizados',
  'Candidatos a Vagas',
  'Visitantes',
  'Comunidade Externa'
];

/**
 * @const BASES_LEGAIS
 * @description Lista das bases legais para tratamento de dados pessoais previstas no Art. 7º da LGPD.
 * Usado no formulário em um campo de seleção (dropdown).
 */
export const BASES_LEGAIS = [
  'Consentimento do titular',
  'Cumprimento de obrigação legal ou regulatória pelo controlador',
  'Execução de políticas públicas',
  'Estudos por órgão de pesquisa',
  'Execução de contrato',
  'Exercício regular de direitos',
  'Proteção da vida',
  'Tutela da saúde',
  'Legítimo interesse do controlador'
];