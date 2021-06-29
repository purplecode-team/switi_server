const Sequelize = require('sequelize');

module.exports = class studyMember extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            contact:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            leader:{
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue:false
            }
        }, {
            sequelize,
            timestamps:false,
            modelName:'studyMember',
            tableName:'studyMember',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

}