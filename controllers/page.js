var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/user.js';
import Post from '../models/post.js';
import Hashtag from '../models/hashtag.js';
const renderProfile = (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
};
const renderJoin = (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
};
const renderMain = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
const renderHashtag = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = yield Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = yield hashtag.getPosts({ include: [{ model: User }] });
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    }
    catch (error) {
        console.error(error);
        return next(error);
    }
});
export { renderHashtag, renderProfile, renderMain, renderJoin };
