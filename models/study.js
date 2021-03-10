const Sequelize = require('sequelize');

module.exports = class Study extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            online_flag:{
                type: Sequelize.INTEGER,
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
            address:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            category:{
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
                allowNull:false,
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
    }



}