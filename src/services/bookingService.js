import db from "../models/index";
import checkStatusSchedule from "../utils/checkStatusSchedule";

const createBooking = async (patientId, data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let isExistPantient = await db.User.findOne({
                where: { id: patientId, roleId: 3, isActive: true }
            })
            if (!isExistPantient) {
                resolve(
                    {
                        ER: 2,
                        message: "Pantient not found or inactive"
                    });
                return;
            }
            else {

                let checkSchedule = await db.Schedule.findOne({
                    where: { id: data.scheduleId }
                })
                if (checkSchedule) {
                    let checkStatus = await checkStatusSchedule(checkSchedule.id)
                    if (!checkStatus) {
                        resolve(
                            {
                                ER: 2,
                                message: "Schedule is not available"
                            });
                        return;
                    } else {
                        let isExistTimeBooking = await checkTimeBooking(patientId, data.scheduleId);
                        let isExistDoctorBooking = await checkDoctorBooking(patientId, data.scheduleId);
                        if (isExistTimeBooking) {
                            resolve(
                                {
                                    ER: 2,
                                    message: "Patient duplicate schedule"
                                });
                            return;
                        }
                        else if (isExistDoctorBooking) {
                            resolve(
                                {
                                    ER: 2,
                                    message: "Patient duplicate doctor"
                                });
                            return;
                        }
                        else {
                            let createBooking = await db.Booking.create({
                                scheduleId: data.scheduleId,
                                patientId: patientId,
                                statusId: 3
                            })
                            if (createBooking) {
                                let updateCurrentNumber = await db.Schedule.update(
                                    {
                                        currentNumber: checkSchedule.currentNumber + 1
                                    },
                                    {
                                        where: { id: data.scheduleId, statusId: 1 }
                                    }
                                )
                                resolve(
                                    {
                                        ER: 0,
                                        message: "Booking created successfully",
                                        data: createBooking
                                    });
                            }
                            else {
                                resolve(
                                    {
                                        ER: 3,
                                        message: "Booking created failed"
                                    });
                            }
                        }

                    }
                }
                else {
                    resolve(
                        {
                            ER: 2,
                            message: "Schedule not found or inactive"
                        });
                    return;
                }

            }
        } catch (error) {

        }
    })
}

const checkDoctorBooking = async (patientId, scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bookingPatient = await db.Booking.findOne({
                where: { patientId }
            })

            if (bookingPatient) {
                let doctorBooking = await db.Schedule.findOne({
                    where: { id: +scheduleId }
                });

                let doctorBooked = await db.Schedule.findOne({
                    where: { id: bookingPatient.scheduleId }
                });

                if (doctorBooked.doctorId === doctorBooking.doctorId &&
                    (doctorBooked.date).toString() === doctorBooking.date.toString()
                ) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
            else resolve(false);

        } catch (error) {

        }
    })
}

const checkTimeBooking = async (patientId, scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bookingPatient = await db.Booking.findOne({
                where: { patientId }
            })
            if (bookingPatient) {
                let bookPatient = await db.Schedule.findOne({
                    where: { id: +scheduleId }
                });

                let bookedPatient = await db.Schedule.findOne({
                    where: { id: bookingPatient.scheduleId }
                });

                if (bookedPatient.timeTypeId === bookPatient.timeTypeId &&
                    bookedPatient.date.toString() === bookPatient.date.toString()
                ) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
            else resolve(false);

        } catch (error) {
            reject(error)
        }
    })
}

const cancelBooking = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patientId = queryString.patientId;
            let bookingId = queryString.bookingId;
            if (!patientId || !bookingId) {
                resolve(
                    {
                        ER: 1,
                        message: "Missing input parameter"
                    });
                return;
            }
            else {
                let isExistBooking = await db.Booking.findOne({
                    where: { id: bookingId, patientId }
                })
                if (!isExistBooking) {
                    resolve(
                        {
                            ER: 2,
                            message: "Booking not found"
                        });
                    return;
                }
                else {
                    let updateBooking = await db.Booking.update(
                        {
                            statusId: 4
                        },
                        {
                            where: { id: bookingId }
                        }
                    )
                    if (updateBooking) {
                        let updateSchedule = await db.Schedule.findOne({
                            where: { id: isExistBooking.scheduleId }
                        })
                        if (updateSchedule) {
                            let updateCurrentNumber = await db.Schedule.update(
                                {
                                    currentNumber: updateSchedule.currentNumber - 1
                                },
                                {
                                    where: { id: updateSchedule.id }
                                }
                            )
                            resolve(
                                {
                                    ER: 0,
                                    message: "Booking cancelled successfully"
                                });
                        }

                    }
                    else {
                        resolve(
                            {
                                ER: 3,
                                message: "Booking cancellation failed"
                            });
                    }
                }
            }
        } catch (error) {

        }
    })
}


module.exports = {
    createBooking,
    cancelBooking
}