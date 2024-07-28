const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    let white_list = ['/', '/register', '/login', '/create-users'];
    console.log(req.originalUrl)
    if (white_list.find(item => '/v1/api' + item === req.originalUrl)) {
        return next();
    } else {
        if (req.headers && req.headers.authorization) {
            let token = req.headers.authorization.split(' ')[1];
            try {
                let decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log(decoded);
                req.user = decoded;  // Lưu thông tin người dùng vào req để sử dụng sau
                return next();
            } catch (error) {
                return res.status(401).json({
                    ER: 1,
                    message: "Invalid token"
                });
            }
        } else {
            return res.status(401).json({
                ER: 1,
                message: "Authorization header is missing"
            });
        }
    }
};

module.exports = auth;


module.exports = auth