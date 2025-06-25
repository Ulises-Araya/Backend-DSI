
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta para registrar un usuario nuevo
router.post('/auth/register', usuarioController.register);

// Ruta para iniciar sesión de usuario
router.post('/auth/login', usuarioController.login);

// Ruta para cerrar sesión
router.post('/auth/logout', usuarioController.logout);

// Ruta para ver todos los usuarios
router.get('/', usuarioController.getAllUsuarios);

//Ruta para buscar usuario por dni
router.get('/dni/:dni', usuarioController.getUsuarioByDni);

// Ruta para ver un usuario por su ID
router.get('/:id', usuarioController.getUsuarioById);

// Ruta para actualizar usuario
router.put('/:id', usuarioController.updateUsuario);

// Ruta para eliminar usuario
router.delete('/:id', usuarioController.deleteUsuario);

// Solicitar reseteo de contraseña
router.post('/auth/forgot-password', usuarioController.forgotPassword);

// Resetear la contraseña con token
router.post('/auth/reset-password', usuarioController.resetPassword);

module.exports = router;
