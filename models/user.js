const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type:Sequelize.STRING,
                allowNull:false,
            },
            gender:{
                type:Sequelize.INTEGER,
                allowNull:false,
            },
            age:{
                type:Sequelize.INTEGER,
                allowNull:false,
            },
            nickname:{
                type:Sequelize.STRING,
                unique:true,
                allowNull:false,
            },
            aboutme:{
                type:Sequelize.STRING,
                allowNull:true,
            },
            sugar:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue: '50',
            },
            profilepath:{
                type:Sequelize.STRING,
                allowNull:true,
            },
            event:{ //이벤트 프로모션 알림 메일 수신
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue: true,
            },
            certification:{
                type: Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue: false,
            },
            certificationCode:{
                type:Sequelize.INTEGER,
                allowNull:true,
            },

        }, {
            sequelize,
            timestamps:true,
            paranoid:false,
            underscored:false,
            modelName: 'User',
            tableName: 'User',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.Study,{foreignKey:'idUser',sourceKey:'id'});
        db.User.hasMany(db.Evaluation, {foreignKey:'idUser',sourceKey:'id'});
        db.User.hasMany(db.Report,{foreignKey:'idUser',sourceKey:'id'});
        db.User.hasMany(db.Report,{foreignKey:'idMember',sourceKey:'id'});
        db.User.hasMany(db.Apply,{foreignKey:'idUser',sourceKey:'id'});
        db.User.hasOne(db.Alarm,{foreignKey:'idUser',sourceKey:'id'});
        db.User.belongsToMany(db.Study,{through:'studyMember'});
        db.User.belongsToMany(db.Interest,{through:'myInterest'});
        db.User.belongsToMany(db.Character,{through:'myCharacter'});
        db.User.belongsToMany(db.Gu,{through:'myRegion'});
        db.User.belongsToMany(db.State,{through:'myState'});



    };
};