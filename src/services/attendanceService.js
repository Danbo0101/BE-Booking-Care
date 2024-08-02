'use strict';
import sendEmail from '../middleware/sendEmail';
import db from '../models/index';
const { Op } = require('sequelize');

const markAttendance = async (doctorId) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const doctorExists = await db.DoctorUser.findOne({
            where: { doctorId: doctorId }
        });
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
        console.error('Error marking attendance:', error);
        throw new Error('Could not mark attendance');
    }
}

const getAttendanceByDate = async (date) => {
    try {
        return await db.Attendance.findAll({
            where: {
                date
            },
            include: [
                {
                    model: db.DoctorUser,
                    as: 'doctor',
                    attributes: ['doctorId', 'clinicId', 'specialtiesId']
                }
            ]
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw new Error('Could not fetch attendance');
    }
}

const checkDoctorAttendance = async (doctorId) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const attendance = await db.Attendance.findOne({
            where: {
                doctorId,
                date: today
            }
        });

        return attendance ? attendance.isPresent : false;
    } catch (error) {
        console.error('Error checking doctor attendance:', error);
        throw new Error('Could not check doctor attendance');
    }
}

const getAllDoctorNotMarkToday = async () => {
    return new Promise(async (resolve, reject) => {
        try {

            let allDoctors = await db.User.findAll({
                where: { roleId: 2, isActive: true },
                attributes: ['id', 'name', 'email', 'phone']
            });

            let currentDate = new Date();
            let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            let endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
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
                    message: "Get doctor not mark today success",
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
    getAttendanceByDate,
    checkDoctorAttendance,
    getAllDoctorNotMarkToday
};
