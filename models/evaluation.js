const Sequelize = require('sequelize');

module.exports = class Evaluation extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            score:{ //평가점수
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps:false,
            modelName:'Evaluation',
            tableName:'Evaluation',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Evaluation.belongsTo(db.User,{foreignKey:'idUser', targetKey:'id'});
        db.Evaluation.belongsTo(db.User,{foreignKey:'idMember', targetKey:'id'});
        db.Evaluation.belongsTo(db.Study,{foreignKey:'idStudy',targetKey:'id'});
    };
}