const sequelize = require("sequelize");
require('dotenv').config()

const conexao = new sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_HOST,
    {dialect:"postgres"}
)

module.exports = { conexao }
