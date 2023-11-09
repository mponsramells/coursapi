const { DataTypes} = require('sequelize');
const sequelizeInstance = require('../utils/sequelize');
const User = require('./user');

const Task = sequelizeInstance.define('Tasks', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
        allowNull: true,
    },
    done: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

(async() => {
    await Task.sync({alter:true});

})();
module.exports = {Task};
