import specialtyService from '../services/specialtyService';

let createSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};
let getAllSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.getAllSpecialty();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

let getDetailSpecialtyById = async (req, res) => {
    try {
        let infor = await specialtyService.getDetailSpecialtyById(
            req.query.id,
            req.query.location
        );
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

let createHandbook = async (req, res) => {
    try {
        let infor = await specialtyService.createHandbook(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

let getAllHandbook = async (req, res) => {
    try {
        let infor = await specialtyService.getAllHandbook();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

let getDetailHandbookById = async (req, res) => {
    try {
        let infor = await specialtyService.getDetailHandbookById(
            req.query.id,
            req.query.location
        );
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};


module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    createHandbook: createHandbook,
    getAllHandbook: getAllHandbook,
    getDetailHandbookById: getDetailHandbookById,
}