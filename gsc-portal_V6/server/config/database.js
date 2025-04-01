const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,     // DB명
  process.env.DB_USER,     // 사용자명
  process.env.DB_PASSWORD, // 비밀번호
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
)

module.exports = sequelize
