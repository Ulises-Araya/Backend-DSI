const express = require('express');
const router = express.Router();
const invitadoController = require('../controllers/invitadoController');

// Obtener todos los invitados de un turno por id_turno
router.get('/turno/:id_turno', invitadoController.getByTurno);

// Crear un nuevo invitado para un turno
router.post('/', invitadoController.create);

// Obtener invitaciones pendientes para un usuario (solo las que debe responder)
router.get('/usuario/:id_usuario/pendientes', invitadoController.getInvitacionesPendientes);

// Obtener turnos aceptados como invitado para un usuario (solo los que aceptó)
router.get('/usuario/:id_usuario/aceptados', invitadoController.getTurnosAceptados);

// Actualizar el estado de una invitación (aceptar/rechazar)
router.put('/:id', invitadoController.updateEstadoInvitacion);

module.exports = router;