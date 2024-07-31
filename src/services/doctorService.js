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
                        message: "Email đã tồn tại"
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
                    gender: data.gender === 1 ? 'Nữ' : 'Nam', // 0: male, 1: female
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
                    message: "Tạo bác sĩ thành công",
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
                        message: "Lấy tất cả bác sĩ thành công",
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
                        message: "Lấy danh sách phân trang bác sĩ thành công",
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
                        message: "Vui lòng nhập id"
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
                            message: "Không tồn tại bác sĩ"
                        });
                    return;
                } else {
                    let updateFields = {
                        name: data.name,
                        email: data.email,
                        address: data.address,
                        gender: data.gender === 1 ? 'Nữ' : 'Nam', // 0: male, 1: female
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
                            message: "Cập nhật Bác sĩ thành công",
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
                        message: "Vui lòng nhập id"
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
                            message: "Không tồn tại bác sĩ"
                        });
                    return;


                }

                let doctorUser = await db.DoctorUser.findOne({
                    where: { doctorId: id }
                })

                if (!doctorUser) {
                    let dataDelete = await db.User.update(
                        {
                            isActive: false
                        },
                        {
                            where: { id: id }
                        }
                    )

                    let doctorUser = await db.DoctorUser.destoy({
                        where: { doctorId: id }
                    })
                    resolve(
                        {
                            ER: 0,
                            message: "Xoá bác sĩ thành công"
                        });
                    return;
                }
                else {
                    let scheduleDoctor = await db.Schedule.findAll({
                        where: { doctorId: id, statusId: 1 }
                    })

                    let isExistBooking = 0;
                    for (let item in scheduleDoctor) {
                        let booking = await db.Booking.findAll({
                            where: { scheduleId: scheduleDoctor[item].id, statusId: 3 }
                        })
                        if (booking) {
                            isExistBooking += 1;
                        }
                    }
                    if (isExistBooking > 0) {
                        resolve(
                            {
                                ER: 3,
                                message: "Không thể xoá bác sĩ này vì đã có lịch đang đặt trước"
                            });
                        return;
                    }
                    else {
                        let dataDelete = await db.User.update(
                            {
                                isActive: false
                            },
                            {
                                where: { id: id }
                            }
                        )
                        let doctorUser = await db.DoctorUser.destoy({
                            where: { doctorId: id }
                        })
                        resolve(
                            {
                                ER: 0,
                                message: "Xoá bác sĩ thành công"
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
                        message: "Vui lòng nhập thông tin"
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
                            message: "Bác sĩ đã được gán "
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
                                message: "Gán bác sĩ thành công",
                                data: assignDoctor
                            });
                    }
                    else {
                        resolve(
                            {
                                ER: 3,
                                message: "Gán bác sĩ thất bại"
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
                        message: "Vui lòng nhập thông tin"
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
                        message: "Lất thông tin gán bác sĩ thành công",
                        data: doctorAssign
                    });
            }
            else {
                resolve(
                    {
                        ER: 2,
                        message: "Bác sĩ chưa được gán hoặc không tồn tại"
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
                        message: "Vui lòng nhập thông tin"
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
                        message: "Không tìm thấy bác sĩ"
                    });
                return;
            }
            else if (!isExistClinic) {
                resolve(
                    {
                        ER: 2,
                        message: "Không tìm thấy phòng khám"
                    });
                return;
            }
            else if (!isExistSpecialties) {
                resolve(
                    {
                        ER: 2,
                        message: "Không tìm thấy chuyên khoa"
                    });
            } else {
                let isExistDoctorUser = await db.DoctorUser.findOne({
                    where: { doctorId: id }
                })
                if (!isExistDoctorUser) {
                    resolve(
                        {
                            ER: 2,
                            message: "Bác sĩ chưa được gán"
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
                            message: "Cập nhật bác sĩ thành công"
                        });
                }
                else {
                    resolve(
                        {
                            ER: 3,
                            message: "Cập nhật bác sĩ thất bại"
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
                            message: "Lấy thông tin thành công",
                            data: doctors
                        });
                } else {
                    resolve(
                        {
                            ER: 2,
                            message: "Không tồn tại bác sĩ thuộc chuyên khoa"
                        });
                }
            } else {
                resolve(
                    {
                        ER: 2,
                        message: "Không tồn tại bác sĩ thuộc chuyên khoa"
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
                            message: "Lấy thông tin thành công",
                            data: doctors
                        });
                } else {
                    resolve(
                        {
                            ER: 2,
                            message: "Không tồn tại bác sĩ thuộc phòng khám"
                        });
                }
            } else {
                resolve(
                    {
                        ER: 2,
                        message: "Không tồn tại bác sĩ thuộc phòng khám"
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
                    message: "Không tìm thấy bác sĩ"
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
                    message: "Bác sĩ chưa được gán",
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
                    message: "Lấy thông tin thành công",
                    data: doctorDetail
                });
            } else {
                resolve({
                    ER: 2,
                    message: "Bác sĩ chưa được gán"
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