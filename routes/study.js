const express = require('express');
const { Study,Image,sequelize,Interest,Gu,State,User,Region,studyMember } = require('../models');
const { isLoggedIn } = require('./middlewares');
const upload = require('./multer');
const router = express.Router();

//스터디 작성
router.post('/addStudy',isLoggedIn,upload.single('img'),async(req,res)=>{
    const idUser = req.decoded.id;
    console.log(req.file);
    const imgPath = req.file.filename;
    //카테고리(3개 이하) , 지역(3개 이하), 모집대상 , 모집인원, 모임장소, 활동기간, 예정종료일, 문의연락처, 제목 ,내용 , 이미지사진
    const {online_flag, state ,category, address, recruit_num, detail_address, period, endDate, contact, title, desc } = req.body;
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
        await studyMember.create({
            StudyId:study.id,
            UserId:idUser,
            contact:contact,
            leader:1 // 모집장 flag
        },{transaction:t});
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

//스터디 목록 불러오기 ( 카테고리, 지역 , 모집대상 )
router.get('/studyList/:onlineFlag',isLoggedIn,async(req,res)=>{
    const flag = req.params.onlineFlag; //온라인 오프라인 flag
    const cate = req.query.category; // 카테고리
    const region = req.query.region; // 지역
    const state = req.query.state; // 모집대상1
    const order = req.query.order; // 정렬옵션 ( 인기순 , 최신순 )

    let cateQuery, stateQuery, regionQuery;

    // 검색 조건이 있을 경우
    if(cate && cate !== 'undefined' && cate !== '0'){
         //카테고리
        const cateArr = cate.split(':');
        cateQuery = {id:cateArr};
    }

    if(state && state !== 'undefined' && state !== '0'){
        // 모집대상
        const stateArr = state.split(':');
        stateQuery = {id:stateArr};
    }

    if(region && region !== 'undefined' && region !== '0'){
        // 지역
        const regionArr = region.split(':');
        regionQuery = {regionId:regionArr};
    }

    //정렬
    let orderQuery;
    if(order === 'update'){ // 최신순
        orderQuery = [['createdAt','DESC']];
    }else if(order === 'count'){ // 인기순
        orderQuery = [[sequelize.col('scrapCount'),'DESC']];
    }

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
                attributes:['category'],
                where:cateQuery,
            }, {
                model:Image,
                attributes:['imgPath']
            }, {
                model:State,
                attributes:['category'],
                where:stateQuery,
            },{
                model:Gu,
                attributes:['gu'],
                where:regionQuery,
                include:[{
                    model:Region,
                    attributes:['city']
                }]
            }], where: {online_flag: flag} , order : orderQuery
    });
        return res.status(200).send({result:true,study});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
});

//모집글 삭제
router.delete('/deleteStudy/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id;

    try{

        await Study.destroy(
            {where:{id}}
        )

        return res.status(200).send({result:true});

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
});

//모집글 수정
router.put('/updateStudy/:id',isLoggedIn,upload.single('img'),async(req,res)=>{
    const id = req.params.id;
    console.log(req.file);
    const imgPath = req.file.filename;
    //카테고리(3개 이하) , 지역(3개 이하), 모집대상 , 모집인원, 모임장소, 활동기간, 예정종료일, 문의연락처, 제목 ,내용 , 이미지사진
    const {online_flag,state,category, address, recruit_num, detail_address, period, endDate, contact, title, desc } = req.body;
    const t = await sequelize.transaction(); // 트랜잭션 생성

    try{
        const study = await Study.findOne({
            where:{id}
        });

        if(study) {
            await study.update({
                period,
                detail_address,
                endDate,
                contact,
                title,
                desc,
                recruit_num
            },{transaction: t});

            if (online_flag !== 'true') {
                await study.setGus(address, {transaction: t}); // 오프라인일 경우 지역 수정
            }
            await Image.update({
                imgPath
            },{where:{idStudy:id}},{transaction:t});
            await study.setInterests(category, {transaction: t});
            await study.setStates(state, {transaction: t});
            await t.commit();

            return res.status(200).send({result: true,study});

        }

    }catch(err){
        await t.rollback();
        console.error(err);
        return res.status(500).send({result:false});
    }

});

//스터디 모집 마감
router.put('/updateFlag/:id',isLoggedIn,async(req,res)=>{

    const id = req.params.id; //study id

    try{
        // 모집여부 flag 1 -> 0 변경
       await Study.update(
           {flag:0},
           {where:{id}}
       )

        return res.status(200).send({result:true});

   } catch(err){
       console.error(err);
       return res.status(500).send({result:false});
   }
});

//스터디 스크랩
router.post('/scrapStudy/:id',isLoggedIn,async(req,res)=>{

    const userId = req.decoded.id;
    const studyId = req.params.id;

    try{
        const study = await Study.findOne({where:{id:studyId}});
        if(study){
            await study.addLikedUser(userId);
            return res.status(200).send({result:true});
        }else{
            return res.status(500).send({result:false});
        }

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

//스크랩 취소
router.delete('/deleteScrap/:id',isLoggedIn,async(req,res)=>{

    const userId = req.decoded.id;
    const studyId = req.params.id;

    try{
        const study = await Study.findOne({where:{id:studyId}});
        if(study) {
            await study.removeLikedUser(userId);
            return res.status(200).send({result:true});
        }else {
            return res.status(500).send({result: false});
        }

    }catch(err){
        console.error(err);
        return res.status(500).send({result:false});
    }
})

module.exports = router;