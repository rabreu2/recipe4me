import nodemailer from "nodemailer"
import User from "../models/userModel"
import crypto from 'crypto';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const rawToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        let resetLink = "";

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                },
            )
            resetLink = `${process.env.NEXT_PUBLIC_DOMAIN}/verifyemail?token=${rawToken}`;
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                },
            )
            resetLink = `${process.env.NEXT_PUBLIC_DOMAIN}/resetpassword?token=${rawToken}`;
        }

        const transport = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: process.env.MAILER_USER!,
                pass: process.env.MAILER_PASS!
            }
        });

        const mailOptions = {
            from: 'Recipe4Me <ray@rayabreu.com>',
            to: email,
            subject: emailType === "VERIFY" ? "Recipe4Me | Email Verification" : "Recipe4Me | Password Reset",
            html: `<table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" style="background:#ebe8d8; color:#000; min-height:68vh; text-align: center;">
                        <tr>
                        <td align="center" valign="middle">
                        <div style="margin-left: 8px;">
                                <img src="https://recipe4me.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frecipe4me-removebg.7dfdee32.png&w=640&q=75" alt="Recipe4Me logo" width="300" height="128">
                                <p style="margin-top: 10px; font-size: 1.2rem;">
                                Click the button below to ${emailType === "VERIFY" ? "verify your email." : "reset your password."}
                                </p>
                                <a href="${resetLink}" style="display: inline-block; padding: 4px 0; margin-top: 4px; font-size: 1.125rem; color: #000; background-color: #22b14c; border: 1px solid #22b14c; border-radius: 12px; text-decoration: none; text-align: center; width: 150px; transition: background-color 0.3s ease-in-out;" onmouseover="this.style.backgroundColor='#187e37'" onmouseout="this.style.backgroundColor='#22b14c'">
                                    ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
                                </a>
                            </div>
                        </td>
                    </tr>
                    </table>
`
        };

        const mailresponse = await transport.sendMail(mailOptions);

        return mailresponse
    } catch (error: any) {
        throw new Error(error.message);
    }
}