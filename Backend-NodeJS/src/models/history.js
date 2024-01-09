'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class History extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            History.belongsTo(models.User,
                { foreignKey: 'patientId', targetKey: 'id', as: 'HistoryData' })

            History.belongsTo(models.Allcode,
                { foreignKey: 'timeType', targetKey: 'id', targetKey: 'keyMap', as: 'timeTypeDataHistory' })
        }
    }
    History.init({
        patientId: DataTypes.INTEGER,
        doctorId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        files: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'History',
    });
    return History;
};