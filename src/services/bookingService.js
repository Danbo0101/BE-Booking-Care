import { where } from "sequelize";
import db from "../models/index";
import checkStatusSchedule from "../utils/checkStatusSchedule";
import convertFormatDate from "../utils/convertFormatDate";

const createBooking = async (patientId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check khách hàng có tồn tại hay không
            let isExistPantient = await db.User.findOne({
                where: { id: patientId, roleId: 3, isActive: true }
            })
            if (!isExistPantient) {
                resolve(
                    {
                        ER: 2,
                        message: "Không tìm thấy khách hàng"
                    });
                return;
            }
            else {
                let checkSchedule = await db.Schedule.findOne({
                    where: { id: data.scheduleId }
                })
                if (checkSchedule) {
                    //kiểm tra trạng thái của lịch làm
                    let checkStatus = await checkStatusSchedule(checkSchedule.id)
                    if (!checkStatus) {
                        resolve(
                            {
                                ER: 2,
                                message: "Lịch không tồn tại"
                            });
                        return;
                    } else {
                        // kiểm tra lịch đặt có bị trùng thời gian hoặc bác sĩ hay không
                        let isExistTimeBooking = await checkTimeBooking(patientId, data.scheduleId);
                        let isExistDoctorBooking = await checkDoctorBooking(patientId, data.scheduleId);
                        if (isExistTimeBooking) {
                            resolve(
                                {
                                    ER: 2,
                                    message: "Bạn đã đặt trùng lịch khám"
                                });
                            return;
                        }
                        else if (isExistDoctorBooking) {
                            resolve(
                                {
                                    ER: 2,
                                    message: "Bạn đã đặt trùng bác sĩ"
                                });
                            return;
                        }
                        else {
                            // xử lý đặt lịch cho khách hàng
                            const statusId = data.consultationFee === data.feePaid ? 3 : 7;
                            // console.log(data.consultationFee === data.feePaid)
                            let createBooking = await db.Booking.create({
                                scheduleId: data.scheduleId,
                                patientId: patientId,
                                statusId: statusId
                            })

                            let createInvoices = await db.Invoice.create({
                                bookingId: createBooking.id,
                                bookingFee: data.bookingFee,
                                consultationFee: data.consultationFee,
                                feePaid: data.feePaid,
                                date: new Date()
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
                                        message: "Đặt lịch khám thành công",
                                        data: createBooking
                                    });
                            }
                            else {
                                resolve(
                                    {
                                        ER: 3,
                                        message: "Đặt lịch khám thất bại"
                                    });
                            }
                        }
                    }
                }
                else {
                    resolve(
                        {
                            ER: 2,
                            message: "Lịch làm không tồn tại"
                        });
                    return;
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const checkDoctorBooking = async (patientId, scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            //tìm tất cả lịch đã đặt của khách hàng 
            let bookingPatient = await db.Booking.findAll({
                where: { patientId }
            })
            // lọc ra các lịch booking đang ở trạng thái đã đặt hoặc đã thanh toán
            const filteredBookingPatients = bookingPatient.filter(booking =>
                booking.statusId === 3 || booking.statusId === 7
            );

            if (filteredBookingPatients.length > 0) {
                // tìm lịch làm của bác sĩ 
                let doctorBooking = await db.Schedule.findOne({
                    where: { id: +scheduleId }
                });

                let check = false;
                // lọc trong các lịch đặt của khách hàng
                for (const booking of filteredBookingPatients) {
                    // tìm lịch làm theo các lịch đặt
                    let doctorBooked = await db.Schedule.findOne({
                        where: { id: booking.scheduleId }
                    });

                    // so sáng bác sĩ có trùng hay không và ngày có trùng hay không
                    if (doctorBooked.doctorId === doctorBooking.doctorId &&
                        (doctorBooked.date).toString() === doctorBooking.date.toString()) {
                        //nếu có set biến check = true và trả về
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
            reject(error);
        }
    })
}

const checkTimeBooking = async (patientId, scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // tìm tất cả lịch đã đặt của khách hàng
            let bookingPatient = await db.Booking.findAll({
                where: { patientId }
            });
            // lọc ra các lịch booking đang ở trạng thái đã đặt hoặc đã thanh toán
            const filteredBookingPatients = bookingPatient.filter(booking =>
                booking.statusId === 3 || booking.statusId === 7
            );
            // console.log(scheduleId)
            if (filteredBookingPatients.length > 0) {
                // tìm lịch làm của bác sĩ
                let bookPatient = await db.Schedule.findOne({
                    where: { id: +scheduleId }
                });

                let check = false;

                for (const booking of filteredBookingPatients) {
                    // tìm lịch làm theo các lịch đặt
                    let bookedPatient = await db.Schedule.findOne({
                        where: { id: booking.scheduleId }
                    });
                    // so sánh thời gian và ngày có bị trùng hay không
                    if (bookedPatient.timeTypeId === bookPatient.timeTypeId &&
                        bookedPatient.date.toString() === bookPatient.date.toString()) {
                        // nếu có trả về true
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
            // kiểm tra id của khách hàng và id của booking có tồn tại không
            if (!patientId || !bookingId) {
                resolve(
                    {
                        ER: 1,
                        message: "Missing input parameter"
                    });
                return;
            }
            else {
                // xử lý huỷ lịch đặt
                let isExistBooking = await db.Booking.findOne({
                    where: { id: bookingId, patientId }
                })
                if (!isExistBooking) {
                    resolve(
                        {
                            ER: 2,
                            message: "Lịch đặt không tồn tại"
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
                                    message: "Huỷ lịch đặt thành công"
                                });
                        }

                    }
                    else {
                        resolve(
                            {
                                ER: 3,
                                message: "Huỷ lịch đặt thất bại"
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

                    let invoice = await db.Invoice.findOne({
                        where: { bookingId: booking.id }
                    })

                    console.log(invoice)
                    result.push({
                        bookingId: booking.id,
                        doctorName: doctor.name,
                        clinicName: clinic.name,
                        clinicAddress: clinic.address,
                        specialtiesName: specialties.name,
                        date: convertFormatDate(schedule.date),
                        timeTypeName: timeType.name,
                        statusName: status.name,
                        bookingFee: invoice.bookingFee,
                        cosultatioFee: invoice.consultationFee,
                        feePaid: invoice.feePaid,
                        dateFee: convertFormatDate(invoice.date)
                    })
                }
                if (result.length > 0) {
                    resolve(
                        {
                            ER: 0,
                            message: "Lấy lịch đặt thành công",
                            data: result
                        });
                }
                else {
                    resolve(
                        {
                            ER: 2,
                            message: "Không tìm thấy lịch đặt"
                        });
                }
            } else {
                resolve(
                    {
                        ER: 2,
                        message: "Khách hàng không tồn tại"
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

const bookingMonthly = async (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            let booking = await db.Booking.findAll();

            let data = await Promise.all(booking.map(async (item) => {
                let schedule = await db.Schedule.findOne({
                    where: { id: item.scheduleId }
                });
                return {
                    ...item,
                    date: schedule.date,
                };
            }));

            let monthlyBookings = Array(12).fill(0);

            data.forEach(item => {
                let month = item.date.getMonth();
                monthlyBookings[month] += 1;
            })

            resolve({
                ER: 0,
                data: monthlyBookings
            })
        } catch (error) {
            reject(error)
        }
    })
}

const bookingClinc = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinicActive = await db.Clinic.findAll({
                where: { isActive: true },
                attributes: ["id", "name"]
            })

            let data = await Promise.all(clinicActive.map(async (item) => {
                let doctors = await db.DoctorUser.findAll({
                    where: { clinicId: item.id },
                    attributes: ['doctorId']
                });

                let doctorIds = doctors.map(doctor => doctor.doctorId);

                return {
                    clinicName: item.name,
                    doctorIds: doctorIds
                };
            }));
            let clinicBookingCounts = [];

            for (let item of data) {
                let totalClinicBookings = 0;

                await Promise.all(item.doctorIds.map(async (doctorId) => {
                    let schedules = await db.Schedule.findAll({
                        where: { doctorId: doctorId }
                    });
                    schedules = schedules.filter(schedule => schedule.statusId !== 5);
                    let totalBookings = schedules.reduce((sum, schedule) => sum + schedule.currentNumber, 0);
                    totalClinicBookings += totalBookings;
                }));
                clinicBookingCounts.push({
                    label: item.clinicName,
                    value: totalClinicBookings
                });

                // console.log(`Clinic ${item.clinicId}:`, totalClinicBookings);
            }

            resolve({
                ER: 0,
                data: clinicBookingCounts
            })

        } catch (error) {

        }
    })
}

const bookingSpecialties = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialtiesActive = await db.Specialties.findAll({
                where: { isActive: true },
                attributes: ["id", "name"]
            });

            let data = await Promise.all(specialtiesActive.map(async (item) => {
                let doctors = await db.DoctorUser.findAll({
                    where: { specialtiesId: item.id },
                    attributes: ['doctorId']
                });

                let doctorIds = doctors.map(doctor => doctor.doctorId);

                return {
                    specialtiesName: item.name,
                    doctorIds: doctorIds
                };
            }));

            let specialtiesBookingCounts = [];

            for (let item of data) {
                let totalSpecialtiesBookings = 0;

                await Promise.all(item.doctorIds.map(async (doctorId) => {
                    let schedules = await db.Schedule.findAll({
                        where: { doctorId: doctorId }
                    });

                    schedules = schedules.filter(schedule => schedule.statusId !== 5);

                    let totalBookings = schedules.reduce((sum, schedule) => sum + schedule.currentNumber, 0);

                    totalSpecialtiesBookings += totalBookings;
                }));

                specialtiesBookingCounts.push({
                    label: item.specialtiesName,
                    value: totalSpecialtiesBookings
                });
            }

            resolve({
                ER: 0,
                data: specialtiesBookingCounts
            });

        } catch (error) {
            reject({
                ER: 1,
                message: error.message
            });
        }
    });
};

const bookingOfClinic = async (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: clinicId, isActive: true }
            });

            if (!clinic) {
                resolve({
                    ER: 2,
                    message: "Clinic not found or inactive"
                });
                return;
            }

            let doctors = await db.DoctorUser.findAll({
                where: { clinicId: clinicId },
                attributes: ['doctorId']
            });

            let doctorIds = doctors.map(doctor => doctor.doctorId);

            let totalClinicBookings = 0;
            let allBookings = [];

            let clinicDetail = await Promise.all(doctorIds.map(async (item) => {
                let doctor = await db.User.findOne({
                    where: { id: item, roleId: 2, isActive: true }
                });

                let doctorInfo = await db.DoctorInfo.findOne({
                    where: { doctorId: item }
                });

                let doctorUser = await db.DoctorUser.findOne({
                    where: { doctorId: item }
                });

                let specialties = await db.Specialties.findOne({
                    where: { id: doctorUser.specialtiesId, isActive: true }
                });

                let schedules = await db.Schedule.findAll({
                    where: { doctorId: item }
                });

                schedules = schedules.filter(schedule => schedule.statusId !== 5);

                let totalBookings = schedules.reduce((sum, schedule) => sum + schedule.currentNumber, 0);
                totalClinicBookings += totalBookings;

                let bookings = await Promise.all(schedules.map(async (schedule) => {
                    let bookings = await db.Booking.findAll({
                        where: { scheduleId: schedule.id },
                        attributes: ['id', 'scheduleId', 'patientId', 'statusId']
                    });

                    bookings = bookings.filter(booking => booking.statusId !== 5);

                    return Promise.all(bookings.map(async (booking) => {
                        let patient = await db.User.findOne({
                            where: { id: booking.patientId }
                        });

                        return {
                            id: booking.id,
                            patientName: patient.name,
                            patientEmail: patient.email,
                            patientPhone: patient.phone,
                            doctorName: doctor.name,
                            specialtiesName: specialties.name,
                            qualification: doctorInfo.qualification,
                            price: doctorInfo.price
                        };
                    }));
                }));

                bookings = bookings.flat();
                allBookings.push(...bookings);

                return {
                    totalClinicBookings,
                    bookings: allBookings
                };
            }));

            resolve({
                ER: 0,
                data: {
                    totalClinicBookings,
                    bookings: allBookings
                }
            });

        } catch (error) {
            reject(error)
        }
    })
}

const bookingOfSpecialties = async (specialtiesId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialties.findOne({
                where: { id: specialtiesId, isActive: true }
            });

            if (!specialties) {
                resolve({
                    ER: 2,
                    message: "Specialties not found or inactive"
                });
                return;
            }

            let doctors = await db.DoctorUser.findAll({
                where: { specialtiesId: specialtiesId },
                attributes: ['doctorId']
            });

            let doctorIds = doctors.map(doctor => doctor.doctorId);

            let totalClinicBookings = 0;
            let allBookings = [];

            let scpecialtiesDetail = await Promise.all(doctorIds.map(async (item) => {
                let doctor = await db.User.findOne({
                    where: { id: item, roleId: 2, isActive: true }
                });

                let doctorInfo = await db.DoctorInfo.findOne({
                    where: { doctorId: item }
                });

                let doctorUser = await db.DoctorUser.findOne({
                    where: { doctorId: item }
                });

                let clinic = await db.Clinic.findOne({
                    where: { id: doctorUser.clinicId, isActive: true }
                });

                let schedules = await db.Schedule.findAll({
                    where: { doctorId: item }
                });

                schedules = schedules.filter(schedule => schedule.statusId !== 5);

                let totalBookings = schedules.reduce((sum, schedule) => sum + schedule.currentNumber, 0);
                totalClinicBookings += totalBookings;

                let bookings = await Promise.all(schedules.map(async (schedule) => {
                    let bookings = await db.Booking.findAll({
                        where: { scheduleId: schedule.id },
                        attributes: ['id', 'scheduleId', 'patientId', 'statusId']
                    });

                    bookings = bookings.filter(booking => booking.statusId !== 5);

                    return Promise.all(bookings.map(async (booking) => {
                        let patient = await db.User.findOne({
                            where: { id: booking.patientId }
                        });

                        return {
                            id: booking.id,
                            patientName: patient.name,
                            patientEmail: patient.email,
                            patientPhone: patient.phone,
                            doctorName: doctor.name,
                            clinic: clinic.name,
                            qualification: doctorInfo.qualification,
                            price: doctorInfo.price
                        };
                    }));
                }));

                bookings = bookings.flat();
                allBookings.push(...bookings);

                return {
                    totalClinicBookings,
                    bookings: allBookings
                };
            }));

            resolve({
                ER: 0,
                data: {
                    totalClinicBookings,
                    bookings: allBookings
                }
            });

        } catch (error) {
            reject(error)
        }
    })
}

const AllBookings = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let bookings = await db.Booking.findAll();

            resolve({
                ER: 0,
                data: bookings
            });

        } catch (error) {
            reject(error)
        }
    })
}



module.exports = {
    createBooking,
    cancelBooking,
    getBookingAPatient,
    getScheduleForBookking,
    bookingMonthly,
    bookingClinc,
    bookingSpecialties,
    bookingOfClinic,
    bookingOfSpecialties,
    AllBookings,
    checkDoctorBooking,
    checkTimeBooking
}