/**
 * @file index.tsx
 * @description Ponto de entrada principal para a aplicação React.
 * Este arquivo é responsável por localizar o elemento 'root' no DOM e
 * renderizar o componente principal da aplicação, `App`, dentro dele.
 * Ele utiliza o `ReactDOM.createRoot` para habilitar funcionalidades concorrentes do React.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Busca o elemento container no HTML onde a aplicação será montada.
const rootElement = document.getElementById('root');
if (!rootElement) {
  // Lança um erro se o container não for encontrado, pois a aplicação não pode ser renderizada.
  throw new Error("Could not find root element to mount to");
}

// Cria a raiz da aplicação React associada ao elemento do DOM.
const root = ReactDOM.createRoot(rootElement);

// Renderiza o componente principal `App` dentro do modo estrito do React.
// React.StrictMode é um wrapper que ajuda a identificar potenciais problemas na aplicação durante o desenvolvimento.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);