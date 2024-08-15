'use strict';

import { markAttendance, getAllDoctorNotMarkToday } from '../services/attendanceService';

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
    getDoctorNotMarkToday
};
