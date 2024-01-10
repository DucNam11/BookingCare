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
        let infor = await clinicServices.getAllClinic();
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever '
        })
    }
}
let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicServices.getDetailClinicById(req.query.id);
        return res.status(200).json(infor)
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
    getDetailClinicById: getDetailClinicById,
   

}