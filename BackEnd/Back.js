const express = require('express');
const morgan = require('morgan');
const supabaseClient = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const chave = "";
const url = "";

const supabase = supabaseClient.createClient(url, chave);

app.get('/produtos', async (req, res) => {
  const { dados, erro } = await supabase
    .from('produtos')
    .select();
  res.send(dados);
  console.log(`lista todos os produtos: ${dados}`);
});

app.get('/produtos/:id', async (req, res) => {
  console.log("id = " + req.params.id);
  const { dados, erro } = await supabase
    .from('produtos')
    .select()
    .eq('id', req.params.id);
  res.send(dados);
  console.log("retorno: " + dados);
});

app.post('/produtos', async (req, res) => {
  const { erro } = await supabase
    .from('produtos')
    .insert({
      nome: req.body.nome,
      descricao: req.body.descricao,
      preco: req.body.preco,
    });
  if (erro) {
    res.send(erro);
  }
  res.send("criado!!");
  console.log("retorno: " + req.body.nome);
  console.log("retorno: " + req.body.descricao);
  console.log("retorno: " + req.body.preco);
});

app.put('/produtos/:id', async (req, res) => {
  const { erro } = await supabase
    .from('produtos')
    .update({
      nome: req.body.nome,
      preco: req.body.preco,
    })
    .eq('id', req.params.id);
  if (erro) {
    res.send(erro);
  }
  res.send("atualizado!!");
  console.log("retorno: " + req.body.nome);
});

app.delete('/produtos/:id', async (req, res) => {
  console.log("deletar: " + req.params.id);
  const { erro } = await supabase
    .from('produtos')
    .delete()
    .eq('id', req.params.id);
  if (erro) {
    res.send(erro);
  }
  res.send("deletado!!");
  console.log("deletar: " + req.params.id);
});

app.get('/', (req, res) => {
  res.send("Olá, estou funcionando com meu amigo Supabase <3");
});

app.get('*', (req, res) => {
  res.send("Olá novamente, estou funcionando com meu amigo até a lua e além <3");
});

app.listen(3000, () => {
  console.log(`> Pronto em http://localhost:3000`);
});
