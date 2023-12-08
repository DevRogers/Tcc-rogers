require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
var mysql = require('mysql')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
const https = require('https')

const fs = require(`fs`);
const cors = require('cors');
const banco = require("./banco")
const Usuario = require("./Usuario")
const app = express()
const jsonParser = bodyParser.json()


const veiculos = require("./veiculos")
const pessoas = require("./pessoas")
const historico = require("./historico")



app.use(express.json())
app.use(cookieParser())
app.use(cors());
banco.conexao.sync( function(){
  console.log("Banco de dados conectado.");
})

const PORTA = 3005
app.listen(PORTA,function(){
  console.log("Servidor rodando na porta " + PORTA );
})

// var con = mysql.createConnection({
//   host: "localhost",
//     user: "fabioRoger",
//     password: "Abcd&123",
//     database: "bancoTcc"
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Conectado!");
// });
app.get("/",(req,res)=>{
  res.status(200).json({msg:"Sucesso"})
})

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });

//LOGIN
async function encontrarUsuarioPorEmail(email){
  const resultado = await Usuario.Usuario.findAll({
    where:{ email:email }
  })
  if( resultado.length == 0 ) return null
  return resultado[0]
}
async function encontrarUsuarioPorId(id){
  const resultado = await Usuario.Usuario.findByPk(id)
  return resultado
}

// const corsOptions = {
//   origin: ['http://127.0.0.1:5500'],
//   methods: 'GET,POST'
// };

// app2.use(cors(corsOptions));

var options =  {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
}

// https.createServer(options, app).listen(portaServidor, '0.0.0.0', () => {
//   console.log("Servidor conectado na porta " + portaServidor);
// });


app.post('/auth/register/',async(req,res)=>{
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  if( !name ){
    return res.status(422).send({msg:"O nome é obrigatório"})
  }
  if( !email ){
    return res.status(422).send({msg:"O email é obrigatório"})
  }
  if( !password ){
    return res.status(422).send({msg:"A senha é obrigatória"})
  }
  if( password != confirmPassword ){
    return res.status(422).send({msg:"As senhas não conferem"})
  }
  const usuario = await encontrarUsuarioPorEmail(email)
  if( usuario != null ){
    return res.status(422).send({msg:"Email já utilizado"})
  }
  const salt = await bcryptjs.genSalt(12)
  const passwordHash = await bcryptjs.hash(password,salt)

  const resultado = await Usuario.Usuario.create({
    "name":name,
    "email":email,
    "hash":passwordHash
  })
  res.status(201).send({msg:"Usuário criado com sucesso"})
})

app.post("/auth/user/", async(req,res)=>{
  const email = req.body.email
  const password = req.body.password
  if( !email ){
    return res.status(422).send({msg:"O email é obrigatório"})
  }
  if( !password ){
    return res.status(422).send({msg:"A senha é obrigatória"})
  }

  const usuario = await encontrarUsuarioPorEmail(email)
  if( usuario == null ){
    return res.status(422).send({msg:"Usuário não encontrado"})
  }
  const checkPassword = await bcryptjs.compare(password, usuario.hash)
  if( !checkPassword ){
    return res.status(422).send({msg:"Senha Inválida"})
  }

  try{
    const secret = process.env.SECRET

      const token = jwt.sign({
        id:usuario.id
      }, secret, { expiresIn: "24h" } )

    //res.cookie('auth',token);
    res.status(200).json({msg:"Autenticação realizada com sucesso!",id:usuario.id,token})
  }catch(error){
    console.log(error);
    return res.status(500).send({msg:"Erro no servidor. Tente novamente mais tarde!"})
  }
})

// Adicionar o checkToken em todos as URLS que você quer proteger.
app.get("/user/:id", checkToken, async(req,res) => {
  const id = req.params.id
  const usuario = await encontrarUsuarioPorId(id)
  if( usuario == null ){
    return res.status(404).send({msg:"Usuário não encontrado"})
  }
  
  // Adicionar depois para mostrar que só esta logado.
  var infoToken = jwt.verify(req.headers.token, process.env.SECRET);
  if( usuario.id != infoToken.id){
    return res.status(401).send({msg:"Acesso Negado!"})
  }

  res.status(200).send({id:usuario.id, name:usuario.name,email:usuario.email})
})

function checkToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
      jwt.verify(token, process.env.SECRET, function(err, token_data) {
          if (err) {
              return res.status(400).send({ msg: "Token inválido" });
          } else {
              // Verificar se o ID do usuário no token corresponde ao ID fornecido na rota
            console.log(token_data.id)
              if (token_data.id != req.params.id) {
                  return res.status(401).send({ msg: "Acesso Negado!" });
              }
              next();
          }
      });
  } else {
      return res.status(401).send({ msg: "Acesso Negado! Token não fornecido." });
  }
}
//LOGIN

app.put("/auth/user/:id", checkToken,jsonParser, async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;

  // Validar os dados recebidos
  if (!name) {
    return res.status(422).send({ msg: "O nome é obrigatório" });
  }

  if (!email) {
    return res.status(422).send({ msg: "O e-mail é obrigatório" });
  }

  // Verificar se o usuário existe
  const usuario = await encontrarUsuarioPorId(id);
  if (!usuario) {
    return res.status(404).send({ msg: "Usuário não encontrado" });
  }

  // Atualizar os dados do usuário
  usuario.name = name;
  usuario.email = email;

  // Atualizar a senha se uma nova senha foi fornecid

  // Salvar as alterações no banco de dados
  try {
    await usuario.save();
    const usuarioAtualizado = {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
    };
    res.status(200).send(usuarioAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Erro ao atualizar o usuário" });
  }
});

//Cadastro e listagem de pessoas
app.get("/pessoas/",async function(req, res) {
  const resultado = await pessoas.Pessoas.findAll()
  res.json(resultado);
})

app.get("/pessoas/:usuarioId",async function(req, res) {
  const resultado = await pessoas.Pessoas.findAll({
      where:{ usuarioId:req.params.usuarioId }
  })
  if( resultado == null ){
      res.status(404).send({})
  }
  res.json(resultado);
})
app.get("/pessoas/name/:usuarioId",async function(req, res) {
  const resultado = await pessoas.Pessoas.findAll({
      where:{ name:req.params.name,
      usuarioId:req.params.usuarioId}
  })
  if( resultado == null ){
      res.status(404).send({})
  }
  res.json(resultado);
})
app.post("/pessoas/",async function(req,res){
  const resultado = await pessoas.Pessoas.create({
      name:req.body.name,
      telefone:req.body.telefone,
      cidade:req.body.cidade,
      estado:req.body.estado,
      usuarioId:req.body.usuarioId
  })
  res.json(resultado)
})

app.put("/pessoas/:id",async function(req,res){
  const resultado = await pessoas.Pessoas.update({
    name:req.body.name,
    telefone:req.body.telefone,
    cidade:req.body.cidade,
    estado:req.body.estado,
    usuarioId:req.body.usuarioId
  },{
      where:{id: req.params.id}
  })
  if( resultado == 0){
      res.status(404).send({})
  }else{
      res.json( await pessoas.Pessoas.findByPk(req.params.id))
  }
})
app.delete("/pessoas/:id",async function(req,res){
  const resultado = await pessoas.Pessoas.destroy({
      where:{
          id:req.params.id
      }
  })
  if( resultado == 0 ){
      res.status(404).send({})
  }else{
      res.status(204).send({})
  }
})
// //Fim do Cadastro e listagem de pessoas

// //Cadastro do Financeiro
app.get("/historicos/:usuarioId",async function(req, res) {
  const resultado = await historico.Historicos.findByPk(req.params.usuarioId)
  if( resultado == null ){
      res.status(404).send({})
  }
  res.json(resultado);
})

app.get("/historicos/total/:usuarioId",async function(req, res) {
  const resultado = await historico.Historicos.findAll({
      where:{ usuarioId:req.params.usuarioId }
  })
  if( resultado == null ){
      res.status(404).send({})
  }
  res.json(resultado);
})

app.post("/historicos/",async function(req,res){
  const resultado = await historico.Historicos.create({
          nome: req.body.nome,
          valor:req.body.valor,
          descricao:req.body.descricao,
          data:req.body.data,
          veiculo:req.body.veiculo,
          placa:req.body.placa,
          tipo:req.body.tipo,
          entrada:req.body.entrada,
          saida:req.body.saida,
          usuarioId:req.body.usuarioId
  })
  res.json(resultado)
})
app.put("/historicos/:id",async function(req,res){
  const resultado = await historico.Historicos.update({
    nome: req.body.nome,
    valor:req.body.valor,
    descricao:req.body.descricao,
    data:req.body.data,
    veiculo:req.body.veiculo,
    placa:req.body.placa,
    tipo:req.body.tipo,
    entrada:req.body.entrada,
    saida:req.body.saida,
    usuarioId:req.body.usuarioId
  },{
      where:{id: req.params.id}
  })
  if( resultado == 0){
      res.status(404).send({})
  }else{
      res.json( await historico.Historicos.findByPk(req.params.id))
  }
})
app.delete("/historicos/:id",async function(req,res){
  const resultado = await historico.Historicos.destroy({
      where:{
          id:req.params.id
      }
  })
  if( resultado == 0 ){
      res.status(404).send({})
  }else{
      res.status(204).send({})
  }
})
// //Fim cadastro do financeiro

// //Inicio cadastro de placas
app.get("/veiculos/:pessoaId/:usuarioId",async function(req, res) {
  const resultado = await veiculos.Veiculos.findAll({
      where:{ pessoaId:req.params.pessoaId,
      usuarioId:req.params.usuarioId}
  })
  if( resultado == null ){
      res.status(404).send({})
  }
  res.json(resultado);
})
app.get("/veiculos/:usuarioId",async function(req, res) {
  const resultado = await veiculos.Veiculos.findAll({
      where:{usuarioId:req.params.usuarioId}
  })
  if( resultado == null ){
      res.status(404).send({})
  }
  res.json(resultado);
})
app.get("/veiculos/",async function(req, res) {
  const resultado = await veiculos.Veiculos.findAll()
  res.json(resultado);
})
app.post("/veiculos/",async function(req,res){
  const resultado = await veiculos.Veiculos.create({
    placa:req.body.placa,
          renavam:req.body.renavam,
          modelo:req.body.modelo,
          cidade:req.body.cidade,
          estado:req.body.estado,
          pessoaId:req.body.pessoaId,
          usuarioId:req.body.usuarioId
  })
  res.json(resultado)
})
app.put("/veiculos/:id",async function(req,res){
  const resultado = await veiculos.Veiculos.update({
    placa:req.body.placa,
    renavam:req.body.renavam,
    modelo:req.body.modelo,
    cidade:req.body.cidade,
    estado:req.body.estado,
    pessoaId:req.body.pessoaId,
    usuarioId:req.body.usuarioId
  },{
      where:{id: req.params.id}
  })
  if( resultado == 0){
      res.status(404).send({})
  }else{
      res.json( await veiculos.Veiculos.findByPk(req.params.id))
  }
})
app.delete("/veiculos/:id",async function(req,res){
  const resultado = await veiculos.Veiculos.destroy({
      where:{
          id:req.params.id
      }
  })
  if( resultado == 0 ){
      res.status(404).send({})
  }else{
      res.status(204).send({})
  }
})