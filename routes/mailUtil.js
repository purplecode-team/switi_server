const nodemailer = require('nodemailer');
const User = require('../models/user');

// 메일 보낼 transporter 생성
const smtpTransport = nodemailer.createTransport({
    service:"gmail",
    host:'smtp.gmail.com',
    port:'587',
    secure:true,
    auth: {
        type:'OAuth2',
        user:process.env.OAUTH_USER,
        clientId:process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
});

module.exports = {
    //메일 전송
    sendEmail: async (email,res) => {
        // 11111 ~ 99999 까지의 인증번호 랜덤으로 생성
        const num = Math.floor(Math.random()*(99999-11111+1))+11111;
        console.log(num);

        const mailOptions = {
            from: process.env.SWITI_EMAIL,
            to:email,
            subject: "SWITI 인증번호 발송 메일입니다.",
            html: "<p> 인증번호는 ["+ num +"] 입니다. </p>"
        }

        try{
            // 인증번호 메일 전송
            await smtpTransport.sendMail(mailOptions);
            // 메일 전송 후 db에 인증번호 추가해주기
            await User.update({certificationCode:num},{where:{email}});
        }catch(err){
            console.error(err);
            return res.status(500).send({result:false});
        }

    },

    // 문의 메일
    sendQuestion: async(title,contents,email,res) => {

        const mailOptions = {
            from:process.env.SWITI_EMAIL,
            to:'switiswitihoney@gmail.com',
            subject: "[문의]: "+ email +" 님의 문의 메일입니다.",
            html: "<p> 제목 : "+ title + "</p>" + "<p> 문의 내용 : "+ contents +"</p>"
        }

        try{
            // 문의 메일 전송
            await smtpTransport.sendMail(mailOptions);

        }catch(err){
            console.error(err);
            return res.status(500).send({result:false});
        }

    },

    //인증번호 비교
    compareCode: async (email,inputCode,res) => {
        try{
            const user = await User.findOne({where:{email:email}});
            if(inputCode == user.certificationCode) {
                // 코드가 일치하면 인증번호값 null 로 변경
                console.log("코드 일치");
                await User.update(
                    {certificationCode: null, certification: true},
                    {where: {email: email}});
            }else{
                return res.status(404).send({result:false});
            }
        }catch(err){
            console.log(err);
            return res.status(500).send({result:false});
        }

    }

};





