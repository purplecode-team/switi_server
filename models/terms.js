const Sequelize = require('sequelize');

module.exports = class Terms extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            terms:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Terms',
            tableName:'Terms',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

}