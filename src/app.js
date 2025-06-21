// Importa librerías necesarias para crear el servidor y manejar pedidos.
const express = require('express');
const cors = require('cors'); // Permite que el frontend se conecte al backend
const morgan = require('morgan'); // Muestra en consola los pedidos que llegan
const axios = require('axios'); // Permite hacer pedidos HTTP a otros servicios
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

// Configura CORS para permitir solicitudes desde el frontend
const allowedOrigins = [
  'http://localhost:9002',
  process.env.FRONTEND_URL || 'https://arborvitae-scheduler.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Aquí se conectan las rutas principales de la API.
// Por ejemplo, cuando el frontend pide /api/libros, se usa el archivo libroRoutes.js
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/turnos', require('./routes/turnoRoutes'));
app.use('/api/salas', require('./routes/salaRoutes'));
app.use('/api/invitados', require('./routes/invitadoRoutes'));

// Manejo de errores generales. Si algo sale mal, muestra un mensaje.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno' });
});

module.exports = app;