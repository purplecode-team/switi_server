const express = require('express');
const multer = require('multer');
const { Study,Interest,Gu,State,User,Character,Region } = require('../models');
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

//유저 프로필정보 가져오기 (나이 , 관심지역 , 관심분야 , 나의 성향 , 나의 성격, 자기소개)
router.get('/myprofile/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id;
    try{
        const myProfile = await User.findOne({
            attributes:['age'],
            include:[{
                model:Interest,
                attributes:['category'],
                through:{attributes:['InterestId']}
            },{
                model:State,
                attributes:['category'],
                through:{attributes:['StateId']}
            },{
                model:Gu,
                attributes:['gu'],
                include:[{
                    model:Region,
                    attributes:['city']
                }]
            },{
                model:Character,
                attributes:['content'],
                through:{attributes:['CharacterId']}
            }],where:{id}
        });

        return res.status(200).send({result:true,myProfile});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

module.exports = router;