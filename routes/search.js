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

        //검색
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
                title:{
                    [Op.like]:`%${keyword}%` //유사검색
                }
            }
        });

        return res.status(200).send({result:true,study});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

module.exports = router;