import Sequelize from 'sequelize';
import configObj from '../config/config.js';
import User from './user.js';
import Post from './post.js';
import Hashtag from './hashtag.js';
const env = process.env.NODE_ENV || 'development';
const config = configObj[env];
const db = {};
const sequelize = new Sequelize.Sequelize(config.database, config.username, config.password, config);
User.initiate(sequelize);
Post.initiate(sequelize);
Hashtag.initiate(sequelize);

User.associate();
Post.associate();
Hashtag.associate();
export { User, Post, Hashtag, sequelize };
