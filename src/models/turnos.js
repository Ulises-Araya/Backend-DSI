module.exports = (sequelize, DataTypes) => {
  const Turno = sequelize.define('Turno', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    tematica: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cantidad_integrantes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aceptado', 'cancelado'),
      allowNull: true,
      defaultValue: 'pendiente',
    },
    observaciones: {
      type: DataTypes.TEXT
    },
    fecha_creacion: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    id_sala: {
      type: DataTypes.INTEGER,
      references: {
        model: 'salas',
        key: 'id'
      }
    }
  }, {
    tableName: 'turnos',
    timestamps: false
  });

  Turno.associate = (models) => {
    Turno.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'Usuario' });
    Turno.belongsTo(models.Sala, { foreignKey: 'id_sala' });
    Turno.hasMany(models.InvitadosTurno, { foreignKey: 'id_turno' });
  };

  return Turno;
};
