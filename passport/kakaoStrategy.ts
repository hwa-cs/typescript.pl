import passport from'passport'
import { Strategy as KakaoStrategy } from'passport-kakao'
import User from'../models/user'

export default () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID!,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) =>{
        // accessToken, refreshToken 카카오 api를 사용시 사용
        console.log('profile', profile)
        // profile 카카오톡 프로필
        // 하지만 자주 바뀜 계속 확인해줘야함
        try {
            const exUser = await User.findOne({
                where: {snsId: profile.id, provider: 'kakao'}
            })
            if (exUser) {
                done(null, exUser)
            } else {
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email,
                    // 이메일 주소가 항상 바뀌어서 코드를 수정해줘야함
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser)
            }
        } catch (error) {
            console.error(error)
            done(error)
        }
    }
    ))
}
