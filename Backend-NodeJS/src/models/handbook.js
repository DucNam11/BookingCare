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
            Handbook.belongsTo(models.User, { foreignKey: 'userId' })
        }
    }
    Handbook.init({
        name: DataTypes.STRING,
        image: DataTypes.TEXT,
        contentHTML: DataTypes.TEXT('long'),
        contentMarkdown: DataTypes.TEXT('long'),
        userId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Handbook',
    });
    return Handbook;
};