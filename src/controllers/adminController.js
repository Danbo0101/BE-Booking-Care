const express = require('express');
const { createDoctor, getDoctors, updateDoctor, deleteADoctor, assignDoctor, updateAssignDoctor, getDoctorForSpecialties } = require('../services/doctorService');
const { createClinic, getClinic, updateClinic, deleteAClinic } = require('../services/clinicService');
const { createSpecialties, getSpecialties, updateSpecialties, deleteASpecialties } = require('../services/specialtiesService');
const { createSchedule, getADoctorSchedule } = require('../services/scheduleService');


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
        data: result.data ? result.data : {}
    })

}

const putUpdateDoctor = async (req, res) => {

    // let image = req.files.image.data;
    let id = req.query.id;
    console.log(id)
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

    let result = await createSpecialties(req.body);

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
        data: result.data ? result.data : {}
    })
}

const putUpdateSpecialties = async (req, res) => {
    let id = req.query.id;
    let result = await updateSpecialties(id, req.body)

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

const getDoctorSchedule = async (req, res) => {

    let result = await getADoctorSchedule(req.query, req.body);

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



module.exports = {
    postCreateDoctor,
    getAllDoctorPaginate,
    putUpdateDoctor,
    deleteDoctor,
    postCreateClinic,
    getAllClinicPaginate,
    putUpdateClinic,
    deleteClinic,
    postCreateSpecialties,
    getAllSpecialtiesPaginate,
    putUpdateSpecialties,
    deleteSpecialties,
    postAssignDoctor,
    putUpdateAssignDoctor,
    postCreateSchedule,
    getDoctorSchedule,
    getDoctorForSpecialtiesPaginate
}