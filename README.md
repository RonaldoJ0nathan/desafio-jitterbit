# Desafio Jitterbit API

Esta é uma aplicação de API construída com Next.js, Node.js e conectada a um banco de dados PostgreSQL. O ambiente de desenvolvimento é totalmente containerizado com Docker, facilitando a configuração e execução.

## 🛠️ Tecnologias Utilizadas

* **Next.js:** Framework React para o desenvolvimento da API.
* **Node.js:** Ambiente de execução para a aplicação.
* **PostgreSQL:** Banco de dados relacional.
* **Docker & Docker Compose:** Para containerização e orquestração do ambiente de desenvolvimento.

## 🚀 Como Rodar a Aplicação com Docker

Siga os passos abaixo para executar a aplicação em seu ambiente local usando Docker.

### Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:

* Docker
* Docker Compose (geralmente já vem com o Docker Desktop)

### 1. Clone o Repositório

```bash
git clone https://github.com/RonaldoJ0nathan/desafio-jitterbit.git
cd desafio-jitterbit
```

### 2. Build e Execução dos Contêineres

Com o Docker e o Docker Compose instalados, você pode construir as imagens e iniciar os contêineres com um único comando. As variáveis de ambiente necessárias para a conexão com o banco de dados já estão pré-configuradas no arquivo `docker-compose.yml` para o ambiente de desenvolvimento.

```bash
docker-compose up --build
```

O comando `docker-compose up` irá:

1. Construir a imagem da sua aplicação (`app`) conforme definido no `Dockerfile`.
2. Baixar a imagem do PostgreSQL (`db`).
3. Iniciar os contêineres da aplicação e do banco de dados.

A flag `--build` força a reconstrução da imagem da sua aplicação, o que é útil caso você tenha feito alterações no código-fonte ou nas dependências.

### 3. Acessando a Aplicação

Após a conclusão do comando anterior, a aplicação estará disponível no seu navegador ou cliente de API.

* **API:** `http://localhost:3000`
* **Banco de Dados (PostgreSQL):** Acessível na porta `5432` do seu localhost.

O código-fonte está sincronizado com o contêiner `app`. Qualquer alteração que você fizer nos arquivos locais será refletida automaticamente na aplicação em execução, graças ao volume configurado no `docker-compose.yml`.

### Comandos Úteis do Docker

* **Para parar os contêineres e remover os volumes anônimos:**

    ```bash
    docker-compose down
    ```

* **Para parar os contêineres preservando o estado (ex: dados do banco):**

    ```bash
    docker-compose stop
    ```

* **Para executar os contêineres em background (modo detached):**

    ```bash
    docker-compose up -d
    ```

* **Para visualizar os logs dos contêineres em execução:**

    ```bash
    docker-compose logs -f
    ```

## 🧪 Sugestão de Fluxo para Testes

Para garantir que todas as rotas da API funcionem de forma integrada e segura, recomenda-se seguir um fluxo de teste que simule o comportamento de um usuário real.

O fluxo lógico é: **Registrar Usuário → Efetuar Login → Acessar Rotas Protegidas**.

1. **Registrar Novo Usuário**
    * **Ação:** Envie uma requisição `POST` para a rota de registro (ex: `/api/register`) com os dados de um novo usuário (nome, e-mail, senha).
    * **Verificação:** Confirme que a API retorna um status de sucesso (ex: `201 Created`) e que o usuário foi salvo no banco de dados.

2. **Efetuar Login**
    * **Ação:** Com o usuário criado, envie uma requisição `POST` para a rota de login (ex: `/api/login`) com o e-mail e a senha.
    * **Verificação:** A API deve retornar um status `200 OK` e um token de autenticação (ex: JWT). **Guarde este token**, pois ele será necessário para os próximos passos.

3. **Testar Outras Rotas (Protegidas)**
    * Use o token de autenticação obtido no passo anterior para testar as demais rotas da aplicação. O token deve ser enviado no cabeçalho de autorização (`Authorization: Bearer <SEU_TOKEN>`).
    * **Exemplo de fluxo para um recurso "Pedidos":**
        * **Criar Pedido:** `POST /api/orders`
        * **Listar Pedidos:** `GET /api/orders`
        * **Atualizar Pedido:** `PUT /api/orders/{id}`
        * **Deletar Pedido:** `DELETE /api/orders/{id}`
    * **Verificação:** Para cada rota, verifique se a resposta é a esperada. Teste também o acesso sem o token para garantir que a rota está devidamente protegida (espera-se um erro `401 Unauthorized`).

## 📄 Documentação das Rotas com Postman

Para facilitar os testes e a exploração da API, um arquivo de coleção do Postman chamado `postman.json` está incluído na raiz do projeto.

Você pode importar este arquivo diretamente para o seu Postman para ter acesso a todas as rotas da API, incluindo exemplos de requisições para:

* Registro de usuário
* Login
* Criação, listagem, atualização e exclusão de pedidos

Isso permite testar rapidamente todos os endpoints e entender como eles funcionam.
