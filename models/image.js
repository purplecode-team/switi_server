const Sequelize = require('sequelize');

module.exports = class Image extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            imgPath:{ //이미지경로
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps:false,
            modelName:'Image',
            tableName:'Image',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Image.belongsTo(db.Study, { foreignKey:'idStudy', targetKey:'id'});
    };
}