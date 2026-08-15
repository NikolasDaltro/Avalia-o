# Teste Técnico — QA Pleno | Automação

Projeto desenvolvido para o desafio técnico de QA Pleno, contemplando análise e design de testes, BDD, automação de API e automação Web.

Escolhi **Playwright + TypeScript** porque queria manter os testes de API e Web na mesma stack. Isso facilita a manutenção, reutilização das configurações e integração com CI.

O Postman também seria adequado para exploração e validações manuais de API, mas para uma suíte automatizada, versionada e executada em pipeline, considerei o Playwright mais apropriado para este projeto.

---

## Tecnologias utilizadas

- Playwright
- TypeScript
- Node.js
- AJV
- JSON Schema
- dotenv
- Git
- GitHub Actions

---

## Parte A — Testes Manuais: Análise e Design

### Estratégia de automação

Começaria automatizando o fluxo principal da API e as validações de contrato, pois são pontos que precisam ser verificados com frequência em uma regressão.

Depois, incluiria os cenários de paginação, autenticação e alguns casos de borda.

Para o tempo de resposta, defini um limite de 3 segundos. Como o ReqRes é uma API externa, preferi trabalhar com uma margem maior para evitar falhas causadas apenas por oscilações de rede.

### Cenários para GET /api/users?page=2

| ID | Cenário | Tipo | Resultado esperado |
|---|---|---|---|
| API-M01 | Consultar usuários com `page=2` | Positivo | Retornar status 200 e dados da página 2 |
| API-M02 | Validar estrutura da resposta | Contrato | Campos obrigatórios presentes |
| API-M03 | Validar estrutura dos usuários | Contrato | Campos `id`, `email`, `first_name`, `last_name` e `avatar` presentes |
| API-M04 | Consultar `page=1` | Positivo | Retornar página 1 corretamente |
| API-M05 | Consultar página inexistente | Borda | Retornar resposta consistente e lista vazia, conforme comportamento da API |
| API-M06 | Consultar `page=0` | Borda | Tratar o valor sem provocar erro interno |
| API-M07 | Consultar `page=-1` | Negativo/Borda | Tratar o valor inválido de forma consistente |
| API-M08 | Consultar `page=abc` | Negativo | Não provocar erro interno 500 |
| API-M09 | Omitir parâmetro `page` | Borda | Validar o comportamento padrão da API |
| API-M10 | Requisição sem API Key | Negativo | Rejeitar a requisição por ausência de autenticação |
| API-M11 | Requisição com API Key inválida | Negativo | Rejeitar a requisição por credencial inválida |
| API-M12 | Validar tempo de resposta | Performance | Responder dentro do limite de 3 segundos definido para a suíte |

### Validações da resposta

Além dos cenários apresentados, verificaria os seguintes pontos da resposta:

- Status HTTP;
- `Content-Type`;
- Estrutura e tipos dos campos utilizando JSON Schema;
- Campos de paginação (`page`, `per_page`, `total` e `total_pages`);
- Quantidade de registros compatível com a paginação;
- Estrutura dos usuários retornados;
- Formato do e-mail;
- Formato da URL do avatar;
- Comportamento da API diante de parâmetros inválidos;
- Tempo de resposta.

---

## Parte B — BDD

### Funcionalidade: Consulta paginada de usuários

```gherkin
Funcionalidade: Consulta paginada de usuários

  Como consumidor da API
  Quero consultar usuários por página
  Para obter os registros de forma paginada

  Cenário: Consultar a segunda página de usuários com sucesso
    Dado que possuo uma chave válida de acesso à API
    Quando realizo uma requisição GET para "/api/users?page=2"
    Então a API deve retornar o status 200
    E a resposta deve estar no formato JSON
    E o campo "page" deve possuir o valor 2
    E a resposta deve conter os campos de paginação
    E os usuários retornados devem respeitar o contrato esperado

  Cenário: Consultar usuários utilizando uma API Key inválida
    Dado que possuo uma chave de API inválida
    Quando realizo uma requisição GET para "/api/users?page=2"
    Então a API deve retornar o status 403
    E a resposta deve informar que a API Key é inválida

  Esquema do Cenário: Consultar diferentes páginas de usuários
    Dado que possuo uma chave válida de acesso à API
    Quando realizo uma requisição GET para "/api/users?page=<pagina>"
    Então a API deve retornar o status 200
    E o campo "page" deve possuir o valor <pagina>

    Exemplos:
      | pagina |
      | 1      |
      | 2      |
```

### Por que utilizei o Esquema do Cenário?

Utilizei o Esquema do Cenário porque a regra testada é a mesma para diferentes páginas. Dessa forma, consigo variar os dados de entrada sem precisar repetir todo o cenário.

Essa mesma ideia também foi aplicada na automação da API, onde as páginas são testadas de forma parametrizada.

---

## Parte C — User Story e Casos de Teste

### User Story

> Como um usuário autenticado, eu quero adicionar um produto ao carrinho, para que eu possa finalizar a compra depois.

### Critérios de aceitação

- **AC1:** O usuário deve conseguir adicionar um produto disponível ao carrinho.
- **AC2:** O carrinho deve refletir a quantidade correta de itens.
- **AC3:** O item adicionado deve aparecer no carrinho com nome e preço.
- **AC4:** O usuário deve conseguir remover o item do carrinho.

### Casos de teste derivados da User Story

| ID | Cenário | Tipo | AC relacionado | Automatizado? |
|---|---|---|---|---|
| CT-01 | Adicionar um produto disponível ao carrinho | Positivo | AC1 | Sim |
| CT-02 | Validar quantidade após adicionar um produto | Positivo | AC2 | Sim |
| CT-03 | Conferir nome e preço do produto no carrinho | Positivo | AC3 | Sim |
| CT-04 | Remover um produto do carrinho | Positivo | AC4 | Sim |
| CT-05 | Adicionar dois produtos diferentes | Borda | AC1 / AC2 | Sim |
| CT-06 | Remover um item quando existem dois no carrinho | Borda | AC2 / AC4 | Sim |
| CT-07 | Validar que o outro produto permanece após remover um item | Borda | AC2 / AC4 | Sim |
| CT-08 | Remover o último produto e deixar o carrinho vazio | Borda | AC2 / AC4 | Sim |
| CT-09 | Validar que o badge desaparece após remover o último produto | Borda | AC2 | Sim |
| CT-10 | Continuar comprando e manter o produto no carrinho | Borda | AC2 / AC3 | Sim |
| CT-11 | Atualizar a página e manter o produto no carrinho | Borda | AC2 / AC3 | Sim |
| CT-12 | Adicionar produto pela página de detalhes | Positivo | AC1 | Sim |
| CT-13 | Validar nome e preço de dois produtos no carrinho | Positivo | AC2 / AC3 | Sim |
| CT-14 | Tentar adicionar um produto indisponível | Negativo | AC1 | Não |

### Cenários complementares da automação Web

Além dos cenários diretamente relacionados à User Story, acrescentei alguns testes de autenticação, checkout e sessão.

| ID | Cenário | Tipo | Área | Automatizado? |
|---|---|---|---|---|
| WEB-01 | Realizar login com credenciais válidas | Positivo | Login | Sim |
| WEB-02 | Realizar login com credenciais inválidas | Negativo | Login | Sim |
| WEB-03 | Tentar login com usuário bloqueado | Negativo | Login | Sim |
| WEB-04 | Tentar login sem informar usuário | Negativo | Login | Sim |
| WEB-05 | Tentar login sem informar senha | Negativo | Login | Sim |
| WEB-06 | Tentar avançar no checkout sem informar CEP | Negativo | Checkout | Sim |
| WEB-07 | Validar produto e preço no resumo da compra | Positivo | Checkout | Sim |
| WEB-08 | Validar subtotal e total da compra | Regra de negócio | Checkout | Sim |
| WEB-09 | Realizar uma compra completa | E2E | Checkout | Sim |
| WEB-10 | Realizar logout com sucesso | Positivo | Sessão | Sim |
| WEB-11 | Tentar acessar área autenticada após logout | Negativo | Sessão | Sim |

### O que eu priorizei ao automatizar?

Priorizei os fluxos de adicionar, remover e validar produtos no carrinho, além da quantidade de itens. São comportamentos importantes para uma regressão e possuem resultados previsíveis.

Depois ampliei a cobertura para comportamentos relacionados ao estado do carrinho, como remover apenas um produto, manter os itens durante a navegação e manter o carrinho após atualizar a página.

Também acrescentei cenários negativos de autenticação, checkout e sessão para não limitar a suíte apenas ao caminho de sucesso.

O cenário de produto indisponível não foi automatizado porque o SauceDemo não fornece uma massa de teste controlada com produto sem estoque. Em um ambiente onde fosse possível controlar esse estado, seria um cenário candidato à automação.

---

## Parte D — Automação de API

A automação da API foi desenvolvida utilizando **Playwright com TypeScript**.

Conforme solicitado no desafio técnico, o endpoint principal utilizado foi:

`GET /api/users?page=2`

Além do fluxo principal solicitado, ampliei a cobertura com outras páginas, cenários negativos, validação de contrato, casos de borda e tempo de resposta.

### Cobertura implementada

A suíte de API contempla:

- Validação do status HTTP `200`;
- Validação do `Content-Type` como JSON;
- Validação dos campos de paginação;
- Validação do conteúdo retornado;
- Validação de contrato utilizando JSON Schema;
- Testes parametrizados para diferentes páginas;
- Cenários negativos;
- Casos de borda;
- Validação do tempo de resposta.

### Validação de contrato

Para validar a estrutura da resposta utilizei **AJV** junto com um JSON Schema separado do arquivo de testes.

O schema está localizado em:

```text
schemas/users.schema.ts
```

Essa separação evita deixar toda a definição do contrato dentro do teste e facilita sua manutenção.

O contrato valida tanto os campos de paginação quanto a estrutura dos usuários retornados pela API.

### Testes parametrizados

Para evitar duplicação de código, utilizei parametrização nos cenários que possuem o mesmo comportamento para diferentes valores de entrada.

Exemplo:

```typescript
const pages = [1, 2];

for (const page of pages) {
  test(`deve retornar corretamente a página ${page}`, async ({ request }) => {
    // execução e validações
  });
}
```

Dessa forma, novas páginas podem ser adicionadas à cobertura sem precisar duplicar todo o cenário.

### Autenticação

A API exige uma API Key para realizar as requisições.

A chave é carregada através da variável de ambiente:

```text
REQRES_API_KEY
```

A chave real não é versionada no repositório.

O arquivo `.env` está incluído no `.gitignore` e o projeto possui um `.env.example` para indicar a configuração necessária:

```env
REQRES_API_KEY=
```

Também foram implementados cenários negativos envolvendo ausência e utilização de uma chave inválida.

### Tempo de resposta

Foi incluída uma validação simples de tempo de resposta.

O limite utilizado foi:

```text
3000 ms
```

Como os testes utilizam uma API pública externa, optei por uma margem de 3 segundos para diminuir a chance de falhas causadas apenas por oscilações de rede ou do próprio serviço.

Essa validação serve como uma verificação básica do tempo de resposta e não substitui testes de carga ou estresse.

Testes de carga e estresse não foram executados por se tratar de uma API pública externa e por não fazerem parte do escopo obrigatório.

Em um ambiente controlado, utilizaria uma ferramenta específica, como k6 ou JMeter, para avaliar métricas como throughput, latência em percentis, taxa de erro e comportamento sob aumento progressivo de carga.

### Relatório de execução

O projeto utiliza o relatório HTML nativo do Playwright.

Após executar os testes, o relatório pode ser aberto com:

```bash
npx playwright show-report
```

O relatório permite visualizar os testes executados, status, duração e detalhes das falhas.

### Executando somente os testes de API

```bash
npx playwright test --project=api
```

---

## Parte E — Automação Web

A automação Web foi desenvolvida com **Playwright + TypeScript** utilizando o SauceDemo como aplicação alvo, conforme sugerido no desafio técnico.

Para organizar as interações com as telas, utilizei o padrão **Page Object**, separando os elementos e ações de cada página dos cenários de teste.

### Estrutura dos Page Objects

```text
pages/
├── LoginPage.ts
├── InventoryPage.ts
├── CartPage.ts
└── CheckoutPage.ts
```

Cada classe possui uma responsabilidade específica:

- `LoginPage`: acesso ao sistema, login e validações de autenticação;
- `InventoryPage`: interação com a listagem de produtos e carrinho;
- `CartPage`: validação e remoção de produtos;
- `CheckoutPage`: preenchimento dos dados, resumo da compra e finalização do pedido.

Os cenários Web estão localizados em:

```text
tests/web/cart.spec.ts
```

### Cobertura da automação Web

#### Autenticação

- Login com usuário e senha válidos;
- Login com credenciais inválidas;
- Login com usuário bloqueado;
- Validação de usuário obrigatório;
- Validação de senha obrigatória.

#### Carrinho de compras

- Adição de um produto;
- Validação da quantidade de itens;
- Validação de nome e preço;
- Adição de dois produtos diferentes;
- Validação de múltiplos produtos;
- Remoção de produto;
- Remoção de um produto mantendo outro no carrinho;
- Atualização da quantidade após remoção;
- Remoção do último produto;
- Validação do carrinho vazio;
- Validação do desaparecimento do badge;
- Persistência do carrinho ao continuar comprando;
- Persistência do carrinho após atualizar a página;
- Adição de produto pela página de detalhes.

#### Checkout

- Início do checkout;
- Validação de campo obrigatório;
- Validação do produto no resumo;
- Validação do preço no resumo;
- Validação do subtotal;
- Validação do total;
- Finalização da compra;
- Confirmação do pedido.

#### Sessão

- Logout;
- Retorno à tela de login após logout;
- Bloqueio de acesso à área autenticada depois do logout.

### Fluxo E2E principal

Além dos cenários menores, foi implementado um fluxo E2E completo:

```text
Login
↓
Adicionar produto
↓
Validar quantidade no carrinho
↓
Abrir carrinho
↓
Validar nome e preço
↓
Iniciar checkout
↓
Preencher dados do cliente
↓
Validar resumo da compra
↓
Validar valores
↓
Finalizar pedido
↓
Validar confirmação
```

Esse cenário valida não apenas a navegação entre telas, mas também pontos importantes do fluxo de compra.

### Asserts utilizados

Ao longo dos testes foram adicionadas validações como:

- URL após login;
- Quantidade de itens no carrinho;
- Nome do produto;
- Preço do produto;
- Presença ou remoção do item;
- Carrinho vazio;
- Mensagens de erro de autenticação;
- Mensagem de usuário bloqueado;
- Campos obrigatórios;
- Produto no resumo da compra;
- Subtotal e total do checkout;
- Confirmação da finalização da compra;
- Encerramento da sessão.

A ideia foi evitar testes baseados apenas em cliques e garantir que o comportamento esperado fosse validado durante o fluxo.

### Esperas e estabilidade

Não foram utilizados waits fixos como:

```typescript
await page.waitForTimeout(3000);
```

As esperas são feitas através dos mecanismos nativos do Playwright, como `expect`, `toBeVisible`, `toHaveText` e `toHaveURL`.

Isso ajuda a reduzir flakiness e evita depender de tempos fixos para a execução dos testes.

### Executando somente os testes Web

```bash
npx playwright test --project=chromium
```

Para acompanhar a execução no navegador:

```bash
npx playwright test --project=chromium --headed
```

### Execução completa

Para executar API e Web:

```bash
npx playwright test --project=api --project=chromium
```

Após a execução, o relatório HTML pode ser aberto com:

```bash
npx playwright show-report
```

---

## Estrutura do projeto

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
│
├── schemas/
│   └── users.schema.ts
│
├── tests/
│   ├── api/
│   │   └── users.spec.ts
│   └── web/
│       └── cart.spec.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

---

## Pré-requisitos

Para executar o projeto localmente é necessário:

- Node.js 20 ou superior;
- npm;
- Git.

---

## Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Acesse a pasta do projeto:

```bash
cd NOME_DO_REPOSITORIO
```

Instale as dependências:

```bash
npm install
```

Instale os navegadores do Playwright:

```bash
npx playwright install
```

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
REQRES_API_KEY=sua_chave_aqui
```

---

## Como executar

### API

```bash
npx playwright test --project=api
```

### Web

```bash
npx playwright test --project=chromium
```

### API + Web

```bash
npx playwright test --project=api --project=chromium
```

### Web com navegador visível

```bash
npx playwright test --project=chromium --headed
```

### Abrir relatório

```bash
npx playwright show-report
```

---

## Integração Contínua

O projeto possui pipeline utilizando **GitHub Actions**.

A cada `push` ou `pull request` para a branch `main`, o pipeline:

1. Baixa o código do repositório;
2. Configura o Node.js;
3. Instala as dependências;
4. Instala o Chromium;
5. Executa os testes de API e Web;
6. Salva o relatório do Playwright como artifact.

A API Key utilizada pelos testes do ReqRes é configurada através de **GitHub Secrets**, evitando armazenar a credencial diretamente no repositório.

---

## Decisões técnicas

### Por que Playwright?

Escolhi Playwright porque permite testar API e Web utilizando a mesma stack.

Isso mantém o projeto mais simples e evita utilizar uma ferramenta diferente apenas para a automação da API.

Também aproveitei recursos como auto-wait, assertions, execução por projetos e relatório HTML.

### Por que Page Object?

Utilizei Page Object para separar as ações e elementos das páginas dos cenários de teste.

Com isso, evito espalhar seletores pelos testes e deixo os cenários mais fáceis de ler e manter.

### Por que JSON Schema?

Utilizei JSON Schema para validar o contrato da API além de verificar valores específicos.

Dessa forma, alterações inesperadas na estrutura ou nos tipos dos campos também podem ser identificadas pelos testes.

---

## Limitações

Durante o desenvolvimento considerei algumas limitações:

- O ReqRes é uma API pública externa, portanto o tempo de resposta pode variar;
- O limite de 3 segundos é uma verificação básica e não representa um teste de carga;
- Testes de carga e estresse não foram executados contra o serviço público;
- O SauceDemo utiliza usuários e dados predefinidos;
- O SauceDemo não possui fluxo de cadastro de usuário ou recuperação de senha;
- O cenário de produto indisponível depende de uma massa de teste que não está disponível;
- A execução Web foi concentrada no Chromium para manter o escopo do desafio.

---

## Como eu pensei

Comecei pelo endpoint obrigatório `GET /api/users?page=2`, garantindo primeiro que o fluxo principal funcionasse e que a resposta tivesse os dados esperados.

Depois ampliei a cobertura da API com JSON Schema, paginação, testes parametrizados, autenticação, cenários negativos, casos de borda e tempo de resposta.

Na parte Web, comecei pelo fluxo sugerido no desafio: realizar login, adicionar um produto e validar o carrinho.

Com o fluxo principal funcionando, organizei as interações utilizando Page Object e fui acrescentando cenários que considerei importantes para uma regressão, como múltiplos produtos, remoção, persistência do carrinho e cenários negativos de autenticação.

Também acrescentei um fluxo E2E de compra para validar a jornada desde o login até a confirmação do pedido.

Depois complementei a cobertura com checkout, usuário bloqueado, campos obrigatórios e logout, incluindo uma validação para garantir que a área autenticada não pudesse ser acessada depois do encerramento da sessão.

Procurei não criar testes apenas para aumentar a quantidade. A prioridade foi cobrir comportamentos importantes, previsíveis e que fariam sentido em uma suíte de regressão.

Por fim, configurei o GitHub Actions para executar os testes automaticamente e manter a API Key protegida através de Secrets.

O objetivo foi montar uma solução simples de executar e manter, mas que demonstrasse diferentes pontos do trabalho de QA: análise de cenários, BDD, contrato de API, testes positivos e negativos, automação Web, E2E, organização do código e integração contínua.