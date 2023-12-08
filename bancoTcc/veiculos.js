const sequelize = require("sequelize");
const banco = require("./banco")

var Veiculos = banco.conexao.define(
    "veiculos",
    {
        id:{
            type:sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        placa:{
            type:sequelize.STRING,
            allowNull:false
        },
        renavam:{
            type:sequelize.STRING,
            allowNull:false
        },
        modelo:{
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

module.exports = {Veiculos: Veiculos}