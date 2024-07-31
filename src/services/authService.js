import sendEmail from "../middleware/sendEmail";
import db from "../models/index";
import bcrypt from "bcryptjs";
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let loginData = {};
            let isExist = await checkEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email },
                    raw: true
                })
                if (user) {
                    let checkPass = await bcrypt.compareSync(password, user.password);
                    if (checkPass) {
                        loginData.ER = 0;
                        loginData.message = "Login success";
                        delete user.password;
                        let payload = {
                            email: user.email,
                            name: user.name,
                            roleId: user.roleId,
                        }
                        let access_token = jwt.sign(
                            payload,
                            process.env.JWT_SECRET,
                            {
                                expiresIn: process.env.JWT_EXPIRE
                            }
                        )
                        user.access_token = access_token;
                        loginData.userData = user;
                    } else {
                        loginData.ER = 3;
                        loginData.message = "Wrong password";
                    }
                }
                else {
                    loginData.ER = 2;
                    loginData.message = "User not found";
                }
            }
            else {
                loginData.ER = 1;
                loginData.message = "Email not found";
            }

            resolve(loginData);
        } catch (error) {
            reject(error);
        }
    })

}

const checkEmail = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email }
            })
            if (user) resolve(true);
            else resolve(false)
        } catch (error) {
            reject(error)
        }
    })
}

const otpStore = {};

const sendOtp = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExistEmail = await checkEmail(email);
            if (!isExistEmail) {
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                otpStore[email] = { otpCode, expiresAt: Date.now() + 5 * 60 * 1000 };
                console.log(`OTP for ${email}:`, otpStore[email]);
                let result = await sendEmail(email, "OTP", "", "", otpCode);
                if (result) {
                    resolve({
                        ER: 0,
                        message: "Gửi OTP thành công"
                    })
                }
                else {
                    resolve({
                        ER: 3,
                        message: "Gửi OTP thất bại"
                    })
                }
            }
            else {
                resolve({
                    ER: 1,
                    message: "Email đã tồn tại"
                })
            }
        } catch (error) {

        }
    })

}

const sendOtpForgot = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExistEmail = await checkEmail(email);
            if (isExistEmail) {
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                otpStore[email] = { otpCode, expiresAt: Date.now() + 5 * 60 * 1000 };
                console.log(`OTP for ${email}:`, otpStore[email]);
                let result = await sendEmail(email, "OTP-FORGOT", "", "", otpCode);
                if (result) {
                    resolve({
                        ER: 0,
                        message: "Gửi OTP thành công"
                    })
                }
                else {
                    resolve({
                        ER: 3,
                        message: "Gửi OTP thất bại"
                    })
                }
            }
            else {
                resolve({
                    ER: 1,
                    message: "Email không tồn tại"
                })
            }
        } catch (error) {

        }
    })

}

const verifyOtp = async (email, otp) => {
    return new Promise((resolve, reject) => {
        try {
            const storedOtp = otpStore[email];
            console.log(storedOtp)
            if (storedOtp) {
                if (Date.now() > storedOtp.expiresAt) {
                    resolve({
                        ER: 3,
                        message: "OTP đã hết hạn"
                    });
                } else if (storedOtp.otpCode === otp) {
                    delete otpStore[email];
                    resolve({
                        ER: 0,
                        message: "OTP đúng"
                    });
                } else {
                    resolve({
                        ER: 2,
                        message: "OTP sai"
                    });
                }
            } else {
                resolve({
                    ER: 2,
                    message: "OTP không tồn tại"
                });
            }
        } catch (error) {
            reject({
                ER: 4,
                message: "Error occurred during OTP verification"
            });
        }
    });
};

const handleRegister = async (data, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExistEmail = await checkEmail(data.email);
            if (!isExistEmail) {
                let hashedPassword = bcrypt.hashSync(data.password, 10);
                let dataCreate = {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    roleId: 3,
                    address: data.address,
                    gender: data.gender === 1 ? 'female' : 'male',
                    phone: data.phone,
                }

                if (file && file.image && file.image.data) {
                    dataCreate.image = file.image.data;
                }
                let newUser = await db.User.create(dataCreate)
                if (newUser) {
                    resolve({
                        ER: 0,
                        message: "User created successfully",
                        data: newUser
                    })
                } else {
                    resolve({
                        ER: 1,
                        message: "Error creating user"
                    })
                }
            } else {
                resolve({
                    ER: 2,
                    message: "Email already exists"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const forgotPassword = async (email, newPassword, confirmPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExistEmail = await checkEmail(email);
            if (isExistEmail) {
                if (newPassword === confirmPassword) {
                    let hashedPassword = bcrypt.hashSync(newPassword, 10);
                    let updateUser = await db.User.update(
                        { password: hashedPassword },
                        {
                            where: { email }
                        }
                    )
                    if (updateUser) {
                        resolve({
                            ER: 0,
                            message: "Password updated successfully"
                        })
                    } else {
                        resolve({
                            ER: 3,
                            message: "Update password failed"
                        })
                    }
                } else {
                    resolve({
                        ER: 2,
                        message: "New password and confirm password not match"
                    })
                }
            } else {
                resolve({
                    ER: 1,
                    message: "Email not found"
                })
            }

        } catch (error) {

        }
    })
}

const updateProfile = async (id, data, file) => {
    return new Promise(async (resolve, reject) => {

        try {
            let isExistUser = await db.User.findOne({
                where: { id: id }
            })
            if (isExistUser) {
                let isExistEmail = await checkEmail(data.email);
                if (isExistEmail) {
                    let dataUpdateProfile = {
                        name: data.name,
                        address: data.address,
                        gender: data.gender === 1 ? 'female' : 'male',
                        phone: data.phone,
                    }

                    if (file && file.image && file.image.data) {
                        dataUpdateProfile.image = file.image.data;

                    }
                    let updateUser = await db.User.update(
                        dataUpdateProfile,
                        {
                            where: { id }
                        }
                    )
                    if (updateUser) {
                        resolve({
                            ER: 0,
                            message: "Update User successfully",

                        })
                    } else {
                        resolve({
                            ER: 1,
                            message: "Error update user"
                        })
                    }
                } else {
                    resolve({
                        ER: 2,
                        message: "Email already exists"
                    })
                }
            } else {
                resolve({
                    ER: 1,
                    message: "User not found"
                })
                return;
            }
        } catch (error) {
            reject(error);
        }
    })
}

const updatePassword = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExistUser = await db.User.findOne({
                where: { id }
            })
            if (isExistUser) {
                let checkPass = await bcrypt.compareSync(data.oldPassword, isExistUser.password);
                if (checkPass) {
                    if (data.newPassword !== data.confirmPassword) {
                        resolve({
                            ER: 4,
                            message: "Mật khẩu mới và xác nhận mật khẩu mới không khớp"
                        })
                        return;
                    }
                    let hashedPassword = bcrypt.hashSync(data.newPassword, 10);
                    let updateUser = await db.User.update(
                        { password: hashedPassword },
                        { where: { id } }
                    )
                    if (updateUser) {
                        resolve({
                            ER: 0,
                            message: "Cập nhật mật khẩu thành công",
                        })
                    }
                    else {
                        resolve({
                            ER: 1,
                            message: "Cập nhật mật khẩu thất bại"
                        })
                    }
                } else {
                    resolve({
                        ER: 3,
                        message: "Sai mật khẩu cũ"
                    })
                    return;
                }
            }
            else {
                resolve({
                    ER: 1,
                    message: "User not found"
                })
                return;
            }

        } catch (error) {
            reject(error)
        }
    })
}

const handleLogout = async (token) => {
    try {
        if (!token) {
            return {
                ER: 1,
                message: 'No token provided'
            };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = db.User.findOne({
            where: { email: decoded.email }
        })
        if (user) {
            return {
                ER: 0,
                message: 'Logout success'
            };
        }
        else {
            return {
                ER: 1,
                message: 'User not found'
            };
        }

    } catch (error) {
        return {
            ER: 2,
            message: 'An error occurred during logout'
        };
    }
};


module.exports = {
    handleLogin,
    handleRegister,
    updateProfile,
    updatePassword,
    handleLogout,
    sendOtp,
    verifyOtp,
    forgotPassword,
    sendOtpForgot
}