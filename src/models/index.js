// Este archivo centraliza la configuración y carga de todos los modelos de la base de datos.

const { Sequelize } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

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

// No hay referencias a MySQL aquí, Sequelize usará el dialecto de la config.

// Carga todos los modelos definidos en la carpeta models
const modelDefiners = [
  require('./usuarios'),
  require('./salas'),
  require('./invitados_turno'),
  require('./turnos')
];

// Define todos los modelos en sequelize
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize, Sequelize.DataTypes);
}

// Llama a associate en cada modelo si existe
Object.values(sequelize.models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(sequelize.models);
  }
});

// Exporta los modelos y la conexión para usarlos en el resto de la app
module.exports = {
  ...sequelize.models,
  sequelize,
  Sequelize
};