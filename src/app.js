const express = require("express");
const { v4: uuidv4 } = require("uuid");

// Array para simular um banco de dados
const database = [
  {
    _id: uuidv4(),
    title: "You Don't Know Js: Scope & Closures",
    author: "Kyle Simpson",
    publisher: "O'Reilly",
    year: 2014,
    genre: "Programming",
  },
];

const app = express();

// Configurar nosso servidor Express para "entender" requisições com corpo em formato JSON
app.use(express.json());

// CRUD no Express

// CREATE
// As requisições do tipo POST e PUT/PATCH possuem uma propriedade especial chamado "body", que carrega o conteúdo da requisição
app.post("/book", (req, res) => {
  console.log(req.body);

  // Adicionando um id único no objeto a ser criado
  const data = { ...req.body, _id: uuidv4() };

  // Adiciona o objeto
  database.push(data);

  // 201 significa Created
  res.status(201).json(data);
});

// READ
app.get("/book", (req, res) => {
  // Caso seja uma pesquisa
  if (req.query.search) {
    const searchResult = database.filter((bookObj) => {
      for (let key in bookObj) {
        // Procurando em cada propriedade do livro se essa propriedade inclui a pesquisa do usuário
        const includesResult = String(bookObj[key])
          .toLowerCase()
          .includes(req.query.search.toLowerCase());

        // includesResult vai ser true ou false, dependendo se alguma chave do livro inclui o termo de busca ou não
        if (includesResult) {
          return includesResult;
        }
      }
    });

    if (searchResult.length) {
      return res.status(200).json(searchResult);
    }

    return res
      .status(404)
      .json({ msg: "Nenhum livro atende seus critérios de busca." });
  }

  // Respondendo todos os livros do banco de dados
  res.status(200).json(database);
});

// READ (detalhe)
app.get("/book/:id", (req, res) => {
  // Similar ao React, podemos declarar parâmetros de rota no Express usando a sintaxe ":nome-do-parametro". Os parâmetros de rota ficam disponíveis no objeto params.
  console.log(req.params);

  const foundBook = database.find((bookObj) => {
    return bookObj._id === req.params.id;
  });

  if (foundBook) {
    return res.status(200).json(foundBook);
  }

  return res.status(404).json({ msg: "Livro não encontrado." });
});

//UPDATE
app.patch("/book/:id", (req, res) => {
  // Encontrar o índice do registro a ser atualizado
  const foundBookIndex = database.findIndex((bookObj) => {
    return bookObj._id === req.params.id;
  });

  // Caso encontrado, modifique o registro
  if (foundBookIndex > -1) {
    // Cria um novo objeto com os valores atualizados
    const updated = { ...database[foundBookIndex], ...req.body };

    // Substitui o objeto no índice encontrado pelo objeto atualizado
    database[foundBookIndex] = updated;

    return res.status(200).json(updated);
  }

  return res.status(404).json({ msg: "Livro não encontrado." });
});

// DELETE
app.delete("/book/:id", (req, res) => {
  // Encontrar o índice do registro a ser atualizado
  const foundBookIndex = database.findIndex((bookObj) => {
    return bookObj._id === req.params.id;
  });

  if (foundBookIndex > -1) {
    // Corta o livro da lista no índice atual
    database.splice(foundBookIndex, 1);

    return res.status(200).json({});
  }

  return res.status(404).json({ msg: "Livro não encontrado." });
});

app.listen(4000, () => console.log("Servidor rodando na porta 4000!"));
