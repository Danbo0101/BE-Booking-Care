import hashPassword from "../utils/hashPassword";
import db from "../models/index";
import { where } from "sequelize";
const apq = require('api-query-params');


const createDoctor = async (data, image) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await db.User.findOne({
                where: { email: data.email }
            })
            if (isExist) {
                resolve(
                    {
                        ER: 1,
                        message: "Email already exists"
                    });
                return;
            }
            else {
                let passwordHash = await hashPassword(data.password);
                let newDoctor = await db.User.create({
                    name: data.name,
                    email: data.email,
                    password: passwordHash,
                    address: data.address,
                    gender: data.gender === 1 ? 'female' : 'male', // 0: male, 1: female
                    roleId: 2,
                    phone: data.phone,
                    image: image,
                })
                let doctorInfo = await db.DoctorInfo.create({
                    doctorId: newDoctor.id,
                    qualification: data.qualification,
                    price: data.price
                })
                let newDoctorData = newDoctor.toJSON();
                delete newDoctorData.password;
                delete newDoctorData.image;
                resolve({
                    ER: 0,
                    message: "Doctor created successfully",
                    data: { newDoctorData, doctorInfo }
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

const getDoctors = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        try {
            let page = queryString.page;
            let { filter, limit } = apq(queryString);
            let offset = (page - 1) * limit;
            if (!page && !limit) {
                let data = await db.User.findAll({
                    where: { roleId: 2, isActive: true },
                    attributes: ['id', 'name', 'image', 'email', 'address', 'gender', 'phone']
                });
                const doctors = await Promise.all(data.map(async (user) => {
                    const userDoctorInfo = await db.DoctorInfo.findOne({
                        where: { doctorId: user.id }
                    });

                    // Fetch doctor specialty for the user
                    const doctorSpecialty = await db.DoctorUser.findOne({
                        where: { doctorId: user.id }
                    });


                    // Fetch the specialty details
                    const specialty = doctorSpecialty ? await db.Specialties.findOne({
                        where: { id: doctorSpecialty.specialtiesId, isActive: true }
                    }) : null;

                    const clinicty = doctorSpecialty ? await db.Clinic.findOne({
                        where: { id: doctorSpecialty.clinicId, isActive: true }
                    }) : null;

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        address: user.address,
                        gender: user.gender,
                        phone: user.phone,
                        qualification: userDoctorInfo?.qualification || null,
                        price: userDoctorInfo?.price || null,
                        specialty: specialty?.name || null,
                        clinic: clinicty?.name || null
                    };
                }));
                resolve(
                    {
                        ER: 0,
                        message: "Get all doctors successfully",
                        data: doctors
                    }
                )
            }
            else {
                let data = await db.User.findAndCountAll({
                    where: { roleId: 2, isActive: true },
                    limit: limit,
                    offset: offset,
                    attributes: ['id', 'name', "image", 'email', "address", "gender", "phone"]

                })
                let totalPage = Math.ceil(data.count / limit);
                data = data.rows;
                // let doctorInfos = await db.DoctorInfo.findAll({
                //     where: { doctorId: data.map(user => user.id) }
                // });

                const doctors = await Promise.all(data.map(async (user) => {

                    const userDoctorInfo = await db.DoctorInfo.findOne({
                        where: { doctorId: user.id }
                    });

                    // Fetch doctor specialty for the user
                    const doctorSpecialty = await db.DoctorUser.findOne({
                        where: { doctorId: user.id }
                    });



                    // Fetch the specialty details
                    const specialty = doctorSpecialty ? await db.Specialties.findOne({
                        where: { id: doctorSpecialty.specialtiesId, isActive: true }
                    }) : null;

                    const clinicty = doctorSpecialty ? await db.Clinic.findOne({
                        where: { id: doctorSpecialty.clinicId, isActive: true }
                    }) : null;



                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        address: user.address,
                        gender: user.gender,
                        phone: user.phone,
                        qualification: userDoctorInfo?.qualification || null,
                        price: userDoctorInfo?.price || null,
                        specialty: specialty?.name || null,
                        clinic: clinicty?.name || null
                    };
                }));
                resolve(
                    {
                        ER: 0,
                        message: "Get doctors paginate successfully",
                        data: doctors,
                        totalPage
                    }
                )
            }
        } catch (error) {
            reject(error);
        }
    })


}

const updateDoctor = async (id, data, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve(
                    {
                        ER: 1,
                        message: "Input doctor id"
                    });
                return;
            }
            else {
                let isExist = await db.User.findOne({
                    where: { id }
                })
                if (!isExist) {
                    resolve(
                        {
                            ER: 2,
                            message: "Doctor not found"
                        });
                    return;
                } else {
                    let updateFields = {
                        name: data.name,
                        email: data.email,
                        address: data.address,
                        gender: data.gender === 1 ? 'female' : 'male', // 0: male, 1: female
                        phone: data.phone,
                    };

                    if (file && file.image && file.image.data) {

                        updateFields.image = file.image.data;
                    }
                    let dataUpdate = await db.User.update(
                        updateFields,
                        {
                            where: { id: id }
                        }
                    );
                    let dataUpdateInfo = await db.DoctorInfo.update(
                        {
                            qualification: data.qualification,
                            price: data.price,
                        },
                        {
                            where: { doctorId: id }
                        }
                    );

                    resolve(
                        {
                            ER: 0,
                            message: "Update Doctor Success",
                        });

                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteADoctor = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve(
                    {
                        ER: 1,
                        message: "Input doctor id"
                    });
                return;
            }
            else {
                let isExist = await db.User.findOne({
                    where: { id }
                })
                if (!isExist) {
                    resolve(
                        {
                            ER: 2,
                            message: "Doctor not found"
                        });
                    return;
                } else {
                    let dataDelete = await db.User.update(
                        {
                            isActive: false
                        },
                        {
                            where: { id: id }
                        }
                    )

                    let doctorUser = await db.DoctorUser.destroy({
                        where: { doctorId: id }
                    })

                    if (dataDelete && doctorUser) {
                        resolve(
                            {
                                ER: 0,
                                message: "Delete Doctor Success"
                            });
                    }
                    else {
                        resolve(
                            {
                                ER: 3,
                                message: "Delete Doctor Failed"
                            });
                    }

                }
            }

        } catch (error) {

        }
    })
}

const assignDoctor = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.clinicId || !data.specialtiesId) {
                resolve(
                    {
                        ER: 1,
                        message: "Input require"
                    });
                return;
            }
            let isExistDoctor = await db.User.findOne({
                where: { id: data.doctorId, roleId: 2, isActive: true }
            })
            let isExistClinic = await db.Clinic.findOne({
                where: { id: data.clinicId, isActive: true }
            })
            let isExistSpecialties = await db.Specialties.findOne({
                where: { id: data.specialtiesId, isActive: true }
            })
            if (!isExistDoctor) {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not found or inactive"
                    });
                return;
            }
            else if (!isExistClinic) {
                resolve(
                    {
                        ER: 2,
                        message: "Clinic not found or inactive"
                    });
                return;
            }
            else if (!isExistSpecialties) {
                resolve(
                    {
                        ER: 2,
                        message: "Specialties not found or inactive"
                    });
            }
            else {
                let isExistDoctorUser = await db.DoctorUser.findOne({
                    where: { doctorId: data.doctorId }
                })
                if (isExistDoctorUser) {
                    resolve(
                        {
                            ER: 2,
                            message: "Doctor already assigned "
                        });
                    return;
                }
                else {
                    let assignDoctor = await db.DoctorUser.create({
                        doctorId: data.doctorId,
                        clinicId: data.clinicId,
                        specialtiesId: data.specialtiesId,
                    })
                    if (assignDoctor) {
                        resolve(
                            {
                                ER: 0,
                                message: "Assign Doctor Success",
                                data: assignDoctor
                            });
                    }
                    else {
                        resolve(
                            {
                                ER: 3,
                                message: "Assign Doctor Failed"
                            });
                    }
                }
            }
        } catch (error) {
            resolve(
                {
                    ER: 99,
                    message: "Conflict clinic"
                });
            reject(error);
        }
    })
}

const getDoctorAssign = async (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve(
                    {
                        ER: 1,
                        message: "Input doctor id"
                    });
                return;
            }
            let doctorAssign = await db.DoctorUser.findOne({
                where: { doctorId },
            })
            if (doctorAssign) {
                resolve(
                    {
                        ER: 0,
                        message: "Get doctor assign successfully",
                        data: doctorAssign
                    });
            }
            else {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not found or not assign"
                    });
            }
        } catch (error) {
            reject(error);
        }
    })
}

const updateAssignDoctor = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !data.clinicId || !data.specialtiesId) {
                resolve(
                    {
                        ER: 1,
                        message: "Input require"
                    });
                return;
            }
            let isExistDoctor = await db.User.findOne({
                where: { id, roleId: 2, isActive: true }
            })
            let isExistClinic = await db.Clinic.findOne({
                where: { id: data.clinicId, isActive: true }
            })
            let isExistSpecialties = await db.Specialties.findOne({
                where: { id: data.specialtiesId, isActive: true }
            })
            if (!isExistDoctor) {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not found or inactive"
                    });
                return;
            }
            else if (!isExistClinic) {
                resolve(
                    {
                        ER: 2,
                        message: "Clinic not found or inactive"
                    });
                return;
            }
            else if (!isExistSpecialties) {
                resolve(
                    {
                        ER: 2,
                        message: "Specialties not found or inactive"
                    });
            } else {
                let isExistDoctorUser = await db.DoctorUser.findOne({
                    where: { doctorId: id }
                })
                if (!isExistDoctorUser) {
                    resolve(
                        {
                            ER: 2,
                            message: "Doctor not assigned yet"
                        });
                    return;
                }
                let updateAssignDoctor = await db.DoctorUser.update(
                    {
                        clinicId: data.clinicId,
                        specialtiesId: data.specialtiesId,
                    },
                    {
                        where: { doctorId: id }
                    }
                )
                if (updateAssignDoctor) {
                    resolve(
                        {
                            ER: 0,
                            message: "Update Assign Doctor Success"
                        });
                }
                else {
                    resolve(
                        {
                            ER: 3,
                            message: "Update Assign Doctor Failed"
                        });
                }
            }
        } catch (error) {

        }
    })
}

const getDoctorForSpecialties = async (specialtiesId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorSpecialties = await db.DoctorUser.findAll({
                where: { specialtiesId }
            })
            if (doctorSpecialties.length > 0) {
                let doctors = [];
                for (let item of doctorSpecialties) {
                    let data = await db.User.findOne({
                        where: { id: item.doctorId, roleId: 2, isActive: true },
                        attributes: ['id', 'name', "image", 'email', "address", "gender", "phone", "isActive"]

                    })
                    let doctorInfo = await db.DoctorInfo.findOne({
                        where: { doctorId: item.doctorId }
                    })
                    if (data && doctorInfo) {
                        data.qualification = doctorInfo.qualification;
                        data.price = doctorInfo.price;
                        doctors.push(data);
                    }
                }
                if (doctors.length > 0) {
                    resolve(
                        {
                            ER: 0,
                            message: "Get Doctors Specialties Success",
                            data: doctors
                        });
                } else {
                    resolve(
                        {
                            ER: 2,
                            message: "No doctor found for this specialties"
                        });
                }
            } else {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not found for this specialties"
                    });
                return;
            }
        } catch (error) {

        }
    })
}

const getDoctorForClinic = async (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorClinic = await db.DoctorUser.findAll({
                where: { clinicId }
            })

            if (doctorClinic.length > 0) {
                let doctors = [];
                for (let item of doctorClinic) {
                    let data = await db.User.findOne({
                        where: { id: item.doctorId, roleId: 2, isActive: true },
                        attributes: ['id', 'name', "image", 'email', "address", "gender", "phone"]

                    })
                    let doctorInfo = await db.DoctorInfo.findOne({
                        where: { doctorId: item.doctorId }
                    })

                    let specialties = await db.Specialties.findOne({
                        where: { id: item.specialtiesId }
                    })

                    if (data && doctorInfo) {
                        data.qualification = doctorInfo.qualification;
                        data.price = doctorInfo.price;
                        data.specialtiesName = specialties?.name || null;
                        doctors.push(data);
                    }
                }
                if (doctors.length > 0) {
                    resolve(
                        {
                            ER: 0,
                            message: "Get Doctors Specialties Success",
                            data: doctors
                        });
                } else {
                    resolve(
                        {
                            ER: 2,
                            message: "No doctor found for this specialties"
                        });
                }
            } else {
                resolve(
                    {
                        ER: 2,
                        message: "Doctor not found for this specialties"
                    });
                return;
            }
        } catch (error) {

        }
    })

}

const getADoctorClinicSpecialties = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: doctorId, roleId: 2, isActive: true },
                attributes: ['id', 'name', 'image', 'email', 'address', 'gender', 'phone']
            });

            if (!doctor) {
                resolve({
                    ER: 2,
                    message: "Doctor not found or inactive"
                });
                return;
            }

            let doctorInfo = await db.DoctorInfo.findOne({
                where: { doctorId },
                attributes: ['qualification', 'price']
            });

            let doctorUser = await db.DoctorUser.findOne({
                where: { doctorId }
            });

            if (!doctorUser) {
                resolve({
                    ER: 100,
                    message: "Doctor not assigned yet",
                    data: {
                        id: doctor.id,
                        name: doctor.name,
                        image: doctor.image,
                        email: doctor.email,
                        address: doctor.address,
                        gender: doctor.gender,
                        phone: doctor.phone,
                        qualification: doctorInfo.qualification,
                        price: doctorInfo.price
                    }
                });
                return;
            }

            let clinic = await db.Clinic.findOne({
                where: { id: doctorUser.clinicId, isActive: true },
                attributes: ['id', 'name', 'address', 'description']
            });

            let specialties = await db.Specialties.findOne({
                where: { id: doctorUser.specialtiesId, isActive: true },
                attributes: ['id', 'name', 'description']
            });



            if (clinic && specialties) {
                let doctorDetail = {
                    doctor: {
                        id: doctor.id,
                        name: doctor.name,
                        image: doctor.image,
                        email: doctor.email,
                        address: doctor.address,
                        gender: doctor.gender,
                        phone: doctor.phone,
                        qualification: doctorInfo.qualification,
                        price: doctorInfo.price
                    },
                    clinic: {
                        id: clinic.id,
                        name: clinic.name,
                        address: clinic.address,
                        description: clinic.description
                    },
                    specialties: {
                        id: specialties.id,
                        name: specialties.name,
                        description: specialties.description
                    },

                }

                resolve({
                    ER: 0,
                    message: "Get Doctor Detail Success",
                    data: doctorDetail
                });
            } else {
                resolve({
                    ER: 2,
                    message: "Doctor's clinic or specialties not found or inactive"
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    createDoctor,
    getDoctors,
    updateDoctor,
    deleteADoctor,
    assignDoctor,
    updateAssignDoctor,
    getDoctorForSpecialties,
    getDoctorForClinic,
    getADoctorClinicSpecialties,
    getDoctorAssign
}