const { createBooking, cancelBooking, getBookingAPatient, getScheduleForBookking,
    bookingMonthly, bookingClinc, bookingSpecialties, bookingOfClinic,
    bookingOfSpecialties, AllBookings, checkDoctorBooking, checkTimeBooking
} = require('../services/bookingService');


const postCreateBooking = async (req, res) => {

    let patientId = req.query.patientId;
    if (!patientId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await createBooking(patientId, req.body);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const deleteCancelBooking = async (req, res) => {

    let result = await cancelBooking(req.query);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })

}

const getBookingPatient = async (req, res) => {

    let patientId = req.query.patientId;

    if (!patientId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await getBookingAPatient(patientId);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getScheduleBookking = async (req, res) => {

    let scheduleId = req.query.scheduleId;

    if (!scheduleId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await getScheduleForBookking(scheduleId);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getBookingMonthly = async (req, res) => {
    let year = req.query.year;

    if (!year) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await bookingMonthly(year);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getBookingClinic = async (req, res) => {

    let result = await bookingClinc();
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getBookingSpecialties = async (req, res) => {

    let result = await bookingSpecialties();
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getBookingOfClinic = async (req, res) => {

    let clinicId = req.query.clinicId;

    if (!clinicId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await bookingOfClinic(clinicId);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getBookingOfSpecialties = async (req, res) => {

    let specialtiesId = req.query.specialtiesId;

    if (!specialtiesId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await bookingOfSpecialties(specialtiesId);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getAllBookings = async (req, res) => {
    let result = await AllBookings();
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getCheckTimeBooking = async (req, res) => {
    let patientId = req.query.patientId;
    let scheduleId = req.query.scheduleId;


    if (!patientId || !scheduleId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await checkTimeBooking(patientId, scheduleId);
    return res.status(200).json(result)
}

const getCheckDoctorBooking = async (req, res) => {
    let patientId = req.query.patientId;
    let scheduleId = req.query.scheduleId;



    if (!patientId || !scheduleId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await checkDoctorBooking(patientId, scheduleId);
    return res.status(200).json(result)
}

module.exports = {
    postCreateBooking,
    deleteCancelBooking,
    getBookingPatient,
    getScheduleBookking,
    getBookingMonthly,
    getBookingClinic,
    getBookingSpecialties,
    getBookingOfClinic,
    getBookingOfSpecialties,
    getAllBookings,
    getCheckTimeBooking,
    getCheckDoctorBooking
}