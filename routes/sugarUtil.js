const { User } = require('../models');

module.exports = {

  //당도 반영
  updateSugar: async (req) => {

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

};
