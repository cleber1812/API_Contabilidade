const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const produtos = require('./routes/produtos')
const usuarios = require('./routes/usuarios')
//let dados = require('./dados.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//app.get('/', (req, res) => { res.send("Hello world2")})
app.get('/', (req, res) => {
  res.statusCode = 200;
  res.json({"mensagem": "Hello world3"})
})

//PRODUTOS
//app.get('/produtos', (req, res) => {res.status(200).json(dados)})
app.use('/produtos', produtos);
app.use('/usuario', usuarios);

//POR ID
//app.get('/produto/:id', (req, res) => {
//  let buscaidProduto = req.params.id;
//  let produto;
//  for (i=0;i<dados.length;i++) {
//    if (dados[i].idProduto == buscaidProduto) {
//     produto = dados[i]
//     break;
//    }
//  }
//  if (produto) mensagem = "Produto encontrado"
//  else mensagem = "Produto não encontrado"
  //res.statusCode = 200;
//  res.status(200).json(produto)
  //res.json({produto: produto, mensagem: mensagem})
  //res.status(200).json({PROD: produto, MENS: mensagem})
//})

//POST
app.post('/produto', (req, res) => {
 let produto = req.body;
 console.log(produto);
  res.status(200).json("ok")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})