import Sequelize from 'sequelize';
import Post from './post.js';
class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                // 비밀번호는 암호화되어 훨씬 길어지기 떄문에 생각보다 길게 제한을 줘야한다
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                // 자유롭게 적는것을 'local', 'kakao' 로 제한
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate() {
        User.hasMany(Post);
        User.belongsToMany(User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        });
        User.belongsToMany(User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    }
}
;
export default User;
