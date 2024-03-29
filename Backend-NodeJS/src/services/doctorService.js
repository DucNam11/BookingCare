import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';


const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true,
            })
            // Lấy thông tin bác sĩ từ bảng Doctor_Infor cho mỗi bác sĩ
            for (let i = 0; i < users.length; i++) {
                let doctorInfo = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: users[i].id
                    }
                });
                users[i].doctorInfo = doctorInfo;
            }
            // Lấy thông tin bác sĩ từ bảng Doctor_Infor cho mỗi bác sĩ
            for (let i = 0; i < users.length; i++) {
                let specialty = await db.Specialty.findOne({
                    where: {
                        id: users[i].doctorInfo.specialtyId
                    }
                });
                users[i].specialty = specialty;
            }
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}



let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = [
        'doctorId',
        'contentHTML',
        'contentMarkdown',
        'action',
        'selectedPrice',
        'selectedPayment',
        'selectedProvince',
        'nameClinic',
        'addressClinic',
        'note',
        'specialtyId',
    ];
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    };
};

let saveDetailInforDoctor = (inputData) => {

    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {

                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {

                //upsert to Markdown
                if (inputData.action === 'CREATE') {
                    await db.MarkDown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.MarkDown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save()
                    }
                }

                //upsert to doctor infor 
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false
                })

                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;
                    await doctorInfor.save()
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succesd!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.MarkDown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }


                //get all exist data
                let exist = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })



                //compare differ
                let toCreate = _.differenceWith(schedule, exist, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }


                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [

                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInforDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputId
                    },

                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true

                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.MarkDown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes:
                                ['email', 'firstName', 'address', 'gender']
                            ,
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}
let getListPatientHistoryForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                let data = await db.History.findAll({
                    where: {
                        // statusId: 'S3',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'HistoryData',
                            attributes:
                                ['email', 'firstName', 'address', 'gender']
                            ,
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataHistory', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}


let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save()
                }

                //send email remedy
                let files = await emailService.sendAttachment(data);
                if (files) {
                    await db.History.create({
                        patientId: data.patientId,
                        doctorId: data.doctorId,
                        date: appointment.date,
                        timeType: data.timeType,
                        files: files,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}

let getSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                });
                return;
            }

            // Kiểm tra xem bác sĩ có tồn tại không
            let appointment = await db.Doctor_Infor.findOne({
                where: {
                    doctorId: data.id
                },
                raw: false
            });
            if (!appointment) {
                resolve({
                    errCode: 2,
                    errMessage: 'Doctor not found',
                });
                return;
            }

            // Lấy thông tin chuyên ngành
            let specialty = await db.Specialty.findOne({
                where: {
                    id: appointment.specialtyId,
                },
                raw: false
            });

            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data: specialty
            });
        } catch (e) {
            reject(e);
        }
    });
};



let cancelSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.patientId || !data.date || !data.timeType || !data.doctorId) {
                reject({
                    errCode: 1,
                    errMessage: "Missing required params"
                });
            } else {
                let booking = await db.Booking.findOne({
                    where: {
                        statusId: 'S2',
                        patientId: data.patientId,
                        date: data.date,
                        timeType: data.timeType,
                    },
                });

                if (!booking) {
                    reject({
                        errCode: 2,
                        errMessage: `The booking doesn't exist`
                    });
                } else {
                    await db.Booking.destroy({
                        where: {
                            statusId: 'S2',
                            patientId: data.patientId,
                            date: data.date,
                            timeType: data.timeType,
                        },
                    });
                    await db.Schedule.create({
                        maxNumber: 10,
                        date: data.date,
                        timeType: data.timeType,
                        doctorId: data.doctorId,
                    })
                    resolve({
                        errCode: 0,
                        errMessage: `The booking has been deleted`
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};


let getListPatientForPatient = (patientId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        patientId: patientId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes:
                                ['email', 'firstName', 'address', 'gender']
                            ,
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
    getListPatientHistoryForDoctor: getListPatientHistoryForDoctor,
    getSpecialty: getSpecialty,
    cancelSchedule: cancelSchedule,
    getListPatientForPatient: getListPatientForPatient,
}