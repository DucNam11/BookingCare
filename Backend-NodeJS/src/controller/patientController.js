import patientService from '../services/patientService'

let postBookAppointment = async (req, res) => {
    try {
        let info = await patientService.postBookAppointment(req.body)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        })
    }
}
let verifyBookAppointment = async (req, res) => {
    try {
        let info = await patientService.verifyBookAppointment(req.body)
        return res.status(200).json(info)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let postBookAppointmentParkage = async (req, res) => {
    try {
        let info = await patientService.postBookAppointmentParkage(req.body)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        })
    }
}
let verifyBookAppointmentParkage = async (req, res) => {
    try {
        let info = await patientService.verifyBookAppointmentParkage(req.body)
        return res.status(200).json(info)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
module.exports = {
    postBookAppointment: postBookAppointment,
    verifyBookAppointment: verifyBookAppointment,
    postBookAppointmentParkage: postBookAppointmentParkage,
    verifyBookAppointmentParkage: verifyBookAppointmentParkage
}