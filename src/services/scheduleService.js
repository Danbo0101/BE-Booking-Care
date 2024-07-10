import db from "../models/index";
import compareDate from "../utils/compareDate";
import checkStatusSchedule from "../utils/checkStatusSchedule";


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
                let isExistSchedule = await db.Schedule.findOne({
                    where: { doctorId: +doctorId, timeTypeId: +data.timeTypeId, date: new Date(data.date) }
                })
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
                    maxNumber: +data.maxNumber
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

const getADoctorSchedule = async (queryString, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorId = queryString.doctorId;
            let date = new Date(data.date);
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
                        let checkStatus = await checkStatusSchedule(item.id);
                        console.log(checkStatus);
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

module.exports = {
    createSchedule,
    getADoctorSchedule
}