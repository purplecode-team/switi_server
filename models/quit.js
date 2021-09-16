const Sequelize = require('sequelize');

module.exports = class Quit extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            reason:{ // 탈퇴 사유
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Quit',
            tableName:'Quit',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {};
}