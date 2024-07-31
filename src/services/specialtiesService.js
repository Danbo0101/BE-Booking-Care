import db from "../models/index";


const createSpecialties = async (data, file) => {
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
                let dataCreate = {
                    name: data.name,
                    description: data.description,
                }

                if (file && file.image && file.image.data) {
                    dataCreate.image = file.image.data;
                }
                let specialties = await db.Specialties.create(dataCreate)
                if (specialties) {

                    resolve({
                        ER: 0,
                        message: "Specialties created successfully",
                        data: specialties
                    })
                }
                else {
                    resolve({
                        ER: 1,
                        message: "Failed to create specialties"
                    })
                }

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
                let totalPage = Math.ceil(specialties.count / limit)
                specialties = specialties.rows;
                resolve({
                    ER: 0,
                    message: "Get specialties paginate successfully",
                    data: specialties,
                    totalPage
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateSpecialties = async (id, data, file) => {
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
                    let dataUpdate = {};
                    if (data) {
                        dataUpdate.name = data.name;
                        dataUpdate.description = data.description;
                    }

                    if (file && file.image && file.image.data) {
                        dataUpdate.image = file.image.data;
                    }

                    try {
                        console.log('Data to update:', dataUpdate);
                        console.log('ID:', id);

                        let specialties = await db.Specialties.update(dataUpdate, {
                            where: { id: id }
                        });

                        if (specialties) {
                            resolve({
                                ER: 0,
                                message: "Specialties updated successfully",
                            })
                        }
                        else {
                            resolve({
                                ER: 3,
                                message: "Specialties updated failed",
                            })
                        }

                    } catch (error) {
                        console.error('Error updating specialties:', error);
                    }


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

                    let allDoctor = await db.DoctorUser.findAll({
                        where: { specialtiesId: id }
                    })


                    if (!allDoctor) {
                        let dataDelete = await db.Specialties.update(
                            {
                                isActive: false
                            },
                            {
                                where: { id: id }
                            }
                        )
                        resolve(
                            {
                                ER: 0,
                                message: "Xoá chuyên khoa thành công"
                            });
                        return;
                    }

                    for (let item in allDoctor) {

                        let scheduleDoctor = await db.Schedule.findAll({
                            where: { doctorId: allDoctor[item].doctorId, statusId: 1 }
                        })


                        let isExistBooking = 0;
                        for (let item in scheduleDoctor) {
                            let booking = await db.Booking.findAll({
                                where: { scheduleId: scheduleDoctor[item].id, statusId: 3 }
                            })

                            if (booking) {
                                isExistBooking = 1;
                            }
                        }

                        if (isExistBooking = 1) {
                            resolve(
                                {
                                    ER: 3,
                                    message: "Không thể xoá chuyên khoa này vì đã có lịch đang đặt trước"
                                });
                            return;
                        }
                        else {
                            let dataDelete = await db.Specialties.update(
                                {
                                    isActive: false
                                },
                                {
                                    where: { id: id }
                                }
                            )
                            let doctorUser = await db.DoctorUser.destoy({
                                where: { specialtiesId: id }
                            })
                            resolve(
                                {
                                    ER: 0,
                                    message: "Xoá chuyên khoa thành công"
                                });
                        }


                    }

                }
            }
        } catch (error) {

        }
    })
}

const getASpecialtiesInfo = async (specialtiesId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialties.findOne({
                where: { id: specialtiesId }
            })
            if (specialties) {
                resolve({
                    ER: 0,
                    message: "Get specialties info successfully",
                    data: specialties
                })
            }
            else {
                resolve({
                    ER: 2,
                    message: "Specialties not found"
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createSpecialties,
    getSpecialties,
    updateSpecialties,
    deleteASpecialties,
    getASpecialtiesInfo
}