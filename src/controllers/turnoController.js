const db = require('../models');
const Turno = db.Turno;
const InvitadosTurno = db.InvitadosTurno;
const Usuario = db.Usuario;
const Sala = db.Sala;

// Obtener todos los turnos (solo datos básicos, sin joins)
exports.getAllTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll();
    res.json(turnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
};

// Modifica getTurnoById para incluir la cantidad real de integrantes aceptados
exports.getTurnoById = async (req, res) => {
  try {
    console.log('Buscando turnos con id del usuario:', req.params.id);
    const turnos = await Turno.findAll({ where: { id_usuario: req.params.id } });
    if (!turnos || turnos.length === 0) {
      console.log('No se encontraron turnos para este usuario');
      return res.json([]);
    }

    // Para cada turno, contar los invitados aceptados o pendientes (ignora rechazados) y sumar el creador
    const turnosConIntegrantes = await Promise.all(turnos.map(async (turno) => {
      const count = await InvitadosTurno.count({
        where: {
          id_turno: turno.id,
          estado_invitacion: ['aceptado', 'pendiente']
        }
      });
      return {
        ...turno.toJSON(),
        cantidad_integrantes: 1 + count // 1 por el creador
      };
    }));

    res.json(turnosConIntegrantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener turnos del usuario' });
  }
};

exports.deleteTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    await turno.destroy();
    res.json({ mensaje: 'Turno eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.createTurno = async (req, res) => {
  try {
    const { fecha, hora_inicio, hora_fin, tematica, cantidad_integrantes, estado, observaciones, fecha_creacion, id_usuario, id_sala } = req.body;

    const nuevoTurno = await Turno.create({
      fecha,
      hora_inicio,
      hora_fin,
      tematica,
      cantidad_integrantes,
      estado, // opcional, si no lo mandás se pone 'pendiente' por default
      observaciones,
      fecha_creacion, // opcional, si no lo mandás usa la fecha default (hoy)
      id_usuario,
      id_sala // <-- Asegúrate de guardar id_sala
    });

    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error('Error al crear turno:', error);
    res.status(400).json({ error: error.message });
  }
};

// Endpoint para obtener todos los turnos con usuario creador, invitados y sala (para admin/encargado y frontend)
exports.getAllTurnosFull = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [
        {
          model: Usuario,
          as: 'Usuario',
          attributes: ['id', 'nombre', 'dni', 'email']
        },
        {
          model: InvitadosTurno,
          include: [{
            model: Usuario,
            attributes: ['id', 'nombre', 'dni', 'email']
          }]
        },
        {
          model: Sala,
          attributes: ['id', 'nombre']
        }
      ]
    });
    res.json(turnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener turnos completos' });
  }
};

// Actualizar un turno por ID
exports.updateTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    // Si se envía id_sala, también actualiza el campo area (nombre de la sala)
    if (req.body.id_sala) {
      const sala = await Sala.findByPk(req.body.id_sala);
      if (sala) {
        req.body.area = sala.nombre;
      }
    }

    await turno.update(req.body);
    console.log('Mensaje:', req.body);
    res.json({ mensaje: 'Turno actualizado correctamente', turno });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un turno por ID con su sala relacionada
exports.getTurnoConSala = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id, {
      include: [
        {
          model: Sala,
          attributes: ['id', 'nombre']
        }
      ]
    });
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    res.json(turno);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener turno con sala' });
  }
};