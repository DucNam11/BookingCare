import express from "express";
import homeController from "../controller/homeController";
import userController from "../controller/userController";
import doctorController from '../controller/doctorController'
import patientController from '../controller/patientController'
import specialtyController from '../controller/specialtyController'
import clinicController from '../controller/clinicController'
import handbookController from '../controller/handbookController'
import parkageController from '../controller/parkageController'

let router = express.Router();

let initWebRoute = (app) => {

    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    //API

    router.post('/api/login', userController.handlelogin)
    router.get('/api/get-all-users', userController.handleGetAllUser)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)

    router.get('/api/allcode', userController.getAllCode)

    router.get('/api/get-top-doctor', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctor', doctorController.getAllDoctors)
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-save-schedule', doctorController.BulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)


    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
    router.post('/api/send-remedy', doctorController.sendRemedy)
    // router.get('/api/get-list-patient-for-admin', doctorController.getListPatientForAdmin)


    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.verifyBookAppointment)
    router.post('/api/patient-book-appointment-parkage', patientController.postBookAppointmentParkage)
    router.post('/api/verify-book-appointment-parkage', patientController.verifyBookAppointmentParkage)

    router.post('/api/create-new-specialty', specialtyController.createNewSpecialty)
    router.get('/api/get-specialty', specialtyController.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)
    router.delete('/api/delete-specialty-by-id', specialtyController.deleteSpecialtyById)
    router.put('/api/edit-specialty-by-id', specialtyController.editSpecialtyById)
    router.get('/api/get-specialty-by-id', specialtyController.getAllSpecialtyById)


    router.post('/api/create-new-clinic', clinicController.createClinic)
    router.get('/api/get-clinic', clinicController.getAllClinic)
    router.get('/api/get-clinic-by-id', clinicController.getDetailClinicById)
    router.delete('/api/delete-clinic-by-id', clinicController.deleteClinicById)
    router.get('/api/get-clinic-manage-by-id', clinicController.getAllClinicById)
    router.put('/api/edit-clinic-by-id', clinicController.editClinicById)


    router.get('/api/get-all-handbook', handbookController.getAllHandbook)
    router.post('/api/create-new-handbook', handbookController.createNewHandbook)
    router.get('/api/get-handbook-by-id', handbookController.getDetailhandbookById)
    router.delete('/api/delete-handbook-by-id', handbookController.deleteHandbookById)
    router.put('/api/edit-handbook-by-id', handbookController.editHandbookById)


    router.get('/api/get-all-parkage', parkageController.getAllParkage)
    router.get('/api/get-parkage-by-id', parkageController.getParkageById)
    router.post('/api/create-parkage', parkageController.CreateParkage)
    router.get('/api/get-parkage-by-clinicId', parkageController.getParkageByClinicId)
    router.delete('/api/delete-parkage-by-id', parkageController.deleteParkageById)
    router.put('/api/edit-parkage-by-id', parkageController.editParkageById)
    router.get('/api/search-parkage', parkageController.searchParkage)
    router.get('/api/get-parkage-by-selection', parkageController.getParkageBySelection)
    router.get('/api/get-parkage-by-selection-category', parkageController.getParkageBySelectionCategory)
    router.get('/api/get-parkage-by-selection-price', parkageController.getParkageBySelectionPrice)
    router.get('/api/get-parkage-by-selection-clinic', parkageController.getParkageBySelectionClinic)
    router.get('/api/get-list-patient-parkage', parkageController.getListPatientParkage)
    router.post('/api/send-remedy-parkage', parkageController.sendRemedyParkage)


    return app.use("/", router);
}

module.exports = initWebRoute;