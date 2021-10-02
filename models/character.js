const Sequelize = require('sequelize');

module.exports = class Character extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            content:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            cate:{
                type: Sequelize.STRING(200),
                defaultValue:'character'
            }
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

    static associate(db) {
        db.Character.belongsToMany(db.User,{through:'myCharacter'});
    };

}