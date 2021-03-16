const express = require('express');
const { User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// 프로필 설정
router.put('/setProfile',isLoggedIn,async(req,res)=>{
   // 나이, 관심지역, 관심분야, 성격, 현재 상황, 자기소개
    const userId = req.decoded.id;
    const { age, myRegion, myInterest, myCharacter, myState ,aboutme } = req.body;

    try{
        const user = await User.findOne({where:{id:userId}});
        const result = await user.update({
            age:age,
            aboutme:aboutme,
        });
        if(result){
            await user.addState(myState);
            await user.addCharacter(myCharacter);
            await user.addInterest(myInterest);
            await user.addGu(myRegion);
            return res.status(200).send({result:true});
        }
        return res.status(500).send({result:false});
    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
});

module.exports = router;