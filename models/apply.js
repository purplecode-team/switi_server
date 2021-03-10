const Sequelize = require('sequelize');

module.exports = class Apply extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            apply_state:{
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue:'0',
            },
            contact:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            apply_detail:{
                type:Sequelize.STRING,
                allowNull:false,
            },
        }, {
            sequelize,
            timestamps:true,
            modelName:'Apply',
            tableName:'Apply',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Apply.belongsTo(db.User,{foreignKey:'idUser',targetKey:'id'});
        db.Apply.belongsTo(db.Study,{foreignKey:'idStudy',targetKey:'id'});
    };
}