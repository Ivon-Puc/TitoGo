# Documentação das alterações e passos realizados

Resumo objetivo

- Renomeação do projeto para "TitoGo" no README e ajustes de textos.
- Atualização de referências dentro do frontend para refletir o novo nome.
- Remoção do remote `upstream` apontando para o repositório original.
- Ajuste do backend para respeitar `PORT` (variável de ambiente) e evitar conflito com o frontend.
- Geração do Prisma Client e aplicação de migrations (nenhuma pendente).
- Criação do `package.json` na raiz com script `dev` para rodar backend+frontend simultaneamente (usa `concurrently`).
- Criação de `backend/.env.example` e documentação de uso.

Arquivos criados/alterados

- `README.md`: atualizado com instruções de clone, e seção "Modo rápido" com comando único para iniciar tudo.
- `backend/.env.example`: modelo de variáveis de ambiente sem segredos.
- `package.json` (raiz): script `dev` (usa `concurrently`).
- `backend/index.js`: agora usa `process.env.PORT || 5000`.
- `frontend/src/pages/HomePage.jsx`: alt da imagem atualizado para "TitoGo illustration".
- `backend/prisma/*`: migrations lidas; `prisma generate` gerou o client.

Comandos executados (principais)

- Instalação dependências:
  - `cd backend && npm install`
  - `cd frontend && npm install`
  - `cd <repo-root> && npm install` (instalou `concurrently` na raiz)
- Git:
  - remoção do remote `upstream` e confirmação de `origin` apontando para `Ivon-Puc/TitoGo`.
  - commits e push das mudanças (`backend/index.js`, `README.md`, etc.).
- Prisma:
  - `npx prisma generate`
  - `npx prisma migrate deploy` (sem migrations pendentes)

Como rodar localmente (PowerShell)

1. Copie o `.env.example` para `.env` no backend e preencha os valores reais:

```powershell
copy .\backend\.env.example .\backend\.env
# editar .\backend\.env -> preencher DATABASE_URL e JWT_SECRET
```

2. Instale dependências na raiz (apenas na primeira vez):

```powershell
cd 'C:\Users\ivonm\OneDrive\Documents\GitHub\TitoGo'
npm install
```

3. Inicie backend + frontend com um comando:

```powershell
npm run dev
```

4. Acesse a aplicação no navegador:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000 (ou porta definida em `backend/.env`)

Notas importantes e recomendações

- Não comite arquivos `.env` com segredos. Use `.env.example` como modelo.
- Se você quiser rodar as migrations localmente via `prisma migrate dev`, lembre-se que a migração que adiciona `senacId` é `NOT NULL` e tem constraint UNIQUE — isso pode falhar se houver usuários existentes sem `senacId`. No ambiente atual não havia migrations pendentes.
  -- Foi adicionado um `docker-compose.yml` como opção de conveniência para levantar um Postgres isolado, mas ele é totalmente opcional — neste ambiente estamos usando um PostgreSQL local (conforme `backend/.env`). Use o `docker-compose.yml` somente se preferir rodar o banco em container.

Se precisar, posso:

- Adicionar um seed script para popular dados de teste.
- Criar `docker-compose.yml` para DB + apps.
- Adicionar lint + CI básico (GitHub Actions) para checks automáticos.

enum Role: Adicionei o enum que define os nossos cargos (USER e ADMIN).

role Role @default(USER): Adicionei o novo campo ao model User. O @default(USER) é crucial, pois garante que a sua rota de registo atual continue a funcionar, atribuindo todos os novos utilizadores como USER automaticamente.

enum Gender: Criei um enum para gender (gênero).

gender Gender: Mudei o campo gender no model User de String para o nosso novo enum Gender.

enum StatusVerificacao: Criei um enum para o seu statusVerificacao.

statusVerificacao StatusVerificacao @default(PENDENTE): Mudei o campo no model User de String para o nosso novo enum.

driverLicense String?: 🌟 Melhoria de Lógica: Mudei a CNH (driverLicense) de String (obrigatório) para String? (opcional). Faz mais sentido que um utilizador possa registar-se na aplicação (para ser passageiro) sem ter uma CNH.
