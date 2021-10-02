const express = require('express');
const { Notice } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();

// 공지사항
router.get('/noticeList',isLoggedIn,async(req,res)=>{
    try{
      const notice = await Notice.findAll();
      return res.status(200).send({result:true,notice});
    }catch(err){
      console.error(err);
      return res.status(500).send({result:false});
    }
})

module.exports = router;