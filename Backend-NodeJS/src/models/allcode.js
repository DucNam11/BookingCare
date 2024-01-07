'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Allcode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' })
            Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
            Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' })

            Allcode.hasMany(models.Doctor_Info, { foreignKey: 'priceId', as: 'priceIdTypeData' })
            Allcode.hasMany(models.Doctor_Info, { foreignKey: 'paymentId', as: 'paymentIdTypeData' })
            Allcode.hasMany(models.Doctor_Info, { foreignKey: 'provinceId', as: 'provinceIdTypeData' })

            Allcode.hasMany(models.Parkages, { foreignKey: 'priceId', as: 'priceIdData' })
            Allcode.hasMany(models.Parkages, { foreignKey: 'categoryId', as: 'categoryIdData' })
            Allcode.hasMany(models.Parkages, { foreignKey: 'provinceId', as: 'provinceIdData' })

            Allcode.hasMany(models.Booking, { foreignKey: 'timeType', as: 'timeTypeDataPatient' })
        }
    }
    Allcode.init({
        keyMap: DataTypes.STRING,
        type: DataTypes.STRING,
        valueEn: DataTypes.STRING,
        valueVi: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Allcode',
    });
    return Allcode;
};