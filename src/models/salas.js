module.exports = (sequelize, DataTypes) => {
  const Sala = sequelize.define('Sala', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1 // CHECK capacidad > 0
      }
    }
  }, {
    tableName: 'salas',
    timestamps: false
  });

  Sala.associate = (models) => {
    Sala.hasMany(models.Turno, { foreignKey: 'id_sala' });
  };

  return Sala;
};
