## Escolhi Playwright porque queria manter os testes de API e Web na mesma stack, utilizando TypeScript. Isso facilita a manutenção, reutilização de configurações e integração com CI. O Postman também seria adequado para exploração e validações manuais de API, mas para uma suíte automatizada versionada e executada em pipeline, considerei o Playwright mais apropriado para este projeto.

## Testes de carga e estresse não foram executados por se tratar de uma API pública externa e por não fazerem parte do escopo obrigatório. Em um ambiente controlado, eu utilizaria uma ferramenta específica, como k6, para medir throughput, latência em percentis, taxa de erro e comportamento sob aumento progressivo de carga.


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

### Casos de teste

A partir da User Story e dos critérios de aceitação, considerei os seguintes cenários:

| ID | Cenário | Tipo | AC relacionado | Automatizar? |
|---|---|---|---|---|
| CT-01 | Adicionar um produto disponível ao carrinho | Positivo | AC1 | Sim |
| CT-02 | Validar quantidade após adicionar um produto | Positivo | AC2 | Sim |
| CT-03 | Conferir nome e preço do produto no carrinho | Positivo | AC3 | Sim |
| CT-04 | Remover um produto do carrinho | Positivo | AC4 | Sim |
| CT-05 | Adicionar dois produtos diferentes | Borda | AC1 / AC2 | Sim |
| CT-06 | Remover um item quando existem dois no carrinho | Borda | AC2 / AC4 | Sim |
| CT-07 | Tentar acessar o carrinho sem estar autenticado | Negativo | Pré-condição da US | Sim |
| CT-08 | Tentar adicionar um produto indisponível | Negativo | AC1 | Não neste momento |
| CT-09 | Voltar para a listagem após adicionar um produto | Borda | AC2 | Sim |
| CT-10 | Atualizar a página com produto no carrinho | Borda | AC2 / AC3 | Sim |

### O que eu automatizaria?

Eu priorizaria os fluxos de adicionar, remover e validar os produtos no carrinho, além da quantidade de itens.

São cenários que precisam ser executados com frequência e têm impacto direto no fluxo de compra, por isso são bons candidatos para uma suíte de regressão automatizada.

Também automatizaria os principais cenários negativos quando o comportamento esperado for previsível.

O cenário de produto indisponível não seria minha primeira prioridade de automação, pois dependeria de uma massa de teste controlada para garantir que o produto estivesse realmente sem estoque.

### Relação com a automação Web

Parte desses cenários foi implementada na automação Web utilizando o SauceDemo.

Foram automatizadas validações como:

- Login válido;
- Login com credenciais inválidas;
- Adição de produto ao carrinho;
- Validação da quantidade de itens;
- Validação do nome e preço do produto;
- Adição de múltiplos produtos;
- Remoção de produto;
- Validação de dados obrigatórios no checkout;
- Fluxo completo de compra até a confirmação do pedido.

Os testes Web foram implementados utilizando Page Object para separar os cenários de teste das interações com cada página da aplicação.

---

## Parte D — Automação de API

A automação da API foi desenvolvida utilizando **Playwright com TypeScript**, tendo como alvo o endpoint que foi solicitado no desafio:

`GET /api/users?page=2`

Além do fluxo principal solicitado no desafio, incluí alguns cenários adicionais para validar paginação, contrato, autenticação, entradas de borda e tempo de resposta.

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

A API atualmente exige uma API Key para realizar as requisições.

A chave é carregada através de uma variável de ambiente:

```text
REQRES_API_KEY
```

A chave real não é versionada no repositório.

O arquivo `.env` está incluído no `.gitignore` e o projeto possui um `.env.example` para indicar a configuração necessária:

```env
REQRES_API_KEY=
```

Também foram considerados cenários negativos envolvendo ausência ou utilização de uma chave inválida.

### Tempo de resposta

Foi incluída uma validação simples de tempo de resposta.

O limite utilizado foi:

```text
3000 ms
```

Como os testes utilizam uma API pública externa, optei por uma margem de 3 segundos para diminuir a chance de falhas causadas apenas por oscilações de rede ou do próprio serviço.

Essa validação serve como uma verificação básica de tempo de resposta e não substitui testes de carga ou estresse.

Para testes de performance mais específicos, utilizaria uma ferramenta própria para esse objetivo, como k6 ou JMeter, em um ambiente controlado.

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

Durante o desenvolvimento, esse comando foi utilizado para executar somente a suíte de API sem executar os testes Web.

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

Os cenários Web ficam separados em:

```text
tests/web/cart.spec.ts
```

### Cenários automatizados

A suíte Web contempla os seguintes cenários:

1. Adicionar um produto ao carrinho;
2. Validar a quantidade de itens no carrinho;
3. Adicionar dois produtos diferentes;
4. Remover produto do carrinho;
5. Realizar login com credenciais inválidas;
6. Impedir avanço no checkout quando um campo obrigatório não é informado;
7. Realizar o fluxo completo de compra até a confirmação do pedido.

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
Validar mensagem de confirmação
```

Esse cenário valida não apenas a navegação entre telas, mas também os principais pontos do fluxo de negócio.

### Asserts utilizados

Ao longo dos testes foram adicionadas validações como:

- URL após login;
- Quantidade de itens no carrinho;
- Nome do produto;
- Preço do produto;
- Presença ou remoção do item;
- Mensagem de erro de autenticação;
- Mensagem de erro de campo obrigatório;
- Subtotal e total do checkout;
- Confirmação da finalização da compra.

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

Para executar API e Web na mesma suíte:

```bash
npx playwright test
```

Após a execução, o relatório HTML pode ser aberto com:

```bash
npx playwright show-report
```