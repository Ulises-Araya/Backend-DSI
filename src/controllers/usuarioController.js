const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controlador para iniciar sesión de usuario
exports.login = async (req, res) => {
  try {
    const { dni, password } = req.body;
    // Busca el usuario por dni
    const usuario = await Usuario.findOne({ where: { dni } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Verifica la contraseña
    const isValidPassword = await bcrypt.compare(password, usuario.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Genera un token para el usuario
    const token = jwt.sign(
      { id: usuario.id, dni: usuario.dni, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true, // La cookie no es accesible desde JS del navegador
      secure: process.env.NODE_ENV === 'production', // En producción, solo HTTPS
      sameSite: 'strict', // Protege contra CSRF
      maxAge: 60 * 60 * 1000 // 1 hora en milisegundos
    });

    res.json({ mensaje: 'Inicio de sesión exitoso', id: usuario.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Registro de usuario (POST /usuarios)
exports.register = async (req, res) => {
  try {
    const { nombre, email, dni, password, rol } = req.body;
    // Verifica que no exista el usuario por dni o email
    const existe = await Usuario.findOne({ where: { dni } }) || await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ error: 'El usuario ya existe con ese DNI o email' });
    }
    // Crea el usuario (el hook beforeCreate encripta la contraseña)
    const usuario = await Usuario.create({
      nombre,
      email,
      dni,
      password,
      rol: rol || 'usuario'
    });
    // Opcional: genera token al registrar
    const token = jwt.sign(
      { id: usuario.id, dni: usuario.dni, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: usuario.id, token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Trae todos los usuarios (sin mostrar las contraseñas)
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Trae un usuario por su ID (sin mostrar la contraseña)
exports.getUsuarioById = async (req, res) => {
  try {
    console.log('Buscando usuario con id:', req.params.id);
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) {
      console.log('No se encontró usuario');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Actualiza un usuario existente
exports.updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se envía una nueva contraseña, encripta antes de guardar
    if (req.body.password) {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } else {
      // No actualizar la contraseña si está vacía
      delete req.body.password;
    }

    await usuario.update(req.body);
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Elimina un usuario por ID
exports.deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

//Cambio hecho para el turnero
//
//
// Busca un usuario por su DNI
exports.getUsuarioByDni = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ where: { dni: req.params.dni } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar usuario por DNI' });
  }
};

// Solicitar reseteo de contraseña (envía token, normalmente por email)
exports.forgotPassword = async (req, res) => {
  try {
    const { email, dni } = req.body;
    const usuario = await Usuario.findOne({
      where: email ? { email } : { dni }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Genera un token de reseteo válido por 15 minutos
    const resetToken = jwt.sign(
      { id: usuario.id, dni: usuario.dni },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    // Aquí deberías enviar el token por email. Por ahora, lo devolvemos en la respuesta.
    res.json({ mensaje: 'Token de reseteo generado', resetToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Resetear la contraseña usando el token
exports.resetPassword = async (req, res) => {
  try {
    const { token, dni, newPassword } = req.body;
    if (!token || !dni || !newPassword) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    // Verifica que el DNI coincida con el del token
    if (payload.dni !== dni) {
      return res.status(400).json({ error: 'DNI inválido para este token' });
    }
    const usuario = await Usuario.findOne({ where: { dni } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Hashea la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(newPassword, salt);
    await usuario.save();
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
