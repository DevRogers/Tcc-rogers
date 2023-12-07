const { Sequelize } = require("sequelize");
require('dotenv').config()

const conexao = new Sequelize(
    process.env.DB_HOST,{dialect:"postgres"}
);

module.exports = { conexao };
