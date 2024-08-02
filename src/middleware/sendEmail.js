require("dotenv").config();
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, nameDoctor, date, otp, timeType) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


    if (subject === "Cancel Booking") {
        const filePath = path.join(__dirname, "../views/cancel-booking.html");
        // console.log(filePath);
        const source = fs.readFileSync(filePath, 'utf8').toString();
        const template = handlebars.compile(source);

        const replacements = {
            nameDoctor,
            date
        };
        const htmlToSend = template(replacements);

        const info = await transporter.sendMail({
            from: `"Booking Care" ${process.env.EMAIL_USER}`,
            to: email,
            subject: "Cancel Boooking Notification",
            text: "Cancel Boooking",
            html: htmlToSend,
        });
        console.log("Message sent: %s", info.messageId);
    }

    if (subject === "OTP") {
        const info = await transporter.sendMail({
            from: `"Booking Care" ${process.env.EMAIL_USER}`,
            to: email,
            subject: "Xác nhận đăng ký",
            text: `Mã OTP để đăng kí của bạn là: ${otp}`,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    }
    if (subject === "OTP-FORGOT") {
        const info = await transporter.sendMail({
            from: `"Booking Care" ${process.env.EMAIL_USER}`,
            to: email,
            subject: "Quên mật khẩu",
            text: `Mã OTP để đổi mật khẩu của bạn là: ${otp}`,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    }
    if (subject === "DOCTOR-LATE") {
        const info = await transporter.sendMail({
            from: `"Booking Care" ${process.env.EMAIL_USER}`,
            to: email,
            subject: `Nhắc nhở bác sĩ ${nameDoctor}`,
            text: `Hôm nay bạn có ca khám ${timeType}`,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    }



}


module.exports = sendEmail;