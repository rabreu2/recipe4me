import nodemailer from "nodemailer"
import User from "../models/userModel"
import bcryptjs from "bcryptjs"

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                },
            )
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                },
            )
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "18d85cb31afd66",
                pass: "b96c34943237e3"
            }
        });
        const mailOptions = {
            from: 'recipe4me.com@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">here</a> to 
            ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"}</p>`
          };
        
        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse
    } catch (error: any) {
        throw new Error(error.message);
    }
}