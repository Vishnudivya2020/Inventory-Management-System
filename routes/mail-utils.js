import nodemailer from 'nodemailer';

import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'overqualifiedhousewife@gmail.com',
        pass:process.env.MAIL_PASS ||'',
    }
});
const mailOptions = {
    from:'overqualifiedhousewife@gmail.com',
    to:['vishnudivyabharathi@gmail.com'],
    subject:'Email Testing',
    text:"Sending Email is so easy",
};

export { mailOptions, transporter};