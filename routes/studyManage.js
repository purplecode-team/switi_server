const express = require('express');
const { Study,Image,Apply } = require('../models');
const { isLoggedIn } = require('./middlewares');
const upload = require('./multer');
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

module.exports = router;