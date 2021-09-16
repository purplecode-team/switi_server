const Sequelize = require('sequelize');

module.exports = class Alarm extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            alarmInterest:{ //관심스터디
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            alarmRequest:{ //스터디 신청알림
                type:Sequelize.BOOLEAN,
                allowNull:false,
            },
            alarmResult:{ // 스터디 수락 및 거절 알
                type:Sequelize.BOOLEAN,
                allowNull:false,
            },
            alarmEvaluation:{ // 상호평가 알림
                type:Sequelize.BOOLEAN,
                allowNull:false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Alarm',
            tableName:'Alarm',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Alarm.belongsTo(db.User,{foreignKey:'idUser',targetKey:'id'});
    };
}