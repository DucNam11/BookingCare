import specialtyService from '../services/specialtyService'

let createNewSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.createNewSpecialty(req.body)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialty()
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetailSpecialtyById = async (req, res) => {
    try {
        let data = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
let deleteSpecialtyById = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing parameterA"
            })
        } else {
            let data = await specialtyService.deleteSpecialtyById(req.body.id)
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
let editSpecialtyById = async (req, res) => {
    try {
        let data = await specialtyService.editSpecialtyById(req.body)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
let getAllSpecialtyById = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialtyById(req.query.id)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    deleteSpecialtyById: deleteSpecialtyById,
    editSpecialtyById: editSpecialtyById,
    getAllSpecialtyById: getAllSpecialtyById,
}