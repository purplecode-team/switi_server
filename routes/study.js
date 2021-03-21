const express = require('express');
const multer = require('multer');
const { Study,Image,sequelize } = require('../models');
const { isLoggedIn } = require('./middlewares');
const path = require('path');
const fs = require('fs');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더 생성');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,cb) {
            cb(null,'uploads/');
        },
        filename(req,file,cb) {
            const ext = path.extname(file.originalname); //확장자
            cb(null,path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});

//스터디 작성
router.post('/addStudy',isLoggedIn,upload.single('img'),async(req,res)=>{
    const idUser = req.decoded.id;
    console.log(req.file);
    const imgPath = req.file.filename;
    //카테고리(3개 이하) , 지역(3개 이하), 모집대상 , 모집인원, 모임장소, 활동기간, 예정종료일, 문의연락처, 제목 ,내용 , 이미지사진
    const {online_flag, category, address, target, recruit_num, detail_address, period, endDate, contact, title, desc } = req.body;
    const t = await sequelize.transaction(); // 트랜잭션 생성
    //console.log(req.body);

    try {
        const study = await Study.create({
            online_flag,
            idUser,
            period,
            target,
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
        await t.commit();

        return res.status(200).send({result:true,study});

    }catch(err) {
        await t.rollback();
        console.error(err);
        return res.status(500).send({result:false});
    }

});

//스터디 목록 불러오기
router.get('/studyList',(req,res)=>{


});

module.exports = router;