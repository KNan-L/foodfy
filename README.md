<body>
    <ul>
        <h3 align="center">
            <img src="public/logo.png">
            <br>
            <img src="public/logowhite.png">
        </h3>
        <li> 
        <p>Foodfy é o projeto final realizado durante o <strong>Bootcamp LaunchBase</strong> da <strong>Rocketseat.</strong></p>
        </li>
        <li>
        <p>Um projeto que coloca em prática o conhecimento adquirido nas aulas, sendo implementado um site de receitas, com gerenciamento de usuários, chefs e receitas. Utilizando Html, css, javascript e outras tecnologias. </p>
        </li>
    </ul>
</body>
<br>

---

## **Tecnologias e Frameworks**

### **Backend:** 
- JavaScript ([NodeJS])

- SQL Server ([PostgresSQL])

- Framework [Express]

### **Frontend:** 
- Nunjucks

- JavaScript

- HTML

- CSS

<br>
---
## `Como Utilizar:`

1. Baixe [o projeto]:
   
    * Baixe o arquivo _zip_.

2. Execute **`npm install`** no terminal para instalar as dependências deste projeto.

3. Configure o acesso ao Banco de dados (utilizando o Postgres), no arquivo __src/config/db.js__

4. Caso não possua o banco foodfy com suas tabelas criado, importe o arquivo dbfoodfy.sql para o Postgres com o nome foodfy.

5. Após configurar o arquivo _db.js_ e criar o banco, execute o arquivo seed.js (`node seed.js`) para popular alguns dados e testar a aplicação.

6. Execute `npm start` para iniciar a aplicação.

### Mais informações

Todas as senhas do seed.js são padronizadas ('1111'), pegue um email da tabela users e utilize um usuário na rota de login (`/admin/login`).

O Seed cria 3 usúarios administradores do sistema, 3 receitas com dados fakes e 6 Chefs com Avatares aleatórios.
