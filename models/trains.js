const mysql=require("mysql");
const Sequelize = require('sequelize');
const db = require('../config/database');


const Train = db.define('trains', {
  train_id:{
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    autoIncrement: false,
  },
  train_name: {
    type: Sequelize.STRING
  },
  departure_time: {
    type: Sequelize.DATE
  },
  source:{
      type:Sequelize.STRING
  },
  destination:{
      type:Sequelize.STRING
  },
  station_id:{
      type:Sequelize.INTEGER
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()')
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()')
  }
},{
  timestamp:false
});

module.exports = Train;