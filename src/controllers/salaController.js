const { Sala } = require('../models');

// Obtener todas las salas
exports.getAll = async (req, res) => {
  try {
    const salas = await Sala.findAll();
    res.json(salas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener salas' });
  }
};

// Obtener una sala por id
exports.getById = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }
    res.json(sala);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la sala' });
  }
};

// Crear una nueva sala
exports.create = async (req, res) => {
  try {
    const sala = await Sala.create(req.body);
    res.status(201).json(sala);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar una sala por id
exports.update = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }
    await sala.update(req.body);
    res.json({ mensaje: 'Sala actualizada correctamente', sala });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una sala por id
exports.delete = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }
    await sala.destroy();
    res.json({ mensaje: 'Sala eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
