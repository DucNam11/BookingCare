import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName || !data.selectedGender || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
            else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)

                })


                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                    },
                });
                console.log(user[0])

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
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

let postVerifyAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    let schedules = await db.Schedule.findOne({
                        where: {
                            doctorId: appointment.doctorId,
                            timeType: appointment.timeType,
                            date: appointment.date
                        },
                        raw: false
                    })
                    if (schedules) {
                        await db.Schedule.destroy({
                            where: {
                                doctorId: schedules.doctorId,
                                timeType: schedules.timeType,
                                date: schedules.date
                            }
                        });
                        appointment.statusId = 'S2';
                        await appointment.save();
                        resolve({
                            errCode: 0,
                            errMessage: "Update the appointment succeed!"
                        })

                    }

                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been confirmed or does not exist!"
                    })
                }
            }

        } catch (e) {
            reject(e);

        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyAppointment: postVerifyAppointment,

}