import db from "../models/index";
import bcrypt from "bcryptjs";

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

module.exports = {
    handleLogin
}