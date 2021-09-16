const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();


const studyRouter = require('./routes/study');
const studyMngRouter = require('./routes/studyManage'); // 스터디관리
const searchRouter = require('./routes/search'); //검색라우터
const reportRouter = require('./routes/report'); // 신고하기
const evaluateRouter = require('./routes/evaluate'); //상호평가 라우터
const authRouter = require('./routes/auth');
const socialLoginRouter = require('./routes/socialLogin');
const cateRouter = require('./routes/category');
const { sequelize } = require('./models');

const app = express();

sequelize.sync({force:false})
    .then(() => {
      console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
      console.error(err);
    });

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret: process.env.SECRET_KEY,
}));

app.use('/study',studyRouter);
app.use('/manage',studyMngRouter); // 스터디관리
app.use('/search',searchRouter);
app.use('/report',reportRouter); // 신고하기
app.use('/evaluate',evaluateRouter);
app.use('/auth',authRouter);
app.use('/socialLogin',socialLoginRouter);
app.use('/category',cateRouter);
app.use('/images',express.static(__dirname + '/images'));

app.listen(4000, () => {
  console.log('start server');
});