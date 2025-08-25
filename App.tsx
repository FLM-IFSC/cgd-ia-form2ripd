/**
 * @file App.tsx
 * @description Componente raiz da aplicação. Gerencia o estado global, como o inventário de processos
 * e o processo selecionado para a visualização do RIPD. Orquestra a interação entre os
 * componentes de formulário, tabela e modal.
 */
import React, { useState } from 'react';
import { ProcessoData } from './types.ts';
import Header from './components/Header.tsx';
import ProcessForm from './components/ProcessForm.tsx';
import InventoryTable from './components/InventoryTable.tsx';
import RipdPreviewModal from './components/RipdPreviewModal.tsx';
import { ToastContainer, toast } from 'react-toastify';

/**
 * Componente `StyleInjector`
 * @description Uma solução alternativa para injetar o CSS da biblioteca `react-toastify`
 * dinamicamente em uma tag <style> no <head> do documento.
 * Essencial para ambientes sem um empacotador de módulos (bundler) que não conseguem
 * processar `import 'arquivo.css';`.
 */
const StyleInjector: React.FC = () => {
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
.Toastify__toast-container {
}
.Toastify__toast {
}
.Toastify__toast--rtl {
  direction: rtl;
}
.Toastify__toast-body {
}
.Toastify__progress-bar {
}
.Toastify__progress-bar--rtl {
  right: 0;
  left: auto;
  transform-origin: right;
}
.Toastify__progress-bar-theme--light {
  background: #757575;
}
.Toastify__progress-bar-theme--dark {
  background: #bbbbbb;
}
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info {
  background: #3498db;
}
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success {
  background: #07bc0c;
}
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning {
  background: #f1c40f;
}
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {
  background: #e74c3c;
}

@keyframes Toastify__trackProgress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}
.Toastify__progress-bar--animated {
  animation: Toastify__trackProgress linear 1;
}

.Toastify__close-button {
  color: #fff;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s ease;
  align-self: flex-start;
}
.Toastify__close-button--default {
  color: #000;
  opacity: 0.3;
}
.Toastify__close-button > svg {
  fill: currentColor;
  height: 16px;
  width: 14px;
}
.Toastify__close-button:hover, .Toastify__close-button:focus {
  opacity: 1;
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container {
    width: 100vw;
    padding: 0;
    left: 0;
    margin: 0;
  }
  .Toastify__toast-container--top-left, .Toastify__toast-container--top-center, .Toastify__toast-container--top-right {
    top: 0;
    transform: translateX(0);
  }
  .Toastify__toast-container--bottom-left, .Toastify__toast-container--bottom-center, .Toastify__toast-container--bottom-right {
    bottom: 0;
    transform: translateX(0);
  }
  .Toastify__toast-container--rtl {
    right: 0;
    left: auto;
  }

  .Toastify__toast {
    margin-bottom: 0;
    border-radius: 0;
  }
}
        `;
        document.head.appendChild(style);
        // Função de limpeza: remove o estilo quando o componente é desmontado.
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    return null;
};

const App: React.FC = () => {
  // Estado para armazenar a lista de processos mapeados (o inventário de dados).
  const [inventario, setInventario] = useState<ProcessoData[]>([]);
  // Estado para controlar a exibição do modal de RIPD. Armazena os dados do processo de alto risco selecionado.
  const [selectedProcessForRipd, setSelectedProcessForRipd] = useState<ProcessoData | null>(null);

  /**
   * Manipula a submissão do formulário de processo.
   * @param data Os dados do processo preenchidos no formulário.
   */
  const handleFormSubmit = (data: ProcessoData) => {
    // Adiciona um ID único ao novo processo.
    const newData = { ...data, id: Date.now() };
    // Adiciona o novo processo ao estado do inventário.
    setInventario(prev => [...prev, newData]);
    // Exibe uma notificação de sucesso.
    toast.success(`Processo "${data.nomeProcesso}" adicionado ao inventário!`);

    // Se o processo for marcado como de alto risco, aciona a geração do RIPD.
    if (data.altoRisco === 'Sim') {
      setSelectedProcessForRipd(newData);
      toast.info(`Rascunho do RIPD para "${data.nomeProcesso}" foi gerado.`);
    }
  };

  /**
   * Fecha o modal de visualização do RIPD.
   */
  const closeRipdModal = () => {
    setSelectedProcessForRipd(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Injeta os estilos necessários para as notificações */}
      <StyleInjector />
      {/* Renderiza o cabeçalho da aplicação */}
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Coluna para o formulário de mapeamento */}
          <div className="lg:col-span-2">
            <ProcessForm onSubmit={handleFormSubmit} />
          </div>
          {/* Coluna para a tabela de inventário */}
          <div className="lg:col-span-3">
            <InventoryTable processos={inventario} />
          </div>
        </div>
      </main>
      {/* Renderiza o modal de RIPD condicionalmente, apenas se um processo de alto risco estiver selecionado */}
      {selectedProcessForRipd && (
        <RipdPreviewModal processo={selectedProcessForRipd} onClose={closeRipdModal} />
      )}
      {/* Container para exibir as notificações (toasts) */}
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default App;