'use strict';
import db from '../models/index';


const markAttendance = async (doctorId) => {
    try {
        //lấy ngày hiện tại
        const today = new Date().toISOString().split('T')[0];

        const doctorExists = await db.DoctorUser.findOne({
            where: { doctorId: doctorId }
        });
        //tìm kiếm và tạo mới điểm danh cho bác sĩ
        let result = await db.Attendance.findOrCreate({
            where: {
                doctorId,
                date: today
            },
            defaults: {
                isPresent: true
            }
        })
        return result;
    } catch (error) {
        console.log(error);
    }
}

const getAllDoctorNotMarkToday = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            // lấy danh sách tất cả bác sĩ
            let allDoctors = await db.User.findAll({
                where: { roleId: 2, isActive: true },
                attributes: ['id', 'name', 'email', 'phone']
            });
            // thiết lập date đầu ngày và cuối ngày hiện tại
            let currentDate = new Date();
            let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            let endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
            // kiểm tra các bác sĩ có lịch trong date đã điểm danh hay chưa
            let allSchedules = await db.Schedule.findAll({
                where: {
                    date: {
                        [db.Sequelize.Op.gte]: startDate,
                        [db.Sequelize.Op.lt]: endDate
                    },
                    statusId: 1
                }
            });

            let scheduledDoctorIds = allSchedules.map(schedule => schedule.doctorId);

            let attendances = await db.Attendance.findAll({
                where: {
                    date: {
                        [db.Sequelize.Op.gte]: startDate,
                        [db.Sequelize.Op.lt]: endDate
                    }
                }
            });

            let attendedDoctorIds = new Set(attendances.map(attendance => attendance.doctorId));

            let doctorsNotMarkedToday = allDoctors.filter(doctor => {
                return scheduledDoctorIds.includes(doctor.id) && !attendedDoctorIds.has(doctor.id);
            });

            resolve(
                {
                    ER: 0,
                    message: "Lấy danh sách các bác sĩ chưa điểm danh hôm nay thành công",
                    data: doctorsNotMarkedToday
                }
            )

        } catch (error) {
            reject(error)
        }
    })
}

export {
    markAttendance,
    getAllDoctorNotMarkToday
};
