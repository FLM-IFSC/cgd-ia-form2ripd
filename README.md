# Automação de Mapeamento de Dados LGPD - IFSC

Uma aplicação web para auxiliar no mapeamento de atividades de tratamento de dados de acordo com a LGPD (Lei Geral de Proteção de Dados), gerar um inventário de dados e criar rascunhos de RIPD (Relatório de Impacto à Proteção de Dados).

## ✨ Funcionalidades

- **Formulário Inteligente**: Um formulário detalhado para mapear processos de tratamento de dados, com campos condicionais para uma melhor experiência de usuário.
- **Inventário de Dados**: Geração automática de uma tabela (Inventário de Dados Pessoais - IDP) com todos os processos mapeados.
- **Indicador de Risco**: Destaque visual na tabela para processos identificados como de "Alto Risco".
- **Geração de Rascunho do RIPD**: Para processos de alto risco, um rascunho do Relatório de Impacto é gerado automaticamente em um modal, pronto para análise e download.
- **Notificações**: Feedbacks visuais para o usuário ao adicionar um novo processo.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com uma abordagem moderna e sem a necessidade de um *build step* (compilação), o que o torna extremamente leve e fácil de publicar.

- **React 19**: Para a construção da interface de usuário.
- **TypeScript**: Para adicionar tipagem estática e segurança ao código.
- **Tailwind CSS**: Para estilização rápida e responsiva, carregado via CDN.
- **ES Modules Nativos + Import Maps**: Permite o uso de `import` diretamente no navegador, buscando os pacotes de uma CDN (`esm.sh`).
- **Babel Standalone**: Transpila o código TSX/JSX em tempo real, no navegador, permitindo a publicação em hosts estáticos sem um processo de build.

---

## 🚀 Como Publicar no GitHub Pages

Siga estes passos para colocar sua aplicação no ar de graça com o GitHub Pages.

### ⚠️ Nota Importante Sobre a Publicação (Porque não precisa de "deploy")

Sua aplicação usa arquivos `.tsx` (TypeScript com React/JSX), que os navegadores não conseguem ler diretamente. Para que funcione no GitHub Pages, adicionamos uma ferramenta chamada **Babel Standalone**. Ela é carregada no `index.html` e converte seu código `.tsx` para JavaScript puro que o navegador entende, tudo isso de forma automática quando a página é carregada.

Por isso, você **não precisa** de um passo de "build" ou compilação no seu computador.

**Requisito Crítico para Imports:** Para que este método funcione, todas as importações de arquivos locais no seu código **precisam incluir a extensão do arquivo**.
- **Incorreto:** `import App from './App';`
- **Correto:** `import App from './App.tsx';`

Isso é necessário para que o navegador saiba exatamente qual arquivo buscar no servidor.

### Passo 1: Crie um Repositório no GitHub

1.  Acesse o [GitHub](https://github.com/) e faça login.
2.  Clique no ícone de `+` no canto superior direito e selecione **"New repository"**.
3.  Dê um nome ao seu repositório (ex: `mapeamento-lgpd`).
4.  Escolha se ele será Público ou Privado. Para o GitHub Pages gratuito, ele precisa ser **Público**.
5.  Clique em **"Create repository"**.

### Passo 2: Envie os Arquivos para o Repositório

Agora, você precisa enviar todos os arquivos da aplicação (`index.html`, `App.tsx`, etc.) para o repositório que você acabou de criar. Você pode fazer isso via linha de comando com `git` ou usando o GitHub Desktop.

Se você não tem familiaridade com `git`, a forma mais simples é:
1.  No seu repositório no GitHub, clique em **"Add file"** e depois em **"Upload files"**.
2.  Arraste todos os arquivos do projeto para a área de upload.
3.  Adicione uma mensagem de commit (ex: "Commit inicial do projeto") e clique em **"Commit changes"**.

### Passo 3: Ative o GitHub Pages

1.  No seu repositório no GitHub, clique na aba **"Settings"**.
2.  No menu lateral esquerdo, clique em **"Pages"**.
3.  Na seção "Build and deployment", em "Source", selecione **"Deploy from a branch"**.
4.  Na seção "Branch", selecione a branch `main` (ou `master`, dependendo do nome da sua branch principal). Deixe a pasta como `/ (root)`.
5.  Clique em **"Save"**.

### Passo 4: Acesse sua Aplicação!

Aguarde alguns minutos. O GitHub levará um tempo para construir e publicar seu site.

Após o processo, a página irá recarregar e um banner verde aparecerá no topo da seção "Pages" com a mensagem: **"Your site is live at `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`"**.

Clique nesse link para ver sua aplicação funcionando! 🎉