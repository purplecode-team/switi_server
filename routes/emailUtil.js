const nodemailer = require('nodemailer');

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
            await smtpTransport.sendMail(mailOptions);
            return num;
        }catch(err){
            console.error(err);
            return res.status(500).send({message:'전송 실패'});
        }

    },

    //이메일 인증여부 check
    isAuthenticated: async (req,res) => {

    }

};





