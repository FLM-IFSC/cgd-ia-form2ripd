import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center p-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900">
      <p className="font-bold">Aviso Importante: Esta ferramenta é um desenvolvimento experimental.</p>
      <p>Os artefatos gerados são rascunhos e devem ser obrigatoriamente revisados e validados por um especialista humano antes de qualquer uso oficial.</p>
      <p className="mt-2">Desenvolvido por FLM na Coordenadoria de Gestão de Dados (CGD) da DTIC do IFSC - Reitoria.</p>
      <p>Dúvidas ou sugestões, entre em contato pelo e-mail: coord.gestao.dados@ifsc.edu.br</p>
    </footer>
  );
};
