const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    dni: {
      type: DataTypes.STRING(50), // igual que en la DB
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(100)
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING(255) // igual que en la DB
    },
    rol: {
      type: DataTypes.ENUM('usuario', 'admin'),
      defaultValue: 'usuario'
    },
    foto_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  // Si tienes asociaciones inversas, agrégalas aquí
  // Usuario.hasMany(models.Turnos, { foreignKey: 'usuarioId' });

  return Usuario;
};