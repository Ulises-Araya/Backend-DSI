require('dotenv').config();

module.exports = {
  development: process.env.DATABASE_URL ? {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: console.log
  } : {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'Turnero_Biblioteca',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    logging: console.log
  },
  test: process.env.DATABASE_URL ? {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  } : {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME_TEST || 'biblioteca_test',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    logging: false
  },
  production: process.env.DATABASE_URL ? {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  } : {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'biblioteca_prod',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    logging: false
  }
};