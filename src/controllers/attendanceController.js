'use strict';

import { markAttendance, getAttendanceByDate, checkDoctorAttendance, getAllDoctorNotMarkToday } from '../services/attendanceService';

// Ghi nhận điểm danh cho bác sĩ
const markAttendanceController = async (req, res) => {
    const { doctorId } = req.body;
    // console.log(doctorId)

    try {
        const attendance = await markAttendance(doctorId);
        console.log(attendance)
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Lấy danh sách điểm danh theo ngày
const getAttendanceByDateController = async (req, res) => {
    const { date } = req.params;

    try {
        const attendances = await getAttendanceByDate(date);
        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Kiểm tra điểm danh của bác sĩ
const checkDoctorAttendanceController = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const isPresent = await checkDoctorAttendance(doctorId);
        res.status(200).json({ isPresent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getDoctorNotMarkToday = async (req, res) => {

    let result = await getAllDoctorNotMarkToday();
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

export {
    markAttendanceController,
    getAttendanceByDateController,
    checkDoctorAttendanceController,
    getDoctorNotMarkToday
};
