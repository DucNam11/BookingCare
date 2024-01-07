import { json } from 'body-parser'
import clinicService from '../services/clinicService'

let createClinic = async (req, res) => {
    try {
        let data = await clinicService.createClinic(req.body)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: 0,
            errMessage: "Error from server"
        })
    }
}
let getAllClinic = async (req, res) => {
    try {
        let data = await clinicService.getAllClinic()
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: 0,
            errMessage: "Error from server"
        })
    }
}
let getDetailClinicById = async (req, res) => {
    try {
        let data = await clinicService.getDetailClinicById(req.query.id)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
let deleteClinicById = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing parameterA"
            })
        } else {
            let data = await clinicService.deleteClinicById(req.body.id)
            return res.status(200).json({
                errCode: 0,
                errMessage: 'Delete Success',
            })
        }
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "error from server"
        })
    }
}
let getAllClinicById = async (req, res) => {
    try {
        let data = await clinicService.getAllClinicById(req.query.id)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let editClinicById = async (req, res) => {
    try {
        let data = await clinicService.editClinicById(req.body)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    deleteClinicById: deleteClinicById,
    getAllClinicById: getAllClinicById,
    editClinicById: editClinicById,
}