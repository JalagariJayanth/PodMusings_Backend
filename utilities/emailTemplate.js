
const verificationBody = (reason,otp,name) => {

    if(reason === "resend"){
        return `
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
            <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Verify Your PODMUSINGS Account</h1>
            <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                    <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                    <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${otp}</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                    <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a PODMUSINGS account.</p>
                    <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the PODMUSINGS app to activate your account.</p>
                    <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a PODMUSINGS account, please disregard this email.</p>
                </div>
            </div>
            <br>
            <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The PODMUSINGS Team</p>
        </div>
      `;
    }else{
        return `
            <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Reset Your PODMUSINGS Account Password</h1>
                <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                        <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                        <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${otp}</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">To reset your PODMUSINGS account password, please enter the following verification code:</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the PODMUSINGS app to reset your password.</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not request a password reset, please disregard this email.</p>
                    </div>
                </div>
                <br>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The PODMUSINGS Team</p>
            </div>
        `
    }
    
}

module.exports = verificationBody