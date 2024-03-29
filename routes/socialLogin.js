const express = require('express');
const axios = require('axios');
const socialLogin = require("./socialLoginUtil");
const qs = require('querystring');
const router = express.Router();

//네이버 로그인 test
router.get('/naverLogin',async(req,res)=>{
    //console.log('네이버 로그인 test');
    const client_id = process.env.client_id;

    const redirectURI = 'http://127.0.0.1:4000/socialLogin/callback';
    const URL = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=asvdfs';
    return res.redirect(URL);

});

//네이버 로그인 callback URL
router.get('/callback',async(req,res)=>{

   const code = req.query.code;
   const state = req.query.state;
   const provider = 'Naver';

   const client_id = process.env.client_id;
   const client_secret = process.env.client_secret;

   try{
     const TOKEN_URL = 'https://nid.naver.com/oauth2.0/token?'+'client_id='+client_id+'&client_secret='+client_secret+'&grant_type=authorization_code&state=aaaw'+'&code='+code;
     const { data } = await axios.get(TOKEN_URL);
     //console.log("data : "+ data);

     const login_token = data.access_token; // 발급된 토큰 저장
     //console.log('발급 토큰 : '+token);

     const info = await axios.get("https://openapi.naver.com/v1/nid/me",{
       headers: {
         'Authorization': `Bearer ${login_token}`
       },
     });

     const email = info.data.response.email;
     const nickname = info.data.response.nickname;

     console.log(email,nickname);

     const token = await socialLogin({ email,nickname,provider}); // 로그인
     return res.status(200).send({result:true,token});

   }catch(err){
     return res.status(500).send({result:false});
   }


});

//카카오 로그인 test
router.get('/kakaoLogin',async(req,res)=>{
  console.log("로그인 ");
  const client_id = process.env.kakao_client_id;
  const redirectURI = 'http://127.0.0.1:4000/socialLogin/kakao';

  const URL = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id='+client_id+'&redirect_uri='+redirectURI;
  console.log(URL);

  return res.redirect(URL);

});

//카카오 로그인 callback
router.get('/kakao',async(req,res)=>{
  console.log("callback");
  console.log(req.query);
  const code = req.query.code;
  const provider = 'Kakao';

  console.log(req.query.code);

  const client_id = process.env.kakao_client_id;
  const client_secret = process.env.kakao_client_secret;

  try{

    //const TOKEN_URL = ;
    const response = await axios({
      method: 'POST',
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data:qs.stringify({
        grant_type: 'authorization_code',
        client_id: client_id,
        redirect_uri:'http://127.0.0.1:4000/socialLogin/kakao',
        code,
        client_secret:client_secret,
      })
    });

    console.log(response);
    const { access_token } = response.data; // 발급된 토큰 저장
    console.log('발급 토큰 : '+access_token);

    const {data} = await axios.get("https://kapi.kakao.com/v2/user/me",{
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
    });

    const email = data.kakao_account.email;
    const nickname = data.properties.nickname;

    const token = await socialLogin({ email,nickname,provider}); // 로그인
    return res.status(200).send({result:true,token});

  }catch(err){
    console.log(err);
    return res.status(500).send({result:false});
  }


})


module.exports = router;