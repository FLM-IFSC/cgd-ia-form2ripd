/**
 * @file InventoryTable.tsx
 * @description Componente que renderiza a tabela do Inventário de Dados Pessoais (IDP).
 * Exibe uma lista de processos mapeados, com informações chave e indicadores visuais de risco.
 */

import React from 'react';
import { ProcessoData } from '../types';
import { TableIcon, CheckCircleIcon, ExclamationIcon } from './icons/Icons';

// Props esperadas pelo componente InventoryTable.
interface InventoryTableProps {
  /** Um array de objetos ProcessoData a serem exibidos na tabela. */
  processos: ProcessoData[];
}

/**
 * Subcomponente para exibir um "badge" (etiqueta) estilizado.
 * Usado aqui para destacar a base legal de cada processo.
 */
const DataBadge: React.FC<{ label: string }> = ({ label }) => (
    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{label}</span>
);


const InventoryTable: React.FC<InventoryTableProps> = ({ processos }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <TableIcon className="h-6 w-6 text-ifsc-green" />
        <h2 className="text-2xl font-bold text-gray-800">Inventário de Dados Pessoais (IDP)</h2>
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