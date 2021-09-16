const jwt = require('jsonwebtoken');
const { User } = require('../models');

const socialLogin = async(req,res) => {
  try{

    //console.log(req);

    let user;

    user = await User.findOne({
      where:{
        provider : req.provider,
        email : req.response.email,
      }
    });

    //가입되어있지 않으면
    if(!user){
      user = await User.create({
        email : req.response.email,
        nickname : req.response.nickname,
        gender : 1,
        provider : req.provider,
      })

    }

    //로그인
    const token = jwt.sign({
      id:user.id,
      email: req.response.email,
      nickname: req.response.nickname,
    }, process.env.JWT_SECRET);

    return {token : token};

  }catch(err){

    console.log(err);
    return res.status(500).send({result:false});
  }

}

module.exports = socialLogin;