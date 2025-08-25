/**
 * @file types.js
 * @description Este arquivo centraliza todas as definições de tipos e interfaces TypeScript
 * utilizadas na aplicação, garantindo consistência e segurança de tipos em todo o projeto.
 */

/**
 * @interface ProcessoData
 * @description Define a estrutura de dados completa para um processo de tratamento de dados.
 * Corresponde a todos os campos do formulário de mapeamento.
 */
export interface ProcessoData {
  /** ID único do processo, gerado no momento da submissão. Opcional pois não existe antes da criação. */
  id?: number;
  /** Nome do processo ou atividade que realiza o tratamento de dados. */
  nomeProcesso: string;
  /** Unidade ou setor do IFSC responsável pelo processo. */
  unidadeSetor: string;
  /** Nome do gestor responsável pelo processo. */
  gestorProcesso: string;
  /** Descrição sucinta do que o processo faz. */
  descricaoProcesso: string;
  /** Data em que o tratamento de dados para este processo foi iniciado. */
  dataInicioTratamento: string;
  /** A finalidade principal para a qual os dados são coletados e tratados. */
  finalidadeTratamento: string;
  /** Indica se o processo envolve o tratamento de dados pessoais. */
  trataDadosPessoais: 'Sim' | 'Não';
  /** Indica se o processo envolve o tratamento de dados pessoais sensíveis. */
  trataDadosSensiveis: 'Sim' | 'Não';
  /** Lista das categorias de dados sensíveis tratados, se aplicável. */
  categoriasDadosSensiveis: string[];
  /** Indica se o processo trata dados de crianças ou adolescentes. */
  trataDadosCriancasAdolescentes: 'Sim' | 'Não';
  /** Lista das categorias de titulares cujos dados são tratados (ex: Alunos, Servidores). */
  categoriasTitulares: string[];
  /** Descrição ou lista dos dados pessoais específicos que são coletados. */
  dadosPessoaisColetados: string;
  /** A base legal da LGPD que justifica o tratamento dos dados. */
  baseLegal: string;
  /** Norma, lei ou regulamento específico que ampara o tratamento, se aplicável. */
  previsaoLegal: string;
  /** De onde os dados são originados (ex: formulário online, sistema acadêmico). */
  fonteDados: string;
  /** Indica se há compartilhamento de dados com outras entidades. */
  compartilhaDados: 'Sim' | 'Não';
  /** Lista detalhada das entidades com as quais os dados são compartilhados e a finalidade. */
  detalhesCompartilhamento: CompartilhamentoDetalhe[];
  /** Período durante o qual os dados serão armazenados. */
  tempoRetencao: string;
  /** Descrição das medidas de segurança técnicas e administrativas implementadas. */
  medidasSeguranca: string;
  /** Avaliação se o tratamento pode gerar alto risco aos titulares, servindo de gatilho para o RIPD. */
  altoRisco: 'Sim' | 'Não';
}

/**
 * @interface CompartilhamentoDetalhe
 * @description Modela a estrutura de um item na lista de compartilhamento de dados,
 * contendo o órgão/entidade e a finalidade do compartilhamento.
 */
export interface CompartilhamentoDetalhe {
  /** ID único para o item de compartilhamento, usado para manipulação na UI (ex: remover). */
  id: number;
  /** Nome do órgão ou entidade com quem os dados são compartilhados. */
  orgao: string;
  /** A finalidade específica para o compartilhamento dos dados. */
  finalidade: string;
}