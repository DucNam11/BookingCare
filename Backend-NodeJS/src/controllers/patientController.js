import patienService from '../services/patientServices';

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patienService.postBookAppointment(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })

    }
}
let postVerifyAppointment = async (req, res) => {

    try {
        let infor = await patienService.postVerifyAppointment(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })

    }
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyAppointment: postVerifyAppointment
}