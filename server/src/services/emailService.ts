import { Resend } from 'resend';

export const sendVerificationEmail = async (to: string, otp: string) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured. Cannot send OTP emails.');
    }
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'OBS Team <onboarding@resend.dev>',
      to: [to],
      subject: 'Welcome to OBS! Verify your email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #d4a574; text-align: center;">🏔️ Welcome to Oh-Bhaisahab Experiences!</h2>
          <p>Hi there,</p>
          <p>Thank you for joining the OBS Tribe. To complete your registration, please enter the following 6-digit code on the verification screen:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't create an account with OBS, please safely ignore this email.</p>
          <br/>
          <p>See you in the mountains,</p>
          <p><strong>Team OBS</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    return false;
  }
};
