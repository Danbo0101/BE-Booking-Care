const express = require('express');
const { getCreateUsers } = require('../controllers/userController')
const { postLogin, postRegister, putUpdatePassword, putUpdateProfile, postLogout,
    postSendOtp, postVerifyOtp, postForgotPassword
} = require('../controllers/authController');
const { postCreateDoctor, getAllDoctorPaginate, putUpdateDoctor, deleteDoctor, getDoctorForSpecialtiesPaginate,
    postCreateClinic, getAllClinicPaginate, putUpdateClinic, deleteClinic, getClinicInfo, getDoctorForClinicPaginate,
    postCreateSpecialties, getAllSpecialtiesPaginate, putUpdateSpecialties, deleteSpecialties, getDoctorClinicSpecialties, getSpecialtiesInfo,
    postAssignDoctor, putUpdateAssignDoctor, getAssignDoctor,
    postCreateSchedule, getADoctorSchedule, deleteDoctorSchedule, putUpdateDoctorSchedule, getDoctorScheduleDetail, getAllDoctorSchedule,
    getAllTimeType, getDoctorReport, getClinicReport, getSpecialtiesReport
} = require('../controllers/adminController');
const { postCreateBooking, deleteCancelBooking, getScheduleBookking, getBookingPatient,
    getBookingMonthly, getBookingClinic, getBookingSpecialties, getBookingOfClinic,
    getBookingOfSpecialties, getAllBookings, getCheckTimeBooking, getCheckDoctorBooking
} = require('../controllers/bookingController');
const { createPaymentUrl, handleVnpayReturn } = require("../controllers/paymentController");
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const checkLogin = require('../middleware/checkLogin');
const { markAttendanceController, getDoctorNotMarkToday } = require('../controllers/attendanceController');
const router = express.Router();



// router.all('*', auth)



// router.post('/create-users', getCreateUsers);
// router.post('/login', postLogin);
// router.post('/register', postRegister);
// router.put('/change-password', checkLogin, putUpdatePassword);
// router.put('/change-profile', checkLogin, putUpdateProfile);


// router.post('/doctors', checkRole(1), postCreateDoctor);
// router.get('/doctors', checkRole(1), getAllDoctorPaginate);
// router.put('/doctors', checkRole(1), putUpdateDoctor);
// router.delete('/doctors', checkRole(1), deleteDoctor);
// router.get('/doctors-specialties', checkRole(1), getDoctorForSpecialtiesPaginate);

// router.post('/clinics', checkRole(1), postCreateClinic);
// router.get('/clinics', checkRole(1), getAllClinicPaginate);
// router.put('/clinics', checkRole(1), putUpdateClinic);
// router.delete('/clinics', checkRole(1), deleteClinic);

// router.post('/specialties', checkRole(1), postCreateSpecialties);
// router.get('/specialties', checkRole(1), getAllSpecialtiesPaginate);
// router.put('/specialties', checkRole(1), putUpdateSpecialties);
// router.delete('/specialties', checkRole(1), deleteSpecialties);

// router.post('/assign-doctor', checkRole(1), postAssignDoctor);
// router.put('/assign-doctor', checkRole(1), putUpdateAssignDoctor);

// router.post('/schedules', checkRole(1), postCreateSchedule);
// router.get('/schedules', checkRole(1), getDoctorSchedule);

// router.post('/bookings', checkRole(3), postCreateBooking);
// router.delete('/bookings', checkRole(3), deleteCancelBooking);
// router.get('/bookings', checkLogin, getBookingPatient);

// module.exports = router;


router.post('/create-users', getCreateUsers);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.post('/sent-otp', postSendOtp);
router.post('/verify-otp', postVerifyOtp);
router.post('/register', postRegister);
router.post('/forgot-password', postForgotPassword);
router.put('/change-password', putUpdatePassword);
router.put('/change-profile', putUpdateProfile);


router.post('/doctors', postCreateDoctor);
router.get('/doctors', getAllDoctorPaginate);
router.put('/doctors', putUpdateDoctor);
router.delete('/doctors', deleteDoctor);
router.get('/doctors-specialties', getDoctorForSpecialtiesPaginate);
router.get('/doctors-clinic', getDoctorForClinicPaginate);
router.get('/doctor-clinic-specialties', getDoctorClinicSpecialties);

router.post('/clinics', postCreateClinic);
router.get('/clinics', getAllClinicPaginate);
router.get('/clinic-info', getClinicInfo);
router.put('/clinics', putUpdateClinic);
router.delete('/clinics', deleteClinic);
router.get('/clinic-booking', getBookingOfClinic);


router.post('/specialties', postCreateSpecialties);
router.get('/specialties', getAllSpecialtiesPaginate);
router.put('/specialties', putUpdateSpecialties);
router.delete('/specialties', deleteSpecialties);
router.get('/specialties-info', getSpecialtiesInfo);
router.get('/specialties-booking', getBookingOfSpecialties);

router.get('/assign-doctor', getAssignDoctor);
router.post('/assign-doctor', postAssignDoctor);
router.put('/assign-doctor', putUpdateAssignDoctor);

router.post('/schedules', postCreateSchedule);
router.get('/schedules', getAllDoctorSchedule);
router.get('/schedules-booking', getADoctorSchedule);
router.get('/schedules-detail', getDoctorScheduleDetail);
router.delete('/schedules', deleteDoctorSchedule);
router.put('/schedules', putUpdateDoctorSchedule);

router.post('/bookings', postCreateBooking);
router.delete('/bookings', deleteCancelBooking);
router.get('/bookings', getScheduleBookking);
router.get('/all-bookings', getAllBookings);
router.get('/history-bookings', getBookingPatient);

router.get('/time-type', getAllTimeType);

router.get('/doctor-report', getDoctorReport);
router.get('/clinic-report', getClinicReport);
router.get('/specialties-report', getSpecialtiesReport);

router.get('/checkTimeBooking', getCheckTimeBooking);
router.get('/checkDoctorBooking', getCheckDoctorBooking);
router.get('/booking-monthly', getBookingMonthly);
router.get('/booking-clinic', getBookingClinic);
router.get('/booking-specialties', getBookingSpecialties);


router.post('/mark-attendance', markAttendanceController);
router.get('/mark-attendance', getDoctorNotMarkToday);



router.post("/create_payment_url", createPaymentUrl);
router.get('/vnpay_return', handleVnpayReturn);
// router.get("/vnpay_return", paymentController.vnpayReturn);
// router.get("/vnpay_ipn", paymentController.vnpayIpn);
// router.post("/querydr", paymentController.queryDr);


module.exports = router;