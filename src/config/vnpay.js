const vnPayConfig = {
    vnp_TmnCode: 'PPOIQI9R', // Mã website của bạn
    vnp_HashSecret: '2HBARKPV1YUETISCJMX6VAZY3PLU2VEP', // Chuỗi bí mật của bạn
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // URL thanh toán của VNPAY
    vnp_ReturnUrl: 'http://localhost:5173/booking-success?',// URL trả về sau khi thanh toán
};

module.exports = vnPayConfig;
