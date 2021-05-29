const express = require('express');
const { Study,Image,studyMember,User,sequelize,Evaluation } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();

//상호평가
router.post('/peerEvaluate/:idMember/:idStudy',isLoggedIn,async(req,res)=>{

    const idUser = req.decoded.id; // 평가 한 유저 id
    const idMember = req.params.idMember; // 평가 받은 유저 id
    const idStudy = req.params.idStudy; // 스터디 id
    const {score1,score2,score3} = req.body; // 참여도 , 지각정도 , 소통
    const total = parseInt(score1)+parseInt(score2)+parseInt(score3);

    try{
        await Evaluation.create({
            score:total,
            idUser:idUser,
            idStudy:idStudy,
            idMember:idMember,
        });

        return res.status(200).send({result:true});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})


module.exports = router;