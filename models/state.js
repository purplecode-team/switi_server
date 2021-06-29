const Sequelize = require('sequelize');

module.exports = class State extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            category:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'State',
            tableName:'State',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.State.belongsToMany(db.Study, {through:'studyTarget'}); //스터디 대상
        db.State.belongsToMany(db.User,{through:'myState'});
    };
}