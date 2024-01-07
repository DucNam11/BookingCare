import parkageService from '../services/parkageService'



let getAllParkage = async (req, res) => {
    try {
        let parkage = await parkageService.getAllParkage()
        return res.status(200).json(parkage)
    } catch (error) {
        console.log(error)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let getParkageById = async (req, res) => {
    try {
        let parkage = await parkageService.getParkageById(req.query.id)
        return res.status(200).json(parkage)
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
        console.log(error);
    }
}
let CreateParkage = async (req, res) => {
    try {
        let parkage = await parkageService.CreateParkage(req.body)
        return res.status(200).json(parkage)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let getParkageByClinicId = async (req, res) => {
    try {
        let parkage = await parkageService.getParkageByClinicId(req.query.clinicId)
        return res.status(200).json(parkage)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let deleteParkageById = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing parameterA"
            })
        } else {
            let parkage = await parkageService.deleteParkageById(req.body.id)
            return res.status(200).json({
                errCode: 0,
                errMessage: 'Delete Success'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let editParkageById = async (req, res) => {
    try {
        let parkage = await parkageService.editParkageById(req.body)
        return res.status(200).json(parkage)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let searchParkage = async (req, res) => {
    try {
        let info = await parkageService.searchParkage(req.query.q)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let getParkageBySelection = async (req, res) => {
    try {
        let info = await parkageService.getParkageBySelection(req.query.provinceId)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let getParkageBySelectionCategory = async (req, res) => {
    try {
        let info = await parkageService.getParkageBySelectionCategory(req.query.categoryId)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let getParkageBySelectionPrice = async (req, res) => {
    try {
        let info = await parkageService.getParkageBySelectionPrice(req.query.priceId)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let getParkageBySelectionClinic = async (req, res) => {
    try {
        let info = await parkageService.getParkageBySelectionClinic(req.query.clinicId)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let getListPatientParkage = async (req, res) => {
    try {
        let data = await parkageService.getListPatientParkage(req.query.parkageId, req.query.date)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
let sendRemedyParkage = async (req, res) => {
    try {
        let data = await parkageService.sendRemedyParkage(req.body)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from Server"
        })
    }
}
module.exports = {
    getAllParkage: getAllParkage,
    getParkageById: getParkageById,
    CreateParkage: CreateParkage,
    getParkageByClinicId: getParkageByClinicId,
    deleteParkageById: deleteParkageById,
    editParkageById: editParkageById,
    searchParkage: searchParkage,
    getParkageBySelection: getParkageBySelection,
    getParkageBySelectionCategory: getParkageBySelectionCategory,
    getListPatientParkage: getListPatientParkage,
    getParkageBySelectionPrice: getParkageBySelectionPrice,
    getParkageBySelectionClinic: getParkageBySelectionClinic,
    sendRemedyParkage: sendRemedyParkage
}