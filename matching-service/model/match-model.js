import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');

const Match = await sequelize.define('Match', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userOne: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userTwo: {
    type: DataTypes.STRING,
    // allowNull defaults to true
  }
}, {
  // Other model options go here
}).sync();

export default Match;