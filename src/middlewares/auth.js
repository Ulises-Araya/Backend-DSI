// Este middleware verifica si el usuario está autenticado usando un token JWT.
// Si el token es válido, deja pasar la petición. Si no, la bloquea.

const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'No autorizado: token no presente' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded; // guarda los datos del token en req
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Verifica rol si es necesario
    if (roles.length && !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso prohibido' });
    }

    next();
  };
};
