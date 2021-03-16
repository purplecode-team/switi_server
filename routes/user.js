const express = require('express');
const { User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// 프로필 설정
router.put('/setProfile',async(req,res)=>{
   // 나이, 관심지역, 관심분야, 성격, 현재 상황, 자기소개

});

module.exports = router;