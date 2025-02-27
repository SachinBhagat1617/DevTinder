const nodemailer = require('nodemailer')

const mailhelper = async (option) => {
    
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });
    const message = {
        from: 'contactbhagatsachin@gmail.com',
        to: option.email,
        subject: option.subject,
        text:option.message,
    }
    await transporter.sendMail(message);
}

module.exports = mailhelper;