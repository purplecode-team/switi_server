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

