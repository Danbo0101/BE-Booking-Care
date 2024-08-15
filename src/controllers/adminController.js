const express = require('express');
const { createDoctor, getDoctors, updateDoctor, deleteADoctor, assignDoctor, getDoctorAssign,
    updateAssignDoctor, getDoctorForSpecialties, getDoctorForClinic, getADoctorClinicSpecialties } = require('../services/doctorService');
const { createClinic, getClinic, updateClinic, deleteAClinic, getAClinicInfo } = require('../services/clinicService');
const { createSpecialties, getSpecialties, updateSpecialties, deleteASpecialties, getASpecialtiesInfo } = require('../services/specialtiesService');
const { createSchedule, getADoctorScheduleBooking, deleteAllDoctorSchedule, updateDoctorSchedule,
    getScheduleDetail, getAllDotorSchedules, getTimeType } = require('../services/scheduleService');
const { doctorReport, clinicReport, specialtiesReport } = require("../services/reportService")

const postCreateDoctor = async (req, res) => {

    let image = req.files.image.data;

    let result = await createDoctor(req.body, image);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getAllDoctorPaginate = async (req, res) => {

    let result = await getDoctors(req.query);

    // console.log(result);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {},
        totalPage: result.totalPage
    })

}

const putUpdateDoctor = async (req, res) => {

    // let image = req.files.image.data;
    let id = req.query.id;
    if (!id) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }
    let result = await updateDoctor(id, req.body, req.files);

    // console.log(result);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const deleteDoctor = async (req, res) => {
    let id = req.query.id;

    let result = await deleteADoctor(id);
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const postCreateClinic = async (req, res) => {

    let result = await createClinic(req.body, req.files);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })

}

const getAllClinicPaginate = async (req, res) => {

    let result = await getClinic(req.query);

    // console.log(result);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {},
        totalPage: result.totalPage ? result.totalPage : 0
    })
}

const getClinicInfo = async (req, res) => {
    let clinicId = req.query.clinicId;

    if (!clinicId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await getAClinicInfo(clinicId);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const putUpdateClinic = async (req, res) => {

    let id = req.query.id;

    let result = await updateClinic(id, req.body, req.files)


    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const deleteClinic = async (req, res) => {

    let id = req.query.id;

    let result = await deleteAClinic(id);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const postCreateSpecialties = async (req, res) => {

    let result = await createSpecialties(req.body, req.files);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getAllSpecialtiesPaginate = async (req, res) => {

    let result = await getSpecialties(req.query)

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {},
        totalPage: result.totalPage ? result.totalPage : 0
    })
}

const getSpecialtiesInfo = async (req, res) => {
    let specialtiesId = req.query.specialtiesId;

    if (!specialtiesId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await getASpecialtiesInfo(specialtiesId);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const putUpdateSpecialties = async (req, res) => {
    let id = req.query.id;


    let result = await updateSpecialties(id, req.body, req.files)

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const deleteSpecialties = async (req, res) => {

    let id = req.query.id;
    let result = await deleteASpecialties(id)

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const postAssignDoctor = async (req, res) => {

    let result = await assignDoctor(req.body);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })

}

const getAssignDoctor = async (req, res) => {
    let doctorId = req.query.doctorId;
    let result = await getDoctorAssign(doctorId);
    console.log(result)
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const putUpdateAssignDoctor = async (req, res) => {
    let id = req.query.doctorId;
    let result = await updateAssignDoctor(id, req.body);
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const postCreateSchedule = async (req, res) => {

    let doctorId = req.query.doctorId;
    let result = await createSchedule(doctorId, req.body);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getADoctorSchedule = async (req, res) => {


    let result = await getADoctorScheduleBooking(req.query);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })

}

const getDoctorForSpecialtiesPaginate = async (req, res) => {

    let specialtiesId = req.query.specialtiesId;

    if (!specialtiesId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await getDoctorForSpecialties(specialtiesId)

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getDoctorForClinicPaginate = async (req, res) => {
    let clinicId = req.query.clinicId;

    console.log(clinicId)

    if (!clinicId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await getDoctorForClinic(clinicId)

    console.log(result)

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getDoctorClinicSpecialties = async (req, res) => {
    let doctorId = req.query.doctorId;

    if (!doctorId) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await getADoctorClinicSpecialties(doctorId)
    // let test = result.data
    // console.log(test.doctor.name)
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const deleteDoctorSchedule = async (req, res) => {
    let doctorId = req.query.doctorId;

    let result = await deleteAllDoctorSchedule(doctorId, req.body);
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const putUpdateDoctorSchedule = async (req, res) => {
    let scheduleId = req.query.scheduleId;
    let result = await updateDoctorSchedule(scheduleId, req.body);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getDoctorScheduleDetail = async (req, res) => {
    let scheduleId = req.query.scheduleId;
    let result = await getScheduleDetail(scheduleId);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getAllDoctorSchedule = async (req, res) => {

    let result = await getAllDotorSchedules(req.query);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getAllTimeType = async (req, res) => {
    let result = await getTimeType();

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getDoctorReport = async (req, res) => {
    let doctorId = req.query.doctorId;
    let month = req.query.month;
    let year = req.query.year;

    if (!doctorId || !month || !year) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await doctorReport(doctorId, month, year);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getClinicReport = async (req, res) => {
    let clinicId = req.query.clinicId;
    let month = req.query.month;
    let year = req.query.year;

    if (!clinicId || !month || !year) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await clinicReport(clinicId, month, year);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const getSpecialtiesReport = async (req, res) => {
    let specialtiesId = req.query.specialtiesId;
    let month = req.query.month;
    let year = req.query.year;

    if (!specialtiesId || !month || !year) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await specialtiesReport(specialtiesId, month, year);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}





module.exports = {
    postCreateDoctor,
    getAllDoctorPaginate,
    putUpdateDoctor,
    deleteDoctor,
    postCreateClinic,
    getAllClinicPaginate,
    getClinicInfo,
    putUpdateClinic,
    deleteClinic,
    postCreateSpecialties,
    getAllSpecialtiesPaginate,
    putUpdateSpecialties,
    deleteSpecialties,
    postAssignDoctor,
    putUpdateAssignDoctor,
    postCreateSchedule,
    getADoctorSchedule,
    getDoctorForSpecialtiesPaginate,
    getDoctorForClinicPaginate,
    getDoctorClinicSpecialties,
    getAssignDoctor,
    deleteDoctorSchedule,
    putUpdateDoctorSchedule,
    getDoctorScheduleDetail,
    getAllDoctorSchedule,
    getAllTimeType,
    getSpecialtiesInfo,
    getDoctorReport,
    getClinicReport,
    getSpecialtiesReport
}