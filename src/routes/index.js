// Este archivo agrupa y organiza las rutas principales de la API.
// Así puedes importar todas las rutas desde un solo lugar.

const express = require('express');
const router = express.Router();

// Importar rutas de usuarios y libros
const usuarioRoutes = require('./usuarioRoutes');

// Configurar rutas: cuando se pida /usuarios o /libros, usa los archivos correspondientes
router.use('/usuarios', usuarioRoutes);

module.exports = router;