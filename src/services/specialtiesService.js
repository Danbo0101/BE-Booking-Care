import db from "../models/index";


const createSpecialties = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await db.Specialties.findOne({
                where: { name: data.name }
            })
            if (isExist) {
                resolve({
                    ER: 1,
                    message: "Specialties already exists"
                })
                return;
            }
            else {
                let specialties = await db.Specialties.create({
                    name: data.name,
                    description: data.description,
                })
                resolve({
                    ER: 0,
                    message: "Specialties created successfully",
                    data: specialties
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

const getSpecialties = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        try {
            let limit = queryString.limit;
            let page = queryString.page;
            let offset = (page - 1) * limit;
            if (!page && !limit) {
                let specialties = await db.Specialties.findAll({
                    where: { isActive: true }
                });
                resolve({
                    ER: 0,
                    message: "Get all specialties successfully",
                    data: specialties
                });
            }
            else {
                let specialties = await db.Specialties.findAndCountAll({
                    where: { isActive: true },
                    limit: +limit,
                    offset: offset,
                });
                specialties = specialties.rows;
                resolve({
                    ER: 0,
                    message: "Get specialties paginate successfully",
                    data: specialties
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateSpecialties = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    ER: 1,
                    message: "Id is required"
                })
            }
            else {
                let isExist = await db.Specialties.findOne({
                    where: { id }
                })
                if (!isExist) {
                    resolve({
                        ER: 2,
                        message: "Specialties not found"
                    });
                    return;
                }
                else {
                    let specialties = await db.Specialties.update(
                        {
                            name: data.name,
                            description: data.description,
                        }
                        ,
                        {
                            where: { id }
                        });

                    if (specialties) {
                        resolve({
                            ER: 0,
                            message: "Specialties updated successfully",
                        })
                    }
                    resolve({
                        ER: 3,
                        message: "Specialties updated failed",
                    })
                }
            }
        } catch (error) {

        }
    })
}

const deleteASpecialties = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    ER: 1,
                    message: "Id is required"
                })
            }
            else {
                let isExist = await db.Specialties.findOne({
                    where: { id }
                })
                if (!isExist) {
                    resolve({
                        ER: 2,
                        message: "Specialties not found"
                    });
                    return;
                }
                else {
                    let specialties = await db.Specialties.update(
                        {
                            isActive: false
                        },
                        {
                            where: { id }
                        });

                    if (specialties) {
                        resolve({
                            ER: 0,
                            message: "Specialties deleted successfully",
                        })
                    }
                    resolve({
                        ER: 3,
                        message: "Specialties deleted failed",
                    })
                }
            }
        } catch (error) {

        }
    })
}

module.exports = {
    createSpecialties,
    getSpecialties,
    updateSpecialties,
    deleteASpecialties
}