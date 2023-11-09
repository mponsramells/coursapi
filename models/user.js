const { DataTypes} = require('sequelize');
const sequelizeInstance = require('../utils/sequelize');
const {Task} = require('./task');

const User = sequelizeInstance.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
        allowNull: false,
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

(async() => {
    await User.sync({alter:true});

})();
module.exports = {User};