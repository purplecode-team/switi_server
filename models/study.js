const Sequelize = require('sequelize');

module.exports = class Study extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            online_flag:{
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            title:{
                type:Sequelize.STRING,
                allowNull: false,
            },
            desc:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            target:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            recruit_num:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:'0',
            },
            detail_address:{
                type:Sequelize.STRING,
                allowNull:true,
            },
            period:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            contact:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            flag:{
                type:Sequelize.BOOLEAN,
                defaultValue:true,
            },
            createdAt:{
                type:Sequelize.DATE,
                allowNull:false,
                defaultValue:Sequelize.NOW,
            },
            endDate:{
                type:Sequelize.DATE,
                allowNull:false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Study',
            tableName:'Study',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.Study.hasMany(db.Report,{foreignKey:'idStudy', sourceKey:'id'});
        db.Study.hasMany(db.Apply,{ foreignKey:'idStudy',sourceKey:'id'});
        db.Study.belongsTo(db.User,{foreignKey:'idUser',targetKey:'id'}); // 스터디 작성자
        db.Study.hasMany(db.Evaluation,{foreignKey:'idStudy',sourceKey:'id'});
        db.Study.hasMany(db.Image,{foreignKey:'idStudy',sourceKey:'id'});
        db.Study.belongsToMany(db.User,{through:'studyMember'});
        db.Study.belongsToMany(db.Interest, {through:'studyCategory'}); // 카테고리 n:m
        db.Study.belongsToMany(db.State, {through:'studyTarget'}); // 스터디 대상
        db.Study.belongsToMany(db.Gu, {through:'studyRegion'}); // 스터디 지역
        db.Study.belongsToMany(db.User, {through:'likedList',as:'likedUser'}); // 스크랩 스터디 목록
    }



}