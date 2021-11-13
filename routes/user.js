const express = require('express');
const multer = require('multer');
const { Study,sequelize,Interest,Gu,State,User,Character,Region,Image } = require('../models');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('./middlewares');
const upload = require('./multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 프로필 설정
router.put('/setProfile',isLoggedIn,async(req,res)=>{
   // 나이, 관심지역, 관심분야, 성격, 현재 상황, 자기소개
    const userId = req.decoded.id;
    const { age, myRegion, myInterest, myCharacter, myState ,aboutme } = req.body;
    const t = await sequelize.transaction(); // 트랜잭션 생성

    try{
        const user = await User.findOne({where:{id:userId}});
        const result = await user.update({
            age:age,
            aboutme:aboutme,
        },{transaction:t});
        if(result){
            await user.addState(myState,{transaction:t});
            await user.addCharacter(myCharacter,{transaction:t});
            await user.addInterest(myInterest,{transaction:t});
            await user.addRegion(myRegion,{transaction:t});
            t.commit();
            return res.status(200).send({result:true});
        }
        return res.status(500).send({result:false});
    }catch(err){
        await t.rollback(); // rollback
        console.error(err);
        return res.status(500).send({result:false});
    }
});


//유저 마이페이지 ( 당도 , 스크랩 수, 닉네임, 프로필사진)
router.get('/myPage',isLoggedIn,async(req,res)=>{
    const id = req.decoded.id;
    try{

        const myPage = await User.findOne({
            attributes:['id','nickname','profilepath','sugar'],
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


//내 프로필 (나이 , 관심지역 , 관심분야 , 나의 성향 , 나의 성격, 자기소개)
router.get('/myProfile',isLoggedIn,async(req,res)=>{
    const id = req.decoded.id;
    try{
        const myProfile = await User.findOne({
            attributes:['id','age','aboutme'],
            include:[{
                model:Interest,
                attributes:['category'],
                through:{attributes:['InterestId']}
            },{
                model:State,
                attributes:['category'],
                through:{attributes:['StateId']}
            },{
                model:Region,
                attributes:['city'],
                through:{attributes:['RegionId']}
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

// 유저 프로필 조회 (상대방 프로필)
router.get('/userProfile/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id;
    try{
        const userProfile = await User.findOne({
            attributes:['id','age','aboutme','sugar','nickname','profilepath'],
            include:[{
                model:Interest,
                attributes:['category'],
                through:{attributes:['InterestId']}
            },{
                model:State,
                attributes:['category'],
                through:{attributes:['StateId']}
            },{
                model:Region,
                attributes:['city'],
                through:{attributes:['RegionId']}
            },{
                model:Character,
                attributes:['content'],
                through:{attributes:['CharacterId']}
            }],where:{id}
        })

        return res.status(200).send({result:true,userProfile});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

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
            await user.setRegions(myRegion,{transaction:t});
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
           attributes: ['id','flag','end_flag','title','desc',
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
               attributes:['category']
           },{
               model:Interest,
               attributes:['category']
           }, {
               model: Region,
               attributes: ['city']
           }]
       });

       return res.status(200).send({result:true,scrapList});

   }catch(err){
       console.error(err);
       return res.status(500).send({result:false});
   }
});

//참여이력-스터디
router.get('/studyHistory',isLoggedIn,async(req,res)=>{
    const id = req.decoded.id;
    try{
        const studyList = await Study.findAll({
            attributes: ['id','flag','end_flag','title','desc',
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
                as:'studyMembers',
                where:{id},
            },{
                model:State,
                attributes:['category']
            },{
                model:Interest,
                attributes:['category']
            }, {
                model: Region,
                attributes: ['city']
            }],where:{end_flag:1}
        });

        return res.status(200).send({result:true,studyList});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})


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

// 회원 정보 page
router.get('/myInfo',isLoggedIn,async(req,res)=>{
    const id = req.decoded.id;
    try{
        const info = await User.findOne({
            attributes:['id','nickname','profilepath'],
            where:{id}
        })

        return res.status(200).send({result:true,info});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

module.exports = router;