// Este middleware sirve para permitir solo a ciertos roles (por ejemplo, solo admin) acceder a una ruta.

module.exports = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Si el usuario no tiene el rol necesario, bloquea el acceso
    if (roles.length && !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso prohibido' });
    }
    next();
  };
};