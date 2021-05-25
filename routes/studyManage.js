const express = require('express');
const { Study,Image,Apply,studyMember,User,sequelize } = require('../models');
const { isLoggedIn } = require('./middlewares');
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

// 신청 수락
router.put('/acceptApply/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id; // apply Id
    const t = await sequelize.transaction(); // 트랜잭션 생성

    try{
        const apply = await Apply.findOne({where:{id:id}});

        if(apply){
            // 상태 update (대기 -> 수락:1)
            await apply.update({
                apply_state:1,
            },{transaction:t});

            // 수락 후 스터디 멤버에도 추가하기
            await studyMember.create({
                StudyId:apply.idStudy,
                UserId:apply.idUser,
                contact:apply.contact
            },{transaction:t});
            await t.commit();
        }

        return res.status(200).send({result:true});

    }catch(err){
        await t.rollback();
        console.error(err);
        return res.status(500).send({result:false});
    }
})

//신청 거절
router.put('/rejectApply/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id; // apply Id
    try{
        const apply = await Apply.findOne({where:{id:id}});

        if(apply){
            // 거절:2
            await apply.update({
                apply_state:2
            })
        }

        return res.status(200).send({result:true});
    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

// 신청서 보기 ( 닉네임 , 프로필이미지 , 신청 내용 )
router.get('/getApplyInfo/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id; // apply id
    try{
        const applyInfo = await Apply.findOne({
            attributes:['id','apply_detail','apply_state'],
            include:[{
                model:User,
                attributes:['id','nickname','profilepath']
            }]
        });

        return res.status(200).send({result:true,applyInfo});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

// 스터디원 탈퇴 처리
router.delete('/deleteMember/:StudyId/:UserId',isLoggedIn,async(req,res)=>{
    const StudyId = req.params.StudyId; // 스터디 id
    const UserId = req.params.UserId; // 유저 id

    try{

        await studyMember.destroy({
            where:{StudyId,UserId}
        })
        return res.status(200).send({result:true});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

// 스터디 종료
router.put('/endStudy/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id; // 스터디 id
    try{
        //end_flag: 0->1 변경
        await Study.update({
            end_flag:1,
        },{where:{id}})

        return res.status(200).send({result:true});
    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

// 스터디 연장
router.put('/updateEndDate/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id; // 스터디 id
    const date = req.body.endDate;
    try{
        console.log(date);
        await Study.update({
                endDate:date
        },{where:{id}});

        return res.status(200).send({result:true});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

module.exports = router;