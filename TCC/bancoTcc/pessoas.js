const sequelize = require("sequelize");
const banco = require("./banco")
const usuario = require("./Usuario")
const Veiculos = require("./veiculos")

var Pessoas = banco.conexao.define(
    "pessoas",
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
        telefone:{
            type:sequelize.STRING,
            allowNull:false
        },
        cidade:{
            type:sequelize.STRING,
            allowNull:false
        },
        estado:{
            type:sequelize.STRING,
            allowNull:false
        }
    },
    {
        timestamps: false
    }
)
Pessoas.hasMany(Veiculos.Veiculos)
module.exports = {Pessoas: Pessoas}