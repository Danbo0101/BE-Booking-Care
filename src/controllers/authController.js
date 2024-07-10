const express = require('express');
const { handleLogin } = require('../services/authService');



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

module.exports = {
    postLogin
}