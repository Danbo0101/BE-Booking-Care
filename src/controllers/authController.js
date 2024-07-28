const express = require('express');
const { handleLogin, handleRegister, updateProfile, updatePassword, handleLogout,
    sendOtp, sendOtpForgot, verifyOtp,
    forgotPassword
} = require('../services/authService');



const postLogin = async (req, res) => {
    let { email, password } = req.body;
    //validate

    if (!email || !password) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }
    //logic

    let result = await handleLogin(email, password);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.userData
    })

}

const postRegister = async (req, res) => {

    let result = await handleRegister(req.body, req.files);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })

}

const putUpdateProfile = async (req, res) => {

    let id = req.query.id;

    if (!id) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }
    let result = await updateProfile(id, req.body, req.files);
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const putUpdatePassword = async (req, res) => {

    let id = req.query.id;

    if (!id) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }
    let result = await updatePassword(id, req.body);
    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const postLogout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const result = await handleLogout(token);

        res.status(result.ER === 0 ? 200 : 500).json(result);
    } catch (error) {
        res.status(500).json({
            ER: 2,
            message: 'An error occurred during logout'
        });
    }
}

const postSendOtp = async (req, res) => {
    let { email, type } = req.body;

    if (!email || !type) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }
    if (type === "" || type === "Register") {
        let result = await sendOtp(email);
        return res.status(200).json({
            ER: result.ER,
            message: result.message,
            data: result.data ? result.data : {}
        })
    } else if (type === "Forgot") {
        let result = await sendOtpForgot(email);
        return res.status(200).json({
            ER: result.ER,
            message: result.message,
            data: result.data ? result.data : {}
        })
    }


}

const postVerifyOtp = async (req, res) => {
    let { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let result = await verifyOtp(email, otp);

    return res.status(200).json({
        ER: result.ER,
        message: result.message,
        data: result.data ? result.data : {}
    })
}

const postForgotPassword = async (req, res) => {

    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
        return res.status(500).json({
            ER: 1,
            message: "Missing input parameter"
        })
    }

    let rsult = await forgotPassword(email, newPassword, confirmPassword);

    return res.status(200).json({
        ER: rsult.ER,
        message: rsult.message,
        data: rsult.data ? rsult.data : {}
    })
}

module.exports = {
    postLogin,
    postRegister,
    putUpdateProfile,
    putUpdatePassword,
    postLogout,
    postSendOtp,
    postVerifyOtp,
    postForgotPassword
}