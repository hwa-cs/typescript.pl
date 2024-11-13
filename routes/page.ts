import express from 'express';
import { isLoggedIn, isNotLoggedIn } from'../middlewares';
import { renderProfile, renderJoin, renderMain, renderHashtag } from'../controllers/page';

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
  // res.locals는 미들웨어간 공유되는 데이터
  // req.session는 로그아욷 전까지 사용자들 끼리 공유된는 데이터
  next();
});

router.get('/profile', isLoggedIn, renderProfile);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

router.get('/hashtag', renderHashtag) // hashtag?hashtag=고양이

export default router;
