const express = require('express');
const { updateSugar } = require("./sugarUtil");
const { Study,Image,studyMember,User,sequelize,Evaluation } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();

//상호평가
router.post('/peerEvaluate',isLoggedIn,async(req,res)=>{

    const idUser = req.decoded.id; // 평가 한 유저 id
    const idMember = req.query.idMember; // 평가 받은 유저 id
    const idStudy = req.query.idStudy; // 스터디 id
    const { score1, score2, score3 } = req.body; // 참여도 , 지각정도 , 소통
    //console.log(req.body);
    const score = (parseInt(score1)+parseInt(score2)+parseInt(score3))/3;
    //console.log("score11:"+score);

    try{

        await Evaluation.create({
            score:score,
            idUser:idUser,
            idStudy:idStudy,
            idMember:idMember,
        });

        // 당도 반영
        await updateSugar({idMember:idMember, score:score});

        return res.status(200).send({result:true});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})




module.exports = router;