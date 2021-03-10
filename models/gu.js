const Sequelize = require('sequelize');

module.exports = class Gu extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            gu:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Gu',
            tableName:'Gu',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Gu.belongsTo(db.Region,{foreignKey:'regionId', targetKey:'id'});
    };
}