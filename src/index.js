const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usuarioRoutes = require('./routes/usuarioRoutes');
const shiftRoutes = require('./routes/shiftRoutes');

const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: 'http://localhost:9002', // Cambia esto al puerto real de tu frontend
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/turnos', shiftRoutes);

// app.listen(3001, () => {
//   console.log('Servidor corriendo en http://localhost:3001');
// });

module.exports = app;