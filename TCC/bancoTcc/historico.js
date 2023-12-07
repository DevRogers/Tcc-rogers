const sequelize = require("sequelize");
const banco = require("./banco")

var Historicos = banco.conexao.define(
    "historicos",
    {
        id:{
            type:sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nome:{
            type:sequelize.STRING,
            allowNull:false
        },
        valor:{
            type:sequelize.DOUBLE,
            allowNull:false
        },
        descricao:{
            type:sequelize.STRING,
            allowNull:false
        },
        data:{
            type:sequelize.DATE,
            allowNull:false
        },
        veiculo:{
            type:sequelize.STRING,
            allowNull:false
        },
        placa:{
            type:sequelize.STRING,
            allowNull:false
        },
        tipo:{
            type:sequelize.STRING,
            allowNull:false
        },
        entrada:{
            type:sequelize.DOUBLE,
            allowNull:false
        },
        saida:{
            type:sequelize.DOUBLE,
            allowNull:false
        }
    },
    {
        timestamps:false
    }
)

module.exports = {Historicos: Historicos}