import db from "../models/index";
import jwt from 'jsonwebtoken';


let createNewHandbook = (data, accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.contentHTML || !data.authors || !data.contentMarkdown || !data.name || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else {
                let senderId = '';
                if (accessToken) {
                    jwt.verify(accessToken, process.env.KEY_SECRET_ACCESS_TOKEN, (err, payload) => {
                        if (err) {
                            resolve({ errorCode: 1, message: 'Token is not valid' });
                        }
                        senderId = payload.id;
                    });
                } else {
                    resolve({ errorCode: 1, message: 'You are not authenticated' });
                }
                await db.Handbook.create({
                    senderId: senderId,
                    statusId: 'S1',
                    authors: data.authors,
                    adviser: data.adviser,
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

let confirmHandbookServices = (id, accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            let censorId = '';
            if (accessToken) {
                jwt.verify(accessToken, process.env.KEY_SECRET_ACCESS_TOKEN, (err, payload) => {
                    if (err) {
                        resolve({ errorCode: 1, message: 'Token is not valid' });
                    }
                    censorId = payload.id;
                });
            } else {
                resolve({ errorCode: 1, message: 'You are not authenticated' });
            }
            let handbook = await db.Handbook.findOne({
                where: { id: id, statusId: 'S1' },
            });
            if (handbook) {
                await handbook.update({ censor: censorId, statusId: 'S2' });
                await handbook.save();
                resolve({ errorCode: 0, message: 'Confirm success' });
            } else {
                resolve({ errorCode: 1, message: 'Not found handbook' });
            }
        } catch (error) {
            reject(error);
        }
    });
};
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
let getDetailhandbookById = (id, type, statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let dataAdviser = [];
            if (!statusId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing Parameter"
                })
            } else if ((id && type === 'detail') || id) {
                data = await db.Handbook.findOne({
                    where: {id: id},
                    include: [
                        {
                            model: db.User,
                            as: 'senderData',
                            attributes: ['id', 'firstName', 'lastName', 'position'],
                        },
                    ],
                    raw: true,
                    nest: true,
                })
            }
            let idAdvisers = data?.adviser?.split(',');
            if (idAdvisers) {
                data.adviserData = await Promise.all(
                    idAdvisers.map(async (item) => {
                        return await db.User.findOne({
                            where: {id: item},
                            attributes: ['firstName', 'lastName', 'position'],
                            raw: true,
                            nest: true,
                        });
                    }),
                );
            }
            else if (type === 'manage' && statusId) {
                data = await db.Handbook.findAll({
                    where: { statusId: statusId },
                    attributes: ['id', 'name', 'image', 'statusId'],
                    include: [
                        { model: db.User, as: 'senderData', attributes: ['id', 'firstName', 'lastName', 'position'] },
                    ],
                    raw: true,
                    nest: true,
                });
            } else {
                //for api homepage
                data = await db.Handbook.findAll({
                    where: { statusId: 'S2' },
                    attributes: ['id', 'name', 'image'],
                    raw: true,
                });
            }
            if (data) {
                resolve({
                    errorCode: 0,
                    data: data,
                });
            } else {
                resolve({
                    errorCode: 1,
                    message: 'Not found handbook',
                });
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
                    errMessage: "Handbook does not exist"
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
                        authors: data.authors,
                        adviser: data.adviser,
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
    confirmHandbookServices: confirmHandbookServices

}