import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'
import emailService from './emailService'


const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let checkRequireField = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedProvince', 'selectedPayment',
        'nameClinic', 'addressClinic', 'specialtyId']
    let isValid = true
    let element = ''
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false
            element = arrFields[i]
            break;
        }
    }
    return { element: element, isValid: isValid }
}
let TopDoctorHome = (inputLimit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: inputLimit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users,
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ['password']
                },
            })
            // if (doctors && doctors.image) {
            //     doctors.image = Buffer.from(doctors.image, 'base64').toString('binary')
            // }
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
            console.log(error)
        }
    })
}
let saveInfoDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObject = checkRequireField(data)
            // if (data.doctorId || data.contentHTML || data.contentMarkdown || data.action ||
            //     data.selectedPrice || data.selectedProvince || data.selectedPayment ||
            //     data.nameClinic || data.addressClinic || data.specialtyId) { //UPSERT MARKDOWN
            if (checkObject.isValid === true) {
                if (data.action === 'CREATE') {
                    await db.Markdowns.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    })
                }
                if (data.action === 'EDIT') {
                    let dataMarkdown = await db.Markdowns.findOne({
                        where: { doctorId: data.doctorId },
                    })
                    if (dataMarkdown) {
                        await db.Markdowns.update(
                            {
                                contentHTML: data.contentHTML,
                                contentMarkdown: data.contentMarkdown,
                                description: data.description,
                            },
                            { where: { doctorId: data.doctorId } }
                        )
                    }
                }
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false
                })
                if (doctorInfo) {
                    await db.Doctor_Info.update(
                        {
                            priceId: data.selectedPrice,
                            provinceId: data.selectedProvince,
                            paymentId: data.selectedPayment,
                            nameClinic: data.nameClinic,
                            addressClinic: data.addressClinic,
                            note: data.note,
                            clinicId: data.clinicId,
                            specialtyId: data.specialtyId
                        }, { where: { doctorId: data.doctorId } }
                    )
                } else {
                    await db.Doctor_Info.create(
                        {
                            doctorId: data.doctorId,
                            priceId: data.selectedPrice,
                            provinceId: data.selectedProvince,
                            paymentId: data.selectedPayment,
                            nameClinic: data.nameClinic,
                            addressClinic: data.addressClinic,
                            note: data.note,
                            clinicId: data.clinicId,
                            specialtyId: data.specialtyId
                        }
                    )
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save Dr info success'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    // errMessage: `Missing Parameter`
                    errMessage: `Missing Parameter : ${checkObject.element}`
                })
            }
        }
        catch (error) {
            reject(error)
            console.log(error)
        }
    })
}
let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing require parameter"
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: { exclude: ['password'] },
                    include: [
                        {
                            model: db.Markdowns,
                            attributes: ['contentHTML', 'contentMarkdown', 'description']
                        },
                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueVi', 'valueEn']
                        },
                        {
                            model: db.Doctor_Info,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include:
                                [
                                    { model: db.Allcode, as: "priceIdTypeData", attributes: ['valueVi', 'valueEn'] },
                                    { model: db.Allcode, as: "provinceIdTypeData", attributes: ['valueVi', 'valueEn'] },
                                    { model: db.Allcode, as: "paymentIdTypeData", attributes: ['valueVi', 'valueEn'] }
                                ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary')
                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let BulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'doctorId', 'date', 'maxNumber'],
                    raw: true
                })
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    // return a.timeType === b.timeType && a.date !== b.date
                    return a.timeType === b.timeType && +a.date === +b.date
                    // return a.timeType === b.timeType
                })
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [{ model: db.Allcode, as: 'timeTypeData', attributes: ['valueVi', 'valueEn'] }],
                    raw: false,
                    nest: true,
                })
                if (!dataSchedule) dataSchedule = []
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getExtraInfoDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: { doctorId: inputId },
                    attributes: { exclude: ['id', 'doctorId'] },
                    include:
                        [
                            { model: db.Allcode, as: "priceIdTypeData", attributes: ['valueVi', 'valueEn'] },
                            { model: db.Allcode, as: "provinceIdTypeData", attributes: ['valueVi', 'valueEn'] },
                            { model: db.Allcode, as: "paymentIdTypeData", attributes: ['valueVi', 'valueEn'] }

                        ],
                    raw: false,
                    nest: true,
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceIdTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'provinceIdTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'paymentIdTypeData', attributes: ['valueVi', 'valueEn'] }
                            ]
                        },
                        {
                            model: db.Markdowns,
                            attributes: ['contentHTML', 'contentMarkdown', 'description']
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary')
                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: { doctorId: doctorId, statusId: 'S2', date: date },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['id', 'email', 'address', 'gender', 'firstName', 'phonenumber'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData',
                                    attributes: ['valueVi', 'valueEn']
                                },
                            ]
                        },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueVi', 'valueEn'] }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.patienId || !data.timeType || !data.email) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                // Update appointment status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patienId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    await db.Booking.update(
                        {
                            statusId: 'S3'
                        }, {
                        where: {
                            doctorId: data.doctorId,
                            patientId: data.patienId,
                            timeType: data.timeType,
                            statusId: 'S2'
                        }
                    }
                    )
                }
                await emailService.sendAttachment(data)
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    TopDoctorHome: TopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveInfoDoctor: saveInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    BulkCreateSchedule: BulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}
