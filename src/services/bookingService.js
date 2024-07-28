import db from "../models/index";
import checkStatusSchedule from "../utils/checkStatusSchedule";
import convertFormatDate from "../utils/convertFormatDate";

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
            let bookingPatient = await db.Booking.findAll({
                where: { patientId, statusId: 3 }
            })

            if (bookingPatient) {
                let doctorBooking = await db.Schedule.findOne({
                    where: { id: +scheduleId }
                });
                let check = false;

                for (const booking of bookingPatient) {
                    let doctorBooked = await db.Schedule.findOne({
                        where: { id: booking.scheduleId }
                    });
                    if (doctorBooked.doctorId === doctorBooking.doctorId &&
                        (doctorBooked.date).toString() === doctorBooking.date.toString()) {
                        check = true;
                        break;
                    }
                }

                if (check) {
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
            let bookingPatient = await db.Booking.findAll({
                where: { patientId, statusId: 3 }
            });

            if (bookingPatient.length > 0) {
                let bookPatient = await db.Schedule.findOne({
                    where: { id: +scheduleId }
                });

                let check = false;

                for (const booking of bookingPatient) {
                    let bookedPatient = await db.Schedule.findOne({
                        where: { id: booking.scheduleId }
                    });
                    if (bookedPatient.timeTypeId === bookPatient.timeTypeId &&
                        bookedPatient.date.toString() === bookPatient.date.toString()) {
                        check = true;
                        break;
                    }
                }

                if (check) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
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

const getBookingAPatient = async (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExistPatient = await db.User.findOne({
                where: { id: patientId, roleId: 3, isActive: true }
            })
            if (isExistPatient) {
                let bookings = await db.Booking.findAll({
                    where: { patientId }
                })
                let result = [];
                for (let booking of bookings) {
                    let schedule = await db.Schedule.findOne({
                        where: { id: booking.scheduleId }
                    })
                    let doctor = await db.User.findOne({
                        where: { id: schedule.doctorId, roleId: 2, isActive: true }
                    })
                    let doctorUser = await db.DoctorUser.findOne({
                        where: { doctorId: schedule.doctorId }
                    })
                    let clinic = await db.Clinic.findOne({
                        where: { id: doctorUser.clinicId, isActive: true }
                    })
                    let specialties = await db.Specialties.findOne({
                        where: { id: doctorUser.specialtiesId, isActive: true }
                    })

                    let timeType = await db.TimeType.findOne({
                        where: { id: schedule.timeTypeId }
                    })

                    let status = await db.Status.findOne({
                        where: { id: booking.statusId }
                    })
                    console.log(status);
                    result.push({
                        bookingId: booking.id,
                        doctorName: doctor.name,
                        clinicName: clinic.name,
                        clinicAddress: clinic.address,
                        specialtiesName: specialties.name,
                        date: convertFormatDate(schedule.date),
                        timeTypeName: timeType.name,
                        statusName: status.name,
                    })
                }
                if (result.length > 0) {
                    resolve(
                        {
                            ER: 0,
                            message: "Get Bookings Success",
                            data: result
                        });
                }
                else {
                    resolve(
                        {
                            ER: 2,
                            message: "No booking found"
                        });
                }
            } else {
                resolve(
                    {
                        ER: 2,
                        message: "Patient not found or inactive"
                    });
                return;
            }
        } catch (error) {

        }
    })
}

const getScheduleForBookking = async (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.Schedule.findOne({
                where: { id: scheduleId }
            })
            if (!schedule) {
                resolve(
                    {
                        ER: 2,
                        message: "Schedule not found or inactive"
                    });
                return;
            }
            let doctor = await db.User.findOne({
                where: { id: schedule.doctorId, roleId: 2, isActive: true }
            })
            let doctorInfo = await db.DoctorInfo.findOne({
                where: { doctorId: schedule.doctorId }
            })
            let doctorUser = await db.DoctorUser.findOne({
                where: { doctorId: schedule.doctorId }
            })
            let clinic = await db.Clinic.findOne({
                where: { id: doctorUser.clinicId, isActive: true }
            })
            let specialties = await db.Specialties.findOne({
                where: { id: doctorUser.specialtiesId, isActive: true }
            })
            let timeType = await db.TimeType.findOne({
                where: { id: schedule.timeTypeId }
            })
            if (!doctor || !doctorInfo || !doctorUser || !clinic || !specialties || !timeType) {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not found or inactive"
                    });
                return;
            }
            resolve(
                {
                    ER: 0,
                    message: "Get Schedule Success",
                    data: {
                        doctorName: doctor.name,
                        doctorImage: doctor.image,
                        clinicName: clinic.name,
                        clinicAddress: clinic.address,
                        specialtiesName: specialties.name,
                        date: convertFormatDate(schedule.date),
                        timeTypeName: timeType.name,
                        qualification: doctorInfo.qualification,
                        price: doctorInfo.price
                    }
                })

        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    createBooking,
    cancelBooking,
    getBookingAPatient,
    getScheduleForBookking
}