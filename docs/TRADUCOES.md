# Documentação das Traduções

## Visão Geral

Este documento registra todas as traduções feitas nos componentes do frontend da aplicação TitoGo, convertendo textos de inglês para português brasileiro (pt-BR).

## Arquivos Traduzidos

### 1. `frontend/src/pages/LoginPage.jsx`

#### Alterações:

- **Comentários e documentação**:

  - "Importamos nossa 'api'" em vez de "Importamos o nosso 'api'"
  - "seu arquivo" em vez de "seu ficheiro"
  - "usuário" em vez de "utilizador"

- **Labels e campos**:

  - "Senha" em vez de "Password"

- **Mensagens**:
  - "Login bem-sucedido! Seu token está salvo" em vez de "Login bem-sucedido! O seu token está guardado"
  - "Erro no login" em vez de "Falha no login"

### 2. `frontend/src/pages/RegisterPage.jsx`

#### Alterações:

- **Mensagens de erro**:

  - "As senhas não coincidem" em vez de "Passwords do not match"
  - "Usuário registrado com sucesso!" em vez de "User registered successfully!"
  - "Ocorreu um erro durante o registro" em vez de "An error occurred during registration"

- **Campos de gênero**:
  - Valores alterados para "masculino" e "feminino"

### 3. `frontend/src/pages/SearchPage.jsx`

#### Alterações:

- **Mensagens de sistema**:

  - "Erro ao buscar dados" em vez de "Error fetching data"
  - "Erro ao buscar coordenadas" em vez de "Error fetching coordinates"
  - "Solicitando esta carona" em vez de "Requesting this ride"

- **Placeholders**:
  - "Digite o local de origem" em vez de "Digite um local"

### 4. `frontend/src/pages/ShareForm.jsx`

#### Alterações:

- **Interface**:

  - "Oferecer Carona" em vez de "Oferecer Boleia (ShareForm)"

- **Documentação e comentários**:
  - "Estados para retorno ao usuário" em vez de "Estados para feedback"
  - "Função chamada quando o formulário é enviado" em vez de "Função chamada quando o formulário é submetido"

### 5. `frontend/src/pages/TripsPage.jsx`

#### Alterações:

- **Termos técnicos**:

  - "requisições autenticadas" em vez de "pedidos autenticados"
  - "dirigindo" em vez de "conduzir"
  - "controle da tela" em vez de "controlo do ecrã"

- **Interface**:
  - "Carregando viagens..." em vez de "A carregar viagens..."
  - "Viagens que estou oferecendo" em vez de "Viagens que estou a oferecer"
  - "Viagens que vou pegar" em vez de "Viagens que eu vou apanhar"

### 6. `frontend/src/pages/HomePage.jsx`

#### Alterações:

- **Textos de interface**:

  - "Recursos" em vez de "Características"
  - "Ilustração TitoGo" em vez de "TitoGo illustration"

- **Textos alternativos de imagens**:
  - "Ícone de Pesquisa" em vez de "Search Icon"
  - "Ícone de Compartilhamento" em vez de "Search Icon"
  - "Ícone de Caronas" em vez de "Search Icon"

## Padrões de Tradução Adotados

1. **Terminologia Consistente**:

   - Uso de "carona" em vez de "boleia"
   - "usuário" em vez de "utilizador"
   - "salvar" em vez de "guardar"

2. **Adaptações Regionais**:

   - Preferência por termos comuns no português brasileiro
   - Remoção de construções típicas do português europeu (ex: "está a carregar")

3. **Interface do Usuário**:

   - Mensagens mais diretas e objetivas
   - Manutenção da formalidade, mas com linguagem acessível

4. **Termos Técnicos**:
   - "requisição" em vez de "pedido" para termos técnicos
   - Manutenção de alguns termos técnicos em inglês quando são padrão na área

## Observações

- Todas as traduções mantêm a consistência com o restante da aplicação
- Foco na experiência do usuário brasileiro
- Preservação da funcionalidade e significado original dos textos
