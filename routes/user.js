const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const { Study,Image,sequelize,Interest,Gu,State,User } = require('../models');
const { isLoggedIn } = require('./middlewares');
const path = require('path');
const fs = require('fs');

const router = express.Router();

//유저 마이페이지 ( 당도 , 스크랩 수, 닉네임, 프로필사진)
router.get('/mypage/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id;
    try{

        const myPage = await User.findOne({
            attributes:['nickname','profilepath','sugar'],
            where:{id}
        });

        const scrapCount = await User.count({
            include:[{
                model:Study,
                as:'likedStudy',
            }],where:{id}
        });

        return res.status(200).send({result:true,myPage,scrapCount});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }

});

//회원정보 수정
router.put('/updateUserinfo',isLoggedIn,async(req,res)=>{

    const id = req.decoded.id; // 유저 id 값 가져오기
    const {nickname,email,newPassword} = req.body;
    let {password} = req.body;

    try{
        const user = await User.findOne({where:{id}});
        // new password 가 입력되었을 경우
        if(newPassword) {
            // 기존 비밀번호 비교
            const result = await bcrypt.compare(password,user.password);
            if(result){
                // 기존 비밀번호 일치 시
                password = await bcrypt.hash(newPassword, 12);
                console.log(password);
            }else{
                return res.status(404).send({result:false,message:"비밀번호 불일치"});
            }
        }

        await user.update({
            email,
            nickname,
            password
        })

        return res.status(200).send({result:true});


    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

module.exports = router;