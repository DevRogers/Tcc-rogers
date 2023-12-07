require('dotenv').config()
const express = require('express')
const express2 = require('express')
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
const app2 = express2();

app.listen(3005)
app.use(express.json())
const portaServidor = process.env.PORT || 3306;
app2.use(express2.json())
app2.use(cookieParser())
banco.conexao.sync( function(){
  console.log("Banco de dados conectado.");
})

var con = mysql.createConnection({
  host: "localhost",
    user: "fabioRoger",
    password: "Abcd&123",
    database: "bancoTcc"
});

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Conectado!");
// });
app2.get("/",(req,res)=>{
  res.status(200).json({msg:"Sucesso"})
})

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });
  app2.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });

//LOGIN
async function encontrarUsuarioPorEmail(email){
  const resultado = await Usuario.usuario.findAll({
    where:{ email:email }
  })
  if( resultado.length == 0 ) return null
  return resultado[0]
}
async function encontrarUsuarioPorId(id){
  const resultado = await Usuario.usuario.findByPk(id)
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

https.createServer(options, app2).listen(portaServidor, '0.0.0.0', () => {
  console.log("Servidor conectado na porta " + portaServidor);
});
app.use(cors());

app2.post('/auth/register/',async(req,res)=>{
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

  const resultado = await Usuario.usuario.create({
    "name":name,
    "email":email,
    "hash":passwordHash
  })
  res.status(201).send({msg:"Usuário criado com sucesso"})
})

app2.post("/auth/user/", async(req,res)=>{
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
app2.get("/user/:id", checkToken, async(req,res) => {
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

app2.put("/auth/user/:id", checkToken,jsonParser, async (req, res) => {
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
app.get("/pessoas/:idUsuario", function (req, res) {
    var sql = "SELECT * FROM pessoas WHERE idUsuario=?;"
    var values = [req.params.idUsuario]
    con.query(sql,values, function (err, result, fields) {
        if (err) throw err;
        res.send(result)
    })
})


app.get("/pessoas/nome/:idUsuario", function (req, res) {
  var sql = "SELECT * FROM pessoas WHERE nome = ? AND idUsuario = ?";
  var values = [req.params.nome, req.params.idUsuario];
  con.query(sql, values, function (err, result) {
    if (err) throw err;
    if (result.length == 0) {
      res.status(404).send({});
    } else {
      res.send(result);
    }
  });
});
app.get("/pessoas/:id", function (req, res) {
    var sql = "SELECT * FROM pessoas WHERE id = ? "
    var values = [req.params.id]
    con.query(sql, values, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            res.status(404).send({})
        } else {
            res.send(result)
        }
    });
})

app.post("/pessoas/", jsonParser, function (req, res) {
    var sql = "INSERT INTO pessoas (nome, telefone, cidade, estado, idUsuario) VALUES (?,?,?,?,?)";
    var values = [req.body.nome, req.body.telefone, req.body.cidade, req.body.estado, req.body.idUsuario]
    con.query(sql, values, function (err, result) {
        if (err) throw err;
        const novaPessoa = {
            id: result.insertId,
            nome: req.body.nome,
            telefone: req.body.telefone,
            cidade: req.body.cidade,
            estado: req.body.estado,
            idUsuario:req.body.idUsuario
        };
        res.send(novaPessoa);
    });
});

app.put("/pessoas/:id",jsonParser, function(req,res){
    var sql = "UPDATE pessoas SET nome = ?, telefone = ?, cidade = ?, estado =?, idUsuario=? WHERE id = ?";
    var values = [req.body.nome, req.body.telefone, req.body.cidade, req.body.estado, req.body.idUsuario, req.params.id]
    con.query(sql, values, function (err, result) {
      if (err) throw err;
      if( result.affectedRows == 0 ){
        res.status( 404 ).send( {} )
      }else{
        const novaPessoa = {
          id: req.params.id,
          nome: req.body.nome,
          telefone:req.body.telefone,
          cidade: req.body.cidade,
          estado: req.body.estado,
          idUsuario:req.body.idUsuario
        };
        res.send( novaPessoa );
      }
    });
  });

  app.delete("/pessoas/:id", function(req, res){
    var sql = "DELETE FROM pessoas WHERE id = ?";
    var values = [req.params.id]
    con.query(sql, values, function (err, result) {
      if (err) throw err;
       if( result.affectedRows == 0 ){
        res.status( 404 ).send( {} );
      }else{
        res.status(204).send( {} );
      }
    });
    
  });
//Fim do Cadastro e listagem de pessoas

//Cadastro do Financeiro
app.get("/historico/:idUsuario", function (req,res){
  var sql = "SELECT * FROM historico WHERE idUsuario=? ORDER BY id DESC;"
  var values = [req.params.idUsuario]
  con.query(sql, values, function (err, result, fields) {
    if (err) throw err;
    res.send( result )
  })
})
app.get("/historico/total/:idUsuario", function (req,res){
  var sql = "SELECT count(id) FROM historico WHERE idUsuario=?"
  var values = [req.params.idUsuario]
  con.query(sql,values, function (err, result, fields) {
    if (err) throw err;
    res.send( result )
  })
})
app.post("/historico/", jsonParser, function( req, res ){
  var sql = "INSERT INTO historico (nome, valor, descricao, data, veiculo, placa, tipo, entrada, saida, idUsuario) VALUES (?,?,?,?,?,?,?,?,?,?)";
  var values = [req.body.nome, req.body.valor, req.body.descricao, req.body.data, req.body.veiculo, req.body.placa, req.body.tipo, req.body.entrada, req.body.saida, req.body.idUsuario]
  con.query(sql, values, function (err, result) {
    if (err) throw err;
    const novoHistorico = {
      id: result.insertId,
      nome: req.body.nome,
      valor:req.body.valor,
      descricao:req.body.descricao,
      data:req.body.data,
      veiculo:req.body.veiculo,
      placa:req.body.placa,
      tipo:req.body.tipo,
      entrada:req.body.entrada,
      saida:req.body.saida,
      idUsuario:req.body.idUsuario
    };
    res.send( novoHistorico );
  });
});

app.put("/historico/:id",jsonParser, function(req,res){
  var sql = "UPDATE historico SET nome = ?, valor = ?, descricao = ?, data = ?, veiculo = ?, placa=?, tipo = ?, entrada = ?, saida = ?, idUsuario=? WHERE id = ?";
  var values = [req.body.nome, req.body.valor, req.body.descricao, req.body.data, req.body.veiculo, req.body.placa, req.body.tipo,req.body.entrada,req.body.saida, req.body.idUsuario, req.params.id]
  con.query(sql, values, function (err, result) {
    if (err) throw err;
    if( result.affectedRows == 0 ){
      res.status( 404 ).send( {} )
    }else{
      const novoHistorico = {
        id: req.params.id,
        nome: req.body.nome,
        valor:req.body.valor,
        descricao:req.body.descricao,
        data:req.body.data,
        veiculo:req.body.veiculo,
        placa:req.body.placa,
        tipo:req.body.tipo,
        entrada:req.body.entrada,
        saida:req.body.saida,
        idUsuario:req.body.idUsuario
      };
      res.send( novoHistorico );
    }
  });
});

app.delete("/historico/:id", jsonParser, function(req, res){
  var sql = "DELETE FROM historico WHERE id = ?";
  var values = [req.params.id]
  con.query(sql, values, function (err, result) {
    if (err) throw err;
     if( result.affectedRows == 0 ){
      res.status( 404 ).send( {} );
    }else{
      res.status(204).send( {} );
    }
  });
  
});
//Fim cadastro do financeiro

//Inicio cadastro de placas
app.get("/veiculos/:idPessoa/:idUsuario", function (req, res) {
  var sql = "SELECT * FROM veiculos WHERE idPessoa=? AND idUsuario=?;";
  var values = [req.params.idPessoa, req.params.idUsuario];
  con.query(sql, values, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});
app.get("/veiculos/:idUsuario", function (req, res) {
  var sql = "SELECT * FROM veiculos WHERE idUsuario=?;";
  var values = [req.params.idUsuario];
  con.query(sql, values, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/veiculos/", function (req, res) {
  var sql = "SELECT * FROM veiculos;"
  con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result)
  })
})

app.post("/veiculos/", jsonParser, function( req, res ){
  var sql = "INSERT INTO veiculos (placa, renavam, modelo, cidade, estado, idPessoa, idUsuario) VALUES (?,?,?,?,?,?,?)";
  var values = [req.body.placa, req.body.renavam, req.body.modelo,req.body.cidade, req.body.estado, req.body.idPessoa, req.body.idUsuario]
  console.log(values);
  con.query(sql, values, function (err, result) {
    if (err) throw err;
    const novaPlaca = {
      id: result.insertId,
      placa:req.body.placa,
      renavam:req.body.renavam,
      modelo:req.body.modelo,
      cidade:req.body.cidade,
      estado:req.body.estado,
      idPessoa:req.body.idPessoa,
      idUsuario:req.body.idUsuario
    };
    res.send( novaPlaca );
  });
});

app.put("/veiculos/:id",jsonParser, function(req,res){
  var sql = "UPDATE veiculos SET placa = ?, renavam = ?, modelo = ?,cidade = ?, estado = ?, idPessoa = ?, idUsuario=? WHERE id = ?";
  var values = [req.body.placa, req.body.renavam, req.body.modelo, req.body.cidade, req.body.estado, req.body.idPessoa, req.body.idUsuario, req.params.id]
  con.query(sql, values, function (err, result) {
    if (err) throw err;
    if( result.affectedRows == 0 ){
      res.status( 404 ).send( {} )
    }else{
      const novaPlaca = {
        id: req.params.id,
        placa:req.body.placa,
        renavam:req.body.renavam,
        modelo:req.body.modelo,
        cidade:req.body.cidade,
        estado:req.body.estado,
        idPessoa:req.body.idPessoa,
        idUsuario:req.body.idUsuario
      };
      res.send( novaPlaca );
    }
  });
});

app.delete("/veiculos/:id", jsonParser, function(req, res){
  var sql = "DELETE FROM veiculos WHERE id = ?";
  var values = [req.params.id]
  con.query(sql, values, function (err, result) {
    if (err) throw err;
     if( result.affectedRows == 0 ){
      res.status( 404 ).send( {} );
    }else{
      res.status(204).send( {} );
    }
  });
  
});
