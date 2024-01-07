import _ from "lodash";
import db from "../models/index";


let createNewHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.contentHTML || !data.contentMarkdown || !data.name || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                await db.Handbook.create({
                    name: data.name,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    image: data.imageBase64,
                    userId: data.userId,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create Handbook Success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllHandbook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Handbook.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailhandbookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let data = await db.Handbook.findOne({
                    where: { id: inputId }
                })
                // if (data && data.length > 0) {
                //     data.map(item => {
                //         item.image = Buffer.from(item.image, 'base64').toString('binary')
                //         return item
                //     })
                // }
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
let deleteHandbookById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let handbook = await db.Handbook.findOne({
                where: { id: id }
            })
            if (!handbook) {
                resolve({
                    errCode: 1,
                    errMessage: "handbook does not exist"
                })
            } else {
                await db.Handbook.destroy({
                    where: { id: id }
                })
                resolve({
                    errCode: 0,
                    errMessage: "Delete handbook success"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let editHandbookById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let handbook = await db.Handbook.findOne({
                    where: { id: data.id }
                })
                if (handbook) {
                    await db.Handbook.update({
                        name: data.name,
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        image: data.imageBase64
                    }, { where: { id: data.id } })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Update handbook Success"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNewHandbook: createNewHandbook,
    getAllHandbook: getAllHandbook,
    getDetailhandbookById: getDetailhandbookById,
    deleteHandbookById: deleteHandbookById,
    editHandbookById: editHandbookById,

}