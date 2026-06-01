const nodemailer = require('nodemailer')

// Hàm gửi email cảm ơn và chứng nhận
async function sendThankYouAndCertificate({ email, name, workshopTitle }) {
    if (!email) return
    // Cấu hình transporter (dùng Gmail demo, nên dùng biến môi trường thực tế)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Chứng nhận tham gia Workshop: ${workshopTitle}`,
        html: `<p>Xin chào ${name},</p>
        <p>Cảm ơn bạn đã tham gia workshop "${workshopTitle}". Chúng tôi gửi đến bạn lời cảm ơn chân thành và chứng nhận đã hoàn thành trải nghiệm.</p>
        <p><b>Chứng nhận:</b> Đã tham gia và hoàn thành workshop "${workshopTitle}" tại HTX Trường Hải.</p>
        <p>Trân trọng,<br/>HTX Trường Hải</p>`
    }
    await transporter.sendMail(mailOptions)
}

module.exports = { sendThankYouAndCertificate }
