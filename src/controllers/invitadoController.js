const { InvitadosTurno } = require('../models');

// Obtener invitados por id_turno
exports.getByTurno = async (req, res) => {
  try {
    const invitados = await InvitadosTurno.findAll({ where: { id_turno: req.params.id_turno } });
    res.json(invitados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener invitados del turno' });
  }
};

// Crear un invitado para un turno
exports.create = async (req, res) => {
  try {
    const invitado = await InvitadosTurno.create(req.body);
    res.status(201).json(invitado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener invitaciones pendientes para un usuario
exports.getInvitacionesPendientes = async (req, res) => {
  try {
    const { Turno, Usuario } = require('../models');
    const invitaciones = await InvitadosTurno.findAll({
      where: {
        id_usuario: req.params.id_usuario,
        estado_invitacion: 'pendiente'
      },
      include: [
        { model: Turno, include: [{ model: Usuario, as: 'Usuario', attributes: ['nombre', 'dni'] }] }
      ]
    });
    res.json(invitaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener invitaciones pendientes' });
  }
};

// Actualizar el estado de una invitación
exports.updateEstadoInvitacion = async (req, res) => {
  try {
    const { InvitadosTurno } = require('../models');
    const { id } = req.params;
    const { estado_invitacion } = req.body;

    const invitacion = await InvitadosTurno.findByPk(id);
    if (!invitacion) {
      return res.status(404).json({ error: 'Invitación no encontrada' });
    }

    invitacion.estado_invitacion = estado_invitacion;
    invitacion.fecha_respuesta = new Date();
    await invitacion.save();

    res.json(invitacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener turnos aceptados como invitado para un usuario
exports.getTurnosAceptados = async (req, res) => {
  try {
    const { Turno, Usuario, InvitadosTurno } = require('../models');
    const invitaciones = await InvitadosTurno.findAll({
      where: {
        id_usuario: req.params.id_usuario,
        estado_invitacion: 'aceptado'
      },
      include: [
        { model: Turno, include: [{ model: Usuario, as: 'Usuario', attributes: ['nombre', 'dni'] }] }
      ]
    });

    // Para cada invitación, calcular la cantidad real de integrantes (aceptados + pendientes, ignora rechazados)
    const result = await Promise.all(invitaciones.map(async (inv) => {
      const count = await InvitadosTurno.count({
        where: {
          id_turno: inv.id_turno,
          estado_invitacion: ['aceptado', 'pendiente']
        }
      });
      // Suma el creador
      const turnoObj = inv.Turno.toJSON();
      turnoObj.cantidad_integrantes = 1 + count;
      return { ...inv.toJSON(), Turno: turnoObj };
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener turnos aceptados' });
  }
};
