import db from "../models/index";
import compareDate from "../utils/compareDate";
import checkStatusSchedule from "../utils/checkStatusSchedule";
import sendEmail from "../middleware/sendEmail";
import convertFormatDate from "../utils/convertFormatDate";

const createSchedule = async (doctorId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //validate
            if (!doctorId) {
                resolve(
                    {
                        ER: 1,
                        message: "Input doctor id"
                    });
                return;
            }
            let isExistDoctor = await db.User.findOne({
                where: { id: doctorId, roleId: 2, isActive: true }
            })
            if (!isExistDoctor) {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not found or inactive"
                    });
                return;
            }
            let isExistDoctorUser = await db.DoctorUser.findOne({
                where: { doctorId: doctorId }
            })

            if (!isExistDoctorUser) {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not assigned yet"
                    });
                return;
            } else {
                let isExistClinic = await db.Clinic.findOne({
                    where: { id: isExistDoctorUser.clinicId, isActive: true }
                })
                let isExistSpecialties = await db.Specialties.findOne({
                    where: { id: isExistDoctorUser.specialtiesId, isActive: true }
                })
                if (!isExistClinic || !isExistSpecialties) {
                    resolve(
                        {
                            ER: 2,
                            message: "Clinic or specialties not found or inactive"
                        });
                    return;
                }
                if (!compareDate(data.date)) {
                    resolve(
                        {
                            ER: 2,
                            message: "Invalid date"
                        });
                    return;
                }
                console.log(data.date)
                let isExistSchedule = await db.Schedule.findOne({
                    where: { doctorId: +doctorId, timeTypeId: +data.timeTypeId, date: new Date(data.date) }
                })
                console.log(isExistSchedule);
                if (isExistSchedule) {
                    resolve(
                        {
                            ER: 2,
                            message: "Doctor Schedule already exists"
                        });
                    return;
                }

                let dataCreateSchedule = {
                    doctorId: doctorId,
                    timeTypeId: data.timeTypeId,
                    statusId: 1,
                    date: new Date(data.date),
                    maxNumber: +data.maxNumber - data.bookedNumber
                }

                let createSchedule = await db.Schedule.create(dataCreateSchedule);
                if (createSchedule) {
                    resolve(
                        {
                            ER: 0,
                            message: "Create schedule success",
                            data: createSchedule
                        });
                }
                else {
                    resolve(
                        {
                            ER: 3,
                            message: "Create schedule failed"
                        });
                }


            }
        } catch (error) {

        }
    })

}

const getADoctorScheduleBooking = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorId = queryString.doctorId;
            let date = new Date(queryString.date);
            if (!doctorId || !date) {
                resolve(
                    {
                        ER: 1,
                        message: "Input doctor id and date"
                    });
                return;
            }
            let isExistDoctor = await db.User.findOne({
                where: { id: +doctorId, roleId: 2, isActive: true }
            })

            if (!isExistDoctor) {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not found or inactive"
                    });
                return;
            }
            else {
                let scheduleDoctor = await db.Schedule.findAll({
                    where: { doctorId: +doctorId, date }
                });

                if (scheduleDoctor.length > 0) {

                    let updatedSchedules = [];

                    let currentTime = new Date();

                    for (let item of scheduleDoctor) {
                        // console.log(1)
                        let checkStatus = await checkStatusSchedule(item.id);
                        // console.log(checkStatus);
                        if (!checkStatus) {
                            continue;
                        }
                        let timeType = await db.TimeType.findOne({
                            where: { id: item.timeTypeId }
                        });

                        if (timeType) {
                            let [hours, minutes, seconds] = timeType.time.split(':');
                            let scheduleTime = date.setUTCHours(hours, minutes, seconds);
                            // console.log('Current Time:', currentTime);
                            // console.log('Schedule Time:', scheduleTime);

                            if (currentTime < scheduleTime) {
                                updatedSchedules.push({
                                    ...item,
                                    timeTypeName: timeType.name
                                });
                            }
                        }
                    }

                    if (updatedSchedules) {
                        resolve(
                            {
                                ER: 0,
                                message: "Get schedule success",
                                data: updatedSchedules
                            });
                    }
                    else {
                        resolve(
                            {
                                ER: 3,
                                message: "Get schedule failed"
                            });
                    }
                }
                else {
                    resolve(
                        {
                            ER: 2,
                            message: "Schedule not found"
                        });
                    return;
                }

            }

        } catch (error) {

        }
    })
}

const updateStatus = async (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.Schedule.findOne({
                where: { id: scheduleId }
            })
            if (schedule && schedule.currentNumber === schedule.maxNumber) {
                let updateStatusSchedule = await db.Schedule.update({
                    statusId: 2
                },
                    { where: { id: scheduleId } }
                )
                if (updateStatusSchedule) {
                    resolve(false);
                    return;
                }
            }
            else if (schedule && schedule.currentNumber < schedule.maxNumber) {
                let updateStatusSchedule = await db.Schedule.update({
                    statusId: 1
                },
                    { where: { id: scheduleId } }
                )
                if (updateStatusSchedule) {
                    resolve(true);
                    return;
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

const deleteAllDoctorSchedule = async (doctorId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve(
                    {
                        ER: 1,
                        message: "Input doctor id"
                    });
                return;
            }
            if (!data) {
                resolve(
                    {
                        ER: 1,
                        message: "Input date"
                    });
                return;
            }
            let isScheduleDoctorExist = await db.Schedule.findOne({
                where: { doctorId, date: new Date(data.date) }

            })

            if (isScheduleDoctorExist) {
                let deleteScheduleDoctor = await db.Schedule.destroy({
                    where: { doctorId, date: new Date(data.date) }
                })
                if (deleteScheduleDoctor) {
                    resolve(
                        {
                            ER: 0,
                            message: "Delete schedule success"
                        });
                }
                else {
                    resolve(
                        {
                            ER: 3,
                            message: "Delete schedule failed"
                        });
                }
            }
            else {
                resolve(
                    {
                        ER: 2,
                        message: "Schedule not found"
                    });
                return;
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateDoctorSchedule = async (scheduleId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!scheduleId) {
                resolve(
                    {
                        ER: 1,
                        message: "Input schedule id"
                    });
                return;
            }
            let isExistSchedule = await db.Schedule.findOne({
                where: { id: scheduleId }
            })
            if (isExistSchedule.statusId === 5 || isExistSchedule.statusId === 6) {
                resolve(
                    {
                        ER: 2,
                        message: "Schedule not found or already cancelled"
                    });
                return;
            }

            if (data.statusId) {
                let doctor = await db.User.findOne({
                    where: { id: isExistSchedule.doctorId, isActive: true, roleId: 2 }
                })
                if (!doctor) {
                    resolve(
                        {
                            ER: 2,
                            message: "Doctor not found or inactive"
                        });
                    return;
                }

                let allBooking = await db.Booking.findAll({
                    where: { scheduleId }
                })


                const fetchEmails = async () => {
                    let listEmail = [];
                    for (let item of allBooking) {
                        let patient = await db.User.findOne({
                            where: { id: item.patientId }
                        });
                        listEmail.push(patient.email);
                    }
                    return listEmail.join(',');
                };

                let date = new Date(isExistSchedule.date);
                let formattedDate = date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear();

                fetchEmails().then(listEmailPatient => {
                    console.log(listEmailPatient);
                    sendEmail(listEmailPatient, "Cancel Booking", doctor.name, formattedDate, "", "")
                }).catch(error => {
                    console.error("Error fetching emails:", error);
                });

                let updateSchedule = await db.Schedule.update(
                    { statusId: 5 },
                    { where: { id: scheduleId } }
                )

                let updasteBooking = await db.Booking.update(
                    { statusId: 5 },
                    { where: { scheduleId } }
                )

                if (updateSchedule && updasteBooking) {
                    resolve(
                        {
                            ER: 0,
                            message: "Cancel booking success"
                        });
                }
                else {
                    resolve(
                        {
                            ER: 3,
                            message: "Cancel booking failed"
                        });
                }

            } else if (data.maxNumber) {
                let updateSchedule = await db.Schedule.update(
                    { maxNumber: data.maxNumber },
                    { where: { id: scheduleId } }
                )
                if (updateSchedule) {
                    resolve(
                        {
                            ER: 0,
                            message: "Update schedule success"
                        });
                }
                else {
                    resolve(
                        {
                            ER: 3,
                            message: "Update schedule failed"
                        });
                }
            }
        } catch (error) {

        }
    })
}

const getScheduleDetail = async (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!scheduleId) {
                resolve(
                    {
                        ER: 1,
                        message: "Input schedule id"
                    });
                return;
            }

            let isExistSchedule = await db.Schedule.findOne({
                where: { id: scheduleId }
            })

            if (isExistSchedule) {
                let allBookingSchedule = await db.Booking.findAll({
                    where: { scheduleId }
                });

                let patientList = await Promise.all(allBookingSchedule.map(async (item) => {
                    let patient = await db.User.findOne({
                        where: { id: item.patientId }
                    });
                    return {
                        patientName: patient.name,
                        patientEmail: patient.email,
                        patientPhone: patient.phone,
                        statusBooking: item.statusId
                    };
                }));

                let dataTest = {
                    scheduleId: scheduleId,
                    date: convertFormatDate(isExistSchedule.date),
                    patientList: patientList
                }

                resolve({
                    ER: 0,
                    data: dataTest
                })

            } else {
                resolve(
                    {
                        ER: 2,
                        message: "Schedule not found"
                    });
                return;
            }
        } catch (error) {

        }
    })
}

const getAllDotorSchedules = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!queryString.doctorId) {
                resolve(
                    {
                        ER: 1,
                        message: "Input doctor id"
                    });
                return;
            }
            else if (!queryString.date) {
                resolve(
                    {
                        ER: 1,
                        message: "Input date"
                    });
                return;
            }

            let doctorId = queryString.doctorId;
            let date = new Date(queryString.date);
            let isExistDoctor = await db.User.findOne({
                where: { id: doctorId, isActive: true, roleId: 2 }
            })

            if (isExistDoctor) {
                let doctorSchedule = await db.Schedule.findAll({
                    where: { doctorId: +doctorId, date }
                })

                if (doctorSchedule.length > 0) {
                    let updatedSchedules = [];
                    for (let item of doctorSchedule) {
                        let checkStatus = await checkStatusSchedule(item.id);
                        let timeType = await db.TimeType.findOne({
                            where: { id: item.timeTypeId }
                        });
                        if (timeType) {
                            updatedSchedules.push({
                                ...item,
                                timeTypeName: timeType.name
                            })
                        }
                    }
                    resolve({
                        ER: 0,
                        data: updatedSchedules
                    })
                }
                else {
                    resolve(
                        {
                            ER: 0,
                            message: "Doctor has no schedule on this date",
                            data: ""
                        });
                    return;
                }
            } else {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not found or inactive"
                    });
                return;
            }
        } catch (error) {

        }
    })
}

const getTimeType = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let timeType = await db.TimeType.findAll();
            resolve({
                ER: 0,
                data: timeType
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createSchedule,
    getADoctorScheduleBooking,
    deleteAllDoctorSchedule,
    updateDoctorSchedule,
    getScheduleDetail,
    getAllDotorSchedules,
    getTimeType
}