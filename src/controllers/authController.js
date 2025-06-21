const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Prompt, Respuesta, Busqueda } = require('../models');

// Controlador para registrar un usuario nuevo
exports.register = async (req, res) => {
  try {
    // Crea el usuario con los datos recibidos
    const usuario = await Usuario.create({
      nombre: req.body.nombre,
      email: req.body.email,
      dni: req.body.dni,
      password: req.body.password,
      rol: req.body.rol
    });
    // Genera un token para que el usuario pueda autenticarse
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ token, id: usuario.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
  try {
    const { dni, password } = req.body;
    // Busca el usuario por dni
    const usuario = await Usuario.findOne({ where: { dni } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Compara la contraseña recibida con la guardada
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Si todo está bien, genera un token para el usuario
    const token = jwt.sign(
      { id: usuario.id, dni: usuario.dni, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, id: usuario.id, rol: usuario.rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para cerrar sesión
exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', { 
      httpOnly: true, 
      sameSite: 'strict', 
      secure: process.env.NODE_ENV === 'production' 
    });
    res.json({ mensaje: 'Sesión cerrada correctamente.' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: error.message });
  }
};