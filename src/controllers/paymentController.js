const { createPaymentUrls, verifyVnpayReturn } = require("../services/paymentService");

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

const handleVnpayReturn = async (req, res) => {
    const queryParams = req.query;
    console.log('Received Query Params:', queryParams);
    const result = await verifyVnpayReturn(queryParams);

    if (result.isValid) {
        console.log('Payment success:', result.queryParams);
        res.redirect(`http://localhost:5173/booking-success?${result.queryString}`);

    } else {
        console.log('Payment failed due to invalid secure hash');
        res.redirect('http://localhost:5173/booking-success??status=failed');
    }
};

module.exports = {
    createPaymentUrl,
    handleVnpayReturn
};