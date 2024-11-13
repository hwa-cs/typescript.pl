import express, { ErrorRequestHandler } from'express';
import cookieParser from'cookie-parser';
import morgan from'morgan';
import path from'path';
import session from'express-session';
import nunjucks from'nunjucks';
import dotenv from'dotenv';
import {sequelize} from './models'
import postRouter from './routes/post';
import userRouter from './routes/user';
import { Request, Response, NextFunction } from 'express';


import passport from 'passport';
import authRouter from './routes/auth';
import passportConfig from './passport';

dotenv.config(); //process.env
const pageRouter = require('./routes/page');

const app = express();
passportConfig(); // 패스포트 설정
app.use(passport.initialize());
app.use(passport.session());

app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
app.use('/img', express.static(path.join(__dirname, 'uploads')));
// views로 오면 .html로 이동
nunjucks.configure('views', {
    // views폴더로 이동
    express: app,
    watch: true,
});

sequelize.sync({force: false}) 
// force: true 는 개발시에만 쓴다
// 서버 재접속시 테이블 초기화
    .then(() => {
        console.log('데이터베이스 연결 성공')
    })
    .catch((err) => {
        console.log(err)
    })

app.use(morgan('dev'));
// 로깅을 개발자 모드로 설정 - 자세하게 설명
// 배포할떄는 conbind로 바꿔서 배포 - 덜 자세하게 설명 -이유는 데이터를 많이 잡아먹음
app.use(express.static(path.join(__dirname, 'public')));
// 보안상 다른 폴더는 접근 불가능하지만 public 폴더는 접근 허용
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// form과 json 요청을 받을수 있게
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET!,
        cookie: {
            httpOnly: true,
            // 자바스크립트로 접근 못하게
            secure: false,
            // https로 적용할떄 ture로 적용
            // 개발시에는 false
        },
    })
);


app.use('/', pageRouter);
app.use((req, res, next) => {
    //404 not found
    const error = new Error('${req.method} ${req.url} 라우터가 없습니다.');
    error.status = 404;
    next(error);
});

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    //배포 모드가 아닐떄 에러를 표시하지만 아니면 안한다
    res.status(err.status || 500);
    res.render('error');
}
app.use(errorHandler);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
