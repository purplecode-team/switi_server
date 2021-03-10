const Sequelize = require('sequelize');

module.exports = class Admin extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            email:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            name:{
                type:Sequelize.STRING(200),
                allowNull:false,
            },
            password:{
                type:Sequelize.STRING(200),
                allowNull:false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Admin',
            tableName:'Admin',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {};
}