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
        html: getBodyHTMLEmail(dataSend),
    });

}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh online </p> 
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng vui lòng click vào đường link sau để xác nhận</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        `

    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this Email because you booked an online medical appointment</p> 
        <p>Information on scheduling medical examinations:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If the above information is correct, please click on the following link to confirm</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        `

    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được Email này vì đã khám bệnh xong </p> 
        <p>Thông tin bệnh tình và đơn thuốc được gửi trong file đính kèm.</p>
        
        <p>Xin chân thành cảm ơn!</p>
        `

    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this Email because you booked an online medical appointment</p> 
        <p>Information on scheduling medical examinations:</p>
        
        `

    }
    return result;

}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {


        try {

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
                to: dataSend.email, // list of receivers
                subject: "Kết quả khám bệnh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        // filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        // content: dataSend.imgBase64.split('base64,')[1],
                        // encoding: 'base64'
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.pdf`,
                        path: dataSend.imgBase64
                    }
                ],
                // attachments: [
                //     {
                //         filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                //         content: dataSend.imgBase64.split('base64,')[1],
                //         encoding: 'base64'

                //     }
                // ],
            });
            resolve(dataSend.imgBase64)


        } catch (e) {
            reject(e)
        }
    })
}





module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}