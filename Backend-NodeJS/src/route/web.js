import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from '../controllers/doctorController';
import patienController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController'


let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);


    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.hanldeGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);


    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctors', doctorController.postInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.get('/api/get-list-patient-history-for-doctor', doctorController.getListPatientHistoryForDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);
    router.get('/api/get-specialtyId', doctorController.getSpecialty);

    router.get('/api/get-list-patient-for-patient', doctorController.getListPatientForPatient);
    router.delete('/api/cancel-schedule', doctorController.cancelSchedule);




    router.post('/api/patient-book-appointment', patienController.postBookAppointment);
    router.post('/api/verify-book-appointment', patienController.postVerifyAppointment);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-new-handbook', specialtyController.createHandbook);
    router.get('/api/get-handbook', specialtyController.getAllHandbook);
    router.get('/api/get-detail-handbook-by-id', specialtyController.getDetailHandbookById);

    router.post('/api/create-new-clinic', clinicController.createClinic)
    router.get('/api/get-clinic', clinicController.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)

    return app.use("/", router);
}

module.exports = initWebRoutes;