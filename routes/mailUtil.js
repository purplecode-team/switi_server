const nodemailer = require('nodemailer');
const User = require('../models/user');

// 메일 보낼 transporter 생성
const smtpTransport = nodemailer.createTransport({
    service:"gmail",
    host:'smtp.gmail.com',
    port:'587',
    secure:'false',
    auth: {
        user:process.env.SWITI_EMAIL,
        pass:process.env.SWITI_PASSWORD,
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

    }

};




