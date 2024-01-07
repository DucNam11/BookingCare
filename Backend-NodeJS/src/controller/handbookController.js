import handbookService from '../services/handbookService'

let createNewHandbook = async (req, res) => {
    try {
        let data = await handbookService.createNewHandbook(req.body)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllHandbook = async (req, res) => {
    try {
        let data = await handbookService.getAllHandbook()
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetailhandbookById = async (req, res) => {
    try {
        let data = await handbookService.getDetailhandbookById(req.query.id)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let deleteHandbookById = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing parameterA"
            })
        } else {
            let data = await handbookService.deleteHandbookById(req.body.id)
            return res.status(200).json({
                errCode: 0,
                errMessage: 'Delete Success'
            })
        }
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "error from server"
        })
    }
}
let editHandbookById = async (req, res) => {
    try {
        let data = await handbookService.editHandbookById(req.body)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}

module.exports = {
    createNewHandbook: createNewHandbook,
    getAllHandbook: getAllHandbook,
    getDetailhandbookById: getDetailhandbookById,
    deleteHandbookById: deleteHandbookById,
    editHandbookById: editHandbookById

}