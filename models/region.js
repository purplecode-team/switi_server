const Sequelize = require('sequelize');

module.exports = class Region extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            city:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            cate:{
                type: Sequelize.STRING(200),
                defaultValue:'region'
            }
        }, {
            sequelize,
            timestamps:false,
            modelName:'Region',
            tableName:'Region',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        //db.Region.hasMany(db.Gu,{ foreignKey: 'regionId', sourceKey: 'id'});
        //db.Gu.belongsTo(db.Region,{foreignKey:'regionId', targetKey:'id'});
        db.Region.belongsToMany(db.Study, {through:'studyRegion'}); // 스터디 지역
        db.Region.belongsToMany(db.User, {through:'myRegion'});
    };
}