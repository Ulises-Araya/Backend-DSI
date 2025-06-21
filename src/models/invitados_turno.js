module.exports = (sequelize, DataTypes) => {
  const InvitadosTurno = sequelize.define('InvitadosTurno', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_turno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'turnos',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    estado_invitacion: {
      type: DataTypes.ENUM('aceptado', 'rechazado', 'pendiente'),
      allowNull: false
    },
    asistencia: {
      type: DataTypes.ENUM('presente', 'ausente', 'pendiente'),
      allowNull: true
    },
    fecha_respuesta: {
      type: DataTypes.DATEONLY
    }
  }, {
    tableName: 'invitados_turno',
    timestamps: false
  });

  InvitadosTurno.associate = (models) => {
    InvitadosTurno.belongsTo(models.Turno, { foreignKey: 'id_turno' });
    InvitadosTurno.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
  };

  return InvitadosTurno;
};
