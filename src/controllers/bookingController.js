const { createBooking, cancelBooking, getBookingAPatient, getScheduleForBookking,
    bookingMonthly, bookingClinc, bookingSpecialties
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



module.exports = {
    postCreateBooking,
    deleteCancelBooking,
    getBookingPatient,
    getScheduleBookking,
    getBookingMonthly,
    getBookingClinic,
    getBookingSpecialties
}