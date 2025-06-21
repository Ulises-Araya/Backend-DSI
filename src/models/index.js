
// Este archivo centraliza la configuración y carga de todos los modelos de la base de datos.
const { Sequelize } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const db = {};

let sequelize;
if (process.env.DATABASE_URL) {
  // Detecta si es localhost para no usar SSL
  const isLocalhost = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    ...(isLocalhost ? {} : {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }),
    logging: dbConfig.logging
  });
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging
    }
  );
}

// Carga todos los modelos definidos en la carpeta models
const modelDefiners = [
  require('./usuarios'),
  require('./salas'),
  require('./invitados_turno'),
  require('./turnos')
];

// Define todos los modelos en sequelize y los añade a nuestro objeto 'db'
for (const modelDefiner of modelDefiners) {
  const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Llama a associate en cada modelo si la función existe
Object.values(db).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

// Adjunta la instancia y el constructor de Sequelize al objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exporta el objeto db que contiene todos los modelos y la conexión
module.exports = db;
