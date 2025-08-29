import React from 'react';
import { ShieldCheckIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-ifsc-green text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center gap-4">
        <ShieldCheckIcon className="w-10 h-10" />
        <div>
          <h1 className="text-2xl font-bold">Gerador de Relatório Técnico de Segurança</h1>
          <p className="text-sm">Assistente para Documentação de Medidas de Segurança em Biometria - IFSC</p>
        </div>
      </div>
    </header>
  );
};
