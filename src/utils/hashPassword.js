import bcrypt from "bcryptjs";

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);

    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)

        } catch (error) {
            reject(error)
        }
    })
}

export default hashPassword;
