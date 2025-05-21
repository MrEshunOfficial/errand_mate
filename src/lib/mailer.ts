import nodemailer from "nodemailer";
import { User } from "@/models/authentication/authModel";
import bcrypt from "bcryptjs";

/**
 * Email types supported by the email service
 */
export enum EmailType {
  VERIFY = "VERIFY",
  RESET = "RESET",
}

/**
 * Interface for email service parameters
 */
interface SendEmailParams {
  email: string;
  emailType: EmailType;
  userId: string;
}

/**
 * Sends an email for account verification or password reset
 *
 * @param params - The parameters for sending the email
 * @returns A promise resolving to the mail response
 */
export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailParams): Promise<nodemailer.SentMessageInfo> => {
  try {
    // Generate a secure hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 12);

    // Update the user document based on email type
    if (emailType === EmailType.VERIFY) {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpire: Date.now() + 3600000, // 1 hour expiry
      });
    } else if (emailType === EmailType.RESET) {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpires: Date.now() + 3600000, // 1 hour expiry
      });
    } else {
      throw new Error(`Unsupported email type: ${emailType}`);
    }

    // Create email transport using environment variables
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: false,
    } as nodemailer.TransportOptions);

    // Prepare the email content
    const subject =
      emailType === EmailType.VERIFY
        ? "Verify your email"
        : "Reset your password";

    const actionText =
      emailType === EmailType.VERIFY
        ? "verify your email"
        : "reset your password";

    const domain = process.env.DOMAIN;
    const actionUrl = `${domain}/${
      emailType === EmailType.VERIFY
        ? "user/verification"
        : "user/resetpassword"
    }?token=${hashedToken}`;

    // Configure mail options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #333; text-align: center;">${subject}</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #666;">
            Please click the button below to ${actionText}. If you didn't request this, you can safely ignore this email.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}
            </a>
          </div>
          <p style="font-size: 14px; color: #999; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser: ${actionUrl}
          </p>
        </div>
      `,
    };

    // Send the email and return the response
    return await new Promise<nodemailer.SentMessageInfo>((resolve, reject) => {
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
        } else {
          console.log("Email sent successfully:", info.response);
          resolve(info);
        }
      });
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error instanceof Error
      ? error
      : new Error("An unknown error occurred while sending the email");
  }
};
