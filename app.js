const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const studyRouter = require('./routes/study');
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

app.listen(4000, () => {
  console.log('start server');
});