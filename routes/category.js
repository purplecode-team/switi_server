const express = require('express');
const { Character, State, Interest, Region, Gu } = require('../models');
const router = express.Router();

// 성격
router.get('/character',async(req,res)=>{
  try{

      const character = await Character.findAll();
      return res.status(200).send({result:true,character});

  }catch(err){
    console.log(err);
    return res.status(500).send({result:false});
  }
});

// 관심분야
router.get('/interest',async(req,res)=>{
  try{
      const interest = await Interest.findAll();
      return res.status(200).send({result:true,interest});

  }catch(err){
    console.log(err);
    return res.status(500).send({result:false});
  }
});

// 나의 상황
router.get('/state',async(req,res)=>{
  try{
      const state = await State.findAll();
      return res.status(200).send({result:true,state});
  }catch(err){
    console.log(err);
    return res.status(500).send({result:false});
  }
});

// 지역
router.get('/region',async(req,res)=>{
  try{
      const region = await Region.findAll();
      return res.status(200).send({result:true,region});
  }catch(err){
    console.log(err);
    return res.status(500).send({result:false});
  }
})

// 상세 주소 ( 구 ) 
router.get('/gu',async(req,res)=>{
  const { regionId } = req.query;
  try{
      const gu = await Gu.findAll({where:{regionId}});
      return res.status(200).send({result:true,gu});
  }catch(err){
    console.log(err);
    return res.status(500).send({result:false});
  }
})

module.exports = router;