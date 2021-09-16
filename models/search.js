const Sequelize = require('sequelize');

module.exports = class Search extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            keyword:{
                type:Sequelize.STRING,
                allowNull:false
            }
        }, {
            sequelize,
            timestamps:false,
            modelName:'Search',
            tableName:'Search',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Search.belongsTo(db.User,{foreignKey:'idUser', targetKey:'id'});

    };
}