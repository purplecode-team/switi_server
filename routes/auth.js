const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('./middlewares');
const mailUtil = require('./mailUtil');

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
    const { nickname, email, password, gender } = req.body; // 이메일, 패스워드, 닉네임, 성별     
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
        });

        return res.status(200).send({result:true,message:"가입완료"}); // true 모든 api 수정하기

    }catch(err){
        console.error(err);
        return res.status(500).send('error');
    }
});

// 로그인 테스트 라우터
router.get('/test',isLoggedIn, (req,res)=>{
    res.send('로그인확인@');
})

//메일 인증
router.post('/compareCode',async(req,res)=>{
    const {email, inputCode} = req.body;

    try{
        //유저정보 가져오기
        const user = await User.findOne({where:{email:email}});
        if(inputCode == user.certificationCode){
            // 코드가 일치하면 인증번호값 null 로 변경 후 토큰발급
            console.log("코드 일치");
            await User.update(
                {certificationCode:null,certification:true},
                {where:{email:email}});
            const token = jwt.sign({
                id:user.id,
                email: user.email,
                nickname: user.nickname,
            }, process.env.JWT_SECRET);

            console.log(token);
            return res.status(200).send({result:true,token});
        }else{
            return res.status(404).send({result:false,message:"인증번호가 일치하지 않습니다."});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({result:false});
    }

})

//메일 재전송
router.post('/resendMail',async(req,res)=>{
    const {email} = req.body;
    try{
        await mailUtil.sendEmail(email);
        return res.status(400).send({result:false,email:email});
    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
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
            if(!user.certification){
                // 최초 로그인일 경우 인증메일 전송하기
                console.log('메일 전송');
                await mailUtil.sendEmail(email);
                // 최초 로그인 시 result false , 해당 유저 이메일 반환
                return res.status(400).send({result:false,email:email});
            }

            const token = jwt.sign({
                id:user.id,
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


// 회원 탈퇴 기능
router.delete('/deleteUser',isLoggedIn,async(req,res)=>{

    const id = req.decoded.id; // 현재 로그인한 아이디

    try{
         const result = await User.destroy({
            where:{id:id}
         })

        if(result){
            return res.status(200).send({result:true});
        }

    }catch(err){
      return res.status(500).send({result:false});
    }
});

//비밀번호 찾기
router.post('/findPwd', async(req,res)=>{
    const email = req.body.email;
    try{
        const user = User.findOne({where:email});
        if(!user){
            // 존재하지 않는 이메일인 경우
            return res.status(404).send({result:false});
        }
        //메일 전송
        await mailUtil.sendEmail(email);
        return res.status(200).send({result:true});

    }catch(err){
        console.log(err);
        return res.status(500).send({result:false});
    }
});

//인증코드 확인
router.post('/checkCode',async(req,res)=>{
    const { inputCode, email } = req.body;
    //유저정보 가져오기
    try{
        await mailUtil.compareCode(email,inputCode);
        return res.status(200).send({result:true});
    }catch(err){
        console.log(err);
        return res.status(500).send({result:false});
    }

});

//비밀번호 재설정
router.post('/setNewPwd',async(req,res)=>{
    const { password , email } = req.body;
    try {
        const hash = await bcrypt.hash( password, 12); // 패스워드 암호화
        await User.update(
            {password: hash},
            {where: {email: email}
        });
    }catch(err){
        console.error(err);
        return res.status(500).send({return:false});
    }

});

module.exports = router;