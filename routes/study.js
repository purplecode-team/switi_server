const express = require('express');
const { Study,Image,sequelize,Interest,Gu,State,User,Region } = require('../models');
const { isLoggedIn } = require('./middlewares');
const upload = require('./multer');
const router = express.Router();

//스터디 작성
router.post('/addStudy',isLoggedIn,upload.single('img'),async(req,res)=>{
    const idUser = req.decoded.id;
    console.log(req.file);
    const imgPath = req.file.filename;
    //카테고리(3개 이하) , 지역(3개 이하), 모집대상 , 모집인원, 모임장소, 활동기간, 예정종료일, 문의연락처, 제목 ,내용 , 이미지사진
    const {online_flag, category, address, recruit_num, detail_address, period, endDate, contact, title, desc } = req.body;
    const t = await sequelize.transaction(); // 트랜잭션 생성
    //console.log(req.body);

    try {
        const study = await Study.create({
            online_flag,
            idUser,
            period,
            detail_address,
            endDate,
            contact,
            title,
            desc,
            recruit_num,
            Images: [{
                imgPath: imgPath,
            }]
        }, {
            include: [
                Image
            ], transaction:t
        });

        if(online_flag !== 'true'){ // 오프라인 스터디 일 경우
            await study.addGu(address,{transaction:t}); // 지역 추가
        }
        await study.addInterest(category,{transaction:t}); // 카테고리 추가
        await study.addState(state,{transaction:t});
        await t.commit();

        return res.status(200).send({result:true,study});

    }catch(err) {
        await t.rollback();
        console.error(err);
        return res.status(500).send({result:false});
    }

});

//모집 상세글
router.get('/studyDetail/:id',isLoggedIn,async(req,res)=>{
    try{
        const id = req.params.id; // 스터디 id
        const study = await Study.findOne({
            attributes:{
                include:[
                    [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM likedList
                    WHERE
                    Study.id = likedList.StudyId
                    )`),
                    'scrapCount'],
                ]},
            include:[{
                model:User,
                attributes:['nickname','profilepath'],
            },{
                model:Interest,
                attributes:['category']
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
            },{
                model:Image,
                attributes:['imgPath']
            }],where:{id}
        });

        return res.status(200).send({result:true,study});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

//스터디 목록 불러오기
router.get('/studyList/:onlineFlag',isLoggedIn,async(req,res)=>{
    const flag = req.params.onlineFlag; //온라인 오프라인 flag
    // 아직 지역은 추가 안함
    try{
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
            }], where: {online_flag: flag}
        });
        return res.status(200).send({result:true,study});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }


});

module.exports = router;