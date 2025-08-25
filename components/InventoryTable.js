/**
 * @file InventoryTable.js
 * @description Componente que renderiza a tabela do Inventário de Dados Pessoais (IDP).
 * Exibe uma lista de processos mapeados, com informações chave e indicadores visuais de risco.
 * Inclui a funcionalidade de exportar os dados para um arquivo CSV.
 */

import React from 'react';
import { TableIcon, CheckCircleIcon, ExclamationIcon, DownloadIcon } from './icons/Icons.js';

/**
 * Converte os dados do inventário para um arquivo CSV e inicia o download.
 * @param {Array<Object>} processos - O array de processos do inventário.
 */
const exportToCsv = (processos) => {
    if (!processos || processos.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    // Define os cabeçalhos para o arquivo CSV.
    const headers = [
        "ID", "Nome do Processo", "Unidade/Setor", "Gestor", "Descrição", "Data de Início", 
        "Finalidade", "Trata Dados Pessoais", "Trata Dados Sensíveis", "Categorias Dados Sensíveis",
        "Trata Dados Crianças/Adolescentes", "Categorias Titulares", "Dados Pessoais Coletados",
        "Base Legal", "Previsão Legal", "Fonte dos Dados", "Compartilha Dados", 
        "Detalhes Compartilhamento", "Tempo de Retenção", "Medidas de Segurança", "Alto Risco"
    ];

    // Função auxiliar para formatar dados complexos (arrays, objetos) para CSV.
    const formatCsvCell = (data) => {
        let value = data;
        if (Array.isArray(data)) {
            // Lida com array de objetos de compartilhamento
            if (data.every(item => typeof item === 'object' && item !== null)) {
                value = data.map(d => `${d.orgao} (Finalidade: ${d.finalidade})`).join('; ');
            } else { // Lida com arrays de strings (como categorias)
                value = data.join(', ');
            }
        }
        
        const stringValue = (value === null || value === undefined) ? '' : String(value);
        // Coloca o valor entre aspas para tratar vírgulas e aspas internas.
        return `"${stringValue.replace(/"/g, '""')}"`;
    };

    // Converte o array de objetos para um array de strings CSV.
    const rows = processos.map(proc => [
        proc.id, proc.nomeProcesso, proc.unidadeSetor, proc.gestorProcesso,
        proc.descricaoProcesso, proc.dataInicioTratamento, proc.finalidadeTratamento,
        proc.trataDadosPessoais, proc.trataDadosSensiveis, proc.categoriasDadosSensiveis,
        proc.trataDadosCriancasAdolescentes, proc.categoriasTitulares, proc.dadosPessoaisColetados,
        proc.baseLegal, proc.previsaoLegal, proc.fonteDados, proc.compartilhaDados,
        proc.detalhesCompartilhamento, proc.tempoRetencao, proc.medidasSeguranca, proc.altoRisco
    ].map(formatCsvCell).join(','));

    // Combina cabeçalhos e linhas em uma única string CSV.
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Cria um Blob e aciona o download.
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for BOM to ensure Excel opens UTF-8 correctly
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `inventario_lgpd_ifsc_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};


/**
 * Subcomponente para exibir um "badge" (etiqueta) estilizado.
 */
const DataBadge = ({ label }) => (
    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{label}</span>
);

const InventoryTable = ({ processos }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <TableIcon className="h-6 w-6 text-ifsc-green" />
          <h2 className="text-2xl font-bold text-gray-800">Inventário de Dados Pessoais (IDP)</h2>
        </div>
        <button
          onClick={() => exportToCsv(processos)}
          disabled={processos.length === 0}
          className="flex items-center space-x-2 px-3 py-2 bg-ifsc-green text-white text-sm font-semibold rounded-md hover:bg-ifsc-green-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <DownloadIcon className="h-5 w-5" />
          <span>Exportar para CSV</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        {/* Renderização condicional: mostra a tabela se houver processos, ou uma mensagem de estado vazio caso contrário. */}
        {processos.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Legal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risco</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processos.map((proc) => (
                <tr key={proc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{proc.nomeProcesso}</div>
                    <div className="text-sm text-gray-500">{proc.finalidadeTratamento.substring(0, 40)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{proc.unidadeSetor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <DataBadge label={proc.baseLegal} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Indicador visual para o nível de risco */}
                    {proc.altoRisco === 'Sim' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ExclamationIcon className="h-4 w-4 mr-1" />
                        Alto Risco
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                         <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Risco Padrão
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum processo mapeado ainda.</p>
            <p className="text-sm text-gray-400 mt-1">Preencha o formulário para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTable;