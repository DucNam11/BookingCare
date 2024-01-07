import _, { reject } from 'lodash'
import db from '../models/index'
const { Op } = require("sequelize");
import emailService from './emailService'

require('dotenv').config()


let getAllParkage = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Parkages.findAll({
                include: [
                    { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                ],
                raw: false,
                nest: true
            })
            resolve({
                errCode: 0,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getParkageById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let data = await db.Parkages.findOne({
                    where: { id: inputId },
                    include: [
                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'categoryIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Specialty, as: 'specialtyIdData', attributes: ['name'] },
                        { model: db.Clinic, as: 'clinicIdData', attributes: ['name'] },
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
let CreateParkage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.clinicId || !data.specialtyId || !data.name) {
                resolve({
                    errCode: 1,
                    errMessage: "Misssing parameter"
                })
            } else {
                await db.Parkages.create({
                    clinicId: data.clinicId,
                    specialtyId: data.specialtyId,
                    priceId: data.selectedPrice,
                    provinceId: data.selectedProvince,
                    categoryId: data.selectedCategory,
                    name: data.name,
                    address: data.address,
                    description: data.description,
                    image: data.imageBase64,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                })
                resolve({
                    errCode: 0,
                    errMessage: "save succeed"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getParkageByClinicId = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let data = await db.Parkages.findOne({
                    where: { clinicId: inputId }
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
let deleteParkageById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let parkage = await db.Parkages.findOne({
                where: { id: inputId }
            })
            if (!parkage) {
                resolve({
                    errCode: 1,
                    errMessage: "parkage does not exist"
                })
            } else {
                await db.Parkages.destroy({
                    where: { id: inputId }
                })
                resolve({
                    errCode: 0,
                    errMessage: "Delete parkage success"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let editParkageById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let parkage = await db.Parkages.findOne({
                    where: { id: data.id }
                })
                if (parkage) {
                    await db.Parkages.update({
                        clinicId: data.clinicId,
                        specialtyId: data.specialtyId,
                        priceId: data.selectedPrice,
                        provinceId: data.selectedProvince,
                        categoryId: data.selectedCategory,
                        name: data.name,
                        address: data.address,
                        description: data.description,
                        image: data.imageBase64,
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                    }, { where: { id: data.id } })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Ok"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let searchParkage = (q) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!q) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing query search"
                })
            } else {
                let data = await db.Parkages.findAll({
                    where: {
                        [Op.or]: [
                            { name: { [Op.like]: '%' + q + '%' } },
                            { description: { [Op.like]: '%' + q + '%' } }
                        ]

                    }
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
let getParkageBySelection = (provinceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!provinceId) {
                let data = await db.Parkages.findAll({
                    include: [
                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'categoryIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Specialty, as: 'specialtyIdData', attributes: ['name'] },
                        { model: db.Clinic, as: 'clinicIdData', attributes: ['name'] },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
            else {
                if (provinceId) {
                    let data = await db.Parkages.findAll({
                        where: {
                            provinceId: provinceId,
                        },
                        include: [
                            { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Allcode, as: 'provinceIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Allcode, as: 'categoryIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Specialty, as: 'specialtyIdData', attributes: ['name'] },
                            { model: db.Clinic, as: 'clinicIdData', attributes: ['name'] },
                        ],
                        raw: false,
                        nest: true
                    })
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }



            }
            // if (!data) data = {}
        } catch (error) {
            reject(error)
        }
    })
}
let getParkageBySelectionCategory = (categoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!categoryId) {
                let data = await db.Parkages.findAll({
                    include: [
                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'categoryIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Specialty, as: 'specialtyIdData', attributes: ['name'] },
                        { model: db.Clinic, as: 'clinicIdData', attributes: ['name'] },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            } else {
                if (categoryId) {
                    let data = await db.Parkages.findAll({
                        where: {
                            categoryId: categoryId,
                        }, include: [
                            { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Allcode, as: 'provinceIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Allcode, as: 'categoryIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Specialty, as: 'specialtyIdData', attributes: ['name'] },
                            { model: db.Clinic, as: 'clinicIdData', attributes: ['name'] },
                        ],
                        raw: false,
                        nest: true
                    })
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getParkageBySelectionPrice = (priceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!priceId) {
                let data = await db.Parkages.findAll({
                    include: [
                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'categoryIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Specialty, as: 'specialtyIdData', attributes: ['name'] },
                        { model: db.Clinic, as: 'clinicIdData', attributes: ['name'] },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            } else {
                if (priceId) {
                    let data = await db.Parkages.findAll({
                        where: {
                            priceId: priceId,
                        }, include: [
                            { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Allcode, as: 'provinceIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Allcode, as: 'categoryIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Specialty, as: 'specialtyIdData', attributes: ['name'] },
                            { model: db.Clinic, as: 'clinicIdData', attributes: ['name'] },
                        ],
                        raw: false,
                        nest: true
                    })
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getParkageBySelectionClinic = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                let data = await db.Parkages.findAll({
                    include: [
                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Allcode, as: 'categoryIdData', attributes: ['valueVi', 'valueEn'], },
                        { model: db.Specialty, as: 'specialtyIdData', attributes: ['name'] },
                        { model: db.Clinic, as: 'clinicIdData', attributes: ['name'] },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            } else {
                if (clinicId) {
                    let data = await db.Parkages.findAll({
                        where: {
                            clinicId: clinicId,
                        }, include: [
                            { model: db.Allcode, as: 'priceIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Allcode, as: 'provinceIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Allcode, as: 'categoryIdData', attributes: ['valueVi', 'valueEn'], },
                            { model: db.Specialty, as: 'specialtyIdData', attributes: ['name'] },
                            { model: db.Clinic, as: 'clinicIdData', attributes: ['name'] },
                        ],
                        raw: false,
                        nest: true
                    })
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getListPatientParkage = (parkageId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!parkageId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: { parkageId: parkageId, statusId: 'S2', date: date },
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
let sendRemedyParkage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.parkageId || !data.patienId || !data.timeType || !data.email) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                // Update appointment status
                let appointment = await db.Booking.findOne({
                    where: {
                        parkageId: data.parkageId,
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
                            parkageId: data.parkageId,
                            patientId: data.patientId,
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
    getAllParkage: getAllParkage,
    getParkageById: getParkageById,
    CreateParkage: CreateParkage,
    getParkageByClinicId: getParkageByClinicId,
    deleteParkageById: deleteParkageById,
    editParkageById: editParkageById,
    searchParkage: searchParkage,
    getParkageBySelection: getParkageBySelection,
    getListPatientParkage: getListPatientParkage,
    getParkageBySelectionCategory: getParkageBySelectionCategory,
    getParkageBySelectionPrice: getParkageBySelectionPrice,
    getParkageBySelectionClinic: getParkageBySelectionClinic,
    sendRemedyParkage: sendRemedyParkage,
}