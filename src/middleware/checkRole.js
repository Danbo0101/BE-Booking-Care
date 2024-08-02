const checkRole = (roleId) => {
    return (req, res, next) => {
        // console.log(req.user.roleId === roleId)
        if (req.user && req.user.roleId && req.user.roleId === roleId) {
            // console.log(1)
            return next();
        } else {
            return res.status(403).json({
                ER: 2,
                message: "Forbidden: You do not have the necessary permissions"
            });
        }
    };
};

module.exports = checkRole;