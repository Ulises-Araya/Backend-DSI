const isLocalhost = process.env.DATABASE_URL && (
  process.env.DATABASE_URL.includes('localhost') || 
  process.env.DATABASE_URL.includes('127.0.0.1')
);

let sequelize;

if(process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    ...(isLocalhost ? {} : {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        }
      }
    }),
    logging: false,
  });
} else {
  // modo local con config.js
  const env = process.env.NODE_ENV || 'development';
  const config = require('../config/config')[env];
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}
