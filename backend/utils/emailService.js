const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendShareEmail = async (recipient, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: "You have been invited to view a PDF",
    text: `Click the link to view the shared PDF: ${link}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.response}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
