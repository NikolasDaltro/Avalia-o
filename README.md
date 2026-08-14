## Parte A — Testes Manuais: Análise e Design

### Estratégia de automação

Eu priorizaria a automação do fluxo principal e das validações de contrato, pois possuem alto valor de regressão e baixo custo de execução.

Em seguida, automatizaria cenários de paginação, autenticação e borda que apresentem comportamento determinístico.

A validação de tempo de resposta seria mantida com margem conservadora, por se tratar de uma API externa, evitando falsos negativos relacionados a variações de rede.

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
| API-M12 | Validar tempo de resposta | Performance | Responder dentro do limite definido para a suíte |

### Validações da resposta

Além dos cenários apresentados, seriam verificadas as seguintes características da resposta:

- Status HTTP;
- Content-Type;
- Estrutura e tipos dos campos por JSON Schema;
- Campos de paginação (`page`, `per_page`, `total` e `total_pages`);
- Quantidade de registros compatível com a paginação;
- Estrutura dos usuários retornados;
- Formato do e-mail e URL do avatar;
- Ausência de erros internos diante de entradas inválidas;
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