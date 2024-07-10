// import bcrypt from "bcryptjs";
import db from "../models/index";
import hashPassword from "../utils/hashPassword";

const createUser = async (data, image) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordBcrypt = await hashPassword(data.password);
            let result = await db.User.create({
                name: data.name,
                email: data.email,
                password: hashPasswordBcrypt,
                address: data.address,
                gender: data.gender === 1 ? 'female' : 'male', // 0: male, 1: female
                roleId: data.roleId,
                phone: data.phone,
                image: image,
            })

            resolve({
                ER: 0,
                message: "User created successfully",
                data: result
            })
        } catch (error) {
            console.log("err", error)
            reject(error)
        }
    })

}



// const hashPassword = (password) => {
//     const salt = bcrypt.genSaltSync(10);

//     return new Promise(async (resolve, reject) => {
//         try {
//             let hashPassword = await bcrypt.hashSync(password, salt);
//             resolve(hashPassword)

//         } catch (error) {
//             reject(error)
//         }
//     })
// }

module.exports = {
    createUser
}