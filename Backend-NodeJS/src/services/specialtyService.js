import db from "../models/index";


let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create Specialty Success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data: data
            })
        }
        catch (error) {
            reject(error)
        }
    })
}
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (inputId || location) {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })
                if (data) {
                    let doctorSpecialty = []
                    if (location === "ALL") {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty
                } else { data = {} }
                resolve({
                    errCode: 0,
                    errMessage: "ok",
                    data: data
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteSpecialtyById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                where: { id: id }
            })
            if (!specialty) {
                resolve({
                    errCode: 1,
                    errMessage: "Specialty does not exist"
                })
            } else {
                await db.Specialty.destroy({
                    where: { id: id }
                })
                resolve({
                    errCode: 0,
                    errMessage: "Delete specialty success"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let editSpecialtyById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: data.id }
                })
                if (specialty) {
                    await db.Specialty.update({
                        name: data.name,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown,
                        image: data.image
                    }, { where: { id: data.id } })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Update Specialty Success"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllSpecialtyById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId }
                })
                resolve({
                    errCode: 0,
                    errMessage: "Success",
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    deleteSpecialtyById: deleteSpecialtyById,
    editSpecialtyById: editSpecialtyById,
    getAllSpecialtyById: getAllSpecialtyById
}