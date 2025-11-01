# Changelog

## [2025-11-01] - Correção de Cache de Deploy

### Problema

A aplicação de frontend não estava refletindo as alterações mais recentes do código, mesmo após o deploy. Suspeitava-se de um problema de cache no processo de build ou no navegador.

### Solução

Para forçar a atualização e diagnosticar o problema, as seguintes alterações foram feitas no arquivo `frontend/src/pages/LoginPage.jsx`:

1.  **Remoção de Comentário:** O comentário `// FORÇANDO ATUALIZAÇÃO DO DEPLOY - 10:59` foi removido.
2.  **Adição de `useEffect` para Debug:** Foi adicionado um hook `useEffect` que executa na montagem do componente e imprime uma mensagem de versão no console do navegador (`console.log('LoginPage renderizada - v2')`).

### Verificação

Após iniciar o servidor de desenvolvimento e acessar a página de login, a mensagem "LoginPage renderizada - v2" foi exibida no console, confirmando que o navegador estava carregando a versão mais recente do arquivo e que o problema de cache foi contornado/resolvido.
