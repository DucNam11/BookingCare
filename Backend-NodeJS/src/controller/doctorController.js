import doctorService from '../services/doctorService'

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) {
        limit = 10
    }
    try {
        let response = await doctorService.TopDoctorHome(limit)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        })
    }
}
let getAllDoctors = async (req, res) => {
    try {
        let doctor = await doctorService.getAllDoctors()
        return res.status(200).json(doctor)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let postInfoDoctor = async (req, res) => {
    try {
        let doctor = await doctorService.saveInfoDoctor(req.body)
        return res.status(200).json(doctor)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let BulkCreateSchedule = async (req, res) => {
    try {
        let data = await doctorService.BulkCreateSchedule(req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
let getExtraInfoDoctorById = async (req, res) => {
    try {
        let data = await doctorService.getExtraInfoDoctorById(req.query.doctorId)
        return res.status(200).json(data)
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {
        let data = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json(data)
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
let getListPatientForDoctor = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
let sendRemedy = async (req, res) => {
    try {
        let data = await doctorService.sendRemedy(req.body)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctor: postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    BulkCreateSchedule: BulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,

}
