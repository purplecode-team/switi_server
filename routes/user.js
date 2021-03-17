const express = require('express');
const { User, sequelize } = require('../models');
const { isLoggedIn } = require('./middlewares');

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
            await user.addGu(myRegion,{transaction:t});
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

module.exports = router;