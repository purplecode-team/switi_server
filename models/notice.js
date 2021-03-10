const Sequelize = require('sequelize');

module.exports = class Notice extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            title:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            content:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            createdAt:{
                type:Sequelize.DATE,
                allowNull:false,
                defaultValue:Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Notice',
            tableName:'Notice',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {};
}