const sequelize = require("sequelize");
const banco = require("./banco");
const Pessoas = require("./pessoas");
const Veiculos = require("./veiculos")
const Historicos = require("./historico")
var Usuario = banco.conexao.define(
    "usuario",
    {
        id:{
            type:sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        name:{
            type:sequelize.STRING,
            allowNull:false
        },
        email:{
            type:sequelize.STRING,
            allowNull:false
        },
        hash:{
            type:sequelize.STRING,
            allowNull:false
        }
    }
)
Usuario.hasMany(Pessoas.Pessoas)
Usuario.hasMany(Veiculos.Veiculos)
Usuario.hasMany(Historicos.Historicos)
module.exports = {Usuario: Usuario}