const { createUser } = require("../services/userService")


const getCreateUsers = async (req, res) => {

    let image = req.files.image;

    // console.log(req.body, image.data);

    let result = await createUser(req.body, image.data);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data

    })
}

module.exports = {
    getCreateUsers
}