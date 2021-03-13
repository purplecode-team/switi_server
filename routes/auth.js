const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('./middlewares');
const emailUtil = require('./emailUtil');

const router = express.Router();

//닉네임 중복어부 체크
router.post('/checkNickname', async(req,res,next)=>{
    try{
        const isUser = await User.findOne({
           where:{nickname:req.body.nickname}
        });
        if(isUser){
            return res.status(400).send({result:false,message:"중복된 닉네임입니다."}); // 중복일 경우
        }else{
            return res.status(200).send({result:true,message:"사용가능한 닉네임입니다."}); // 중복 x
        }
    }catch(err){
        console.error(err);
        return res.status(500).send({result:false,message:'error'});
    }
});

//회원가입
router.post('/signup', async (req,res,next) => {
    const { nickname, email, password, gender, age } = req.body;

    try{
        const isEmail = await User.findOne({
            where:{email}
        });
        if(isEmail){
           return res.status(400).send({result:false,message:"이미 가입된 이메일입니다."}); //false 추가해주기
        }

        const hash = await bcrypt.hash(password, 12) // 패스워드 암호화
        await User.create({ // 인증메일 전송 ( 회원가입때 할지 로그인할때 할지 ? )
            nickname,
            email,
            password:hash,
            gender,
            age,
        });

        // 인증번호 발급 메일 전송 
        const num = await emailUtil.sendEmail(email);
        return res.status(200).send({message:"가입완료", num}); // true 모든 api 수정하기

    }catch(err){
        console.error(err);
        return res.status(500).send('error');
    }
});

// 로그인 테스트 라우터
router.get('/test',isLoggedIn, (req,res)=>{
    res.send('로그인확인@');
})

router.post('/login',async(req,res,next)=>{
    const {email,password} = req.body;

    try{
        const user = await User.findOne({where:{email}});

        // 하나 틀리면 틀린걸로 , 5번 틀리면 - 1분
        if(!user){
            return res.status(404).send({result:false});
        }

        const result = await bcrypt.compare(password,user.password);

        // 패스워드 일치 시
        if(result){
            const token = jwt.sign({
                email: user.email,
                nickname: user.nickname,
            }, process.env.JWT_SECRET);

            console.log(token);
            return res.status(200).send({result:true,token});
        }

        return res.status(404).send({result:false});

    } catch(err){
        console.error(err);
        return res.status(500).send('error');
    }

});

module.exports = router;