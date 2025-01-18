const crypto = require("crypto")


const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
}

const isOTPValid = (otpExpiration) => {
    return Date.now() > otpExpiration.getTime();
}

module.exports = {generateOTP,isOTPValid}