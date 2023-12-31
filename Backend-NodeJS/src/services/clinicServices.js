import db from "../models/index"
require('dotenv').config();
import _ from 'lodash';

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.descriptionHTML || !data.descriptionMarkdown || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create a new clinic success',
                })
            }
        }
        catch (e) {
            reject(e)
            console.log(e);
        }
    })
}
let getAllClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data === 'ALL') {
                let res = await db.Clinic.findAll();
                if (!res) {
                    resolve({
                        errCode: 0,
                        data: [],
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: res,
                    })
                }
            };
            if (data && data !== 'ALL') {
                let res = await db.Clinic.findOne({
                    where: { id: data },
                })
                if (!res) {
                    resolve({
                        errCode: 0,
                        data: [],
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: res,
                    })
                }
            }

        }
        catch (e) {
            reject(e)
        }
    })
}
let getDetailByClinicId = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                })
            }
            else {

                let res = await db.Doctor_infor.findAll({
                    where: {
                        clinicId: clinicId
                    },
                    attributes: ['doctorId'],
                })
                if (!res) {
                    resolve({
                        errCode: 0,
                        data: [],
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: res,
                    })
                }
            }


        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailByClinicId: getDetailByClinicId,
}