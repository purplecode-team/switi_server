const express = require('express');
const { Study,Search,User,sequelize,Interest,State,Gu,Region,Image } = require('../models');
const { Op } = require("sequelize");
const { isLoggedIn } = require('./middlewares');
const router = express.Router();

//검색하기
router.post('/searchStudy',isLoggedIn,async(req,res)=>{
    const idUser = req.decoded.id; // user id 값
    const {keyword} = req.body; // 검색어

    try{
        // 검색어 저장
        await Search.create({
            keyword:keyword,
            idUser:idUser,
        });

        //검색 -> 해당 키워드에 맞는 스터디 리스트 출력
        const study = await Study.findAll({
            attributes:{include: [
                    [
                        sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM likedList
                    WHERE
                    Study.id = likedList.StudyId
                    )`),
                        'scrapCount'
                    ]
                ]},
            include:[{
                model:Interest,
                attributes:['category']
            }, {
                model:Image,
                attributes:['imgPath']
            }, {
                model:State,
                attributes:['category']
            },{
                model:Gu,
                attributes:['gu'],
                include:[{
                    model:Region,
                    attributes:['city']
                }]
            }],where:{
                [Op.or]: [{title:{
                    [Op.like]:`%${keyword}%` //유사검색
                }},{desc: {[Op.like]:`%${keyword}%`}}]
            }
        });

        return res.status(200).send({result:true,study});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

//검색 기록 출력
router.get('/getSearch',isLoggedIn,async(req,res)=>{
    const idUser = req.decoded.id;
    try{

        const search = await Search.findAll({
            where:{idUser},
            limit: 10,
        })

        return res.status(200).send({search,result:true});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

//전체 삭제
router.delete('/deleteAll',isLoggedIn,async(req,res)=>{
    const idUser = req.decoded.id; // user id 값

    try{

        await Search.destroy({
                where:{idUser}
        });

        return res.status(200).send({result:true});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }

})

//하나만 삭제
router.delete('/deleteOne/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id;
    try{

        await Search.destroy({
            where:{id}
        });

        return res.status(200).send({result:true});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

module.exports = router;