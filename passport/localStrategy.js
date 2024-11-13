var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
export default () => {
    passport.use(new LocalStrategy({
        // usernameField: 'email'와 passwordField: 'password'는 
        // 폼에서 전달받는 요청 객체(req.body)의 필드 이름이 email과 password임을 지정하는 것입니다.
        // Passport의 LocalStrategy가 이 옵션을 보고 폼 데이터에서 email과 password를 
        // 찾아 자동으로 인증 처리를 합니다.
        usernameField: 'email',
        passwordField: 'password',
        // 사용자가 입력한 비밀번호
        passReqToCallback: false, // req가 필요하면 사용 true로 설정
    }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        // done(서버실패, 성공유저, 로직실패)
        // done(error): 오류가 발생한 경우 호출하며, 인증이 중단됩니다.
        // done(null, user): 인증이 성공하고 user 객체를 전달할 때 호출됩니다.
        // done(null, false, { message: 'Error message' }): 
        // 인증이 실패한 경우 호출하며, 실패 메시지를 전달할 수 있습니다.
        try {
            const exUser = yield User.findOne({ where: { email } });
            // db에 저장된 유저
            if (exUser) { // 성공유저
                const result = yield bcrypt.compare(password, exUser.password);
                // db에 저장된 비밀번호
                if (result) {
                    // 비밀번호가 같으면 
                    done(null, exUser);
                }
                else { // 로직실패
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            }
            else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        }
        catch (error) { // 서버실패
            console.error(error);
            done(error);
        }
    })));
};
