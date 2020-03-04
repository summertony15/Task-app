const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'summertony15@gmail.com',
        subject: 'Welcome to my world',
        text: `Welcome to the app, ${name}. Let me lead you in.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'summertony15@gmail.com',
        subject: 'Why do you cancel email sub',
        text: `Hello ${name}, just want to confirm the cancellation of email`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}