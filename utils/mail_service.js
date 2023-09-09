const axios = require('axios');
const config = require('../config/config');

const API_KEY = config.BREVO_API_KEY; // Replace this with your actual API key
const apiUrl = 'https://api.brevo.com/v3/smtp/email';

exports.sendMail = (req,res,data) => {
    let content = `
    <html>
    <head></head>
    <body>
        <h2>Hello,${data.recipientName}.</h2>
        ${
            data.resetUrl ? (`
                <h4>To Reset your password please go to the given url:<h4>
                <a href='${data.resetUrl}'>Reset your Password</a>
            `) : (
                `<p>${data.content}</p>`
            )
        }
    </body>
    </html>
    `
    const emailData = {
    sender: {
        name: 'Anolog',
        email: 'swayangdiptacc@gmail.com',
    },
    to: [
        {
        email: data.recipientMail,
        name: data.recipientName,
        },
    ],
    subject: data.subject,
    htmlContent: content
    };


axios.post(apiUrl, emailData, {
    headers: {
        'accept': 'application/json',
        'api-key': API_KEY,
        'content-type': 'application/json',
    },
    }).then((response) => {
        return res.status(200).json({success: true,message: ["Password reset link sent!"]})
    }).catch((error) => {
        return res.status(500).json({error: true,message: ["Something went wrong",error]})
    });    
}

