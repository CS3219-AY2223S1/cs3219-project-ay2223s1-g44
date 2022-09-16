import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');

const MatchModel = await sequelize.define('Match', {
  // Model attributes are defined here
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userOne: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userOneSocketId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userTwo: {
    type: DataTypes.STRING,
    // allowNull defaults to true
  },
  userTwoSocketId: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  // Other model options go here
}).sync();

export default MatchModel;