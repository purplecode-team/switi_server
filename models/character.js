const Sequelize = require('sequelize');

module.exports = class Character extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            content:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Character',
            tableName:'Character',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

}