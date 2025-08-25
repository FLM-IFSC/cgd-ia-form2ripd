/**
 * @file Header.js
 * @description Componente de apresentação responsável por renderizar o cabeçalho da aplicação.
 * Exibe o título, subtítulo e a identidade visual do IFSC.
 */
import React from 'react';
import { ShieldCheckIcon } from './icons/Icons.js';

const Header = () => {
  return (
    <header className="bg-ifsc-green text-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Ícone para reforçar o tema de segurança e conformidade */}
          <ShieldCheckIcon className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">Automação de Mapeamento de Dados LGPD</h1>
            <p className="text-sm text-green-200">Plataforma do Instituto Federal de Santa Catarina (IFSC)</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;