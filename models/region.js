const Sequelize = require('sequelize');

module.exports = class Region extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            city:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Interest',
            tableName:'Interest',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Region.hasMany(db.Gu,{ foreignKey: 'regionId', sourceKey: 'id'});
    };
}