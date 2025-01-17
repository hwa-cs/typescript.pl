import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/user';
import { RequestHandler } from 'express';

const join: RequestHandler = async (req, res, next) => {
   const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

const login: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (authError: Error | null, user: Express.User | false, info: { message: string }) => {
  if (authError) {
    console.error(authError);
    return next(authError);
  }
  if (!user) {
    return res.redirect(`/?error=${info.message}`);
  }
  return req.login(user, (loginError) => {
    if (loginError) {
      console.error(loginError);
      return next(loginError);
    }
    return res.redirect('/');
  });
})(req, res, next);
 // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

const logout:RequestHandler = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};

export { logout, login, join }