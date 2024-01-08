'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Handbooks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            statusId: {
                type: Sequelize.STRING,
            },
            authors: {
                type: Sequelize.STRING,
            },
            senderId: {
                type: Sequelize.INTEGER,
            },
            censor: {
                type: Sequelize.INTEGER,
            },
            adviser: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            contentHTML: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            },
            contentMarkdown: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Handbooks');
    }
};