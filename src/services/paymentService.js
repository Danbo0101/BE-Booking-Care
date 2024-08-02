const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const vnPayConfig = require("../config/vnpay");

const createPaymentUrls = async (orderId, amount, bankCode, locale, ipAddr) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let tmnCode = vnPayConfig.vnp_TmnCode;
    let secretKey = vnPayConfig.vnp_HashSecret;
    let vnpUrl = vnPayConfig.vnp_Url;
    let returnUrl = vnPayConfig.vnp_ReturnUrl;

    if (!locale) {
        locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toán cho hoá đơn :${orderId}`,
        vnp_OrderType: "other",
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate
    };

    if (bankCode) {
        vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
}

const verifyVnpayReturn = async (queryParams) => {
    const secureHash = queryParams.vnp_SecureHash;

    delete queryParams.vnp_SecureHash;
    delete queryParams.vnp_SecureHashType;

    const sortedParams = sortObject(queryParams);
    const secretKey = vnPayConfig.vnp_HashSecret;
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // console.log('Received Secure Hash:', secureHash);
    // console.log('Calculated Secure Hash:', signed);
    // console.log('Sign Data:', signData);

    return {
        isValid: secureHash === signed,
        queryParams: queryParams,
        queryString: querystring.stringify(queryParams)
    };
};

const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    createPaymentUrls,
    verifyVnpayReturn
};

