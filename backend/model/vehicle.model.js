const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Vehicle = sequelize.define('Vehicle', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  images: { type: DataTypes.JSON, allowNull: true },
  tags: { type: DataTypes.JSON, allowNull: true },
  userId: { type: DataTypes.INTEGER, references: { model: "users", key: 'id' } },
});

User.hasMany(Vehicle, { foreignKey: 'userId' });
Vehicle.belongsTo(User, { foreignKey: 'userId' });

module.exports = Vehicle;
