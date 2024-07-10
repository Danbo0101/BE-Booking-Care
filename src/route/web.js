const express = require('express');
const { getCreateUsers } = require('../controllers/userController')
const { postLogin } = require('../controllers/authController');
const { postCreateDoctor, getAllDoctorPaginate, putUpdateDoctor, deleteDoctor, getDoctorForSpecialtiesPaginate,
    postCreateClinic, getAllClinicPaginate, putUpdateClinic, deleteClinic,
    postCreateSpecialties, getAllSpecialtiesPaginate, putUpdateSpecialties, deleteSpecialties,
    postAssignDoctor, putUpdateAssignDoctor,
    postCreateSchedule, getDoctorSchedule
} = require('../controllers/adminController');
const { postCreateBooking, deleteCancelBooking } = require('../controllers/bookingController');
const router = express.Router();



router.post('/create-users', getCreateUsers);
router.post('/login', postLogin);


router.post('/doctors', postCreateDoctor);
router.get('/doctors', getAllDoctorPaginate);
router.put('/doctors', putUpdateDoctor);
router.delete('/doctors', deleteDoctor);
router.get('/doctors-specialties', getDoctorForSpecialtiesPaginate);

router.post('/clinics', postCreateClinic);
router.get('/clinics', getAllClinicPaginate);
router.put('/clinics', putUpdateClinic);
router.delete('/clinics', deleteClinic);

router.post('/specialties', postCreateSpecialties);
router.get('/specialties', getAllSpecialtiesPaginate);
router.put('/specialties', putUpdateSpecialties);
router.delete('/specialties', deleteSpecialties);

router.post('/assign-doctor', postAssignDoctor);
router.put('/assign-doctor', putUpdateAssignDoctor);

router.post('/schedules', postCreateSchedule);
router.get('/schedules', getDoctorSchedule);

router.post('/bookings', postCreateBooking);
router.delete('/bookings', deleteCancelBooking);

module.exports = router;