import clinicServices from "../services/clinicServices"


let createClinic = async (req, res) => {
    try {
        let infor = await clinicServices.createClinic(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever '
        })
    }
}
let getAllClinic = async (req, res) => {
    try {
        let response = await clinicServices.getAllClinic(req.query.id);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Clinic '
        })
    }
}
let getDetailByClinicId = async (req, res) => {
    try {
        let response = await clinicServices.getDetailByClinicId(req.query.id);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Specialty'
        })
    }
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailByClinicId: getDetailByClinicId,

}