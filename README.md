# TitoGo

Bem-vindo ao repositório da aplicação TitoGo! Este projeto é uma aplicação web full-stack criada para facilitar o compartilhamento de caronas entre usuários. Desenvolvido com tecnologias modernas, permite que usuários se cadastrem, façam login, compartilhem viagens, busquem caronas disponíveis e gerenciem solicitações de viagem. Abaixo você encontrará todas as informações necessárias para entender, configurar e contribuir para o projeto.

## Pré-visualização

A seguir estão algumas capturas de tela que mostram a aplicação:

- **Cadastro (Sign up)**
  ![Screenshot from 2025-01-28 20-21-58](https://github.com/user-attachments/assets/59d3a06c-c282-4fd8-85ed-212ac5ae390a)

- **Login (Sign in)**
  ![Screenshot from 2025-01-28 20-01-05](https://github.com/user-attachments/assets/3ba1ed60-609c-4083-be63-28c7cf953a03)

- **Página inicial (Home Page)**
  ![Screenshot from 2025-01-28 20-00-38](https://github.com/user-attachments/assets/7e49fa5a-92a2-4cca-b1af-f46f0e64ba63)

- **Compartilhar viagem (Share Rides)**
  ![Screenshot from 2025-01-28 20-05-31](https://github.com/user-attachments/assets/b68b117a-b71e-42ad-a247-976c115ce9ea)

- **Buscar caronas (Search Rides)**
  ![Screenshot from 2025-01-28 20-12-17](https://github.com/user-attachments/assets/0e920364-2efc-40f7-9211-61b7e9be1758)

- **Gerenciamento de viagens (Ride Management)**
  ![Screenshot from 2025-01-28 20-18-54](https://github.com/user-attachments/assets/dfe26117-e357-4c8a-bb11-c663eb51ea62)
  ![Screenshot from 2025-01-28 20-19-57](https://github.com/user-attachments/assets/0261f333-f5ba-455d-9add-791785c4b2be)

## Funcionalidades

- **Autenticação de Usuário**: Cadastro e login seguros usando JWT (JSON Web Tokens).
- **Compartilhamento de Viagens**: Usuários podem publicar viagens com informações como origem, destino, horário e vagas disponíveis.
- **Busca de Caronas**: Usuários podem solicitar participar de uma carona; o proprietário pode aprovar, ignorar ou recusar a solicitação.
- **Gerenciamento de Viagens**: Usuários podem visualizar viagens publicadas por eles e as viagens às quais irão participar.
- **Mapa Interativo**: Integrado com Leaflet e OpenStreetMap para visualização de rotas.
- **Design da UI**: Construído com Tailwind CSS para uma interface limpa e atraente.

## Stack de Tecnologias

- **Frontend**: React, Leaflet & OpenStreetMap (para mapas), Tailwind CSS
- **Backend**: Express, CORS, JWT
- **Banco de Dados**: PostgreSQL (executado via Docker)

## Configuração e Instalação

1. **Clone o repositório**:

```bash
git clone https://github.com/Ivon-Puc/TitoGo.git
```

2. **Instale as dependências**:

   - Para o backend:
     ```bash
     cd backend
     npm install
     ```
   - Para o frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Configurar o PostgreSQL**:

   - Verifique se o Docker está instalado e em execução.
   - Inicie um container PostgreSQL:
     ```bash
     docker run --name flow-postgres -e POSTGRES_USER=your_user -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=flow -p 5432:5432 -d postgres
     ```

4. **Configurar variáveis de ambiente**:

   - Crie um arquivo `.env` no diretório `backend` com as seguintes variáveis:
     ```env
     PORT=5000
     DATABASE_URL=postgresql://your_user:your_password@localhost:5432/flow
     JWT_SECRET=your_jwt_secret
     ```

5. **Executar a aplicação**:

   - Inicie o servidor backend:
     ```bash
     cd backend
     npm start
     ```
   - Inicie o frontend:
     ```bash
     cd frontend
     npm start
     ```

6. **Acesse a aplicação**:
   Abra o navegador e acesse `http://localhost:3000`.

## Modo rápido (iniciar backend + frontend)

Se preferir um comando único na raiz do repositório para rodar backend e frontend em desenvolvimento, use o script `dev` que adicionámos:

1. Instale dependências na raiz (isso instalará `concurrently`):

```powershell
cd 'C:\Users\ivonm\OneDrive\Documents\GitHub\TitoGo'
npm install
```

2. Copie o arquivo de exemplo de variáveis de ambiente e preencha os valores reais (não comite `.env`):

```powershell
copy .\backend\.env.example .\backend\.env
# edite .\backend\.env e preencha DATABASE_URL e JWT_SECRET
```

3. Inicie ambos com um único comando:

```powershell
npm run dev
```

Observação: o backend por padrão usa a porta definida em `backend/.env` (ex.: 5000). O frontend vem configurado para rodar em `3000`.

## Como contribuir

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório.
2. Crie uma nova branch para sua feature ou correção.
3. Faça commit das suas mudanças e faça push para o seu fork.
4. Abra um pull request explicando suas alterações.

## Agradecimentos

- [React](https://reactjs.org/) pelo framework frontend.
- [Express.js](https://expressjs.com/) pelo framework backend.
- [Tailwind CSS](https://tailwindcss.com/) pelo estilo.
- [Leaflet](https://leafletjs.com/) pela integração de mapas.
- [OpenStreetMap](https://www.openstreetmap.org/) pelos dados de mapa.
- [PostgreSQL](https://www.postgresql.org/) pelo banco de dados.

---

Boas caronas
