'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Handbook extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Handbook.belongsTo(models.User, { foreignKey: 'senderId', targetKey: 'id', as: 'senderData' })
        }
    }
    Handbook.init({
        name: DataTypes.STRING,
        authors: DataTypes.STRING,
        statusId: DataTypes.STRING,
        senderId: DataTypes.INTEGER,
        censor: DataTypes.INTEGER,
        adviser: DataTypes.STRING,
        image: DataTypes.TEXT,
        contentHTML: DataTypes.TEXT('long'),
        contentMarkdown: DataTypes.TEXT('long'),
    }, {
        sequelize,
        modelName: 'Handbook',
    });
    return Handbook;
};