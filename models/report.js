const Sequelize = require('sequelize');

module.exports = class Report extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            content:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            state:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:'0',
            },
            createdAt:{
                type:Sequelize.DATE,
                allowNull:false,
                defaultValue:Sequelize.NOW,
            }
        }, {
            sequelize,
            timestamps:false,
            modelName:'Report',
            tableName:'Report',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Report.belongsTo(db.User, {foreignKey:'idUser', targetKey:'id'});
        db.Report.belongsTo(db.User, {foreignKey:'idMember', targetKey:'id'});
        db.Report.belongsTo(db.Study, {foreignKey:'idStudy', targetKey:'id'});

    };
}