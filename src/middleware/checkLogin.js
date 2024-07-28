
const checkLogin = (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        return res.status(401).json({
            ER: 3,
            message: "Unauthorized: You need to log in"
        });
    }
};

module.exports = checkLogin;
