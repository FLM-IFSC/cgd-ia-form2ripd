/**
 * @file RipdPreviewModal.tsx
 * @description Componente modal para exibir uma pré-visualização do rascunho do Relatório de
 * Impacto à Proteção de Dados (RIPD). É acionado quando um processo de alto risco é submetido.
 * Permite a visualização e o download do rascunho em formato de texto.
 */
import React from 'react';
import { ProcessoData } from '../types.ts';
import { DocumentTextIcon, XIcon, DownloadIcon } from './icons/Icons.tsx';

// Props esperadas pelo componente RipdPreviewModal.
interface RipdPreviewModalProps {
  /** Os dados do processo de alto risco a serem exibidos no RIPD. */
  processo: ProcessoData;
  /** Função de callback para fechar o modal. */
  onClose: () => void;
}

/**
 * Subcomponente para estruturar o conteúdo do RIPD em seções com título.
 */
const RipdSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-700 border-b-2 border-ifsc-green pb-1 mb-2">{title}</h3>
        <div className="text-gray-600 prose prose-sm max-w-none">{children}</div>
    </div>
);

/**
 * Subcomponente para exibir um par de 'label' e 'valor' dentro de uma seção do RIPD.
 */
const RipdField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <p><strong>{label}:</strong> {value || <span className="text-gray-400">Não informado</span>}</p>
);

const RipdPreviewModal: React.FC<RipdPreviewModalProps> = ({ processo, onClose }) => {
    
    /**
     * Gera o conteúdo textual do rascunho do RIPD a partir dos dados do processo.
     * @returns Uma string formatada contendo o rascunho do relatório.
     */
    const generateRipdText = () => {
        let content = `RELATÓRIO DE IMPACTO À PROTEÇÃO DE DADOS (RIPD) - RASCUNHO\n`;
        content += `==========================================================\n\n`;
        content += `1. IDENTIFICAÇÃO\n`;
        content += `   - Nome do Processo: ${processo.nomeProcesso}\n`;
        content += `   - Unidade Responsável: ${processo.unidadeSetor}\n`;
        content += `   - Gestor do Processo: ${processo.gestorProcesso}\n\n`;
        content += `2. DESCRIÇÃO DO PROCESSO\n`;
        content += `   - Descrição: ${processo.descricaoProcesso}\n`;
        content += `   - Finalidade: ${processo.finalidadeTratamento}\n\n`;
        content += `3. DADOS TRATADOS\n`;
        content += `   - Categorias de Titulares: ${processo.categoriasTitulares.join(', ')}\n`;
        content += `   - Dados Pessoais Coletados: ${processo.dadosPessoaisColetados}\n`;
        content += `   - Tratamento de Dados Sensíveis: ${processo.trataDadosSensiveis}\n`;
        if (processo.trataDadosSensiveis === 'Sim') {
             content += `   - Categorias de Dados Sensíveis: ${processo.categoriasDadosSensiveis.join(', ')}\n`;
        }
        content += `   - Tratamento de Dados de Crianças/Adolescentes: ${processo.trataDadosCriancasAdolescentes}\n\n`;
        content += `4. CONFORMIDADE LEGAL\n`;
        content += `   - Base Legal: ${processo.baseLegal}\n`;
        content += `   - Previsão Legal Específica: ${processo.previsaoLegal || 'N/A'}\n\n`;
        content += `5. CICLO DE VIDA E SEGURANÇA\n`;
        content += `   - Fonte dos Dados: ${processo.fonteDados}\n`;
        content += `   - Compartilhamento: ${processo.compartilhaDados}\n`;
        if(processo.compartilhaDados === 'Sim'){
            processo.detalhesCompartilhamento.forEach(d => {
                content += `     - Com: ${d.orgao} | Para: ${d.finalidade}\n`;
            });
        }
        content += `   - Tempo de Retenção: ${processo.tempoRetencao}\n`;
        content += `   - Medidas de Segurança: ${processo.medidasSeguranca}\n\n`;
        content += `6. ANÁLISE DE NECESSIDADE E PROPORCIONALIDADE\n`;
        content += `   - [SEÇÃO A SER PREENCHIDA MANUALMENTE PELO DPO E GESTOR DO PROCESSO]\n\n`;
        content += `7. AVALIAÇÃO DETALHADA DOS RISCOS\n`;
        content += `   - [SEÇÃO A SER PREENCHIDA MANUALMENTE PELO DPO E GESTOR DO PROCESSO]\n\n`;
        content += `8. MEDIDAS PARA MITIGAÇÃO DE RISCOS\n`;
        content += `   - [SEÇÃO A SER PREENCHIDA MANUALMENTE PELO DPO E GESTOR DO PROCESSO]\n\n`;
        content += `==========================================================\n`;
        content += `Este documento é um rascunho gerado automaticamente e requer análise e complementação.\n`;
        return content;
    };

    /**
     * Manipula o clique no botão de download. Cria um arquivo .txt em memória
     * e aciona o download no navegador.
     */
    const handleDownload = () => {
        const text = generateRipdText();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `RIPD_Rascunho_${processo.nomeProcesso.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

  return (
    // Overlay do modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      {/* Conteúdo do modal */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-6 w-6 text-ifsc-green" />
            <h2 className="text-xl font-bold text-gray-800">Rascunho do RIPD Gerado</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full">
            <XIcon className="h-6 w-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
            {/* Mensagem de alerta/notificação */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <p className="text-yellow-800 text-sm">Um novo processo de tratamento de dados de alto risco foi identificado. O rascunho inicial do RIPD foi gerado e requer sua análise e complementação. Uma notificação foi enviada para o DPO e o Gestor do Processo.</p>
            </div>
          
            {/* Renderização das seções do RIPD */}
            <RipdSection title="1. Identificação do Processo">
                <RipdField label="Nome do Processo" value={processo.nomeProcesso} />
                <RipdField label="Unidade/Setor Responsável" value={processo.unidadeSetor} />
                <RipdField label="Gestor do Processo" value={processo.gestorProcesso} />
            </RipdSection>

            <RipdSection title="2. Descrição Detalhada">
                <RipdField label="Descrição" value={processo.descricaoProcesso} />
                <RipdField label="Finalidade do Tratamento" value={processo.finalidadeTratamento} />
            </RipdSection>
            
            <RipdSection title="3. Natureza dos Dados Tratados">
                 <RipdField label="Categorias de Titulares" value={processo.categoriasTitulares.join(', ')} />
                 <RipdField label="Dados Pessoais Coletados" value={processo.dadosPessoaisColetados} />
                 <RipdField label="Trata Dados Sensíveis" value={processo.trataDadosSensiveis} />
                 {processo.trataDadosSensiveis === 'Sim' && <RipdField label="Categorias de Dados Sensíveis" value={processo.categoriasDadosSensiveis.join(', ')} />}
                 <RipdField label="Trata Dados de Crianças/Adolescentes" value={processo.trataDadosCriancasAdolescentes} />
            </RipdSection>

            <RipdSection title="4. Base Legal">
                 <RipdField label="Base Legal para Tratamento" value={processo.baseLegal} />
                 <RipdField label="Previsão Legal Específica" value={processo.previsaoLegal} />
            </RipdSection>

            <RipdSection title="5. Ciclo de Vida do Dado">
                 <RipdField label="Fonte dos Dados" value={processo.fonteDados} />
                 <RipdField label="Compartilhamento de Dados" value={processo.compartilhaDados} />
                 {processo.compartilhaDados === 'Sim' && (
                     <ul className="list-disc list-inside ml-4">
                         {processo.detalhesCompartilhamento.map(d => <li key={d.id}><strong>{d.orgao}:</strong> {d.finalidade}</li>)}
                     </ul>
                 )}
                 <RipdField label="Tempo de Retenção" value={processo.tempoRetencao} />
                 <RipdField label="Medidas de Segurança Implementadas" value={processo.medidasSeguranca} />
            </RipdSection>

            {/* Seções que requerem preenchimento manual */}
            <RipdSection title="6. Análise de Necessidade e Proporcionalidade">
                <p className="text-gray-500 italic p-3 bg-gray-100 rounded-md">[SEÇÃO A SER PREENCHIDA MANUALMENTE PELO DPO E GESTOR DO PROCESSO]</p>
            </RipdSection>

            <RipdSection title="7. Avaliação Detalhada dos Riscos">
                <p className="text-gray-500 italic p-3 bg-gray-100 rounded-md">[SEÇÃO A SER PREENCHIDA MANUALMENTE PELO DPO E GESTOR DO PROCESSO]</p>
            </RipdSection>

        </main>
        <footer className="p-4 bg-gray-50 border-t rounded-b-lg flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Fechar
          </button>
          <button onClick={handleDownload} className="flex items-center space-x-2 px-4 py-2 bg-ifsc-green text-white font-semibold rounded-md hover:bg-ifsc-green-dark">
            <DownloadIcon className="h-5 w-5" />
            <span>Baixar Rascunho (.txt)</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RipdPreviewModal;