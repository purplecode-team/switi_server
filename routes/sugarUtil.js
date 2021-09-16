const { User, studyMember } = require('../models');

//당도 반영 util
//상호평가 시
const updateSugar = async (req) => {

    const score = req.score;
    const id = req.idMember;

    try{

      // 기존 당도 꺼내오기
      const user = await User.findOne({
        attributes: ['sugar'],
        where: {id : id}
      })

      const newScore = parseInt(user.sugar)+parseInt(score);
      //console.log("newScore"+newScore);

      // 수정
      await User.update({
        sugar : newScore
      },{where:{id : id}})

    }catch(err){
      console.error(err);
    }

  }


  const score = req.score;
  const id = req.idMember;

  try{

    // 기존 당도 꺼내오기
    const user = await User.findOne({
      attributes: ['sugar'],
      where: {id : id}
    })

    const newScore = parseInt(user.sugar)+parseInt(score);
    //console.log("newScore"+newScore);

    // 수정
    await User.update({
      sugar : newScore
    },{where:{id : id}})

  }catch(err){
    console.error(err);
  }

}

//신고 당했을 경우 -10
const reportedSugar = async (req) => {

  const id = req.idUser; // 신고 당한 유저 id

  try{
    // 기존 당도 꺼내오기
    const user = await User.findOne({
      attributes: ['sugar'],
      where: {id : id}
    })

    const newScore = parseInt(user.sugar) - 10;

    // 수정
    await User.update({
      sugar : newScore
    },{where:{id : id}})

  }catch(err){
    console.error(err);
  }

}

//스터디 신청 취소 시 -1
const cancelSugar = async (req) => {

  const id = req.idUser;

  try{
    // 기존 당도 꺼내오기
    const user = await User.findOne({
      attributes: ['sugar'],
      where: {id : id}
    })

    const newScore = parseInt(user.sugar) - 1;

    // 수정
    await User.update({
      sugar : newScore
    },{where:{id : id}})

  }catch(err){
    console.error(err);
  }
}

//스터디 완료 시 +1
const finishSugar = async (req) => {

  const id = req.idStudy; // 스터디 id
  //console.log("util"+id);

  try{

    // 해당 스터디 멤버 list 모두 가져오기
    const members = await studyMember.findAll({
      attributes: ['UserId'],
      where: {StudyId : id}
    });

    //console.log(members);

    for (const mem of members){

      // 각 스터디원의 정보 가져오기
      const user = await User.findOne({
        attributes: ['sugar'],
        where: {id : mem.UserId}
      })

      const newScore = parseInt(user.sugar) + 1;

      // 새 당도 반영
      await User.update({
        sugar : newScore
      },{where:{id : mem.UserId}})

    }

  }catch(err){
    console.error(err);
  }
}


module.exports = { updateSugar, reportedSugar, cancelSugar, finishSugar}