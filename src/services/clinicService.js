import db from "../models/index";


const createClinic = async (data, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataCreate = {
                name: data.name,
                address: data.address,
                description: data.address,
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

            // console.log(limit, page, offset);

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
                console.log(limit, page, offset);
                let clinics = await db.Clinic.findAndCountAll({
                    where: { isActive: true },
                    limit: +limit,
                    offset: offset,
                });

                clinics = clinics.rows;

                resolve({
                    ER: 0,
                    message: "Get clinics paginate successfully",
                    data: clinics
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
                    let dataUpdate = {
                        name: data.name,
                        address: data.address,
                        description: data.description,
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

                    resolve({
                        ER: 0,
                        message: "Clinic deleted successfully",
                    })
                }
            }
        } catch (error) {

        }
    })
}


module.exports = {
    createClinic,
    getClinic,
    updateClinic,
    deleteAClinic
}