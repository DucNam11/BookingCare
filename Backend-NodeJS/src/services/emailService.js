require('dotenv').config();
import nodemailer from "nodemailer";


let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Hello " <danletuan03@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Đặt lịch khám bệnh", // Subject line
        html: `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh online </p> 
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng vui lòng click vào đường link sau để xác nhận</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        ` , // html body
    });

}





module.exports = {
    sendSimpleEmail: sendSimpleEmail
}