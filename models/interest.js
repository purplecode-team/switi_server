const Sequelize = require('sequelize');

module.exports = class Interest extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            category:{
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
        db.Interest.belongsToMany(db.Study, {through:'studyCategory'});
    };
}