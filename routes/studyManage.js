const express = require('express');
const { Study,Image,Apply,studyMember,User } = require('../models');
const { isLoggedIn } = require('./middlewares');
const upload = require('./multer');
const router = express.Router();

// 스터디 관리 - 내 모집글
router.get('/myStudyList',isLoggedIn,async(req,res)=>{
    const id = req.decoded.id;
    try{
        const study = await Study.findAll({
            attributes:['id','title'],
            include:[{
                model:Image,
                attributes:['imgPath']
            }]
            ,where:{idUser:id}
        })
        return res.status(200).send({result:true,study});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

// 스터디 관리 - 진행중
router.get('/myApplyList',isLoggedIn,async(req,res)=>{
    const id = req.decoded.id;
    try{
        const study = await Study.findAll({
            attributes:['id','title','flag'],
            include:[{
                model:Apply,
                attributes:['id','apply_state'],
                where:{idUser:id},
            },{
                model:Image,
                attributes:['imgPath']
            }]
        });

        return res.status(200).send({result:true,study});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

//스터디원 관리 (내 모집글, 스터디원 및 수락 대기인원 목록)
router.get('/studyMemList/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id; // studpy id
    const idUser = req.decoded.id; // 현재 로그인 userid

    try{
        //스터디 멤버
        const member = await Study.findOne({
            attributes:[],
            include:[{
                model:User,
                attributes:['id','email','nickname','profilepath'],
                as:'studyMembers',
                through:{attributes:['contact']},
            }],where:{id,idUser}
        })

        //수락 대기 인원
        const applyUser = await Apply.findAll({
            attributes:['id','contact','apply_detail','idStudy','idUser'],
            include:[{
               model:User,
               attributes:['id','email','nickname','profilepath'],
            }],
            where:{apply_state:0,idStudy:id}
        })

        return res.status(200).send({result:true,member,applyUser});
    }
    catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

module.exports = router;