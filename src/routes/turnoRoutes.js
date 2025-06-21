const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

// Obtener todos los turnos (solo datos básicos, sin joins)
router.get('/', turnoController.getAllTurnos);

// Obtener todos los turnos con usuario creador e invitados (para admin/encargado)
router.get('/full/all', turnoController.getAllTurnosFull);

// Obtener turnos de un usuario por su ID
router.get('/:id', turnoController.getTurnoById);

// Obtener un turno por ID con su sala relacionada
router.get('/conSala/:id', turnoController.getTurnoConSala);

// Eliminar un turno por ID
router.delete('/:id', turnoController.deleteTurno);

// Crear un nuevo turno
router.post('/', turnoController.createTurno);

// Actualizar un turno por ID
router.put('/:id', turnoController.updateTurno);

module.exports = router;