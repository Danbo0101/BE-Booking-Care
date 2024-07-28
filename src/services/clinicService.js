import { where } from "sequelize";
import db from "../models/index";


const createClinic = async (data, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataCreate = {
                name: data.name,
                address: data.address,
                description: data.description,
            }
            if (file && file.image && file.image.data) {
                dataCreate.image = file.image.data;
            }
            let clinic = await db.Clinic.create(dataCreate);
            resolve({
                ER: 0,
                message: "Clinic created successfully",
                data: clinic
            });
        } catch (error) {
            reject(error);
        }
    })
}

const getClinic = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        try {
            let limit = queryString.limit;
            let page = queryString.page;
            let offset = (page - 1) * limit;



            if (!limit && !page) {
                let clinics = await db.Clinic.findAll({
                    where: { isActive: true }
                });
                resolve({
                    ER: 0,
                    message: "Get all clinics successfully",
                    data: clinics
                })
            }
            else {

                let clinics = await db.Clinic.findAndCountAll({
                    where: { isActive: true },
                    limit: +limit,
                    offset: offset,
                });

                let totalPage = Math.ceil(clinics.count / limit);
                clinics = clinics.rows;
                resolve({
                    ER: 0,
                    message: "Get clinics paginate successfully",
                    data: clinics,
                    totalPage
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

const updateClinic = async (id, data, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    ER: 1,
                    message: "Id is required"
                })
            }
            else {

                let isExist = await db.Clinic.findOne({
                    where: { id }
                })
                if (!isExist) {
                    resolve({
                        ER: 2,
                        message: "Clinic not found"
                    });
                    return;
                }
                else {
                    let dataUpdate = {}

                    if (data) {
                        dataUpdate.name = data.name;
                        dataUpdate.address = data.address;
                        dataUpdate.description = data.description;
                    }


                    if (file && file.image && file.image.data) {
                        dataUpdate.image = file.image.data;
                    }


                    let clinic = await db.Clinic.update(dataUpdate, {
                        where: { id }
                    });

                    resolve({
                        ER: 0,
                        message: "Clinic updated successfully",
                    })
                }
            }
        }

        catch (error) {
            reject(error);
        }
    })
}

const deleteAClinic = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    ER: 1,
                    message: "Id is required"
                })
            }
            else {
                let isExist = await db.Clinic.findOne({
                    where: { id }
                })
                if (!isExist) {
                    resolve({
                        ER: 2,
                        message: "Clinic not found"
                    });
                    return;
                }
                else {
                    let clinic = await db.Clinic.update({ isActive: false }, {
                        where: { id }
                    });

                    let doctorUser = await db.DoctorUser.destroy({
                        where: { clinicId: id }
                    })

                    if (clinic || doctorUser) {
                        resolve({
                            ER: 0,
                            message: "Clinic deleted successfully",
                        })
                    }
                    else {
                        resolve({
                            ER: 1,
                            message: "Error when delete clinic"
                        })
                    }


                }
            }
        } catch (error) {

        }
    })
}

const getAClinicInfo = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            let clinic = await db.Clinic.findOne({
                where: { id }
            });
            if (!clinic) {
                resolve({
                    ER: 2,
                    message: "Clinic not found"
                });
                return;
            }
            else {
                resolve({
                    ER: 0,
                    message: "Get clinic info successfully",
                    data: clinic
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    createClinic,
    getClinic,
    updateClinic,
    deleteAClinic,
    getAClinicInfo
}