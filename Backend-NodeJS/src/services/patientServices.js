import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';


let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
            else {
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: "Le Tuan Dan",
                    time: '8:00 - 9:00',
                    doctorName: "DoMixi",
                    redirectLink: "https://www.youtube.com/watch?v=4ijhl1zVwZ8"

                })


                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });

                console.log(user[0])

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        }
                    })
                }


                resolve({
                    errCode: 0,
                    message: 'Save infor patient succeed!'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,

}