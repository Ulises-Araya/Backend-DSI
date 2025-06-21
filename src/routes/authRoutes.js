const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

// Ruta para registrar un usuario nuevo
router.post('/register', authController.register);
// Ruta para iniciar sesión
router.post('/login', authController.login);
// Ruta para cerrar sesión y borrar prompts/respuestas
router.post('/logout', auth, authController.logout);

module.exports = router;