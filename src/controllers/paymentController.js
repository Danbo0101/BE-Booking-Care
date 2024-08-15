const { createPaymentUrls } = require("../services/paymentService");

const createPaymentUrl = async (req, res) => {
    try {
        let ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let { orderId, orderInfo, amount, bankCode, language } = req.body;

        let paymentUrl = await createPaymentUrls(orderId, orderInfo, amount, bankCode, language, ipAddr);
        res.set("Content-Type", "text/html");
        res.send(JSON.stringify(paymentUrl));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createPaymentUrl,

};