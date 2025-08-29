import type { WizardStep, FormData } from '../types';
import { IFSC_CAMPUS_LIST } from './ifscData';

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'intro',
    title: 'Introdução e Escopo',
    fields: [
      { id: 'campusName', label: 'Selecione o Câmpus', type: 'select', options: IFSC_CAMPUS_LIST, required: true },
      { 
        id: 'ambientesCobertos', 
        label: 'Quais ambientes utilizam o controle de acesso por biometria?', 
        type: 'checkbox',
        options: [
            { key: 'labs', text: 'Laboratórios de Ensino / Pesquisa' },
            { key: 'ti', text: 'Salas de TI / Racks' },
            { key: 'dataCenter', text: 'Datacenter Local' },
            { key: 'recepcao', text: 'Recepção / Entrada Principal' },
            { key: 'almoxarifado', text: 'Almoxarifado / Patrimônio' },
            { key: 'other', text: 'Outro(s) ambiente(s)', isCustomTrigger: true }
        ],
      },
      { id: 'numeroDispositivos', label: 'Número de dispositivos biométricos instalados', type: 'number', placeholder: 'Ex: 5' }
    ]
  },
  {
    id: 'systemDetails',
    title: 'Detalhes do Sistema',
    fields: [
        { 
            id: 'brands', 
            label: 'Marcas dos Equipamentos Utilizados (se aplicável)', 
            type: 'checkbox',
            options: [
                { key: 'intelbras', text: 'Intelbras' },
                { key: 'dahua', text: 'Dahua' },
                { key: 'zkteco', text: 'ZKTeco' },
                { key: 'hikvision', text: 'Hikvision' },
                { key: 'other', text: 'Outra(s) marca(s)', isCustomTrigger: true }
            ],
        },
        { 
            id: 'installationType', 
            label: 'Modelo de Instalação da Infraestrutura', 
            type: 'radio',
            options: [
                { key: 'local', text: 'Local / On-Premise' },
                { key: 'terceirizado', text: 'Terceirizado / Nuvem' },
            ]
        },
        {
          id: 'providerName',
          label: 'Nome da Empresa Fornecedora',
          type: 'text',
          placeholder: 'Ex: Amazon Web Services',
          condition: (formData: FormData) => formData.systemDetails?.installationType === 'terceirizado',
        },
        {
          id: 'dataLocation',
          label: 'País Principal de Armazenamento dos Dados',
          type: 'text',
          placeholder: 'Ex: Brasil, EUA',
          condition: (formData: FormData) => formData.systemDetails?.installationType === 'terceirizado',
        },
        {
          id: 'privacyPolicyLink',
          label: 'Link para a Política de Privacidade/Segurança',
          type: 'text',
          placeholder: 'https://...',
          condition: (formData: FormData) => formData.systemDetails?.installationType === 'terceirizado',
        },
    ]
  },
  {
    id: 'technicalMeasures',
    title: 'Medidas Técnicas',
    fields: [
      { 
        id: 'criptografia', 
        label: 'Criptografia', 
        type: 'checkbox',
        options: [
          { key: 'aes256', text: 'Os dados em repouso são protegidos por criptografia (Ex: AES-256).' },
          { key: 'tls13', text: 'A transmissão de dados (em trânsito) utiliza protocolo seguro (Ex: TLS 1.3).' },
          { key: 'other', text: 'Outro(s) tipo(s) de criptografia', isCustomTrigger: true },
        ],
        unknown: { key: 'naoSei', text: 'Não sei informar / Não avaliado' }
      },
      { 
        id: 'controleAcesso', 
        label: 'Controle de Acesso Lógico', 
        type: 'checkbox',
        options: [
          { key: 'minPrivilege', text: 'O acesso é restrito com base no princípio do menor privilégio.' },
          { key: 'mfa', text: 'O acesso administrativo aos sistemas exige autenticação multifator (MFA).' },
          { key: 'review', text: 'Os perfis de acesso são revisados periodicamente.' },
          { key: 'other', text: 'Outro(s) controle(s) de acesso', isCustomTrigger: true },
        ],
        unknown: { key: 'naoSei', text: 'Não sei informar / Não avaliado' }
      },
       { 
        id: 'rede', 
        label: 'Segurança de Rede', 
        type: 'checkbox',
        options: [
          { key: 'vlan', text: 'Os servidores de biometria estão em uma rede segregada (VLAN).' },
          { key: 'firewall', text: 'Firewalls com regras restritivas protegem o perímetro da rede.' },
          { key: 'idsIps', text: 'Sistemas de Detecção/Prevenção de Intrusão (IDS/IPS) monitoram o tráfego.' },
          { key: 'other', text: 'Outra(s) medida(s) de segurança de rede', isCustomTrigger: true },
        ],
        unknown: { key: 'naoSei', text: 'Não sei informar / Não avaliado' }
      },
    ]
  },
    {
    id: 'organizationalMeasures',
    title: 'Medidas Organizacionais (Alinhamento DTIC)',
    fields: [
      { 
        id: 'politicas', 
        label: 'Políticas e Procedimentos', 
        type: 'checkbox',
        options: [
          { key: 'cientePsi', text: 'A equipe local está ciente da Política de Segurança da Informação (PSI) do IFSC?' },
          { key: 'cienteNormativa', text: 'A equipe local conhece a normativa de tratamento de dados biométricos do IFSC?' },
          { key: 'other', text: 'Outro(s) procedimento(s) conhecido(s)', isCustomTrigger: true },
        ],
        needsHelp: { key: 'precisaAjuda', text: 'Não foi avaliado / Precisamos de ajuda da DTIC' }
      },
      { 
        id: 'gestaoIncidentes', 
        label: 'Gestão de Incidentes e Continuidade', 
        type: 'checkbox',
        options: [
          { key: 'cientePri', text: 'A equipe local conhece o Plano de Resposta a Incidentes (PRI) da DTIC?' },
          { key: 'conheceBackup', text: 'Os procedimentos de backup e restauração dos dados estão documentados e são conhecidos pela equipe?' },
          { key: 'other', text: 'Outro(s) plano(s) conhecido(s)', isCustomTrigger: true },
        ],
        needsHelp: { key: 'precisaAjuda', text: 'Não foi avaliado / Precisamos de ajuda da DTIC' }
      },
    ]
  },
  {
    id: 'conclusion',
    title: 'Auditorias e Conclusão',
    fields: [
       { 
        id: 'auditorias', 
        label: 'Resultados de Auditorias e Testes de Segurança', 
        type: 'checkbox',
        options: [
          { key: 'pentest', text: 'Pentests (testes de invasão) são realizados periodicamente.' },
          { key: 'scans', text: 'Scans de vulnerabilidade são executados para identificar falhas.' },
          { key: 'auditoriaLgpd', text: 'Auditorias internas de conformidade com a LGPD são realizadas.' },
          { key: 'other', text: 'Outro(s) tipo(s) de teste', isCustomTrigger: true },
        ],
        unknown: { key: 'semTestes', text: 'Nenhum teste de segurança foi realizado formalmente até o momento.' }
      },
       { 
        id: 'nivelSeguranca', 
        label: 'Nível de Segurança Percebido', 
        type: 'radio',
        options: [
          { key: 'Alto', text: 'Alto' },
          { key: 'Médio', text: 'Médio' },
          { key: 'Adequado', text: 'Adequado' },
        ]
      },
      { id: 'melhorias', label: 'Recomendações e Melhorias Futuras (Opcional)', type: 'textarea', placeholder: 'Liste recomendações para aprimorar a segurança. Ex: Implementar um sistema de detecção de vivacidade (liveness detection)...' },
    ]
  }
];
