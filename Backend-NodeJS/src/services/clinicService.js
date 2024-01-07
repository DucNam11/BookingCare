import db from "../models/index";


let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.descriptionMarkdown || !data.descriptionHTML || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: " Missing Parameter"
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                    image: data.imageBase64
                })
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
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
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
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (inputId) {
                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown']
                })
                if (data) {
                    let doctorClinic = []
                    doctorClinic = await db.Doctor_Info.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId']
                    })
                    data.doctorClinic = doctorClinic
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
let deleteClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: id }
            })
            if (!clinic) {
                resolve({
                    errCode: 1,
                    errMessage: "Clinic does not exist"
                })
            } else {
                await db.Clinic.destroy({
                    where: { id: id }
                })
                resolve({
                    errCode: 0,
                    errMessage: "Delete Clinic success"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let data = await db.Clinic.findOne({
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
let editClinicById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where: { id: data.id }
                })
                if (clinic) {
                    await db.Clinic.update({
                        name: data.name,
                        address: data.address,
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

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    deleteClinicById: deleteClinicById,
    getAllClinicById: getAllClinicById,
    editClinicById: editClinicById,
}