# Automação de Mapeamento de Dados LGPD - IFSC

Uma aplicação web para auxiliar no mapeamento de atividades de tratamento de dados de acordo com a LGPD (Lei Geral de Proteção de Dados), gerar um inventário de dados e criar rascunhos de RIPD (Relatório de Impacto à Proteção de Dados).

## ✨ Funcionalidades

- **Formulário Inteligente**: Um formulário detalhado para mapear processos de tratamento de dados, com campos condicionais.
- **Inventário de Dados**: Geração automática de uma tabela com todos os processos mapeados.
- **Exportar para CSV**: Funcionalidade para exportar o inventário de dados para um arquivo `.csv`.
- **Indicador de Risco**: Destaque visual na tabela para processos identificados como de "Alto Risco".
- **Geração de Rascunho do RIPD**: Para processos de alto risco, um rascunho do Relatório de Impacto é gerado automaticamente, pronto para análise e download como `.txt`.
- **Notificações**: Feedbacks visuais para o usuário ao adicionar um novo processo.

## 🛠️ Tecnologias Utilizadas (Arquitetura Simplificada)

Este projeto foi reestruturado para ser um **aplicativo de arquivo único**, garantindo máxima compatibilidade e facilidade de publicação, especialmente no GitHub Pages.

- **React 18**: Carregado via CDN para a construção da interface de usuário.
- **Tailwind CSS**: Carregado via CDN para estilização rápida e responsiva.
- **Babel Standalone**: Transpila o código JSX em tempo real, no navegador. **Esta é a chave que permite que tudo funcione sem um processo de build**.
- **Arquivo Único**: Todo o código da aplicação (componentes, lógica, constantes) reside dentro do `index.html`. Isso elimina completamente os erros de carregamento de módulos (`MIME type`) que ocorrem em plataformas de hospedagem estática.

---

## 🚀 Como Publicar no GitHub Pages (Método Garantido)

Siga estes passos para colocar sua aplicação no ar. Com a nova arquitetura de arquivo único, o processo é extremamente simples e robusto.

### Passo 1: Crie um Repositório no GitHub

1.  Acesse o [GitHub](https://github.com/) e faça login.
2.  Crie um **novo repositório público**. Para o GitHub Pages gratuito, ele precisa ser **Público**.

### Passo 2: Envie os Arquivos para o Repositório

Agora, você só precisa enviar os arquivos essenciais para o repositório que acabou de criar.

1.  No seu repositório no GitHub, clique em **"Add file"** > **"Upload files"**.
2.  Arraste os seguintes arquivos para a área de upload:
    - `index.html`
    - `favicon.svg`
    - `README.md`
3.  Adicione uma mensagem de commit (ex: "Versão final para publicação") e clique em **"Commit changes"**.

### Passo 3: Ative o GitHub Pages

1.  No seu repositório no GitHub, clique na aba **"Settings"**.
2.  No menu lateral esquerdo, clique em **"Pages"**.
3.  Na seção "Build and deployment", em "Source", selecione **"Deploy from a branch"**.
4.  Na seção "Branch", selecione a branch `main` (ou `master`). Deixe a pasta como `/ (root)`.
5.  Clique em **"Save"**.

### Passo 4: Acesse sua Aplicação!

Aguarde um ou dois minutos. O GitHub levará um tempo para publicar seu site.

Após o processo, a página irá recarregar e um banner verde aparecerá no topo com a mensagem: **"Your site is live at `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`"**.

Clique nesse link para ver sua aplicação funcionando perfeitamente! 🎉
