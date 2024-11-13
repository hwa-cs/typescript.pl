import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';
import { renderProfile, renderJoin, renderMain, renderHashtag } from '../controllers/page.js';
const router = express.Router();
router.use((req, res, next) => {
    var _a, _b, _c, _d, _e, _f;
    res.locals.user = req.user;
    res.locals.followerCount = ((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.Followers) === null || _b === void 0 ? void 0 : _b.length) || 0;
    res.locals.followingCount = ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.Followings) === null || _d === void 0 ? void 0 : _d.length) || 0;
    res.locals.followingIdList = ((_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.Followings) === null || _f === void 0 ? void 0 : _f.map(f => f.id)) || [];
    // res.locals는 미들웨어간 공유되는 데이터
    // req.session는 로그아욷 전까지 사용자들 끼리 공유된는 데이터
    next();
});
router.get('/profile', isLoggedIn, renderProfile);
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);
router.get('/hashtag', renderHashtag); // hashtag?hashtag=고양이
export default router;
