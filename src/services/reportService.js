import db from "../models/index";
import convertFormatDate from "../utils/convertFormatDate";


const doctorReport = async (doctorId, month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: doctorId, isActive: true }
            })
            if (!doctor) {
                resolve({
                    ER: 2,
                    message: "Không tìm thấy bác sĩ"
                });
                return;
            }

            let doctorUser = await db.DoctorUser.findOne({
                where: { doctorId }
            })

            if (doctorUser) {
                let doctorSchedule = await db.Schedule.findAll({
                    where: { doctorId }
                })

                let scheduleNotCancel = doctorSchedule.filter(item => item.statusId !== 5);

                let scheduleOfMonth = scheduleNotCancel.filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate.getUTCMonth() === month - 1 && itemDate.getUTCFullYear() === +year;
                })

                let totalBookingOfMonth = 0;
                let patientList = [];
                for (let item in scheduleOfMonth) {
                    totalBookingOfMonth += scheduleOfMonth[item].currentNumber;

                    let bookingOfMonth = await db.Booking.findAll({
                        where: { scheduleId: scheduleOfMonth[item].id }
                    })

                    let bookingNotCancel = bookingOfMonth.filter(item => item.statusId !== 4);
                    for (let booking of bookingNotCancel) {
                        let patient = await db.User.findOne({
                            where: { id: booking.patientId }
                        })
                        patientList.push({
                            patientName: patient.name,
                            patientEmail: patient.email,
                            patientPhone: patient.phone,
                            date: convertFormatDate(scheduleOfMonth[item].date)
                        })
                    }
                }

                resolve({
                    ER: 0,
                    data: {
                        totalBookingOfMonth: totalBookingOfMonth,
                        patientList: patientList
                    }

                })



            } else {
                resolve({
                    ER: 1,
                    message: "Doctor not assign"
                })
                return;
            }



        } catch (error) {
            reject(error)
        }
    })
}

const clinicReport = async (clinicId, month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: clinicId, isActive: true }
            })

            if (!clinic) {
                resolve({
                    ER: 2,
                    message: "Không tìm thấy phòng khám"
                });
                return;
            }

            let doctorUser = await db.DoctorUser.findAll({
                where: { clinicId },
                attributes: ['doctorId', "specialtiesId"]
            })

            let dataDoctor = await Promise.all(doctorUser.map(async (item) => {
                let doctor = await db.User.findOne({
                    where: { id: item.doctorId },
                    attributes: ['id', 'name']
                });

                let qualification = await db.DoctorInfo.findOne({
                    where: { doctorId: item.doctorId },
                    attributes: ['qualification']
                })

                let specialties = await db.Specialties.findOne({
                    where: { id: item.specialtiesId },
                    attributes: ['name']
                })

                let scheduleDoctor = await db.Schedule.findAll({
                    where: { doctorId: doctor.id },
                });

                let filteredScheduleDoctor = scheduleDoctor.filter(schedule => schedule.statusId !== 5);

                let scheduleOfMonth = filteredScheduleDoctor.filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate.getUTCMonth() === month - 1 && itemDate.getUTCFullYear() === +year;
                })

                let totalBookingDoctor = 0;

                for (let schedule of scheduleOfMonth) {
                    totalBookingDoctor += schedule.currentNumber;
                }
                return {
                    doctorName: doctor.name,
                    qualificationDoctor: qualification.qualification,
                    specialtiesName: specialties.name,
                    totalBookingDoctor
                };
            }));

            let totalBookings = dataDoctor.reduce((sum, doctor) => sum + doctor.totalBookingDoctor, 0);

            resolve({
                ER: 0,
                data: {
                    totalBookings,
                    dataDoctor
                }
            })

        } catch (error) {
            reject(error)
        }
    })
}

const specialtiesReport = async (specialtiesId, month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialties.findOne({
                where: { id: specialtiesId, isActive: true }
            })

            if (!specialties) {
                resolve({
                    ER: 2,
                    message: "Không tìm thấy chuyên khoa"
                });
                return;
            }

            let doctorUser = await db.DoctorUser.findAll({
                where: { specialtiesId },
                attributes: ['doctorId', "clinicId"]
            })

            let dataDoctor = await Promise.all(doctorUser.map(async (item) => {
                let doctor = await db.User.findOne({
                    where: { id: item.doctorId },
                    attributes: ['id', 'name']
                });

                let qualification = await db.DoctorInfo.findOne({
                    where: { doctorId: item.doctorId },
                    attributes: ['qualification']
                })

                let clinic = await db.Clinic.findOne({
                    where: { id: item.clinicId },
                    attributes: ['name']
                })

                let scheduleDoctor = await db.Schedule.findAll({
                    where: { doctorId: doctor.id },
                });

                let filteredScheduleDoctor = scheduleDoctor.filter(schedule => schedule.statusId !== 5);

                let scheduleOfMonth = filteredScheduleDoctor.filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate.getUTCMonth() === month - 1 && itemDate.getUTCFullYear() === +year;
                })

                let totalBookingDoctor = 0;

                for (let schedule of scheduleOfMonth) {
                    totalBookingDoctor += schedule.currentNumber;
                }
                return {
                    doctorName: doctor.name,
                    qualificationDoctor: qualification.qualification,
                    clinicName: clinic.name,
                    totalBookingDoctor
                };
            }));

            let totalBookings = dataDoctor.reduce((sum, doctor) => sum + doctor.totalBookingDoctor, 0);

            resolve({
                ER: 0,
                data: {
                    totalBookings,
                    dataDoctor
                }
            })

        } catch (error) {
            reject(error)
        }
    })
}

export {
    doctorReport,
    clinicReport,
    specialtiesReport
}