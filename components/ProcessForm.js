/**
 * @file ProcessForm.js
 * @description Componente principal do formulário inteligente para mapeamento de processos.
 * Gerencia o estado dos dados do formulário, valida entradas e lida com a submissão.
 * Possui lógica para renderizar campos condicionalmente.
 */

import React, { useState } from 'react';
import { BASES_LEGAIS, CATEGORIAS_DADOS_SENSIVEIS, CATEGORIAS_TITULARES } from '../constants.js';
import { PlusIcon, TrashIcon } from './icons/Icons.js';

// Estado inicial do formulário, usado para preencher e resetar os campos.
const initialFormData = {
  nomeProcesso: '',
  unidadeSetor: '',
  gestorProcesso: 'Usuário Logado (Exemplo)', // Pré-preenchido como exemplo
  descricaoProcesso: '',
  dataInicioTratamento: '',
  finalidadeTratamento: '',
  trataDadosPessoais: 'Sim',
  trataDadosSensiveis: 'Não',
  categoriasDadosSensiveis: [],
  trataDadosCriancasAdolescentes: 'Não',
  categoriasTitulares: [],
  dadosPessoaisColetados: '',
  baseLegal: '',
  previsaoLegal: '',
  fonteDados: '',
  compartilhaDados: 'Não',
  detalhesCompartilhamento: [],
  tempoRetencao: '',
  medidasSeguranca: '',
  altoRisco: 'Não',
};

/**
 * Subcomponente para agrupar campos do formulário em seções lógicas.
 */
const FormSection = ({ title, children }) => (
  <div className="p-5 border border-gray-200 rounded-lg bg-white mb-6">
    <h3 className="text-lg font-semibold text-ifsc-green border-b border-gray-200 pb-2 mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

/**
 * Subcomponente reutilizável para um campo de input padrão.
 */
const InputField = 
  ({ label, id, name, value, onChange, type = 'text', required = false, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <input type={type} id={id} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ifsc-green focus:border-ifsc-green" />
  </div>
);

/**
 * Subcomponente reutilizável para um campo de textarea.
 */
const TextareaField =
 ({ label, id, name, value, onChange, required = false, rows = 3, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <textarea id={id} name={name} value={value} onChange={onChange} required={required} rows={rows} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ifsc-green focus:border-ifsc-green"></textarea>
  </div>
);


/**
 * Subcomponente reutilizável para um grupo de botões de rádio (Sim/Não).
 */
const RadioGroup =
 ({ label, name, value, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <div className="flex items-center space-x-4 mt-1">
      <label className="flex items-center"><input type="radio" name={name} value="Sim" checked={value === 'Sim'} onChange={onChange} className="focus:ring-ifsc-green h-4 w-4 text-ifsc-green border-gray-300" /> <span className="ml-2">Sim</span></label>
      <label className="flex items-center"><input type="radio" name={name} value="Não" checked={value === 'Não'} onChange={onChange} className="focus:ring-ifsc-green h-4 w-4 text-ifsc-green border-gray-300" /> <span className="ml-2">Não</span></label>
    </div>
  </div>
);

/**
 * Subcomponente reutilizável para um grupo de checkboxes.
 */
const CheckboxGroup = ({ label, options, selected, onChange, required = false }) => {
    const handleCheckboxChange = (option) => {
        const newSelection = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelection);
    };
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 p-2 rounded-md">
            {options.map(option => (
                <label key={option} className="flex items-center">
                <input type="checkbox" checked={selected.includes(option)} onChange={() => handleCheckboxChange(option)} className="focus:ring-ifsc-green h-4 w-4 text-ifsc-green border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-600">{option}</span>
                </label>
            ))}
            </div>
        </div>
    );
};

/**
 * Subcomponente reutilizável para um campo de seleção (dropdown).
 */
const SelectField =
 ({ label, id, name, value, onChange, options, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <select id={id} name={name} value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-ifsc-green focus:border-ifsc-green">
            <option value="">Selecione...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


const ProcessForm = ({ onSubmit }) => {
  // Estado que armazena todos os dados do formulário.
  const [formData, setFormData] = useState(initialFormData);

  // Manipulador genérico para campos de input, textarea e select.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manipulador específico para grupos de checkboxes.
  const handleCheckboxChange = (name, selected) => {
      setFormData(prev => ({...prev, [name]: selected}));
  }
  
  // Manipulador para atualizar os detalhes de compartilhamento (tabela dinâmica).
  const handleCompartilhamentoChange = (index, field, value) => {
    const newDetails = [...formData.detalhesCompartilhamento];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData(prev => ({ ...prev, detalhesCompartilhamento: newDetails }));
  };

  // Adiciona uma nova linha à seção de compartilhamento.
  const addCompartilhamento = () => {
    setFormData(prev => ({
      ...prev,
      detalhesCompartilhamento: [...prev.detalhesCompartilhamento, { id: Date.now(), orgao: '', finalidade: '' }]
    }));
  };

  // Remove uma linha da seção de compartilhamento pelo seu ID.
  const removeCompartilhamento = (id) => {
    setFormData(prev => ({
      ...prev,
      detalhesCompartilhamento: prev.detalhesCompartilhamento.filter(item => item.id !== id)
    }));
  };

  // Manipula o evento de submissão do formulário.
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o recarregamento da página.
    onSubmit(formData); // Chama a função de callback passada por props.
    setFormData(initialFormData); // Reseta o formulário para o estado inicial.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mapeamento de Processo LGPD</h2>

        {/* Seção A: Identificação do Processo */}
        <FormSection title="A: Identificação do Processo">
            <InputField label="Nome do Processo/Atividade" id="nomeProcesso" name="nomeProcesso" value={formData.nomeProcesso} onChange={handleChange} required />
            <InputField label="Unidade/Setor Responsável" id="unidadeSetor" name="unidadeSetor" value={formData.unidadeSetor} onChange={handleChange} required />
            <InputField label="Gestor do Processo" id="gestorProcesso" name="gestorProcesso" value={formData.gestorProcesso} onChange={handleChange} required />
            <TextareaField label="Breve Descrição do Processo" id="descricaoProcesso" name="descricaoProcesso" value={formData.descricaoProcesso} onChange={handleChange} required />
            <InputField label="Data de Início do Tratamento" id="dataInicioTratamento" name="dataInicioTratamento" type="date" value={formData.dataInicioTratamento} onChange={handleChange} />
        </FormSection>

        {/* Seção B: Natureza do Tratamento de Dados */}
        <FormSection title="B: Natureza do Tratamento de Dados">
            <TextareaField label="Finalidade do Tratamento" id="finalidadeTratamento" name="finalidadeTratamento" value={formData.finalidadeTratamento} onChange={handleChange} required />
            <RadioGroup label="Este processo trata dados pessoais?" name="trataDadosPessoais" value={formData.trataDadosPessoais} onChange={handleChange} required />
            <RadioGroup label="Este processo trata dados pessoais sensíveis?" name="trataDadosSensiveis" value={formData.trataDadosSensiveis} onChange={handleChange} required />
            {/* Renderização condicional: mostra campo de categorias de dados sensíveis apenas se a opção 'Sim' for selecionada */}
            {formData.trataDadosSensiveis === 'Sim' && (
                <CheckboxGroup label="Quais categorias de dados sensíveis?" options={CATEGORIAS_DADOS_SENSIVEIS} selected={formData.categoriasDadosSensiveis} onChange={(s) => handleCheckboxChange('categoriasDadosSensiveis', s)} />
            )}
            <RadioGroup label="Este processo trata dados de crianças ou adolescentes?" name="trataDadosCriancasAdolescentes" value={formData.trataDadosCriancasAdolescentes} onChange={handleChange} required />
            <CheckboxGroup label="Categorias de Titulares dos Dados" options={CATEGORIAS_TITULARES} selected={formData.categoriasTitulares} onChange={(s) => handleCheckboxChange('categoriasTitulares', s)} required/>
            <TextareaField label="Dados Pessoais Coletados" id="dadosPessoaisColetados" name="dadosPessoaisColetados" value={formData.dadosPessoaisColetados} onChange={handleChange} required placeholder="Ex: Nome completo, CPF, RG, Endereço..."/>
        </FormSection>

        {/* Seção C: Conformidade Legal (LGPD) */}
        <FormSection title="C: Conformidade Legal (LGPD)">
            <SelectField label="Base Legal para o Tratamento" id="baseLegal" name="baseLegal" value={formData.baseLegal} onChange={handleChange} options={BASES_LEGAIS} required/>
            <InputField label="Previsão Legal (se aplicável)" id="previsaoLegal" name="previsaoLegal" value={formData.previsaoLegal} onChange={handleChange} placeholder="Ex: Lei nº 9.394/96 (LDB)"/>
        </FormSection>

        {/* Seção D: Ciclo de Vida e Segurança do Dado */}
        <FormSection title="D: Ciclo de Vida e Segurança do Dado">
            <InputField label="Fonte dos Dados" id="fonteDados" name="fonteDados" value={formData.fonteDados} onChange={handleChange} placeholder="Ex: Formulário de inscrição online"/>
            <RadioGroup label="Há compartilhamento de dados com outros órgãos ou entidades?" name="compartilhaDados" value={formData.compartilhaDados} onChange={handleChange} required/>
            {/* Renderização condicional: mostra a seção de detalhes de compartilhamento apenas se 'Sim' for selecionado */}
            {formData.compartilhaDados === 'Sim' && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-md border">
                    <label className="block text-sm font-medium text-gray-700">Com quem e para qual finalidade?</label>
                    {formData.detalhesCompartilhamento.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end p-2 border rounded-md">
                            <InputField label={`Órgão/Entidade ${index + 1}`} id={`orgao_${item.id}`} name="orgao" value={item.orgao} onChange={(e) => handleCompartilhamentoChange(index, 'orgao', e.target.value)} />
                            <div className="flex items-end space-x-2">
                                <div className="flex-grow">
                                <InputField label="Finalidade" id={`finalidade_${item.id}`} name="finalidade" value={item.finalidade} onChange={(e) => handleCompartilhamentoChange(index, 'finalidade', e.target.value)} />
                                </div>
                                <button type="button" onClick={() => removeCompartilhamento(item.id)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addCompartilhamento} className="flex items-center space-x-2 text-sm text-ifsc-green hover:text-ifsc-green-dark font-medium">
                        <PlusIcon className="h-5 w-5"/>
                        <span>Adicionar Compartilhamento</span>
                    </button>
                </div>
            )}
            <InputField label="Tempo de Retenção/Armazenamento dos Dados" id="tempoRetencao" name="tempoRetencao" value={formData.tempoRetencao} onChange={handleChange} required placeholder="Ex: 5 anos após o desligamento do aluno"/>
            <TextareaField label="Medidas de Segurança Técnicas e Administrativas" id="medidasSeguranca" name="medidasSeguranca" value={formData.medidasSeguranca} onChange={handleChange} placeholder="Ex: Controle de acesso, armazenamento seguro..."/>
        </FormSection>

        {/* Seção E: Avaliação de Risco */}
        <FormSection title="E: Avaliação de Risco (Gatilho para o RIPD)">
             <RadioGroup label="Este tratamento pode gerar alto risco aos direitos e liberdades dos titulares?" name="altoRisco" value={formData.altoRisco} onChange={handleChange} required/>
             <p className="text-xs text-gray-500 mt-1">Considera-se alto risco: tratamento em larga escala de dados sensíveis, monitoramento sistemático, uso de tecnologias emergentes, etc.</p>
        </FormSection>

        {/* Botão de submissão do formulário */}
        <div className="flex justify-end mt-8">
          <button type="submit" className="px-6 py-3 bg-ifsc-green text-white font-bold rounded-lg shadow-md hover:bg-ifsc-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ifsc-green-dark transition-colors duration-300">
            Submeter e Mapear Processo
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProcessForm;