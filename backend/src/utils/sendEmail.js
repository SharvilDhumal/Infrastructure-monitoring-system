const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text, html, attachments) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"InfravisionAI Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            text: text,
            html: html,
            attachments: attachments,
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email not sent:', error);
        if (error.code === 'EAUTH') {
            console.error('---------------------------------------------------');
            console.error('SMTP AUTH ERROR: likely incorrect email or password.');
            console.error('Make sure you are using an "App Password" if 2FA is on.');
            console.error('See: https://support.google.com/accounts/answer/185833');
            console.error('---------------------------------------------------');
        }
        throw error;
    }
};

module.exports = sendEmail;
