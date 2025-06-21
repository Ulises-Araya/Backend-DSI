// Este archivo inicia el servidor y se asegura de que la base de datos esté lista.

const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

// Sincroniza la base de datos y luego inicia el servidor
sequelize.sync({ alter: true }) // Cambia a true solo si quieres borrar y crear todo de nuevo (solo en desarrollo)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });