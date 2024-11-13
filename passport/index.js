import passport from 'passport';
import local from './localStrategy.js';
// import kakao from './kakaoStrategy.js';
import User from '../models/user.js';
export default () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // user id만 추출
    });
    // 세션 {1234123412: 1}    {세션쿠키 : 유저아이디} -> 메모리에 저장됨
    // 수많은 유저의 세션쿠키까지 저장되면 메모리가 너무 큼
    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                },
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                }, // 팔로워
            ]
        })
            .then(user => done(null, user)) // req.user, req.session
            // req.user, req.session 자동생성
            // 정확히는 connect.sid쿠키로 세션에서 찾을 때 req.session이 생성됨
            .catch(err => done(err));
    });
    local();
    // kakao();
};
