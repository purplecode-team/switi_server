const express = require('express');
const multer = require('multer');
const { Study,sequelize,Interest,Gu,State,User,Character,Region,Image } = require('../models');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('./middlewares');
const upload = require('./multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

//유저 마이페이지 ( 당도 , 스크랩 수, 닉네임, 프로필사진)
router.get('/myPage/:id',isLoggedIn,async(req,res)=>{
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
router.get('/myProfile/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id;
    try{
        const myProfile = await User.findOne({
            attributes:['age','aboutme'],
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
});

//유저 프로필 수정 (나이 , 관심지역 , 관심분야 , 나의 성향 , 나의 성격, 자기소개)
router.put('/updateProfile',isLoggedIn,async(req,res)=>{
    const id = req.decoded.id;
    const {age,aboutme,myRegion,myInterest,myCharacter,myState} = req.body;
    const t = await sequelize.transaction();

    try{
        const user = await User.findOne({where:{id}});
        console.log(user);
        if(user){
            await user.update({
                age,
                aboutme
            },{transaction:t});
            await user.setStates(myState,{transaction:t});
            await user.setCharacters(myCharacter,{transaction:t});
            await user.setInterests(myInterest,{transaction:t});
            await user.setGus(myRegion,{transaction:t});
            await t.commit();

            return res.status(200).send({result:true});
        }

        return res.status(500).send({result:false});

    }catch(err){
        await t.rollback(); //rollback
        console.error(err);
        return res.status(500).send({result:false});
    }
});


//마이페이지 스크랩 리스트
router.get('/scrapList', isLoggedIn,async(req,res)=>{
   const id = req.decoded.id;
   try{
       const scrapList = await Study.findAll({
           attributes: ['id','flag','title','desc',
                   [
                       sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM likedList
                    WHERE
                    Study.id = likedList.StudyId
                    )`),
                       'scrapCount'
                   ]],
           include:[{
               model:User,
               attributes:[],
               as:'likedUser',
               where:{id},
           },{
               model:State,
               attributes:['category'],
               through: {attributes: []}
           },{
               model:Interest,
               attributes:['category'],
               through: {attributes: []}
           }
           ]
       });

       return res.status(200).send({result:true,scrapList});

   }catch(err){
       console.error(err);
       return res.status(500).send({result:false});
   }
});


//회원정보 수정
router.put('/updateUserinfo',isLoggedIn,upload.single('img'),async(req,res)=>{

    const id = req.decoded.id; // 유저 id 값 가져오기
    const {nickname,email,newPassword} = req.body;
    console.log(req.file);
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
            password,
            profilepath:req.file.filename,
        })

        return res.status(200).send({result:true});


    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

module.exports = router;