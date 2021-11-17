const express = require('express');
const { isLoggedIn } = require('./middlewares');
const mailUtil = require('./mailUtil');
const router = express.Router();

// 문의하기
router.post('/sendMail',isLoggedIn,async(req,res)=>{
  const email = req.decoded.email;
  const {title,contents} = req.body;
  try{

    await mailUtil.sendQuestion(title,contents,email); // 문의 메일 전송하기
    return res.status(200).send({result:true});

  }catch(err){
    console.error(err);
    return res.status(500).send({result:false});
  }
})

module.exports = router;