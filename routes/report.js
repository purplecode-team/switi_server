const express = require('express');
const { Study,Image,studyMember,User,sequelize,Report } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();

//신고하기 클릭 -> 현재 참여중인 스터디만 조회
router.get('/getReportList',isLoggedIn,async(req,res)=>{
    const id = req.decoded.id;
    try{
        const study = await Study.findAll({
            attributes:['id','title'],
            include:[{
                model:User,
                attributes:[],
                as:'studyMembers',
                where:{id},
           },{
                model:Image,
                attributes:['imgPath']
           }],
            where:{flag:0} // 모집마감
        });

        return res.status(200).send({result:true,study});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

//신고하기 상세
//스터디원 목록 출력
router.get('/getReportInfo/:studyId',isLoggedIn,async(req,res)=>{
    const studyId = req.params.studyId;

    try{

        const member = await Study.findAll({
            attributes:['id'],
            include:[{
                attributes:['id','nickname'],
                model:User,
                as:'studyMembers'
            }],
            where:{id:studyId}
        })

        return res.status(200).send({result:true,member});

    }catch(err){
        return res.status(500).send({result:false});
    }

})

//신고하기
router.post('/reportUser/:studyId/:memberId',isLoggedIn,async(req,res)=>{

    const userId = req.decoded.id;
    const studyId = req.params.studyId;
    const memberId = req.params.memberId;
    const content = req.body.content;

    try{

        await Report.create({
            content,
            idStudy:studyId,
            idMember:memberId,
            idUser:userId,
            state:0,
        })

        return res.status(200).send({result:true});

    }catch(err){
        return res.status(500).send({result:false});
    }

})

module.exports = router;
