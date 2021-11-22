const express = require('express');
const { isEvaluated } = require("./middlewares");
const { updateSugar } = require("./sugarUtil");
const { Study,Image,studyMember,User,sequelize,Evaluation } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();

//상호평가 페이지 -> 상대 닉네임 & 프로필 출력
router.get('/evaluatePage',isLoggedIn,isEvaluated,async(req,res)=>{

    const idMember = req.query.idMember; // 상대 스터디원 id
    const idStudy = req.query.idStudy; // 스터디 id

    try{

        const user = await User.findOne({
            attributes: ['nickname','profilePath'],
            where: {id : idMember}
        });

        return res.status(200).send({result:true,user,idStudy});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})


//상호평가
router.post('/peerEvaluate',isLoggedIn,isEvaluated,async(req,res)=>{

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