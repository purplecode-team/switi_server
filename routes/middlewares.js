const { Evaluation,User,Report } = require('../models');
const jwt = require('jsonwebtoken');

// 로그인 jwt 토큰 검사
exports.isLoggedIn = (req,res,next) => {

  try{
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  }catch(err){
    console.error(err);
    return res.status(401).send({result:false,message:'유효하지 않는 토큰입니다.'});
  }

};

//평가 여부 체크 -> 중복 제출 방지
exports.isEvaluated = async(req,res,next) => {
  try{

    const idUser = req.decoded.id; // 평가 한 유저 id
    const idMember = req.query.idMember; // 평가 받은 유저 id
    const idStudy = req.query.idStudy; // 스터디 id

     const e = await Evaluation.findOne({
              where:{idUser, idMember, idStudy}
     })

    if(e){
      return res.status(403).send({result:false,error:403,message:'이미 평가한 스터디원 입니다.'});
    }else{
      next();
    }

  }catch(err){
    console.log(err);
    return res.status(500).send({result:false})
  }
};

//평가 여부 체크 -> 중복 제출 방지
exports.isReported = async(req,res,next) => {
  try{

    const idUser = req.decoded.id; // 평가 한 유저 id
    const studyId = req.params.studyId;
    const memberId = req.params.memberId;

    const e = await Report.findOne({
          where:{idUser:idUser, idMember:memberId, idStudy:studyId}
    })

    if(e){
      return res.status(403).send({result:false,error:403,message:'이미 신고한 스터디원입니다.'});
    }else{
      next();
    }

  }catch(err){
    console.log(err);
    return res.status(500).send({result:false})
  }
};

